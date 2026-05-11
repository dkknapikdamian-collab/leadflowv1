const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function ok(message) { console.log(`ok ${message}`); }
function fail(message) { console.error(`FAIL: ${message}`); process.exitCode = 1; }
function assertIncludes(source, needle, label) { source.includes(needle) ? ok(label || `includes ${needle}`) : fail(label || `missing ${needle}`); }
function assertNotIncludes(source, needle, label) { !source.includes(needle) ? ok(label || `does not include ${needle}`) : fail(label || `must not include ${needle}`); }
function assertOrder(source, before, after, label) {
  const a = source.indexOf(before);
  const b = source.indexOf(after);
  if (a >= 0 && b >= 0 && a < b) ok(label || `${before} before ${after}`);
  else fail(label || `${before} must be before ${after}`);
}

if (!exists('src/pages/Settings.tsx')) fail('src/pages/Settings.tsx missing');
if (!exists('src/styles/Settings.css')) fail('src/styles/Settings.css missing');

const settings = read('src/pages/Settings.tsx');
const css = read('src/styles/Settings.css');
const pkg = exists('package.json') ? JSON.parse(read('package.json')) : { scripts: {} };

assertIncludes(settings, 'CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE', 'stage marker in Settings.tsx');
assertIncludes(settings, 'data-settings-tabs-inplace="true"', 'in-page settings tab root');
assertIncludes(settings, 'settings-tabs', 'settings tabs class');
assertIncludes(settings, 'Plany', 'Plany tab');
assertIncludes(settings, 'Konto', 'Konto tab');
assertIncludes(settings, 'Bezpieczeństwo', 'security tab');
assertIncludes(settings, 'Workspace', 'workspace tab');
assertIncludes(settings, 'Powiadomienia', 'notifications tab');
assertIncludes(settings, 'Integracje', 'integrations tab');
assertIncludes(settings, "useState<SettingsTab>('plans')", 'default tab is plans');
assertOrder(settings, "{ id: 'plans'", "{ id: 'account'", 'Plany before Konto');
assertIncludes(settings, 'SettingsOriginalContent', 'original settings content preserved in account tab');
assertIncludes(settings, 'data-settings-original-content="true"', 'original settings content marker');
assertIncludes(settings, 'data-settings-account-strip="true"', 'account data shown inside settings, not app side rail');
assertNotIncludes(settings, 'SettingsLegacy', 'does not use SettingsLegacy wrapper');
assertNotIncludes(settings, 'settings-vnext-page', 'does not use failed vnext page wrapper');
assertNotIncludes(settings, 'settings-shell', 'does not use failed settings shell');
assertNotIncludes(settings, 'settings-account-rail', 'does not add right account rail');
assertNotIncludes(settings, 'right-card settings-account-card', 'does not reuse dark right-card account rail');

assertIncludes(css, 'CLOSEFLOW_STAGE13_SETTINGS_TABS_INPLACE_START', 'css stage marker');
assertIncludes(css, '.settings-inpage-card', 'css in-page card');
assertIncludes(css, '.settings-inpage-panel', 'css in-page panel');
assertIncludes(css, '@media (max-width: 980px)', 'css includes mobile fallback 980');
assertIncludes(css, '@media (max-width: 640px)', 'css includes mobile fallback 640');
assertNotIncludes(css, '.settings-vnext-page', 'css does not include failed vnext page selector');
assertNotIncludes(css, '.settings-shell', 'css does not include failed shell selector');
assertNotIncludes(css, '.settings-account-rail', 'css does not include right account rail selector');

if (pkg.scripts && pkg.scripts['check:settings-tabs-inplace'] === 'node scripts/check-closeflow-settings-tabs-inplace.cjs') ok('package script registered');
else fail('package script check:settings-tabs-inplace missing or wrong');

if (process.exitCode) process.exit(process.exitCode);
console.log('ok settings tabs inplace guard passed');
