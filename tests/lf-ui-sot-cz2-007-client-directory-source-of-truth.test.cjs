const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('CZ2-007 client-options exports canonical client metadata', () => {
  const source = read('src/lib/source-of-truth/client-options.ts');
  for (const token of [
    'CLIENT_HEALTH_OPTIONS', 'CLIENT_SOURCE_OPTIONS', 'PORTAL_STATUS_OPTIONS',
    'deriveClientHealthValue', 'getClientHealthMeta', 'getClientHealthLabel',
    'getClientHealthTone', 'getClientSourceMeta', 'getPortalStatusMeta', 'getPortalStatusLabel',
  ]) assert.match(source, new RegExp(`export\\s+(const|function)\\s+${token}\\b`));
  assert.match(source, /label:\s*'W realizacji'/);
  assert.match(source, /label:\s*'Onboarding'/);
  assert.match(source, /label:\s*'Wymaga ruchu'/);
  assert.match(source, /label:\s*'W sprzedaży'/);
  assert.match(source, /label:\s*'Do spięcia'/);
  assert.match(source, /label:\s*'Portal gotowy'/);
  assert.match(source, /label:\s*'Portal jeszcze niegotowy'/);
});

test('CZ2-007 src/lib/clients.ts delegates client UI metadata to client-options', () => {
  const source = read('src/lib/clients.ts');
  assert.match(source, /from '\.\/source-of-truth\/client-options'/);
  assert.match(source, /return getPortalStatusLabel\(portalReady\)/);
  assert.match(source, /return getClientHealthLabel\(input\)/);
  assert.match(source, /return getClientHealthTone\(label\)/);
  assert.doesNotMatch(source, /case\s+['"]W realizacji['"]/);
  assert.doesNotMatch(source, /case\s+['"]Onboarding['"]/);
});

test('CZ2-007 clients routes stay active and canonical', () => {
  const app = read('src/App.tsx');
  const routes = read('src/lib/routes.ts');
  const layout = read('src/components/Layout.tsx');
  assert.match(app, /path=\{CLOSEFLOW_ROUTES\.clients\}/);
  assert.match(app, /path=\{CLOSEFLOW_ROUTES\.clientDetail\}/);
  assert.match(routes, /clients:\s*'\/clients'/);
  assert.match(routes, /clientDetail:\s*'\/clients\/:clientId'/);
  assert.match(routes, /path:\s*CLOSEFLOW_ROUTES\.clients,\s*status:\s*'canonical'/);
  assert.match(routes, /path:\s*CLOSEFLOW_ROUTES\.clientDetail,\s*status:\s*'canonical'/);
  assert.match(layout, /label:\s*'Klienci'/);
  assert.match(layout, /path:\s*'\/clients'/);
});

test('CZ2-007 client pages do not define local metadata option maps', () => {
  for (const rel of ['src/pages/Clients.tsx', 'src/pages/ClientDetail.tsx']) {
    const source = read(rel);
    assert.doesNotMatch(source, /(const|let|var)\s+CLIENT_HEALTH_OPTIONS\b/);
    assert.doesNotMatch(source, /(const|let|var)\s+CLIENT_SOURCE_OPTIONS\b/);
    assert.doesNotMatch(source, /(const|let|var)\s+PORTAL_STATUS_OPTIONS\b/);
    assert.doesNotMatch(source, /bg-\$\{/);
    assert.doesNotMatch(source, /text-\$\{/);
    assert.doesNotMatch(source, /border-\$\{/);
  }
});

test('CZ2-007 changed source files are UTF-8 clean', () => {
  for (const rel of [
    'src/lib/source-of-truth/client-options.ts',
    'src/lib/clients.ts',
    'scripts/guards/verify-lf-ui-sot-cz2-007-client-directory-source-of-truth.cjs',
    'tests/lf-ui-sot-cz2-007-client-directory-source-of-truth.test.cjs',
  ]) assert.doesNotMatch(read(rel), /[ÅÄĹ�]/, `${rel} contains mojibake`);
});
