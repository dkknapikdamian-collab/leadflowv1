const fs = require('fs');
const path = require('path');

function read(p) {
  return fs.readFileSync(path.join(process.cwd(), p), 'utf8');
}

function exists(p) {
  return fs.existsSync(path.join(process.cwd(), p));
}

function ok(message) {
  console.log(`ok ${message}`);
}

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exitCode = 1;
}

function assertNotIncludes(file, text, label) {
  if (file.includes(text)) fail(label || `Unexpected text: ${text}`);
  else ok(label || `does not include ${text}`);
}

function assertIncludes(file, text, label) {
  if (file.includes(text)) ok(label || `includes ${text}`);
  else fail(label || `Missing text: ${text}`);
}

const settingsPath = 'src/pages/Settings.tsx';
const cssPath = 'src/styles/Settings.css';
const pkgPath = 'package.json';

if (!exists(settingsPath)) fail('Missing src/pages/Settings.tsx');
if (!exists(pkgPath)) fail('Missing package.json');

const settings = read(settingsPath);
const pkg = JSON.parse(read(pkgPath));
const css = exists(cssPath) ? read(cssPath) : '';

assertNotIncludes(settings, 'type SettingsTab', 'Settings tab type removed');
assertNotIncludes(settings, 'SETTINGS_TABS', 'Settings tabs config removed');
assertNotIncludes(settings, 'settings-tabs', 'Settings tabs class removed from page');
assertNotIncludes(settings, 'data-settings-account-rail', 'Always-visible account rail removed');
assertNotIncludes(settings, 'SettingsLegacy', 'SettingsLegacy import/reference removed');
assertNotIncludes(settings, 'CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1', 'repair marker removed from Settings.tsx');
assertNotIncludes(settings, 'CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT', 'tabs marker removed from Settings.tsx');

if (exists('src/pages/SettingsLegacy.tsx')) fail('src/pages/SettingsLegacy.tsx should be removed after rollback');
else ok('SettingsLegacy file removed');

const scripts = pkg.scripts || {};
if (scripts['check:settings-tabs-layout']) fail('package.json still has check:settings-tabs-layout');
else ok('package.json does not include check:settings-tabs-layout');
if (scripts['check:settings-layout-repair1']) fail('package.json still has check:settings-layout-repair1');
else ok('package.json does not include check:settings-layout-repair1');
assertIncludes(JSON.stringify(scripts), 'check:settings-rollback-2026-05-11', 'rollback guard script is registered');

assertNotIncludes(css, 'CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1', 'repair marker removed from Settings.css');
assertNotIncludes(css, 'CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT', 'tabs marker removed from Settings.css');
assertNotIncludes(css, '.settings-vnext-page', 'settings-vnext-page CSS removed');
assertNotIncludes(css, '.settings-account-rail', 'settings account rail CSS removed');

if (process.exitCode) process.exit(process.exitCode);
console.log('ok settings rollback guard passed');
