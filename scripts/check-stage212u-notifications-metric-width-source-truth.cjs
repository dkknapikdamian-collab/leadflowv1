const fs = require('fs');

function fail(message) {
  console.error('STAGE212U_GUARD_FAIL: ' + message);
  process.exit(1);
}

function read(path) {
  if (!fs.existsSync(path)) fail('missing file: ' + path);
  return fs.readFileSync(path, 'utf8');
}

const notificationsCss = read('src/styles/visual-stage10-notifications-vnext.css');
const foundationCss = read('src/styles/closeflow-visual-foundation-stage212m.css');
const runtime = read('src/components/VisualFoundationRuntimeStage212M.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');

if (!notifications.includes('className="notifications-stats-grid"')) {
  fail('NotificationsCenter.tsx missing notifications-stats-grid marker');
}

if (!notifications.includes('columns={4}')) {
  fail('NotificationsCenter.tsx metric tiles should stay columns={4}');
}

for (const source of [
  ['visual-stage10-notifications-vnext.css', notificationsCss],
  ['closeflow-visual-foundation-stage212m.css', foundationCss],
  ['VisualFoundationRuntimeStage212M.tsx', runtime],
]) {
  const [name, text] = source;

  if (!text.includes('STAGE212U_NOTIFICATIONS_METRIC_WIDTH_SOURCE_TRUTH')) {
    fail(`${name} missing Stage212U marker`);
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

console.log('STAGE212U_NOTIFICATIONS_METRIC_WIDTH_SOURCE_TRUTH_GUARD_PASS');
