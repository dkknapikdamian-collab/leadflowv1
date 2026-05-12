const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-v6-repair1-scope-text.css');
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Calendar imports repair CSS', calendar.includes("import '../styles/closeflow-calendar-v6-repair1-scope-text.css';"));
expect('Calendar has repair marker', calendar.includes('CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_2026_05_12'));
expect('Broad V6 effect removed', !calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'));
expect('CSS restores month text black', css.includes('--cf-calendar-v6r1-text: #0f172a'));
expect('CSS targets month rows', css.includes('.cf-calendar-month-text-row'));
expect('CSS targets selected day V6 rows', css.includes('.cf-calendar-selected-day-row-v6'));
expect('CSS selected day rows white background', css.includes('background: var(--cf-calendar-v6r1-white)'));
expect('CSS selected day title black', css.includes('.cf-calendar-selected-day-title-v6'));
expect('CSS scoped to calendar', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS avoids sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css));

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures
};

fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_AUDIT.generated.json'), JSON.stringify(result, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_AUDIT.generated.md'), [
  '# CloseFlow — Calendar V6 Repair1 Scope/Text Audit',
  '',
  `Verdict: **${result.verdict.toUpperCase()}**`,
  '',
  failures.length ? failures.map(f => `- ${f}`).join('\n') : '- none',
  ''
].join('\n'), 'utf8');

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_AUDIT_OK');
