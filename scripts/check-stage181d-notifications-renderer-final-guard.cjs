#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const tsxPath = path.join(repo, 'src/pages/NotificationsCenter.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage10-notifications-vnext.css');
const tsx = fs.readFileSync(tsxPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const failures = [];
const fail = (msg) => failures.push(msg);

// Renderer must be local/Today-style, not OperatorMetricTiles.
if (tsx.includes('<OperatorMetricTiles')) fail('old <OperatorMetricTiles /> renderer remains');
if (tsx.includes('OperatorMetricTiles,')) fail('OperatorMetricTiles import remains');
if (tsx.includes('OperatorMetricTileItem')) fail('OperatorMetricTileItem type remains');
if (!tsx.includes('notifications-today-parity-grid')) fail('today-parity metric grid missing');
if (!tsx.includes('notifications-today-parity-tile')) fail('today-parity metric tile missing');
if (!tsx.includes('data-stage181d-notifications-metric-renderer-final="true"')) fail('Stage181D TSX marker missing');
if (!tsx.includes('data-cf-metric-replacement="stage181d-today-parity"')) fail('Stage181D metric replacement marker missing');

// Old Channels card must not return.
if (tsx.includes('function PermissionCopy')) fail('dead PermissionCopy helper remains');
if (tsx.includes('<PermissionCopy')) fail('dead <PermissionCopy /> usage remains');
for (const text of ['Poranny digest e-mail', 'Konfiguracja w Ustawieniach', '<h2>Kanały</h2>', '<h2>Kanały</h2>', '<h2>Kanały</h2>']) {
  if (tsx.includes(text)) fail(`dead channels card marker remains: ${text}`);
}

// Important: the live success toast is allowed and should not be treated as dead channel copy.
if (!tsx.includes('Powiadomienia przeglądarki są włączone.')) {
  fail('live browser notification success toast missing or still mojibake');
}

for (const text of ['Szybkie akcje', 'Nadchodzące', 'Jak działają powiadomienia?']) {
  if (!tsx.includes(text)) fail(`required right rail UI missing: ${text}`);
}

if (!css.includes('STAGE181D_NOTIFICATIONS_RENDERER_FINAL_GUARD')) fail('Stage181D CSS marker missing');
if (!css.includes('grid-template-columns: repeat(4, minmax(0, 1fr))')) fail('4-column metric grid contract missing');
if (!css.includes('notifications-stats-grid.notifications-today-parity-grid[data-stage181d-notifications-metric-renderer-final="true"]')) fail('specific Stage181D CSS selector missing');

if (failures.length) {
  console.error('STAGE181D_NOTIFICATIONS_RENDERER_FINAL_GUARD_FAIL: ' + failures.join('; '));
  process.exit(1);
}
console.log('STAGE181D_NOTIFICATIONS_RENDERER_FINAL_GUARD_PASS');
