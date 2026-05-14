const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8'); }
function fail(message) { console.error('STAGE80_TODAY_TASK_DONE_DESKTOP_VISIBILITY_FAIL: ' + message); process.exit(1); }
const today = read('src/pages/TodayStable.tsx');
const css = read('src/styles/stage80-today-task-done-desktop-visibility.css');
const main = read('src/main.tsx');
for (const token of [
  'cf-today-row-actions',
  'cf-today-task-done-button',
  'data-stage79-task-done-action',
  'stage80TaskRoute',
  'stage80TaskPathId',
  'stage80TaskQueryId',
  'isStage80TaskBadge',
  "Boolean(fb4TaskId) || isStage80TaskBadge",
  "status: 'done'",
]) {
  if (!today.includes(token)) fail('TodayStable missing desktop/task-done token: ' + token);
}
for (const token of [
  '.cf-today-row-actions',
  '.cf-today-task-done-button[data-stage79-task-done-action="true"]',
  'display: inline-flex !important',
  'visibility: visible !important',
  'opacity: 1 !important',
  '@media (min-width: 640px)',
]) {
  if (!css.includes(token)) fail('desktop visibility CSS missing token: ' + token);
}
if (!main.includes("stage80-today-task-done-desktop-visibility.css")) fail('main.tsx does not import Stage80 desktop visibility CSS');
const badHidden = /\.cf-today-task-done-button[\s\S]{0,220}(display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0)/i;
if (badHidden.test(css)) fail('Stage80 CSS hides the task done button');
console.log('OK stage80 today task done desktop visibility');
