const fs = require("fs");

const leadPath = "src/pages/LeadDetail.tsx";
const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const lead = fs.readFileSync(leadPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

check("J3C marker exists in LeadDetail", lead.includes("STAGE216J3C_NOTES_HISTORY_CENTER"));
check("J3C2 marker exists in CSS", css.includes("STAGE216J3C2_NOTES_ORDER_FIX"));
check("J3D marker exists in LeadDetail", lead.includes("STAGE216J3D_UPCOMING_ACTIONS_RAIL"));
check("J3D marker exists in CSS", css.includes("STAGE216J3D_UPCOMING_ACTIONS_RAIL"));
check("right rail upcoming actions card exists", lead.includes('data-stage216j3d-upcoming-actions-card="true"'));
check("upcoming actions are capped to five", lead.includes("timeline.slice(0, 5).map"));
check("upcoming action rows are marked", lead.includes("data-stage216j3d-upcoming-action-row"));
check("quick task CTA exists", lead.includes("handleCreateQuickTask") && lead.includes("Dodaj follow-up"));
check("quick event CTA exists", lead.includes("handleCreateQuickEvent") && lead.includes("Dodaj wydarzenie"));
check("old single next action card removed or replaced", !lead.includes('data-lead-next-action-card="true"') && lead.includes("data-stage216j3d-single-next-action-replaced"));
check("case card still exists", lead.includes("Powiązana sprawa"));
check("finance card still exists", lead.includes("Finanse leada"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);