const fs = require('fs');
const path = require('path');
const repo = process.cwd();
const file = path.join(repo, 'src', 'pages', 'NotificationsCenter.tsx');
function fail(message) { console.error('STAGE180T_NOTIFICATIONS_CHANNELS_DEAD_COPY_FIX_GUARD_FAIL: ' + message); process.exit(1); }
const text = fs.readFileSync(file, 'utf8');
const forbidden = [
  'function PermissionCopy',
  '<PermissionCopy',
  '<h2>Kanały</h2>',
  'notifications-channel-card',
  'Poranny digest e-mail',
  'Digest działa tylko po konfiguracji',
  'Konfiguracja w Ustawieniach',
  'Odblokuj je w ustawieniach przeglądarki. W aplikacji nadal zobaczysz alerty.',
  'Możesz je włączyć, żeby terminy i pilne zadania nie uciekały z ekranu.',
  'Ta przeglądarka może nie obsługiwać powiadomień. Przypomnienia w aplikacji nadal działają.',
];
for (const marker of forbidden) {
  if (text.includes(marker)) fail('forbidden notifications channel copy/class remains: ' + marker);
}
const required = [
  'notifications-right-rail',
  '<h2>Szybkie akcje</h2>',
  '<h2>Nadchodzące</h2>',
  '<h2>Jak działają powiadomienia?</h2>',
];
for (const marker of required) {
  if (!text.includes(marker)) fail('missing required remaining notifications UI: ' + marker);
}
console.log('STAGE180T_NOTIFICATIONS_CHANNELS_DEAD_COPY_FIX_GUARD_PASS');
