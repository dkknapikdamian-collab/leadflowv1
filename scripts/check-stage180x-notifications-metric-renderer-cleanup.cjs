const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const tsxPath = path.join(repo, 'src', 'pages', 'NotificationsCenter.tsx');
const cssPath = path.join(repo, 'src', 'styles', 'visual-stage10-notifications-vnext.css');

function fail(message) {
  console.error('STAGE180X_NOTIFICATIONS_METRIC_RENDERER_CLEANUP_GUARD_FAIL: ' + message);
  process.exit(1);
}
function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + file);
  return fs.readFileSync(file, 'utf8');
}
const tsx = read(tsxPath);
const css = read(cssPath);

const forbiddenTsx = [
  'OperatorMetricTiles',
  'OperatorMetricTileItem',
  'function PermissionCopy(',
  '<PermissionCopy',
  '<h2>Kanały</h2>',
  'Poranny digest e-mail',
  'Konfiguracja w Ustawieniach',
  'Powiadomienia przeglądarki są włączone',
  'Powiadomienia są zablokowane w przeglądarce',
];
for (const value of forbiddenTsx) {
  if (tsx.includes(value)) fail('forbidden TSX marker remains: ' + value);
}

const requiredTsx = [
  'data-stage180x-notifications-metric-renderer-cleanup="true"',
  'notifications-today-parity-grid',
  'notifications-today-parity-tile',
  'notifications-today-parity-card',
  'notificationMetricTiles.map((tile)',
  'onClick={() => setActiveFilter(tile.id)}',
  'Szybkie akcje',
  'Nadchodzące',
  'Jak działają powiadomienia?',
];
for (const value of requiredTsx) {
  if (!tsx.includes(value)) fail('missing required TSX marker: ' + value);
}

const requiredCss = [
  'STAGE180X_NOTIFICATIONS_METRIC_RENDERER_CLEANUP',
  '.notifications-vnext-page .notifications-stats-grid.notifications-today-parity-grid',
  'grid-template-columns: repeat(4, minmax(0, 1fr)) !important',
  '.notifications-today-parity-card',
  '.notifications-today-parity-icon',
];
for (const value of requiredCss) {
  if (!css.includes(value)) fail('missing required CSS marker: ' + value);
}

console.log('STAGE180X_NOTIFICATIONS_METRIC_RENDERER_CLEANUP_GUARD_PASS');
