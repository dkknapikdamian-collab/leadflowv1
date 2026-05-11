#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const settingsPath = path.join(root, 'src/pages/Settings.tsx');
const cssPath = path.join(root, 'src/styles/Settings.css');

function fail(message) {
  console.error(`FAIL: ${message}`);
  process.exit(1);
}

function pass(message) {
  console.log(`PASS: ${message}`);
}

if (!fs.existsSync(settingsPath)) fail('src/pages/Settings.tsx not found');
const settings = fs.readFileSync(settingsPath, 'utf8');
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

const required = [
  ['settings-tabs', 'settings tabs class'],
  ['Plany', 'Plany tab'],
  ['Bezpieczeństwo', 'security tab label'],
  ['Workspace', 'workspace tab label'],
  ['Integracje', 'integrations tab label'],
  ['data-settings-account-rail="true"', 'always visible account rail marker'],
  ['Dane konta', 'account data heading'],
  ['settings-account-rail', 'account rail class'],
];

for (const [needle, label] of required) {
  if (!settings.includes(needle)) fail(`Missing ${label}: ${needle}`);
  pass(`Found ${label}`);
}

if (!/useState\s*<\s*SettingsTab\s*>\s*\(\s*['"]plans['"]\s*\)/.test(settings)) {
  fail('Active tab does not default to plans');
}
pass('Default tab is plans');

const tabsArrayMatch = settings.match(/const\s+SETTINGS_TABS\s*=\s*\[([\s\S]*?)\]\s*satisfies/);
if (!tabsArrayMatch) fail('SETTINGS_TABS array not found');
const tabsArray = tabsArrayMatch[1];
const plansIndex = tabsArray.indexOf("id: 'plans'");
const accountIndex = tabsArray.indexOf("id: 'account'");
if (plansIndex === -1 || accountIndex === -1) fail('plans/account tab ids not found');
if (plansIndex > accountIndex) fail('Plany must be before Konto in SETTINGS_TABS');
pass('Plany is before Konto');

if (!css.includes('.settings-shell')) fail('Settings CSS does not include .settings-shell');
if (!css.includes('grid-template-columns')) fail('Settings CSS does not define desktop grid columns');
if (!css.includes('@media (max-width: 980px)')) fail('Settings CSS does not include mobile fallback');
pass('Settings CSS layout exists');

console.log('Settings tabs layout guard passed.');
