const fs = require("fs");

const leadPath = "src/pages/LeadDetail.tsx";
const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const lead = fs.readFileSync(leadPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

check("J3H marker exists", lead.includes("STAGE216J3H_ACTIVITY_HISTORY_RAIL"));
check("J3I marker exists in LeadDetail", lead.includes("STAGE216J3I_ACTIVITY_HISTORY_LEFT_RAIL"));
check("J3I marker exists in CSS", css.includes("STAGE216J3I_ACTIVITY_HISTORY_LEFT_RAIL"));
check("left activity history card exists", lead.includes('data-stage216j3i-activity-history-left-rail="true"'));
check("right rail history was removed", !lead.includes('className="right-card lead-detail-right-card lead-detail-activity-history-rail-card"'));
check("right rail moved marker exists", lead.includes('data-stage216j3i-activity-history-moved-from-right-rail="true"'));
check("left history shows first five entries", lead.includes("leadActivityHistoryItems.slice(0, 5).map"));
check("older entries remain expandable", lead.includes("leadActivityHistoryItems.slice(5).map") && lead.includes('data-stage216j3h-activity-history-more="true"'));
check("notes stay in center", lead.includes('data-stage216j3g-notes-only-section="true"'));
check("upcoming actions remain in right rail", lead.includes('data-stage216j3d-upcoming-actions-card="true"'));
check("case card still exists", lead.includes("Powiązana sprawa"));
check("finance card still exists", lead.includes("Finanse leada"));
check("note events are still redacted in history", lead.includes("Treść notatki jest widoczna w sekcji Notatki."));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);