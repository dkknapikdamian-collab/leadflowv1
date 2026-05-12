const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-render-pipeline-repair3.css');

const forbiddenImports = [
  'closeflow-calendar-color-tooltip-v2.css',
  'closeflow-calendar-month-chip-overlap-fix-v1.css',
  'closeflow-calendar-month-rows-no-overlap-repair2.css',
  'closeflow-calendar-month-entry-structural-fix-v3.css',
  'closeflow-calendar-month-plain-text-rows-v4.css',
  'closeflow-calendar-selected-day-readability-v5.css',
  'closeflow-calendar-selected-day-full-labels-v6.css',
  'closeflow-calendar-v6-repair1-scope-text.css',
  'closeflow-calendar-month-light-selected-day-real-entries-repair2.css'
];

const forbiddenRuntimeMarkers = [
  'CLOSEFLOW_CALENDAR_COLOR_TOOLTIP_V2_EFFECT',
  'CLOSEFLOW_CALENDAR_MONTH_CHIP_OVERLAP_FIX_V1_EFFECT',
  'CLOSEFLOW_CALENDAR_MONTH_ROWS_NO_OVERLAP_REPAIR2_TOOLTIP_ROW_TITLE',
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'
];

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Calendar imports Repair3 CSS', calendar.includes("import '../styles/closeflow-calendar-render-pipeline-repair3.css';"));
expect('Calendar has Repair3 marker', calendar.includes('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12'));

for (const forbidden of forbiddenImports) {
  expect(`old CSS import removed: ${forbidden}`, !calendar.includes(forbidden));
}
for (const forbidden of forbiddenRuntimeMarkers) {
  expect(`old runtime marker removed: ${forbidden}`, !calendar.includes(forbidden));
}

expect('No replaceChildren visual normalizer remains', !calendar.includes('replaceChildren();'));
expect('Repair3 CSS defines black text', css.includes('--cf-calendar-r3-text: #0f172a'));
expect('Repair3 CSS targets month rows', css.includes('.cf-calendar-month-text-row'));
expect('Repair3 CSS targets real selected/list cards', css.includes('.calendar-entry-card') && css.includes('.cf-readable-card'));
expect('Repair3 CSS is Calendar scoped', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('Repair3 CSS avoids sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css));

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures
};
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_CHECK.generated.json'), JSON.stringify(result, null, 2), 'utf8');

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_AUDIT_OK');
