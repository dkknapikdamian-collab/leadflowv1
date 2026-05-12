const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';
const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-selected-day-full-labels-v6.css');
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_AUDIT.generated.json');
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('import exists', calendar.includes("import '../styles/closeflow-calendar-selected-day-full-labels-v6.css';"));
expect('effect exists', calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'));
expect('full labels exist', calendar.includes("full: 'Zadanie'") && calendar.includes("full: 'Wydarzenie'"));
expect('item text is appended', calendar.includes('titleSpan.textContent = itemText;'));
expect('css selected row exists', css.includes('.cf-calendar-selected-day-row-v6'));
expect('css full label exists', css.includes('.cf-calendar-selected-day-kind-v6'));
expect('css title ellipsis exists', css.includes('.cf-calendar-selected-day-title-v6') && css.includes('text-overflow: ellipsis !important'));
expect('audit pass', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_CHECK_OK');
