const fs = require("fs");

const leadPath = "src/pages/LeadDetail.tsx";
const cssPath = "src/styles/visual-stage14-lead-detail-vnext.css";
const lead = fs.readFileSync(leadPath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }

check("J3E marker exists", lead.includes("STAGE216J3E_DUPLICATE_ACTIONS_CLEANUP"));
check("J3F marker exists in LeadDetail", lead.includes("STAGE216J3F_NOTES_UX_CLEANUP"));
check("J3F marker exists in CSS", css.includes("STAGE216J3F_NOTES_UX_CLEANUP"));
check("add note modal state exists", lead.includes("isAddNoteOpen") && lead.includes("setIsAddNoteOpen"));
check("inline wide note form removed", !lead.includes("data-stage216j3c-note-form-wide") && !lead.includes("lead-detail-note-form-wide"));
check("note actions panel exists", lead.includes('data-stage216j3f-note-actions-only="true"'));
check("add note dialog exists", lead.includes('data-stage216j3f-add-note-dialog="true"'));
check("add note dialog submits through handleAddNote", lead.includes('className="lead-detail-add-note-dialog-form"') && lead.includes("onSubmit={handleAddNote}"));
check("history still shows recent activities", lead.includes("activities.slice(0, 5).map"));
check("source context is source-only", lead.includes('data-stage216j3f-source-context-card="true"') && lead.includes("Źródło / pierwsza notatka"));
check("latest history duplicate removed from context card", !lead.includes("Ostatnia notatka z historii"));
check("context card can be hidden when there is no source note", lead.includes('data-stage216j3f-source-context-card-hidden="true"'));
check("dictation remains available", lead.includes("handleToggleNoteSpeech") && lead.includes("Dyktuj notatkę"));
check("J3E hotfix guard remains protected", lead.includes("{!leadInService && timeline.length > 5 ? (") && !lead.includes("? (`r`n"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);