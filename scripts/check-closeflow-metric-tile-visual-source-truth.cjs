const fs = require('fs');
const path = require('path');
const root = process.cwd();
const STAGE = 'CLOSEFLOW_METRIC_TILE_VISUAL_SOURCE_TRUTH_VS5U';
function read(rel){ return fs.readFileSync(path.join(root, rel), 'utf8'); }
function fail(message){ console.error(STAGE + '_CHECK_FAIL: ' + message); process.exit(1); }
function assert(condition, message){ if(!condition) fail(message); }
const css = read('src/styles/closeflow-metric-tile-visual-source-truth.css');
const emergency = read('src/styles/emergency/emergency-hotfixes.css');
const pkg = JSON.parse(read('package.json'));
const deep = JSON.parse(read('docs/ui/closeflow-metric-tiles-deep-source-map.generated.json'));
const today = read('src/pages/TodayStable.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const notifications = read('src/pages/NotificationsCenter.tsx');
assert(css.includes(STAGE), 'visual source truth CSS marker missing');
for (const needle of ['Owner:', 'Reason:', 'Scope:', 'remove_after_stage:']) assert(css.includes(needle), 'metadata missing: ' + needle);
for (const needle of ['--cf-metric-source-label-size', '--cf-metric-source-value-size', '--cf-metric-source-min-height', '.cf-top-metric-tile-content', '.cf-html-shell .main-today', '.notifications-stats-grid', 'data-p0-tasks-stable-rebuild']) assert(css.includes(needle), 'CSS missing selector/token: ' + needle);
assert(emergency.includes("@import '../closeflow-metric-tile-visual-source-truth.css';"), 'visual source truth CSS must be imported from emergency hotfixes so it wins legacy page CSS');
assert(emergency.lastIndexOf('closeflow-metric-tile-visual-source-truth.css') > emergency.lastIndexOf('closeflow-a1-client-note-event-lead-visibility-finalizer.css'), 'visual source truth import must be after older emergency imports');
assert(pkg.scripts && pkg.scripts['check:closeflow-metric-tile-visual-source-truth'], 'package check script missing');
assert(pkg.scripts && pkg.scripts['verify:closeflow-metric-tile-visual-source-truth'], 'package verify script missing');
assert(today.includes('P0_TODAY_STABLE_REBUILD'), 'TodayStable marker missing');
assert(tasks.includes('MetricGrid') && tasks.includes('StatShortcutCard'), 'Tasks must stay on MetricGrid -> StatShortcutCard');
assert(notifications.includes('MetricGrid') && notifications.includes('StatShortcutCard'), 'Notifications must stay on MetricGrid -> StatShortcutCard');
assert(deep && deep.marker === 'CLOSEFLOW_METRIC_TILES_DEEP_SOURCE_MAP_VS5T', 'deep source map marker mismatch');
const todayPage = deep.pages.find((page) => page.rel === 'src/pages/TodayStable.tsx');
assert(todayPage && todayPage.importsStatShortcutCard === false, 'this stage expects Today renderer migration to remain explicit and documented, not silently half-patched');
console.log(STAGE + '_CHECK_OK');
console.log('visual_layer=closeflow-metric-tile-visual-source-truth.css');
console.log('today_renderer_migration_pending=true');
console.log('tasks_notifications_shared_chain=MetricGrid->StatShortcutCard->MetricTile');
