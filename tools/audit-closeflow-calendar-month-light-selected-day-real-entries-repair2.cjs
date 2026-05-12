const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css');
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Calendar imports repair2 CSS', calendar.includes("import '../styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css';"));
expect('Calendar has repair2 marker', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12'));
expect('Broad V6 effect absent', !calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'));
expect('V4 skips calendar-entry-card in label filter or chooser', calendar.includes("node.closest('.calendar-entry-card, .cf-readable-card, [data-calendar-entry-completed]')") || calendar.includes("labelNode.closest('.calendar-entry-card, .cf-readable-card, [data-calendar-entry-completed]')"));
expect('CSS forces month rows light', css.includes('.cf-calendar-month-text-row') && css.includes('background: var(--cf-cal-r2-card-bg)'));
expect('CSS forces month title black', css.includes('.cf-calendar-month-text-title') && css.includes('--cf-cal-r2-text: #0f172a'));
expect('CSS keeps selected real cards readable', css.includes('.calendar-entry-card') && css.includes('.cf-readable-card'));
expect('CSS scoped to Calendar', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS avoids sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css));

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures
};
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_AUDIT.generated.json'), JSON.stringify(result, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_AUDIT.generated.md'), [
  '# CloseFlow — Calendar Month Light + Selected Day Real Entries Repair2 Audit',
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  failures.length ? failures.map(f => `- ${f}`).join('\n') : '- none',
  ''
].join('\n'), 'utf8');

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_AUDIT_OK');
