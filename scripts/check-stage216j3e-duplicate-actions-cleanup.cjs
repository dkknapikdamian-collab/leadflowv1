const fs = require("fs");

const leadPath = "src/pages/LeadDetail.tsx";
const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const lead = fs.readFileSync(leadPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

check("J3D marker exists in LeadDetail", lead.includes("STAGE216J3D_UPCOMING_ACTIONS_RAIL"));
check("J3D marker exists in CSS", css.includes("STAGE216J3D_UPCOMING_ACTIONS_RAIL"));
check("J3E marker exists in LeadDetail", lead.includes("STAGE216J3E_DUPLICATE_ACTIONS_CLEANUP"));
check("J3E marker exists in CSS", css.includes("STAGE216J3E_DUPLICATE_ACTIONS_CLEANUP"));
check("middle work summary is overflow-only", lead.includes('data-stage216j3e-overflow-work-summary="true"'));
check("middle work summary only appears when timeline has more than five", lead.includes("!leadInService && timeline.length > 5"));
check("middle action list skips first five", lead.includes("timeline.slice(5).map"));
check("middle duplicate title removed", !lead.includes("<h2>Zadania i wydarzenia</h2>"));
check("overflow title exists", lead.includes("<h2>Pozostałe działania</h2>"));
check("right quick actions card removed", !lead.includes("<h2>Szybkie akcje</h2>"));
check("quick actions replacement marker exists", lead.includes("data-stage216j3e-quick-actions-merged-into-upcoming"));
check("upcoming actions card still exists", lead.includes('data-stage216j3d-upcoming-actions-card="true"'));
check("follow-up CTA still exists", lead.includes("Dodaj follow-up"));
check("event CTA still exists", lead.includes("Dodaj wydarzenie"));
check("case card still exists", lead.includes("Powiązana sprawa"));
check("finance card still exists", lead.includes("Finanse leada"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);