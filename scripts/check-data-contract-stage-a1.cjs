const fs = require('fs');
const path = require('path');

const root = process.cwd();
const contractPath = path.join(root, 'src', 'lib', 'data-contract.ts');
const indexCssPath = path.join(root, 'src', 'index.css');
const visualSourceTruthPath = path.join(root, 'src', 'styles', 'closeflow-visual-source-truth.css');
const recordsRailsOwnerCssPath = path.join(root, 'src', 'styles', 'owners', 'closeflow-records-and-rails.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Brak pliku: ${path.relative(root, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    throw new Error(`Brak wymaganego kontraktu: ${label}`);
  }
  console.log(`OK: ${label}`);
}

function assertExcludes(content, needle, label) {
  if (content.includes(needle)) {
    throw new Error(`Niedozwolony historyczny kontrakt: ${label}`);
  }
  console.log(`OK: ${label}`);
}

const contract = read(contractPath);
const indexCss = read(indexCssPath);
const visualSourceTruth = read(visualSourceTruthPath);
const recordsRailsOwnerCss = read(recordsRailsOwnerCssPath);

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

assertIncludes(visualSourceTruth, './owners/closeflow-rails-and-detail.css', 'canonical visual source imports the rails semantic owner');
assertExcludes(indexCss, "@import './styles/emergency/emergency-hotfixes.css';", 'index.css excludes the historical emergency import');
assertExcludes(indexCss, '#root .border-amber-200.bg-amber-50:has(> svg:only-child)', 'index.css nie dubluje selektora przeniesionego do warstwy emergency');
assertIncludes(recordsRailsOwnerCss, 'reason: hide empty client warning strip that only renders an icon.', 'records/rails owner documents the empty client warning rationale');
assertIncludes(recordsRailsOwnerCss, 'scope: client panel empty amber warning strip only; real alerts with text/actions stay visible.', 'records/rails owner scopes the warning-strip fix');
assertIncludes(recordsRailsOwnerCss, 'remove_after_stage: after client warning strip rendering is fixed in JSX.', 'records/rails owner retains the removal condition');
assertIncludes(recordsRailsOwnerCss, '#root .border-amber-200.bg-amber-50:has(> svg:only-child)', 'active records/rails owner hides only the empty client warning strip');
assertIncludes(recordsRailsOwnerCss, 'display: none !important;', 'active records/rails selector hides the empty client warning strip');

console.log('OK: Stage A1 data contract guard reconciled with the current CSS import-layer source truth.');
