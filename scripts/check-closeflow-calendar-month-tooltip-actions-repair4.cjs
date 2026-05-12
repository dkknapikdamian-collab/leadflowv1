const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-month-tooltip-actions-repair4.css');
const auditJson = read('docs/ui/CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_CHECK.generated.json');

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Repair4 import exists', calendar.includes("closeflow-calendar-month-tooltip-actions-repair4.css"));
expect('title tooltip setter exists', calendar.includes("setAttribute('title', fullText)"));
expect('aria label setter exists', calendar.includes("setAttribute('aria-label', fullText)"));
expect('action rail data hook exists', calendar.includes('data-cf-calendar-entry-actions="true"'));
expect('month ellipsis CSS exists', css.includes('text-overflow: ellipsis'));
expect('month nowrap CSS exists', css.includes('white-space: nowrap'));
expect('actions nowrap CSS exists', css.includes('flex-wrap: nowrap'));
expect('audit passed', auditJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_MONTH_TOOLTIP_ACTIONS_REPAIR4_CHECK_OK');
