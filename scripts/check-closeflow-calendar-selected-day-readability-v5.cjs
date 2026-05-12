const fs = require('fs');
const path = require('path');
const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel),'utf8') : '';
const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-selected-day-readability-v5.css');
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_AUDIT.generated.json');
const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };
expect('import exists', calendar.includes("import '../styles/closeflow-calendar-selected-day-readability-v5.css';"));
expect('marker exists', calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_2026_05_12'));
expect('css exists', css.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_2026_05_12'));
expect('row readable bg exists', css.includes('--cf-cal-selected-row-bg-v5'));
expect('row readable text exists', css.includes('--cf-cal-selected-row-text-v5'));
expect('audit pass', auditJson.includes('"verdict": "pass"'));
if (failures.length) { console.error('CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_CHECK_FAILED'); console.error(failures.join('\n')); process.exit(1); }
console.log('CLOSEFLOW_CALENDAR_SELECTED_DAY_READABILITY_V5_CHECK_OK');
