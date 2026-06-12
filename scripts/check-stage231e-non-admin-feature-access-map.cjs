#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const matrixPath = path.join(root, '_project', '07_STAGE231E_NON_ADMIN_FEATURE_ACCESS_MATRIX.md');
const reportPath = path.join(root, '_project', 'runs', '2026-06-12_STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT.md');

const requiredFeatures = [
  'Google Calendar status',
  'Google Calendar connect',
  'Google Calendar disconnect',
  'Google Calendar sync-outbound',
  'Calendar page',
  'Today page',
  'Tasks',
  'Leads',
  'Clients',
  'Cases',
  'Notifications',
  'Settings account/security',
  'Settings notifications',
  'Daily digest UI',
  'Daily digest diagnostics/test send',
  'Weekly report',
  'AI/drafts',
  'Browser notifications',
  'Conflict warnings',
];

const allowedVerdicts = new Set([
  'OK',
  'DO_NAPRAWY_W_231F',
  'DO_NAPRAWY_W_231G',
  'DO_NAPRAWY_OSOBNY_ETAP',
]);

const allowedVerdictPattern = /\|\s*(OK|DO_NAPRAWY_W_231F|DO_NAPRAWY_W_231G|DO_NAPRAWY_OSOBNY_ETAP)\s*\|/g;

function fail(message) {
  console.error('STAGE231E_NON_ADMIN_FEATURE_ACCESS_MAP_FAIL: ' + message);
  process.exit(1);
}

function readRequiredFile(filePath) {
  if (!fs.existsSync(filePath)) {
    fail('Missing required file: ' + path.relative(root, filePath));
  }
  return fs.readFileSync(filePath, 'utf8');
}

const matrix = readRequiredFile(matrixPath);
const report = readRequiredFile(reportPath);

if (!matrix.includes('STAGE231E_NON_ADMIN_ACCOUNT_FEATURE_ACCESS_AUDIT')) {
  fail('Matrix is missing stage marker.');
}

if (!matrix.includes('## Matrix dostepnosci')) {
  fail('Matrix is missing Matrix dostepnosci section.');
}

for (const feature of requiredFeatures) {
  if (!matrix.includes('| ' + feature + ' |')) {
    fail('Matrix is missing required feature row: ' + feature);
  }
}

const forbiddenTokens = ['TODO', '???', 'TBD', 'UZUPELNIC'];
for (const token of forbiddenTokens) {
  if (matrix.includes(token)) {
    fail('Matrix contains unfinished marker: ' + token);
  }
}

const rows = matrix
  .split(/\r?\n/)
  .filter((line) => line.startsWith('| '))
  .filter((line) => !line.includes('---'))
  .filter((line) => !line.startsWith('| Funkcja '));

const seen = new Set();
for (const line of rows) {
  const feature = requiredFeatures.find((requiredFeature) => line.startsWith('| ' + requiredFeature + ' |'));
  if (!feature) continue;

  seen.add(feature);

  const verdictMatches = [...line.matchAll(allowedVerdictPattern)].map((match) => match[1]);
  const uniqueVerdicts = [...new Set(verdictMatches)].filter((verdict) => allowedVerdicts.has(verdict));

  if (uniqueVerdicts.length !== 1) {
    fail(
      'Invalid or ambiguous verdict for ' +
        feature +
        ': ' +
        (uniqueVerdicts.length ? uniqueVerdicts.join(', ') : 'EMPTY')
    );
  }
}

for (const feature of requiredFeatures) {
  if (!seen.has(feature)) {
    fail('Required feature was not parsed from the matrix table: ' + feature);
  }
}

const requiredReportSections = [
  '## FAKTY Z KODU / PLIKOW',
  '## DECYZJE DAMIANA',
  '## HIPOTEZY / PROPOZYCJE AI',
  '## DO POTWIERDZENIA',
  '## AUDYT PRZED ETAPEM',
  '## MAPA DOSTEPU',
  '## ZNALEZIONE PROBLEMY',
  '## TESTY AUTOMATYCZNE',
  '## TESTY RECZNE',
  '## GUARDY',
  '## AUDYT PO ETAPIE',
  '## RYZYKA',
  '## WPLYW NA OBSIDIANA',
  '## NASTEPNY KROK',
  '## GIT / ZIP STATUS',
];

for (const section of requiredReportSections) {
  if (!report.includes(section)) {
    fail('Run report is missing section: ' + section);
  }
}

if (!report.includes('AUDYT PRZED ETAPEM') || !report.includes('AUDYT PO ETAPIE')) {
  fail('Run report must include both pre-stage and post-stage audit sections.');
}

console.log('STAGE231E_NON_ADMIN_FEATURE_ACCESS_MAP_PASS');
console.log('Checked features: ' + requiredFeatures.length);