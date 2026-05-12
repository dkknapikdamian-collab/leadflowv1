const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-text-ellipsis-selected-day-repair5.css');

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('Repair5 CSS import exists', calendar.includes("closeflow-calendar-text-ellipsis-selected-day-repair5.css"));
expect('Repair5 marker exists', calendar.includes("CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_2026_05_12"));
expect('Repair5 effect exists', calendar.includes("CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_EFFECT"));
expect('Calendar body route class is mounted', calendar.includes("body.classList.add('cf-calendar-route-active')"));
expect('Calendar body route class is cleaned', calendar.includes("body.classList.remove('cf-calendar-route-active')"));
expect('Month entry runtime class is added', calendar.includes("cf-cal-r5-month-entry"));
expect('Month title runtime class is added', calendar.includes("cf-cal-r5-month-title"));
expect('Selected day section runtime class is added', calendar.includes("cf-cal-r5-selected-day-section"));
expect('Selected day list runtime class is added', calendar.includes("cf-cal-r5-selected-day-list"));
expect('Native title tooltip is set', calendar.includes("setAttribute('title', fullText)"));
expect('Action rail hook exists', calendar.includes('data-cf-calendar-entry-actions="true"'));

expect('CSS has body scope', css.includes("body.cf-calendar-route-active"));
expect('CSS month entry selector exists', css.includes(".cf-cal-r5-month-entry"));
expect('CSS month title ellipsis exists', css.includes(".cf-cal-r5-month-entry .cf-cal-r5-month-title") && css.includes("text-overflow: ellipsis"));
expect('CSS selected day list one column exists', css.includes(".cf-cal-r5-selected-day-list") && css.includes("grid-template-columns: minmax(0, 1fr)"));
expect('CSS selected day action nowrap exists', css.includes("[data-cf-calendar-entry-actions=\"true\"]") && css.includes("flex-wrap: nowrap"));

const outDir = path.join(repo, 'docs', 'ui');
fs.mkdirSync(outDir, { recursive: true });
const result = {
  generatedAt: new Date().toISOString(),
  stage: 'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_2026_05_12',
  verdict: failures.length ? 'fail' : 'pass',
  failures
};
fs.writeFileSync(path.join(outDir, 'CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_CHECK.generated.json'), JSON.stringify(result, null, 2), 'utf8');

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_AUDIT_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('CLOSEFLOW_CALENDAR_TEXT_ELLIPSIS_SELECTED_DAY_REPAIR5_AUDIT_OK');
