const fs = require("fs");
const path = require("path");

const STAGE = "STAGE5B_PACKAGE_JSON_BOM_BUILD_GATE_V1";

function pass(message) {
  console.log("PASS " + message);
}

function fail(message) {
  console.error("FAIL " + message);
  process.exitCode = 1;
}

function assert(condition, message) {
  if (condition) pass(message);
  else fail(message);
}

const repoRoot = path.resolve(__dirname, "..");
const packagePath = path.join(repoRoot, "package.json");
const bytes = fs.readFileSync(packagePath);

assert(!(bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf), "package.json has no UTF-8 BOM");
assert(bytes[0] === 0x7b, "package.json starts with {, not hidden BOM/control char");

let pkg = null;
try {
  pkg = JSON.parse(bytes.toString("utf8"));
  pass("package.json parses with plain JSON.parse");
} catch (error) {
  fail("package.json parses with plain JSON.parse: " + error.message);
}

if (pkg) {
  assert(Boolean(pkg.scripts), "package.json has scripts object");
  assert(pkg.scripts["check:stage5b-package-json-bom-build-gate-v1"] === "node scripts/check-stage5b-package-json-bom-build-gate.cjs", "package.json exposes Stage5B check script");
  assert(pkg.scripts["test:stage5b-package-json-bom-build-gate-v1"] === "node --test tests/stage5b-package-json-bom-build-gate.test.cjs", "package.json exposes Stage5B test script");
  assert(Boolean(pkg.scripts["check:stage4-ai-draft-confirm-bridge-v1"]), "Stage4 check script still exists");
  assert(Boolean(pkg.scripts["check:stage5-ai-read-query-hardening-v1"]), "Stage5 check script still exists");
}

const docPath = path.join(repoRoot, "docs/release/STAGE5B_PACKAGE_JSON_BOM_BUILD_GATE_V1_2026-05-06.md");
const doc = fs.existsSync(docPath) ? fs.readFileSync(docPath, "utf8") : "";
assert(doc.includes(STAGE), "release doc contains " + STAGE);
assert(doc.includes("No commit/push after failed build"), "release doc documents build gate");

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log("PASS " + STAGE);