const fs = require("fs");

const checks = [];
function check(name, pass) {
  checks.push({ name, pass: Boolean(pass) });
}
function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

const cases = read("api/cases.ts");
const items = read("api/case-items.ts");
const report = "_project/reports/STAGE216D2_PORTAL_SESSION_ERROR_MAPPING_LOCAL_ONLY_2026-06-01.md";
const obsidian = "OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-06-01 - CloseFlow Stage216-D2 portal session error mapping local only.md";

check("api/cases.ts exists", fs.existsSync("api/cases.ts"));
check("api/case-items.ts exists", fs.existsSync("api/case-items.ts"));
check("cases maps PORTAL_SESSION to 403", cases.includes("message.includes('PORTAL_SESSION')") && cases.includes("res.status(403).json({ error: message });"));
check("cases keeps PORTAL_TOKEN mapping", cases.includes("message.includes('PORTAL_TOKEN')"));
check("cases keeps CASE_NOT_FOUND 404", cases.includes("message === 'CASE_NOT_FOUND' ? 404 : 500"));
check("case-items maps PORTAL_SESSION to 403", items.includes("message.includes('PORTAL_SESSION')") && items.includes("? 403"));
check("case-items keeps PORTAL_TOKEN mapping", items.includes("message.includes('PORTAL_TOKEN')"));
check("case-items keeps CASE_NOT_FOUND 404", items.includes("message === 'CASE_NOT_FOUND'"));
check("no SQL/RLS/GRANT mutation added to cases", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(cases));
check("no SQL/RLS/GRANT mutation added to case-items", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(items));
check("report exists", fs.existsSync(report));
check("obsidian update exists", fs.existsSync(obsidian));

for (const item of checks) {
  console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
}
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);