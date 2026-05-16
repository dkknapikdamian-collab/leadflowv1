const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();

function read(rel) {
  const full = path.join(repo, rel);
  if (!fs.existsSync(full)) return '';
  return fs.readFileSync(full, 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}

const failures = [];
const warnings = [];
const expect = (label, ok) => {
  if (!ok) failures.push(label);
};

const calendar = read('src/pages/Calendar.tsx');
const v4Css = read('src/styles/closeflow-calendar-month-plain-text-rows-v4.css');
const packageJson = read('package.json');

/*
  Repair1: do NOT block every replaceChildren() globally.
  V4 baseline can contain old harmless code paths using replaceChildren().
  We block only post-V4 layers and post-V4 runtime markers that caused visual regression.
*/
const forbiddenCalendarImports = [
  'closeflow-calendar-selected-day-readability-v5.css',
  'closeflow-calendar-selected-day-full-labels-v6.css',
  'closeflow-calendar-v6-repair1-scope-text.css',
  'closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'closeflow-calendar-render-pipeline-repair3.css',
  'closeflow-calendar-month-tooltip-actions-repair4.css',
  'closeflow-calendar-text-ellipsis-selected-day-repair5.css'
];

const forbiddenRuntimeMarkers = [
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_2026_05_12',
  'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_2026_05_12',
  'CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_2026_05_12',
  'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12',
  'CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12',
  'CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_2026_05_12',
  'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_2026_05_12',
  'cf-calendar-route-active',
  'cf-cal-r5-month-entry'
];

const forbiddenFiles = [
  'src/styles/closeflow-calendar-selected-day-readability-v5.css',
  'src/styles/closeflow-calendar-selected-day-full-labels-v6.css',
  'src/styles/closeflow-calendar-v6-repair1-scope-text.css',
  'src/styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'src/styles/closeflow-calendar-render-pipeline-repair3.css',
  'src/styles/closeflow-calendar-month-tooltip-actions-repair4.css',
  'src/styles/closeflow-calendar-text-ellipsis-selected-day-repair5.css'
];

expect('Calendar.tsx exists', Boolean(calendar));
expect('V4 month CSS exists', Boolean(v4Css));
expect('Calendar imports V4 month CSS', calendar.includes("import '../styles/closeflow-calendar-month-plain-text-rows-v4.css';"));
expect('Calendar has V4 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12'));

for (const item of forbiddenCalendarImports) {
  expect(`post-V4 calendar import is absent: ${item}`, !calendar.includes(item));
}
for (const item of forbiddenRuntimeMarkers) {
  expect(`post-V4 runtime marker is absent: ${item}`, !calendar.includes(item));
}
for (const item of forbiddenFiles) {
  expect(`post-V4 CSS file is absent: ${item}`, !exists(item));
}

expect('V4 CSS contains stage marker', v4Css.includes('CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4'));
expect('V4 CSS uses nowrap', /white-space\s*:\s*nowrap\s*!important/.test(v4Css) || /white-space\s*:\s*nowrap/.test(v4Css));
expect('V4 CSS uses ellipsis', /text-overflow\s*:\s*ellipsis\s*!important/.test(v4Css) || /text-overflow\s*:\s*ellipsis/.test(v4Css));
expect('V4 CSS guards overflow hidden', /overflow\s*:\s*hidden\s*!important/.test(v4Css) || /overflow\s*:\s*hidden/.test(v4Css));
expect('V4 CSS has month text row selector', v4Css.includes('cf-calendar-month-text-row') || v4Css.includes('data-cf-calendar-row-kind'));
expect('V4 CSS is calendar scoped', v4Css.includes('calendar') || v4Css.includes('cf-calendar'));

const darkBackgroundPatterns = [
  /background(?:-color)?\s*:\s*#0f172a/i,
  /background(?:-color)?\s*:\s*#111827/i,
  /background(?:-color)?\s*:\s*#020617/i,
  /background(?:-color)?\s*:\s*rgb\(\s*15\s*,\s*23\s*,\s*42\s*\)/i
];

for (const pattern of darkBackgroundPatterns) {
  expect(`V4 CSS does not reintroduce dark inner month rows: ${pattern}`, !pattern.test(v4Css));
}

if (!packageJson.includes('check:closeflow:calendar-month-v4-freeze')) {
  warnings.push('package.json does not include check:closeflow:calendar-month-v4-freeze yet. Patch should add it.');
}

if (calendar.includes('replaceChildren();')) {
  warnings.push('Calendar.tsx contains replaceChildren(); allowed in Repair1 because it exists in accepted V4 baseline. Do not use it for post-V4 visual normalizers.');
}

const report = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_V4_VISUAL_FREEZE_GUARD_REPAIR1_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  frozenBaseline: {
    commit: '53e1dca',
    visualReference: 'user screenshot after restore: monthly calendar is acceptable and frozen',
    sourceTruth: [
      'src/pages/Calendar.tsx',
      'src/styles/closeflow-calendar-month-plain-text-rows-v4.css'
    ]
  },
  repair1: {
    reason: 'Previous guard was too strict because it blocked generic replaceChildren(); V4 baseline can contain it. Repair1 blocks only post-V4 visual layers and markers.',
    replaceChildrenPolicy: 'allowed only if not tied to post-V4 visual layer markers'
  },
  protectedAgainst: [
    'post-V4 calendar visual CSS imports',
    'post-V4 runtime visual markers',
    'dark inner pill rows in monthly calendar',
    'V5/V6/Repair2/Repair3/Repair4/Repair5 calendar layers'
  ],
  warnings,
  failures
};

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_V4_VISUAL_FREEZE_GUARD_REPAIR1_2026-05-12.generated.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_V4_VISUAL_FREEZE_GUARD_REPAIR1_2026-05-12.generated.md'), [
  '# CloseFlow \u2014 Calendar Month V4 Visual Freeze Guard Repair1',
  '',
  `Verdict: **${report.verdict.toUpperCase()}**`,
  '',
  '## Frozen baseline',
  `- Commit: \`${report.frozenBaseline.commit}\``,
  '- Visual reference: user screenshot after restore, monthly calendar accepted and frozen',
  '',
  '## Repair1 reason',
  report.repair1.reason,
  '',
  '## Source of truth',
  ...report.frozenBaseline.sourceTruth.map((x) => `- \`${x}\``),
  '',
  '## Guard blocks',
  ...report.protectedAgainst.map((x) => `- ${x}`),
  '',
  '## Warnings',
  ...(warnings.length ? warnings.map((x) => `- ${x}`) : ['- none']),
  '',
  '## Failures',
  ...(failures.length ? failures.map((x) => `- ${x}`) : ['- none']),
  ''
].join('\n'), 'utf8');

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_V4_VISUAL_FREEZE_GUARD_REPAIR1_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_V4_VISUAL_FREEZE_GUARD_REPAIR1_OK');
console.log(JSON.stringify(report, null, 2));
