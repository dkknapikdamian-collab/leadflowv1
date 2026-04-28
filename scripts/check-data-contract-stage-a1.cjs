const fs = require('fs');
const path = require('path');

const root = process.cwd();
const contractPath = path.join(root, 'src', 'lib', 'data-contract.ts');
const cssPath = path.join(root, 'src', 'index.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Brak pliku: ${path.relative(root, filePath)}`);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    throw new Error(`Brak wymaganego kontraktu: ${label}`);
  }
  console.log(`OK: ${label}`);
}

const contract = read(contractPath);
const css = read(cssPath);

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

assertIncludes(css, 'CLIENT_PANEL_EMPTY_WARNING_STRIP_FIX_STAGE_A1', 'CSS ma marker usunięcia pustego paska klienta');
assertIncludes(css, '#root .border-amber-200.bg-amber-50:has(> svg:only-child)', 'CSS ukrywa pusty pasek ostrzegawczy klienta przez zawężony selektor');

console.log('OK: Stage A1 data contract guard passed.');
