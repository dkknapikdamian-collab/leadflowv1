const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';
const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css');
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_AUDIT.generated.json');
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('import exists', calendar.includes("import '../styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css';"));
expect('marker exists', calendar.includes('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_2026_05_12'));
expect('bad broad V6 effect gone', !calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'));
expect('v4 selected day skip exists', calendar.includes('calendar-entry-card') && calendar.includes('cf-readable-card'));
expect('month light background css exists', css.includes('background: var(--cf-cal-r2-card-bg)'));
expect('month black text css exists', css.includes('--cf-cal-r2-text: #0f172a'));
expect('selected real cards css exists', css.includes('.calendar-entry-card') && css.includes('.cf-readable-card'));
expect('audit pass', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CLOSEFLOW_CALENDAR_MONTH_LIGHT_SELECTED_DAY_REAL_ENTRIES_REPAIR2_CHECK_OK');
