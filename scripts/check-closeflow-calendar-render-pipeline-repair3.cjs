const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (rel) => fs.existsSync(path.join(repo, rel)) ? fs.readFileSync(path.join(repo, rel), 'utf8') : '';

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/closeflow-calendar-render-pipeline-repair3.css');
const checkJson = read('docs/ui/CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_CHECK.generated.json');

const failures = [];
const expect = (label, ok) => { if (!ok) failures.push(label); };

expect('repair import exists', calendar.includes("import '../styles/closeflow-calendar-render-pipeline-repair3.css';"));
expect('bad normalizer removed', !calendar.includes('replaceChildren();'));
expect('bad v6 marker removed', !calendar.includes('CLOSEFLOW_CALENDAR_SELECTED_DAY_FULL_LABELS_V6_EFFECT'));
expect('repair css exists', css.includes('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_2026_05_12'));
expect('calendar month entries light css exists', css.includes('background: var(--cf-calendar-r3-bg)'));
expect('real cards css exists', css.includes('.calendar-entry-card'));
expect('audit pass', checkJson.includes('"verdict": "pass"'));

if (failures.length) {
  console.error('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_CHECK_FAILED');
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log('CLOSEFLOW_CALENDAR_RENDER_PIPELINE_REPAIR3_CHECK_OK');
