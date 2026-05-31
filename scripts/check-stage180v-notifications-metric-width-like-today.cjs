const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const cssPath = path.join(repo, 'src', 'styles', 'visual-stage10-notifications-vnext.css');
const css = fs.readFileSync(cssPath, 'utf8');
function fail(message) { console.error('STAGE180V_NOTIFICATIONS_METRIC_WIDTH_LIKE_TODAY_GUARD_FAIL: ' + message); process.exit(1); }
const required = [
  'STAGE180V_NOTIFICATIONS_METRIC_WIDTH_LIKE_TODAY',
  '.notifications-vnext-page > .cf-operator-metric-grid.notifications-stats-grid',
  'max-width: 1440px !important',
  'width: 100% !important',
  'grid-template-columns: repeat(4, minmax(0, 1fr)) !important',
  'justify-items: stretch !important',
  'max-width: none !important',
  '@media (max-width: 1180px)',
  '@media (max-width: 700px)'
];
for (const token of required) {
  if (!css.includes(token)) fail('missing required CSS token: ' + token);
}
const markerCount = (css.match(/STAGE180V_NOTIFICATIONS_METRIC_WIDTH_LIKE_TODAY/g) || []).length;
if (markerCount !== 1) fail('marker should appear exactly once, found: ' + markerCount);
console.log('STAGE180V_NOTIFICATIONS_METRIC_WIDTH_LIKE_TODAY_GUARD_PASS');
