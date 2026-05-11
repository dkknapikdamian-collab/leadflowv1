#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

function fail(message) {
  console.error(`x ${message}`);
  process.exitCode = 1;
}

function pass(message) {
  console.log(`ok ${message}`);
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(`${label} missing '${needle}'`);
  else pass(`${label} includes '${needle}'`);
}

function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) fail(`${label} should not include '${needle}'`);
  else pass(`${label} does not include '${needle}'`);
}

function assertRegex(source, regex, label) {
  if (!regex.test(source)) fail(`${label} does not match ${regex}`);
  else pass(`${label} matches ${regex}`);
}

function assertOrder(source, first, second, label) {
  const a = source.indexOf(first);
  const b = source.indexOf(second);
  if (a < 0 || b < 0 || a >= b) fail(`${label} order invalid: '${first}' before '${second}'`);
  else pass(`${label} order ok: '${first}' before '${second}'`);
}

const settingsPath = 'src/pages/Settings.tsx';
const cssPath = 'src/styles/Settings.css';
if (!exists(settingsPath)) fail(`${settingsPath} not found`);
if (!exists(cssPath)) fail(`${cssPath} not found`);
if (process.exitCode) process.exit(1);

const settings = read(settingsPath);
const css = read(cssPath);

assertIncludes(settings, 'CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1', 'settings');
assertIncludes(settings, 'settings-tabs', 'settings');
assertIncludes(settings, 'Plany', 'settings');
assertIncludes(settings, 'Konto', 'settings');
assertIncludes(settings, 'Bezpieczeństwo', 'settings');
assertIncludes(settings, 'Workspace', 'settings');
assertIncludes(settings, 'Powiadomienia', 'settings');
assertIncludes(settings, 'Integracje', 'settings');
assertIncludes(settings, 'data-settings-account-rail="true"', 'settings');
assertIncludes(settings, 'settings-account-list', 'settings');
assertIncludes(settings, 'Status dostępu', 'settings');
assertIncludes(settings, "useState<SettingsTab>('plans')", 'settings');
assertIncludes(settings, 'formatDateLabel', 'settings');
assertOrder(settings, "{ id: 'plans'", "{ id: 'account'", 'settings tabs');
assertNotIncludes(settings, 'right-card settings-account-card', 'settings');

assertIncludes(css, 'CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_START', 'settings css');
assertRegex(css, /\.settings-vnext-page\s*{[\s\S]*width:\s*min\(1180px,\s*calc\(100vw - 48px\)\)/, 'settings css page width');
assertRegex(css, /\.settings-header\s*{[\s\S]*background:\s*transparent\s*!important/, 'settings css header transparent');
assertRegex(css, /\.settings-shell\s*{[\s\S]*grid-template-columns:\s*minmax\(0,\s*1fr\)\s*320px/, 'settings css shell columns');
assertRegex(css, /\.settings-account-card\s*{[\s\S]*background:\s*var\(--cf-card-bg,\s*#fff\)\s*!important/, 'settings css account white card');
assertRegex(css, /\.settings-account-row\s+strong\s*{[\s\S]*color:\s*var\(--cf-text,\s*#0f172a\)\s*!important/, 'settings css account value visible');

if (process.exitCode) process.exit(1);
console.log('ok settings layout repair1 guard passed');
