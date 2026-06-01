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
check("Stage216-H marker still exists in LeadDetail", lead.includes("STAGE216H_LEAD_DETAIL_CONTACT_CARD_COMPACTION"));
check("Stage216-H marker still exists in CSS", css.includes("STAGE216H_LEAD_DETAIL_CONTACT_CARD_COMPACTION"));
check("Stage216-I marker exists in LeadDetail", lead.includes("STAGE216I_LEAD_DETAIL_CONTACT_GEOMETRY_FIX"));
check("Stage216-I marker exists in CSS", css.includes("STAGE216I_LEAD_DETAIL_CONTACT_GEOMETRY_FIX"));
check("desktop shell has three columns", css.includes("minmax(320px, 390px) minmax(0, 1fr) minmax(320px, 380px)"));
check("desktop grid areas are contact main rail", css.includes('grid-template-areas: "contact main rail"'));
check("contact list becomes one column on desktop", css.includes("grid-template-columns: 1fr !important"));
check("top cards are compact", css.includes("min-height: 124px"));
check("right rail remains mapped", css.includes("grid-area: rail"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);