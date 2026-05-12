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
const css = stripCssComments(read('src/styles/closeflow-calendar-color-tooltip-v2.css'));
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_DEEP_AUDIT.generated.json');

expect('Calendar imports color tooltip css', calendar.includes("import '../styles/closeflow-calendar-color-tooltip-v2.css';"));
expect('Calendar has v2 marker', calendar.includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12'));
expect('Calendar has tooltip effect marker', calendar.includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT'));
expect('Calendar sets title attribute', calendar.includes("node.setAttribute('title', raw);"));
expect('Calendar sets cfCalendarKind', calendar.includes('cfCalendarKind'));
expect('Calendar sets cfCalendarRowKind', calendar.includes('cfCalendarRowKind'));

expect('CSS has v2 marker', read('src/styles/closeflow-calendar-color-tooltip-v2.css').includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_SKIN_V2_2026_05_12'));
expect('CSS uses calendar sibling scope', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS has event color', css.includes('data-cf-calendar-kind="event"'));
expect('CSS has task color', css.includes('data-cf-calendar-kind="task"'));
expect('CSS has lead/phone color', css.includes('data-cf-calendar-kind="lead"') && css.includes('data-cf-calendar-kind="phone"'));
expect('CSS has tooltip cursor', css.includes('[data-cf-calendar-tooltip="true"]'));
expect('CSS has no broad shell scope', !css.includes('.cf-html-shell:has([data-cf-page-header-v2="calendar"])'));
expect('CSS has no sidebar selector', !css.includes('[class*="sidebar"]') && !css.includes('[class*="side"]') && !css.includes('[class*="rail"]'));

expect('deep audit generated', auditJson.includes('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_2026_05_12'));
expect('deep audit passed', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_CHECK_OK');
