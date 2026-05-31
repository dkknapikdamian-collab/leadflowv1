const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const file = path.join(repo, 'src', 'pages', 'NotificationsCenter.tsx');
const src = fs.readFileSync(file, 'utf8');

function fail(message) {
  console.error('STAGE180R_NOTIFICATIONS_REMOVE_CHANNELS_CARD_ANCHORLESS_GUARD_FAIL: ' + message);
  process.exit(1);
}

const forbidden = [
  'Kanały',
  'Poranny digest e-mail',
  'Powiadomienia są zablokowane w przeglądarce',
  'Odblokuj je w ustawieniach przeglądarki',
  'Konfiguracja w Ustawieniach',
  'notifications-channel-card',
  'PermissionCopy',
  'getBrowserNotificationsEnabled',
  'setBrowserEnabledState',
];

for (const needle of forbidden) {
  if (src.includes(needle)) fail('NotificationsCenter.tsx still contains removed channel card copy/symbol: ' + needle);
}

for (const required of ['Szybkie akcje', 'Nadchodzące', 'Jak działają powiadomienia?', 'notifications-right-rail', 'STAGE180R_NOTIFICATIONS_CHANNELS_CARD_REMOVED']) {
  if (!src.includes(required)) fail('NotificationsCenter.tsx missing required remaining UI/marker: ' + required);
}

console.log('STAGE180R_NOTIFICATIONS_REMOVE_CHANNELS_CARD_ANCHORLESS_GUARD_PASS');
