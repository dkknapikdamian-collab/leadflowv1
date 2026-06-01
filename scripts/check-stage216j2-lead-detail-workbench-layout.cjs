const fs = require("fs");

const checks = [];
function check(name, pass) {
  checks.push({ name, pass: Boolean(pass) });
}
function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

const lead = read("src/pages/LeadDetail.tsx");
const css = read("src/styles/visual-stage14-lead-detail-vnext.css");

check("LeadDetail exists", fs.existsSync("src/pages/LeadDetail.tsx"));
check("CSS exists", fs.existsSync("src/styles/visual-stage14-lead-detail-vnext.css"));
check("Stage216-J2 marker exists in LeadDetail", lead.includes("STAGE216J2_LEAD_DETAIL_WORKBENCH_LAYOUT"));
check("Stage216-J2 marker exists in CSS", css.includes("STAGE216J2_LEAD_DETAIL_WORKBENCH_LAYOUT"));
check("old EntityContactCard JSX removed from shell", !lead.includes("<EntityContactCard"));
check("workbench shell exists", lead.includes("lead-detail-workbench-shell"));
check("data source of truth card exists", lead.includes("data-lead-data-source-of-truth"));
check("notes/history center exists", lead.includes("data-lead-notes-history-center"));
check("upcoming actions card exists", lead.includes("data-lead-upcoming-actions-card"));
check("timeline limited to 5", lead.includes("timeline.slice(0, 5)"));
check("activities limited to 5", lead.includes("activities.slice(0, 5)"));
check("desktop has data notes actions columns", css.includes('grid-template-areas: "data notes actions"'));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);