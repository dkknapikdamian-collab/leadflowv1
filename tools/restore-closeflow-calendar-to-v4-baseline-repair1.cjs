const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const repo = process.argv[2] || process.cwd();
const baseline = process.argv[3] || 'ca8404f';

function run(args) {
  cp.execFileSync(args[0], args.slice(1), { cwd: repo, stdio: 'pipe', encoding: 'utf8' });
}

function read(rel) {
  const full = path.join(repo, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

const restorePaths = [
  'src/pages/Calendar.tsx',
  'src/styles/closeflow-calendar-month-plain-text-rows-v4.css'
];

run(['git', 'cat-file', '-e', `${baseline}^{commit}`]);
run(['git', 'restore', '--source', baseline, '--', ...restorePaths]);

const postV4Files = [
  'src/styles/closeflow-calendar-selected-day-readability-v5.css',
  'src/styles/closeflow-calendar-selected-day-full-labels-v6.css',
  'src/styles/closeflow-calendar-v6-repair1-scope-text.css',
  'src/styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'src/styles/closeflow-calendar-render-pipeline-repair3.css',
  'src/styles/closeflow-calendar-month-tooltip-actions-repair4.css',
  'src/styles/closeflow-calendar-text-ellipsis-selected-day-repair5.css'
];

const removedPostV4Files = [];
for (const rel of postV4Files) {
  const full = path.join(repo, rel);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { force: true });
    removedPostV4Files.push(rel);
  }
}

const calendar = read('src/pages/Calendar.tsx');

const badImports = [
  'closeflow-calendar-selected-day-readability-v5.css',
  'closeflow-calendar-selected-day-full-labels-v6.css',
  'closeflow-calendar-v6-repair1-scope-text.css',
  'closeflow-calendar-month-light-selected-day-real-entries-repair2.css',
  'closeflow-calendar-render-pipeline-repair3.css',
  'closeflow-calendar-month-tooltip-actions-repair4.css',
  'closeflow-calendar-text-ellipsis-selected-day-repair5.css'
].filter((needle) => calendar.includes(needle));

const missingMustHave = [
  'closeflow-calendar-month-plain-text-rows-v4.css',
  'CLOSEFLOW_CALENDAR_MONTH_PLAIN_TEXT_ROWS_V4_2026_05_12'
].filter((needle) => !calendar.includes(needle));

const report = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_2026_05_12',
  baseline,
  restorePaths,
  removedPostV4Files,
  badImports,
  missingMustHave,
  verdict: badImports.length || missingMustHave.length ? 'fail' : 'pass',
  note: 'Repair1 fixes the restore script bug and restores only Calendar.tsx plus V4 month plain text CSS.'
};

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_2026-05-12.generated.json'), JSON.stringify(report, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_2026-05-12.generated.md'), [
  '# CloseFlow — Calendar restore to V4 baseline Repair1',
  '',
  `Baseline: \`${baseline}\``,
  '',
  `Verdict: **${report.verdict.toUpperCase()}**`,
  '',
  '## Restored paths',
  ...restorePaths.map((x) => `- ${x}`),
  '',
  '## Removed post-V4 CSS files',
  ...(removedPostV4Files.length ? removedPostV4Files.map((x) => `- ${x}`) : ['- none']),
  '',
  '## Bad imports left',
  ...(badImports.length ? badImports.map((x) => `- ${x}`) : ['- none']),
  '',
  '## Missing required V4 markers',
  ...(missingMustHave.length ? missingMustHave.map((x) => `- ${x}`) : ['- none']),
  ''
].join('\n'), 'utf8');

if (report.verdict !== 'pass') {
  console.error('CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_FAILED');
  console.error(JSON.stringify(report, null, 2));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_RESTORE_TO_V4_BASELINE_REPAIR1_OK');
console.log(JSON.stringify(report, null, 2));
