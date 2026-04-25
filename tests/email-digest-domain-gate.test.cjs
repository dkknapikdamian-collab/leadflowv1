const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('email digest controls are hidden until sender domain is verified', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;/);
  assert.match(settings, /DAILY_DIGEST_EMAIL_UI_VISIBLE \? \(/);
  assert.match(settings, /Mailowy digest jest gotowy technicznie/);
  assert.match(settings, /ukryty do czasu podpiecia domeny nadawczej/);
  assert.match(settings, /powiadomienia@twojadomena\.pl/);
});

test('email digest backend handlers remain available for later domain activation', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /handleSaveDigestSettings/);
  assert.match(settings, /handleCheckDigestDiagnostics/);
  assert.match(settings, /handleSendDigestTest/);
  assert.match(settings, /Wyslij test teraz/);
  assert.match(settings, /Sprawdz konfiguracje/);
});

test('release gates include email digest domain gate regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/email-digest-domain-gate\.test\.cjs/);
  assert.match(fullGate, /tests\/email-digest-domain-gate\.test\.cjs/);
});
