const fs = require("fs");

const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const leadPath = "src/pages/LeadDetail.tsx";
const css = fs.readFileSync(cssPath, "utf8");
const lead = fs.readFileSync(leadPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

check("J3C marker exists in LeadDetail", lead.includes("STAGE216J3C_NOTES_HISTORY_CENTER"));
check("J3C marker exists in CSS", css.includes("STAGE216J3C_NOTES_HISTORY_CENTER"));
check("J3C2 marker exists in CSS", css.includes("STAGE216J3C2_NOTES_ORDER_FIX"));
check("center column is forced to grid", css.includes(".lead-detail-main-column") && css.includes("display: grid !important"));
check("top grid order is first", css.includes(".lead-detail-top-grid") && css.includes("order: 1 !important"));
check("history center order is second", css.includes(".lead-detail-history-center") && css.includes("order: 2 !important"));
check("work summary order is third", css.includes(".lead-detail-work-summary-section") && css.includes("order: 3 !important"));
check("context notes order is fourth", css.includes(".lead-detail-notes-section") && css.includes("order: 4 !important"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(css + "\n" + lead));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);