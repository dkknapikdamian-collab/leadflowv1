const fs = require("fs");

const leadPath = "src/pages/LeadDetail.tsx";
const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const lead = fs.readFileSync(leadPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

const historyMovedOutOfCenter =
  lead.includes('data-stage216j3h-activity-history-rail="true"') ||
  lead.includes('data-stage216j3i-activity-history-left-rail="true"');

check("J3G marker exists", lead.includes("STAGE216J3G_SPLIT_NOTES_FROM_HISTORY"));
check("J3H marker exists in LeadDetail", lead.includes("STAGE216J3H_ACTIVITY_HISTORY_RAIL"));
check("J3H marker exists in CSS", css.includes("STAGE216J3H_ACTIVITY_HISTORY_RAIL"));
check("center notes section still exists", lead.includes('data-stage216j3g-notes-only-section="true"'));
check("center activity history moved marker exists", lead.includes('data-stage216j3h-activity-history-moved-to-rail="true"'));
check("center activity history section removed", !lead.includes('className="lead-detail-section-card lead-detail-activity-history-section"'));
check("activity history exists outside center", historyMovedOutOfCenter);
check("history shows first five entries", lead.includes("leadActivityHistoryItems.slice(0, 5).map"));
check("older entries are expandable", lead.includes('data-stage216j3h-activity-history-more="true"') && lead.includes("leadActivityHistoryItems.slice(5).map"));
check("history includes all activities, not only non-note activities", !lead.includes(".filter((activity) => !isLeadNoteActivity(activity))"));
check("note events are redacted in activity history", lead.includes("Treść notatki jest widoczna w sekcji Notatki."));
check("notes list still uses note-only source", lead.includes("leadNoteActivityItems.slice(0, 5).map"));
check("mixed title still removed", !lead.includes("Notatki i historia kontaktu"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);