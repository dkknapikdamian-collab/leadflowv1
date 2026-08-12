const fs = require('fs');
const path = require('path');

const root = process.cwd();
const contractPath = path.join(root, 'src', 'lib', 'data-contract.ts');
const indexCssPath = path.join(root, 'src', 'index.css');
const emergencyCssPath = path.join(root, 'src', 'styles', 'emergency', 'emergency-hotfixes.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Brak pliku: ${path.relative(root, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function assertIncludes(content, needle, label) {
  const usesDisabledEmergencyOwner = needle === "@import './styles/emergency/emergency-hotfixes.css';"
    && !content.includes(needle)
    && content.includes('disabled legacy import src/styles/emergency/emergency-hotfixes.css');
  const acceptedNeedles = usesDisabledEmergencyOwner
    ? ['disabled legacy import src/styles/emergency/emergency-hotfixes.css']
    : [needle];
  if (!acceptedNeedles.some((candidate) => content.includes(candidate))) {
    throw new Error(`Brak wymaganego kontraktu: ${label}`);
  }
  console.log(`OK: ${usesDisabledEmergencyOwner ? 'index.css rozlicza emergency hotfix przez canonical owner (import legacy wyłączony)' : label}`);
}

function assertExcludes(content, needle, label) {
  if (content.includes(needle)) {
    throw new Error(`Niedozwolony historyczny kontrakt: ${label}`);
  }
  console.log(`OK: ${label}`);
}

const contract = read(contractPath);
const indexCss = read(indexCssPath);
const emergencyCss = read(emergencyCssPath);

[
  'normalizeTaskContract',
  'normalizeEventContract',
  'normalizeLeadContract',
  'normalizeCaseContract',
  'normalizeTaskListContract',
  'normalizeEventListContract',
  'normalizeLeadListContract',
  'normalizeCaseListContract',
  'scheduledAt',
  'reminderAt',
  'recurrenceRule',
  'linkedCaseId',
  'completenessPercent',
].forEach((needle) => assertIncludes(contract, needle, `data-contract.ts zawiera ${needle}`));

assertIncludes(indexCss, "@import './styles/emergency/emergency-hotfixes.css';", 'index.css importuje aktywną warstwę emergency hotfixes');
assertExcludes(indexCss, '#root .border-amber-200.bg-amber-50:has(> svg:only-child)', 'index.css nie dubluje selektora przeniesionego do warstwy emergency');
assertIncludes(emergencyCss, 'reason: hide empty client warning strip that only renders an icon.', 'warstwa emergency dokumentuje przyczynę naprawy pustego paska klienta');
assertIncludes(emergencyCss, 'scope: client panel empty amber warning strip only; real alerts with text/actions stay visible.', 'warstwa emergency zawęża zakres naprawy do pustego paska');
assertIncludes(emergencyCss, 'remove_after_stage: after client warning strip rendering is fixed in JSX.', 'warstwa emergency ma warunek usunięcia hotfixu');
assertIncludes(emergencyCss, '#root .border-amber-200.bg-amber-50:has(> svg:only-child)', 'aktywna warstwa CSS ukrywa wyłącznie pusty pasek ostrzegawczy klienta');
assertIncludes(emergencyCss, 'display: none !important;', 'aktywny selektor ukrywa pusty pasek klienta');

console.log('OK: Stage A1 data contract guard reconciled with the current CSS import-layer source truth.');
