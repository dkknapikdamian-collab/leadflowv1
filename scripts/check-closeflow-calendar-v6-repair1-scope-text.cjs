const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';
const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-v6-repair1-scope-text.css');
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_AUDIT.generated.json');

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('repair import exists', calendar.includes("import '../styles/closeflow-calendar-v6-repair1-scope-text.css';"));
expect('repair marker exists', calendar.includes('CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_2026_05_12'));
expect('bad V6 effect removed', !calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'));
expect('black text token exists', css.includes('#0f172a'));
expect('month row selector exists', css.includes('.cf-calendar-month-text-row'));
expect('selected row selector exists', css.includes('.cf-calendar-selected-day-row-v6'));
expect('audit pass', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CLOSEFLOW_CALENDAR_V6_REPAIR1_SCOPE_TEXT_CHECK_OK');
