const fs = require("fs");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""; }

const lead = read("src/pages/LeadDetail.tsx");
const css = read("src/styles/visual-stage14-lead-detail-vnext.css");

check("LeadDetail exists", fs.existsSync("src/pages/LeadDetail.tsx"));
check("CSS exists", fs.existsSync("src/styles/visual-stage14-lead-detail-vnext.css"));
check("Stage216-J3A marker exists in LeadDetail", lead.includes("STAGE216J3A_LEAD_DETAIL_HEADER_SIMPLIFICATION"));
check("Stage216-J3A marker exists in CSS", css.includes("STAGE216J3A_LEAD_DETAIL_HEADER_SIMPLIFICATION"));
check("header is grid one-line", css.includes("grid-template-columns: minmax(0, 1fr) auto"));
check("header meta is hidden", css.includes(".lead-detail-header .lead-detail-header-meta") && css.includes("display: none !important"));
check("header title uses nowrap ellipsis", css.includes("white-space: nowrap") && css.includes("text-overflow: ellipsis"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);
