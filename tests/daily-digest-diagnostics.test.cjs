const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('daily digest API exposes workspace diagnostics without sending email', () => {
  const api = read('api/daily-digest.ts');

  assert.match(api, /workspace-diagnostics/);
  assert.match(api, /digest-diagnostics/);
  assert.match(api, /hasResendApiKey/);
  assert.match(api, /usesFallbackFromEmail/);
  assert.match(api, /cronSecretConfigured/);
  assert.match(api, /canSend/);
});

test('settings page exposes digest diagnostics button and status panel', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /DigestDiagnosticsState/);
  assert.match(settings, /handleCheckDigestDiagnostics/);
  assert.match(settings, /Sprawdz konfiguracje/);
  assert.match(settings, /Digest gotowy do wysylki/);
  assert.match(settings, /Digest wymaga konfiguracji/);
  assert.match(settings, /RESEND_API_KEY:/);
  assert.match(settings, /DIGEST_FROM_EMAIL:/);
});

test('release gates include digest diagnostics regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/daily-digest-diagnostics\.test\.cjs/);
  assert.match(fullGate, /tests\/daily-digest-diagnostics\.test\.cjs/);
});
