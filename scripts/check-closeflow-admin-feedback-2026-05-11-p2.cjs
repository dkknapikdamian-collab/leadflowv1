#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
let failures = 0;

function read(rel, required = false) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    if (required) fail(`${rel} is missing`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function listFiles(dir, predicate) {
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return [];
  const out = [];
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (predicate(full)) out.push(full);
    }
  };
  walk(fullDir);
  return out;
}

function readMany(rels) {
  return rels.map((rel) => read(rel, false)).join('\n');
}

function pass(message) {
  console.log(`PASS ${message}`);
}

function fail(message) {
  failures += 1;
  console.error(`FAIL ${message}`);
}

function assertIncludes(label, content, needle) {
  if (content.includes(needle)) pass(`${label} includes '${needle}'`);
  else fail(`${label} does not include '${needle}'`);
}

function assertNotIncludes(label, content, needle) {
  if (!content.includes(needle)) pass(`${label} does not include '${needle}'`);
  else fail(`${label} still includes '${needle}'`);
}

function cssForCaseDetail() {
  const candidates = [
    'src/styles/CaseDetail.css',
    'src/styles/case-detail.css',
    'src/styles/cases.css',
    'src/styles/closeflow-visual-system.css',
    'src/styles/closeflow-action-tokens.css',
  ];
  const dynamic = listFiles('src/styles', (full) => {
    const base = path.basename(full).toLowerCase();
    return base.endsWith('.css') && base.includes('case');
  }).map((full) => path.relative(root, full));
  return readMany([...new Set([...candidates, ...dynamic])]);
}

function hasDarkBackgroundForCaseQuickActions(css) {
  const blocks = css.match(/[^{}]*\.case-quick-actions[^{}]*\{[^{}]*\}/g) || [];
  const darkValue = /background(?:-color)?\s*:\s*(?:#(?:020617|0f172a|111827|1e293b|0b1120|101827)|rgb\(\s*(?:2|11|15|17|30)\s*,\s*(?:6|17|23|24|41)\s*,\s*(?:23|32|42|39|59)\s*\)|rgba\(\s*(?:2|11|15|17|30)\s*,\s*(?:6|17|23|24|41)\s*,\s*(?:23|32|42|39|59)\s*,|linear-gradient\([^;]*(?:#020617|#0f172a|#111827|#1e293b))/i;
  return blocks.some((block) => darkValue.test(block));
}

console.log('CloseFlow admin feedback P2 guard');
console.log('CaseDetail');
const caseDetail = read('src/pages/CaseDetail.tsx', true);
assertNotIncludes('caseDetail', caseDetail, 'Dodaj brak');
assertIncludes('caseDetail', caseDetail, 'case-quick-actions');
const caseCss = cssForCaseDetail();
if (hasDarkBackgroundForCaseQuickActions(caseCss)) {
  fail("case detail styles include dark background for '.case-quick-actions'");
} else {
  pass("case detail styles do not include dark background for '.case-quick-actions'");
}

console.log('Billing');
const billing = read('src/pages/Billing.tsx', true);
assertNotIncludes('billing', billing, 'Plan aktywny.');
assertNotIncludes('billing', billing, 'Co masz w planie');
assertNotIncludes('billing', billing, 'Co jest dostępne teraz');
assertNotIncludes('billing', billing, 'Rozliczenia lead/case');
assertNotIncludes('billing', billing, 'billing-limits-card');
assertIncludes('billing', billing, 'Następna płatność');
assertIncludes('billing', billing, 'billing-status-card');

console.log('Help');
const support = readMany(['src/pages/SupportCenter.tsx', 'src/pages/Help.tsx']);
if (!support.trim()) fail('support page source is missing');
assertNotIncludes('support', support, 'Zgłoszenia i status.');
assertNotIncludes('support', support, 'Szybkie linki');
assertNotIncludes('support', support, 'Status aplikacji');
if (/support-right-card[\s\S]{0,400}Kontakt|Kontakt[\s\S]{0,400}support-right-card/.test(support)) {
  fail("support still includes right-card contact panel");
} else {
  pass("support does not include support-right-card Kontakt panel");
}
assertIncludes('support', support, 'Moje zgłoszenia');
assertIncludes('support', support, 'data-support-ticket-list="true"');
assertIncludes('support', support, 'Brak odpowiedzi');
assertIncludes('support', support, 'support-ticket-status');

console.log('Settings');
const settings = read('src/pages/Settings.tsx', true);
assertIncludes('settings', settings, 'settings-tabs');
assertIncludes('settings', settings, 'Plany');
assertIncludes('settings', settings, 'Bezpieczeństwo');
assertIncludes('settings', settings, 'Workspace');
assertIncludes('settings', settings, 'Integracje');
assertIncludes('settings', settings, 'data-settings-account-rail="true"');
assertIncludes('settings', settings, 'Dane konta');

const plansIndex = settings.indexOf("{ id: 'plans'");
const accountIndex = settings.indexOf("{ id: 'account'");
if (plansIndex >= 0 && accountIndex >= 0 && plansIndex < accountIndex) {
  pass('settings SETTINGS_TABS keeps Plany before Konto');
} else if (settings.includes("useState<SettingsTab>('plans')") || settings.includes('useState("plans")') || settings.includes("useState('plans')")) {
  pass('settings has active default plans');
} else {
  fail('settings does not clearly default to plans or keep Plany before Konto');
}

console.log('Script in package.json');
const packageJson = read('package.json', true);
assertIncludes('package.json', packageJson, '"check:closeflow-admin-feedback-2026-05-11-p2"');
assertIncludes('package.json', packageJson, 'scripts/check-closeflow-admin-feedback-2026-05-11-p2.cjs');

if (failures > 0) {
  console.error(`\nCloseFlow admin feedback P2 guard failed: ${failures} issue(s).`);
  process.exit(1);
}

console.log('\nCloseFlow admin feedback P2 guard passed.');
