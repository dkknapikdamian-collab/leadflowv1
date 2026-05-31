const fs = require('fs');
const path = require('path');
const root = process.cwd();
const file = path.join(root, 'src/pages/NotificationsCenter.tsx');
const src = fs.readFileSync(file, 'utf8');
function fail(message) { console.error('STAGE180S_NOTIFICATIONS_CHANNELS_FINAL_GUARD_FAIL: ' + message); process.exit(1); }
const forbidden = [
  'Kanały',
  'Poranny digest e-mail',
  'Powiadomienia są zablokowane w przeglądarce',
  'Powiadomienia przeglądarki są włączone',
  'Powiadomienia przeglądarki nie są jeszcze włączone',
  'Konfiguracja w Ustawieniach',
  'PermissionCopy permission',
  'function PermissionCopy',
];
for (const item of forbidden) {
  if (src.includes(item)) fail('forbidden notifications channel copy remains: ' + item);
}
const required = ['Szybkie akcje', 'Nadchodzące', 'Jak działają powiadomienia?', 'notifications-right-rail'];
for (const item of required) {
  if (!src.includes(item)) fail('missing required remaining notifications UI: ' + item);
}
console.log('STAGE180S_NOTIFICATIONS_CHANNELS_FINAL_GUARD_PASS');
