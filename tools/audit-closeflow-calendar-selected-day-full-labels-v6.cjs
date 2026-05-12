const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';
const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-selected-day-full-labels-v6.css');
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Calendar imports V6 CSS', calendar.includes("import '../styles/closeflow-calendar-selected-day-full-labels-v6.css';"));
expect('Calendar has V6 marker', calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_2026_05_12'));
expect('Calendar has V6 effect', calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'));
expect('Calendar maps Zadanie', calendar.includes("full: 'Zadanie'"));
expect('Calendar maps Wydarzenie', calendar.includes("full: 'Wydarzenie'"));
expect('Calendar creates kind span', calendar.includes("kindSpan.className = 'cf-calendar-selected-day-kind-v6';"));
expect('Calendar creates title span', calendar.includes("titleSpan.className = 'cf-calendar-selected-day-title-v6';"));
expect('Calendar preserves hover title', calendar.includes("row.setAttribute('title', fullHoverText);"));
expect('CSS has selected row', css.includes('.cf-calendar-selected-day-row-v6'));
expect('CSS has full label width', css.includes('min-width: 68px'));
expect('CSS has ellipsis title', css.includes('text-overflow: ellipsis !important'));
expect('CSS is scoped to calendar', css.includes('[data-cf-page-header-v2="calendar"] ~ *'));
expect('CSS avoids sidebar selectors', !/\[class\*=["'](?:sidebar|side|rail|left)["']\]/.test(css));

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
const result = { generatedAt: new Date().toISOString(), stage: 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_2026_05_12', verdict: failures.length ? 'fail' : 'pass', failures };
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_AUDIT.generated.json'), JSON.stringify(result, null, 2), 'utf8');
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_AUDIT.generated.md'), ['# CloseFlow — Calendar Selected Day Full Labels V6 Audit', '', `Verdict: **${result.verdict.toUpperCase()}**`, '', failures.length ? failures.map(f => `- ${f}`).join('\n') : '- none', ''].join('\n'), 'utf8');

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_AUDIT_OK');
