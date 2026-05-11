const fs = require('fs');
const path = require('path');

const root = process.cwd();
const bannedLabel = ['Klient', ' w tle'].join('');
const caseDetailPath = path.join(root, 'src/pages/CaseDetail.tsx');
const packagePath = path.join(root, 'package.json');
const docPath = path.join(root, 'docs/bugs/CLOSEFLOW_CASE_DETAIL_REMOVE_CLIENT_BACKGROUND_PANEL_2026-05-10.md');

function fail(message) {
  console.error('CLOSEFLOW_CASE_DETAIL_REMOVE_CLIENT_BACKGROUND_PANEL_CHECK_FAIL: ' + message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('Missing file: ' + file);
  return fs.readFileSync(file, 'utf8');
}

const caseDetail = read(caseDetailPath);
if (caseDetail.includes(bannedLabel)) {
  fail('CaseDetail still contains removed client background panel label.');
}

if (/data-[^=]*(client|klient)[^=]*(background|tle)/i.test(caseDetail)) {
  fail('CaseDetail still contains a client background panel data marker.');
}

const pkg = JSON.parse(read(packagePath));
const script = pkg.scripts && pkg.scripts['check:closeflow-case-detail-no-client-background-panel'];
if (script !== 'node scripts/check-closeflow-case-detail-no-client-background-panel.cjs') {
  fail('package.json is missing check:closeflow-case-detail-no-client-background-panel script.');
}

const doc = read(docPath);
for (const needle of [
  'CLOSEFLOW_CASE_DETAIL_REMOVE_CLIENT_BACKGROUND_PANEL_2026-05-10',
  'Zakres',
  'Nie zmieniono',
  'Weryfikacja',
]) {
  if (!doc.includes(needle)) fail('Documentation missing marker: ' + needle);
}

console.log('CLOSEFLOW_CASE_DETAIL_REMOVE_CLIENT_BACKGROUND_PANEL_CHECK_OK');
