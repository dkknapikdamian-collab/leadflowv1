const fs = require("fs");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""; }

const lead = read("src/pages/LeadDetail.tsx");
const css = read("src/styles/visual-stage14-lead-detail-vnext.css");

check("LeadDetail exists", fs.existsSync("src/pages/LeadDetail.tsx"));
check("CSS exists", fs.existsSync("src/styles/visual-stage14-lead-detail-vnext.css"));
check("Stage216-J3B still exists", lead.includes("STAGE216J3B_LEAD_DATA_PANEL") && css.includes("STAGE216J3B_LEAD_DATA_PANEL"));
check("Stage216-J3C marker exists in LeadDetail", lead.includes("STAGE216J3C_NOTES_HISTORY_CENTER"));
check("Stage216-J3C marker exists in CSS", css.includes("STAGE216J3C_NOTES_HISTORY_CENTER"));
check("history section is marked as notes/history center", lead.includes("data-stage216j3c-notes-history-center"));
check("history title changed", lead.includes("Notatki i historia kontaktu"));
check("note form is wide", lead.includes("data-stage216j3c-note-form-wide"));
check("activities are limited to five", lead.includes("activities.slice(0, 5).map"));
check("work summary is marked", lead.includes("data-stage216j3c-work-summary"));
check("source notes no longer compete with main heading", lead.includes("Kontekst leada"));
check("right rail still exists", lead.includes("lead-detail-right-rail"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);