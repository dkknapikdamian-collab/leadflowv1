const fs = require("fs");

const checks = [];
function check(name, pass) { checks.push({ name, pass: Boolean(pass) }); }
function read(file) { return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : ""; }

const lead = read("src/pages/LeadDetail.tsx");
const css = read("src/styles/visual-stage14-lead-detail-vnext.css");

check("LeadDetail exists", fs.existsSync("src/pages/LeadDetail.tsx"));
check("CSS exists", fs.existsSync("src/styles/visual-stage14-lead-detail-vnext.css"));
check("Stage216-J3A still exists", lead.includes("STAGE216J3A_LEAD_DETAIL_HEADER_SIMPLIFICATION") && css.includes("STAGE216J3A_LEAD_DETAIL_HEADER_SIMPLIFICATION"));
check("Stage216-J3B marker exists in LeadDetail", lead.includes("STAGE216J3B_LEAD_DATA_PANEL"));
check("Stage216-J3B marker exists in CSS", css.includes("STAGE216J3B_LEAD_DATA_PANEL"));
check("left rail data panel exists", lead.includes("data-stage216j3b-lead-data-panel"));
check("EntityContactCard JSX removed", !lead.includes("<EntityContactCard"));
check("data panel has expected fields", lead.includes("Status") && lead.includes("Źródło") && lead.includes("Telefon") && lead.includes("E-mail") && lead.includes("Wartość") && lead.includes("Ostatnia aktywność"));
check("edit data action exists", lead.includes("handleStartLeadEditing") && lead.includes("Edytuj dane"));
check("notes section still exists", lead.includes("data-stage115-lead-notes-section"));
check("right rail still exists", lead.includes("lead-detail-right-rail"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);