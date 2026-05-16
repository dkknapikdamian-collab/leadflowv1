const fs = require('fs');
const path = require('path');

const root = process.cwd();
const failures = [];
let pass = 0;

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    failures.push(`${rel}: missing`);
    console.log(`FAIL ${rel}: missing`);
    return '';
  }
  return fs.readFileSync(p, 'utf8').replace(/^\uFEFF/, '');
}

function ok(condition, label) {
  if (condition) {
    pass += 1;
    console.log(`PASS ${label}`);
  } else {
    failures.push(label);
    console.log(`FAIL ${label}`);
  }
}

const leads = read('src/pages/Leads.tsx');
const css = read('src/styles/closeflow-list-row-tokens.css');
const pkg = read('package.json');
const doc = read('docs/feedback/CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP_2026-05-09.md');

ok(leads.includes('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP'), 'Leads has FB-2 marker');
ok(leads.includes('CLOSEFLOW_FB2_LEADS_PHONE_SINGLE_SOURCE'), 'Leads has phone single-source marker');
ok(!leads.includes('Telefon:'), 'Leads has no duplicated "Telefon:" prefix');
ok(leads.includes('Najcenniejsze leady'), 'right rail label is Najcenniejsze leady');
ok(!leads.includes('Najcenniejsze relacje'), 'old right rail relation label removed');
ok(leads.includes('CLOSEFLOW_FB2_RIGHT_RAIL_LEADS_ONLY'), 'right rail lead-only marker exists');
ok(leads.includes("buildRelationValueEntries({ leads: activeLeads, clients: [], cases: [] })"), 'right rail source is active leads only');
ok(!/const mostValuableRelations[\s\S]{0,300}clients,\s*cases/.test(leads), 'most valuable rail does not take clients/cases source');
ok(leads.includes('buildRelationFunnelValue({ leads: activeLeads, clients })'), 'global funnel value logic retained');
ok(!leads.includes('Najcenniejsi klienci'), 'right rail does not say clients');
ok(!leads.includes('Najcenniejsze kontakty'), 'right rail does not say contacts');

ok(css.includes('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP'), 'CSS has FB-2 marker');
ok(css.includes('min-width: 0'), 'CSS has min-width zero for text containers');
ok(css.includes('-webkit-line-clamp: 2'), 'CSS clamps long names');
ok(css.includes('word-break: normal'), 'CSS avoids breaking short words');
ok(css.includes('white-space: nowrap'), 'CSS keeps amount readable');

ok(pkg.includes('"check:closeflow-fb2-leads-list-right-rail-cleanup"'), 'package has FB-2 check script');

ok(doc.includes('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP'), 'doc has FB-2 marker');
ok(doc.includes('Najcenniejsze leady'), 'doc records right rail label decision');
ok(doc.includes('Telefon nie jest zdublowany'), 'doc records phone dedupe decision');
ok(doc.includes('nie zmienia finans\u00F3w'), 'doc records finance untouched constraint');

console.log(`\nSummary: ${pass} pass, ${failures.length} fail.`);
if (failures.length) {
  console.log('FAIL CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP_OK');
