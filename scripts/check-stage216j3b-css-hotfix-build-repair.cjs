const fs = require("fs");

const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const css = fs.readFileSync(cssPath, "utf8");

const checks = [];
function check(name, pass) {
  checks.push({ name, pass: Boolean(pass) });
}

check("J3B CSS marker exists", css.includes("STAGE216J3B_LEAD_DATA_PANEL"));
check("J3B CSS comment is closed", /\/\*\s*STAGE216J3B_LEAD_DATA_PANEL[\s\S]*?\*\//.test(css));
check("data panel card CSS exists", css.includes(".lead-detail-data-panel-card"));
check("data panel list CSS exists", css.includes(".lead-detail-data-panel-list"));
check("copy row CSS exists", css.includes(".lead-detail-data-panel-row-copy"));
check("no malformed stale fragment remains", !css.includes("stay ata-panel-row-copy"));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);