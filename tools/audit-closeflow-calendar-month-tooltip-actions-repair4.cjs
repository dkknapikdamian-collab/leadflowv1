const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-month-tooltip-actions-repair4.css');

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Calendar imports Repair4 CSS', calendar.includes("import '../styles/closeflow-calendar-month-tooltip-actions-repair4.css';"));
expect('Calendar has Repair4 marker', calendar.includes("CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12"));
expect('Calendar has hover title effect marker', calendar.includes("CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_EFFECT"));
expect('Hover effect does not rewrite DOM children', !calendar.includes("replaceChildren();"));
expect('Action rail has data hook', calendar.includes('data-cf-calendar-entry-actions="true"'));

expect('CSS has stage marker', css.includes("CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12"));
expect('CSS defines one-line month title', css.includes("text-overflow: ellipsis") && css.includes("white-space: nowrap"));
expect('CSS forces month row light background', css.includes("background: var(--cf-cal-r4-bg)") && css.includes("--cf-cal-r4-text: #0f172a"));
expect('CSS targets action rail in selected-day cards', css.includes(".calendar-entry-card > div:first-child > div:last-child"));
expect('CSS keeps action rail nowrap', css.includes("flex-wrap: nowrap"));
expect('CSS targets real cards', css.includes(".calendar-entry-card") && css.includes(".cf-readable-card"));

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures
};
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_CHECK.generated.json'), JSON.stringify(result, null, 2), 'utf8');

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_AUDIT_OK');
