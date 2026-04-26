const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('profile settings endpoint does not require existing profile row id', () => {
  const source = read('api/system?kind=profile-settings.ts');

  assert.match(source, /buildLookupQueries/);
  assert.match(source, /insertProfileWithSchemaFallback/);
  assert.match(source, /updateProfileWithSchemaFallback/);
  assert.doesNotMatch(source, /PROFILE_SETTINGS_ROW_ID_MISSING/);
});

test('profile settings endpoint supports appearance skin save contract', () => {
  const source = read('api/system?kind=profile-settings.ts');

  assert.match(source, /appearance_skin/);
  assert.match(source, /appearanceSkin/);
  assert.match(source, /settings:\s*\{/);
});

test('index html includes modern mobile web app capable meta tag', () => {
  const html = read('index.html');

  assert.match(html, /<meta name="mobile-web-app-capable" content="yes" \/>/);
  assert.match(html, /<meta name="apple-mobile-web-app-capable" content="yes" \/>/);
});
