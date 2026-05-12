const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const failures = [];

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}
function stripCssComments(input) {
  return input.replace(/\/\*[\s\S]*?\*\//g, '');
}
function expect(label, ok) {
  if (!ok) failures.push(label);
}

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-skin-only-v1.css');
const cssNoComments = stripCssComments(css);
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1.generated.json');

expect('Calendar has repair1 marker', calendar.includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_2026_05_12'));
expect('CSS has header-sibling scope', cssNoComments.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS executable body has no broad cf-html-shell :has scope', !cssNoComments.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])'));
expect('CSS executable body has no broad side/sidebar/rail/left selectors', !/\[class\*=["'](?:side|sidebar|rail|left)["']\]/.test(cssNoComments));
expect('CSS executable body has no aside selector', !/(^|[\s,{])aside([\s,{:.#\[]|$)/m.test(cssNoComments));
expect('Repair1 audit generated', auditJson.includes('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_2026_05_12'));
expect('Repair1 audit passed', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_SKIN_SCOPE_REPAIR_AUDIT_V2_REPAIR1_CHECK_OK');
