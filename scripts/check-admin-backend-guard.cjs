const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  return fs.existsSync(path.join(root, rel)) ? fs.readFileSync(path.join(root, rel), 'utf8') : '';
}
const errors = [];
function assert(condition, message) { if (!condition) errors.push(message); }

const aiConfigServer = read('src/server/ai-config.ts');
const aiConfigClient = read('src/lib/ai-config.ts');
const adminPage = read('src/pages/AdminAiSettings.tsx');
const systemApi = read('api/system.ts');
const layout = read('src/components/Layout.tsx');

assert(aiConfigServer.includes('requireAdminAuthContext'), 'src/server/ai-config.ts must require backend admin auth context');
assert(/await\s+requireAdminAuthContext\s*\(\s*req\s*\)/.test(aiConfigServer), 'ai-config handler must await requireAdminAuthContext(req) before returning diagnostics');
assert(!/process\.env\.[A-Z0-9_]*(KEY|TOKEN|SECRET)/.test(aiConfigClient), 'client ai-config must not read env secrets');
assert(aiConfigClient.includes('/api/system?kind=ai-config'), 'client ai-config must call backend diagnostics endpoint');
assert(/Authorization\s*:\s*`Bearer \$\{accessToken\}`/.test(aiConfigClient), 'client ai-config request must pass bearer token when available');
assert(adminPage.includes('useWorkspace'), 'AdminAiSettings must use useWorkspace/api-me derived access state');
assert(adminPage.includes('isAdmin'), 'AdminAiSettings must gate UI on isAdmin');
assert(!/(localStorage|sessionStorage)\s*\.\s*getItem\s*\([^)]*(admin|role|isAdmin)/i.test(adminPage), 'AdminAiSettings must not read admin/role from browser storage');
assert(systemApi.includes('aiConfigHandler'), 'api/system.ts must route ai-config through server handler');
assert(/kind\s*===\s*['"]ai-config['"]/.test(systemApi) || /case\s+['"]ai-config['"]/.test(systemApi) || systemApi.includes('ai-config'), 'api/system.ts must expose ai-config only through explicit kind route');

if (layout) {
  assert(!/localStorage\s*\.\s*getItem\s*\([^)]*(admin|role|isAdmin)/i.test(layout), 'Layout must not derive admin navigation from localStorage');
}

if (errors.length) {
  console.error('Admin backend guard failed.');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}
console.log('OK: admin backend/UI guard passed.');
