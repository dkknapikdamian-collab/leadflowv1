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
check("LeadDetail Stage216-H marker exists", lead.includes("STAGE216H_LEAD_DETAIL_CONTACT_CARD_COMPACTION"));
check("CSS Stage216-H marker exists", css.includes("STAGE216H_LEAD_DETAIL_CONTACT_CARD_COMPACTION"));
check("contact card avatar row hidden", css.includes(".lead-detail-client-parity-contact-card .cf-entity-contact-avatar-row") && css.includes("display: none !important"));
check("contact card has title Dane kontaktowe", css.includes('content: "Dane kontaktowe"'));
check("contact card grid has three columns", css.includes("grid-template-columns: repeat(3, minmax(0, 1fr))"));
check("last contact row hidden only in lead contact card", css.includes(".lead-detail-client-parity-contact-card .cf-entity-contact-info-row:nth-child(4)") && css.includes("display: none !important"));
check("empty right-rail next action card removed", !lead.includes('data-lead-next-action-empty="-"'));
check("next action card is conditional", lead.includes('data-lead-next-action-card="true"') && lead.includes(") : null}"));
check("no SQL/RLS/GRANT added", !/\b(create\s+policy|alter\s+table|grant\s+|revoke\s+|drop\s+policy|enable\s+row\s+level\s+security)\b/i.test(lead + "\n" + css));

for (const item of checks) console.log(`${item.pass ? "PASS" : "FAIL"} - ${item.name}`);
const failed = checks.filter((item) => !item.pass);
console.log(`\nPASS: ${checks.length - failed.length}`);
console.log(`FAIL: ${failed.length}`);
if (failed.length) process.exit(1);