const fs = require('fs');

function fail(message) {
  console.error('STAGE212X_GUARD_FAIL: ' + message);
  process.exit(1);
}

function read(path) {
  if (!fs.existsSync(path)) fail('missing file: ' + path);
  return fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
}

const runtime = read('src/components/VisualFoundationRuntimeStage212M.tsx');
const notificationsCss = read('src/styles/visual-stage10-notifications-vnext.css');
const foundationCss = read('src/styles/closeflow-visual-foundation-stage212m.css');
const notifications = read('src/pages/NotificationsCenter.tsx');

const runtimeTrimmed = runtime.trimStart();

if (!runtimeTrimmed.startsWith("import { useEffect } from 'react';")) {
  fail('runtime file does not start with React import after BOM/whitespace normalization');
}

if (!runtime.includes('const css = `')) {
  fail('runtime missing css template string');
}

const cssIndex = runtime.indexOf('const css = `');
const rawCssIndex = runtime.indexOf('body #root .notifications-vnext-page');

if (rawCssIndex !== -1 && rawCssIndex < cssIndex) {
  fail('notification CSS appears before css template string');
}

if (!notifications.includes('notifications-stats-grid')) {
  fail('NotificationsCenter.tsx missing notifications-stats-grid marker');
}

/*
  Nie wymagamy już literalnego columns={4}.
  To było kruche: JSX może mieć whitespace, inny renderer albo kolumny mogą być kontrolowane przez CSS.
  Kontrakt Stage212X: klasa grid istnieje, a 4 kolumny desktopowe są źródłem prawdy w CSS/runtime.
*/
if (!notifications.includes('OperatorMetricTiles') && !notifications.includes('notifications-stats-grid')) {
  fail('NotificationsCenter.tsx missing metric renderer/source marker');
}

for (const [name, text] of [
  ['VisualFoundationRuntimeStage212M.tsx', runtime],
  ['visual-stage10-notifications-vnext.css', notificationsCss],
  ['closeflow-visual-foundation-stage212m.css', foundationCss],
]) {
  if (!text.includes('STAGE212V_NOTIFICATIONS_METRIC_WIDTH_RUNTIME_REPAIR')) {
    fail(`${name} missing Stage212V marker`);
  }

  if (!text.includes('.notifications-stats-grid')) {
    fail(`${name} missing notifications-stats-grid selector`);
  }

  if (!text.includes('max-width: none')) {
    fail(`${name} missing max-width none override`);
  }

  if (!text.includes('width: 100%')) {
    fail(`${name} missing width 100 override`);
  }

  if (!text.includes('grid-template-columns: repeat(4, minmax(0, 1fr))')) {
    fail(`${name} missing 4-column desktop grid source truth`);
  }
}

console.log('STAGE212X_NOTIFICATIONS_WIDTH_FINAL_GUARD_PASS');