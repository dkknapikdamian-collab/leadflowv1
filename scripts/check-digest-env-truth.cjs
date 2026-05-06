const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const root = process.cwd();
const digestHandler = fs.readFileSync(path.join(root, 'src/server/daily-digest-handler.ts'), 'utf8');
const settings = fs.readFileSync(path.join(root, 'src/pages/Settings.tsx'), 'utf8');
const notificationsCenter = fs.readFileSync(path.join(root, 'src/pages/NotificationsCenter.tsx'), 'utf8');
const systemApi = fs.readFileSync(path.join(root, 'api/system.ts'), 'utf8');

assert.match(digestHandler, /cronSecretConfigured/, 'Digest diagnostics must expose cronSecretConfigured');
assert.match(digestHandler, /if \(!cronSecret\) return false/, 'Digest manual route must require CRON_SECRET');
assert.match(digestHandler, /canSend/, 'Digest diagnostics must expose canSend truth');
assert.match(settings, /Digest wymaga konfiguracji/, 'Settings must show digest configuration truth');
assert.match(notificationsCenter, /Digest działa tylko po konfiguracji/, 'Notifications center must not claim digest always active');
assert.match(systemApi, /kind === 'weekly-report'/, 'System API must route weekly report handler');

console.log('PASS check:digest-env-truth');
