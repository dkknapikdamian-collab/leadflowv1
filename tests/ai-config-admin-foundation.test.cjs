const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}
function exists(relativePath) {
  return fs.existsSync(path.join(repoRoot, relativePath));
}

test('admin AI config foundation is wired behind admin navigation and consolidated system API route', () => {
  const app = read('src/App.tsx');
  const layout = read('src/components/Layout.tsx');
  const page = read('src/pages/AdminAiSettings.tsx');
  const client = read('src/lib/ai-config.ts');
  const system = read('api/system.ts');
  const server = read('src/server/ai-config.ts');

  assert.equal(exists('api/ai-config.ts'), false, 'AI config must not create an extra Vercel api/*.ts function');
  assert.match(app, /AdminAiSettings/);
  assert.match(app, /path="\/settings\/ai"/);
  assert.match(layout, /isAdmin/);
  assert.match(layout, /AI admin/);
  assert.match(layout, /\/settings\/ai/);
  assert.match(page, /Dostęp tylko dla admina/);
  assert.match(page, /Konfiguracja AI/);
  assert.match(client, /fetchAiConfigDiagnostics/);
  assert.match(client, /\/api\/system\?kind=ai-config/);
  assert.match(system, /aiConfigHandler/);
  assert.match(system, /kind === 'ai-config'/);
  assert.match(server, /ADMIN_ONLY/);
  assert.match(server, /AI_PRIMARY_PROVIDER/);
  assert.match(server, /GEMINI_MODEL/);
  assert.match(server, /CLOUDFLARE_AI_MODEL/);
});

test('admin AI config tests are included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(source, /tests\/ai-config-admin-foundation\.test\.cjs/);
  assert.match(source, /tests\/ai-config-no-secret-leak\.test\.cjs/);
  assert.match(source, /tests\/cases-page-helper-copy-cleanup\.test\.cjs/);
});
