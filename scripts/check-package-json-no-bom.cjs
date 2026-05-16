const fs = require("fs");
const path = require("path");

const packagePath = path.join(process.cwd(), "package.json");
const bytes = fs.readFileSync(packagePath);

if (bytes.length >= 3 && bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
  console.error("[package-json-no-bom] FAIL: package.json starts with UTF-8 BOM. Vite/Tailwind resolver can fail on this file.");
  process.exit(1);
}

const text = bytes.toString("utf8");
if (text.charCodeAt(0) === 0xFEFF) {
  console.error("[package-json-no-bom] FAIL: package.json starts with U+FEFF.");
  process.exit(1);
}

try {
  JSON.parse(text);
} catch (error) {
  console.error("[package-json-no-bom] FAIL: package.json is not valid JSON.");
  console.error(error.message);
  process.exit(1);
}

console.log("[package-json-no-bom] OK: package.json is valid JSON and has no BOM");
