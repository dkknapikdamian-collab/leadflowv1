const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-text-ellipsis-selected-day-repair5.css');
const generated = read('docs/ui/CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_CHECK.generated.json');

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Calendar has Repair5 import', calendar.includes("closeflow-calendar-text-ellipsis-selected-day-repair5.css"));
expect('Calendar annotates month rows', calendar.includes("node.classList.add('cf-cal-r5-month-entry')"));
expect('Calendar annotates selected-day section', calendar.includes("section.classList.add('cf-cal-r5-selected-day-section')"));
expect('Calendar annotates selected-day list', calendar.includes("commonParent.classList.add('cf-cal-r5-selected-day-list')"));
expect('Calendar adds hover title', calendar.includes("element.setAttribute('title', fullText)") || calendar.includes("setAttribute('title', fullText)"));
expect('CSS forces month nowrap', css.includes("white-space: nowrap") && css.includes("text-overflow: ellipsis"));
expect('CSS stacks selected day cards', css.includes("grid-template-columns: minmax(0, 1fr)"));
expect('CSS keeps desktop actions in one line', css.includes("flex-wrap: nowrap"));
expect('Audit passed', generated.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_CHECK_OK');
