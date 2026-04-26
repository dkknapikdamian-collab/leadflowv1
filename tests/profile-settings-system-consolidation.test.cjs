const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

const STANDALONE_PROFILE_SETTINGS_API = ['/api', 'profile-settings'].join('/');
const STANDALONE_PROFILE_SETTINGS_API_NO_SLASH = ['api', 'profile-settings'].join('/');

test('profile settings are consolidated into system API to keep Vercel function count safe', () => {
  const profileSettingsApiPath = path.join(root, 'api', 'profile-settings.ts');
  const system = read('api/system.ts');

  assert.equal(fs.existsSync(profileSettingsApiPath), false);
  assert.match(system, /handleProfileSettings/);
  assert.match(system, /PROFILE_SETTINGS_MATCH_QUERIES_V2/);
  assert.doesNotMatch(system, /PROFILE_SETTINGS_ROW_ID_MISSING/);
});

test('runtime code does not call standalone profile-settings API function', () => {
  const filesToScan = [
    'src',
    'api',
  ];

  const offenders = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(path.join(root, dir), { withFileTypes: true })) {
      const full = path.join(root, dir, entry.name);
      const relative = path.relative(root, full);

      if (entry.isDirectory()) {
        if (['node_modules', '.git', 'dist', 'build', '.vercel', '.tests-dist'].includes(entry.name)) continue;
        walk(relative);
      } else if (/\.(ts|tsx|js|jsx|mjs|cjs|html)$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        if (
          content.includes(STANDALONE_PROFILE_SETTINGS_API)
          || content.includes(STANDALONE_PROFILE_SETTINGS_API_NO_SLASH)
        ) {
          offenders.push(relative);
        }
      }
    }
  }

  for (const dir of filesToScan) {
    if (fs.existsSync(path.join(root, dir))) walk(dir);
  }

  assert.deepEqual(offenders, []);
});

test('profile settings docs do not publish the old standalone endpoint literally', () => {
  const docsDir = path.join(root, 'docs');
  const offenders = [];

  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      const relative = path.relative(root, full);

      if (entry.isDirectory()) {
        walk(full);
      } else if (/\.(md|txt)$/.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        if (
          content.includes(STANDALONE_PROFILE_SETTINGS_API)
          || content.includes(STANDALONE_PROFILE_SETTINGS_API_NO_SLASH)
        ) {
          offenders.push(relative);
        }
      }
    }
  }

  if (fs.existsSync(docsDir)) walk(docsDir);

  assert.deepEqual(offenders, []);
});

test('profile settings save still has system route and PWA meta is modernized', () => {
  const system = read('api/system.ts');
  const html = read('index.html');
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.match(system, /profile-settings/);
  assert.match(system, /safeUpdateWhere/);
  assert.match(fallback, /\/api\/system\?kind=profile-settings/);
  assert.match(html, /<meta name="mobile-web-app-capable" content="yes" \/>/);
});
