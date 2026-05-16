const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('Google login is guarded in embedded mobile browsers before OAuth redirect', () => {
  const source = read('src/pages/Login.tsx');

  assert.ok(source.includes('isEmbeddedGoogleAuthBlockedUserAgent'), 'Login must detect embedded mobile browsers');
  assert.ok(source.includes('Google blokuje logowanie w tej przegl\u0105darce'), 'User must see a clear Google webview warning');
  assert.ok(source.includes('Otw\u00F3rz t\u0119 stron\u0119 w Chrome albo Safari'), 'User must get an external browser instruction');
  assert.ok(source.includes('Kopiuj link'), 'User must have a copy-link fallback');
  assert.ok(source.includes('handleCopyLoginUrl'), 'Login must expose copy-link fallback logic');
  assert.ok(source.includes('handleOpenExternalBrowserHint'), 'Login must expose external-browser helper action');
  assert.ok(source.includes('signInWithRedirect'), 'Normal mobile redirect auth must remain available outside blocked webviews');
  assert.ok(source.includes('signInWithPopup'), 'Desktop popup auth must remain available');
  assert.ok(source.includes('signInWithEmailAndPassword'), 'Email login must remain available');

  const guardIndex = source.indexOf('isEmbeddedGoogleAuthBlockedUserAgent()');
  const redirectIndex = source.indexOf('startRedirectFlow');
  assert.ok(guardIndex >= 0 && redirectIndex >= 0 && guardIndex < redirectIndex, 'Guard must run before OAuth redirect starts');
});

test('Google webview guard avoids malformed regex artifacts', () => {
  const source = read('src/pages/Login.tsx');

  assert.ok(!source.includes('/Line//i'), 'Line detector must not be a malformed regex');
  assert.ok(!source.includes('/Twitter|X//i'), 'Twitter detector must not be a malformed regex');
  assert.ok(!source.includes('/; wv)/i'), 'Android WebView detector must not be a malformed regex');
  assert.ok(!source.includes('w/i,'), 'Standalone broken wv detector must not remain');
  assert.ok(!source.includes('\u0008'), 'Backspace escape artifacts must not remain');
  assert.ok(!source.includes(String.fromCharCode(8)), 'Raw backspace characters must not remain');
  assert.ok(source.includes("'; wv)'") || source.includes("'; wv)'") || source.includes("; wv)"), 'Android WebView marker should stay covered');
});

test('Google webview guard test is included in quiet release gate', () => {
  const source = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(source.includes("'tests/google-mobile-login-webview-guard.test.cjs'"));
});
