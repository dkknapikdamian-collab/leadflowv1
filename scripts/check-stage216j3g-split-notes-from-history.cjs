const fs = require("fs");

const leadPath = "src/pages/LeadDetail.tsx";
const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const lead = fs.readFileSync(leadPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

check("J3F marker exists", lead.includes("STAGE216J3F_NOTES_UX_CLEANUP"));
check("J3G marker exists in LeadDetail", lead.includes("STAGE216J3G_SPLIT_NOTES_FROM_HISTORY"));
check("J3G marker exists in CSS", css.includes("STAGE216J3G_SPLIT_NOTES_FROM_HISTORY"));
check("note activity helper exists", lead.includes("function isLeadNoteActivity"));
check("note items keep raw activity", lead.includes("raw: activity"));
check("activity history items exist", lead.includes("leadActivityHistoryItems"));
check("mixed title removed", !lead.includes("Notatki i historia kontaktu"));
check("notes-only title exists", lead.includes("<h2>Notatki</h2>"));
check("notes-only section marker exists", lead.includes('data-stage216j3g-notes-only-section="true"'));
check("notes list uses note-only source", lead.includes("leadNoteActivityItems.slice(0, 5).map"));
check("notes list does not use activities slice directly", !lead.includes("activities.slice(0, 5).map((activity)"));
check("activity history is not mixed into notes section", lead.includes('data-stage216j3h-activity-history-rail="true"') || lead.includes('data-stage216j3g-activity-history-section="true"'));
check("add note modal still exists", lead.includes('data-stage216j3f-add-note-dialog="true"'));
check("J3E hotfix still protected", lead.includes("{!leadInService && timeline.length > 5 ? (") && !lead.includes("? (`r`n"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);