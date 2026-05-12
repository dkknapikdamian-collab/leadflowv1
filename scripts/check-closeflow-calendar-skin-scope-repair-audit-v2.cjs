const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function p(rel) {
  return path.join(repo, rel);
}
function read(rel) {
  return fs.existsSync(p(rel)) ? fs.readFileSync(p(rel), 'utf8') : '';
}
function expect(label, ok) {
  if (!ok) failures.push(label);
}

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-skin-only-v1.css');
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2.generated.json');

expect('Calendar imports repaired calendar skin', calendar.includes("import '../styles/closeflow-calendar-skin-only-v1.css';"));
expect('Calendar has repair marker', calendar.includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12'));

expect('CSS repair marker exists', css.includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12'));
expect('CSS uses header sibling scope', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS does not use broad cf-html-shell calendar has scope', !css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])'));
expect('CSS does not include broad side selector', !/\[class\*=["'](?:side|sidebar|rail|left)["']\]/.test(css));
expect('CSS does not include aside selector', !/(^|[\s,{])aside([\s,{:.#\[]|$)/m.test(css));
expect('CSS still styles calendar entry cards', css.includes('.calendar-entry-card'));
expect('CSS still neutralizes dark calendar slabs within content', css.includes('bg-slate-950'));
expect('CSS styles event/task/lead chips', css.includes('[data-cf-entity-type="event"]') && css.includes('[data-cf-entity-type="task"]') && css.includes('[data-cf-entity-type="lead"]'));
expect('Audit generated', auditJson.includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_2026_05_12'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_CHECK_OK');
