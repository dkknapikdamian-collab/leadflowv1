const fs = require("fs");

const leadPath = "src/pages/LeadDetail.tsx";
const lead = fs.readFileSync(leadPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

check("J3E marker exists", lead.includes("STAGE216J3E_DUPLICATE_ACTIONS_CLEANUP"));
check("overflow section still exists", lead.includes('data-stage216j3e-overflow-work-summary="true"'));
check("bad PowerShell newline literal removed", !lead.includes("? (`r`n") && !lead.includes("`r`n              <section"));
check("valid JSX conditional exists", lead.includes("{!leadInService && timeline.length > 5 ? ("));
check("remaining actions slice still starts from 6th item", lead.includes("timeline.slice(5).map"));
check("quick actions merge marker still exists", lead.includes("data-stage216j3e-quick-actions-merged-into-upcoming"));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);