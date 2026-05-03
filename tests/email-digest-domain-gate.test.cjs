const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('email digest UI is fully hidden until sender domain is ready', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /const DAILY_DIGEST_EMAIL_UI_VISIBLE = false;/);
  assert.match(settings, /DAILY_DIGEST_EMAIL_UI_VISIBLE \? \(/);
  assert.match(settings, /\) : null\}/);
  assert.doesNotMatch(settings, /Mailowy digest jest gotowy technicznie/);
  assert.doesNotMatch(settings, /ukryty do czasu podpiecia domeny nadawczej/);
  assert.doesNotMatch(settings, /powiadomienia@twojadomena\.pl/);
});

test('email digest backend handlers remain in code for later domain activation', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /handleSaveDigestSettings/);
  assert.match(settings, /handleCheckDigestDiagnostics/);
  assert.match(settings, /handleSendDigestTest/);
  assert.match(settings, /Wy\u015blij test teraz|Wyslij test teraz/);
  assert.match(settings, /Sprawd\u017a konfiguracj\u0119|Sprawdz konfiguracje/);
});

test('release gates include email digest domain gate regression test', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  const fullGate = read('scripts/closeflow-release-check.cjs');

  assert.match(quietGate, /tests\/email-digest-domain-gate\.test\.cjs/);
  assert.match(fullGate, /tests\/email-digest-domain-gate\.test\.cjs/);
});
