const fs = require("fs");
const path = require("path");
const test = require("node:test");
const assert = require("node:assert/strict");

const repoRoot = path.resolve(__dirname, "..");

test("package.json has no UTF-8 BOM and parses with JSON.parse", () => {
  const packagePath = path.join(repoRoot, "package.json");
  const bytes = fs.readFileSync(packagePath);
  assert.notDeepEqual(Array.from(bytes.slice(0, 3)), [0xef, 0xbb, 0xbf]);
  assert.equal(bytes[0], 0x7b);
  assert.doesNotThrow(() => JSON.parse(bytes.toString("utf8")));
});

test("Stage5B guard scripts are registered in package.json", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, "package.json"), "utf8"));
  assert.equal(pkg.scripts["check:stage5b-package-json-bom-build-gate-v1"], "node scripts/check-stage5b-package-json-bom-build-gate.cjs");
  assert.equal(pkg.scripts["test:stage5b-package-json-bom-build-gate-v1"], "node --test tests/stage5b-package-json-bom-build-gate.test.cjs");
});

test("Stage5B package documents build gate after failed Stage5 build", () => {
  const doc = fs.readFileSync(path.join(repoRoot, "docs/release/STAGE5B_PACKAGE_JSON_BOM_BUILD_GATE_V1_2026-05-06.md"), "utf8");
  assert.match(doc, /STAGE5B_PACKAGE_JSON_BOM_BUILD_GATE_V1/);
  assert.match(doc, /No commit\/push after failed build/);
  assert.match(doc, /UTF-8 without BOM/);
});
