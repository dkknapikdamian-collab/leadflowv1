const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const mainPath = path.join(repo, 'src', 'main.tsx');
const cssPath = path.join(repo, 'src', 'styles', 'closeflow-right-rail-source-truth.css');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`OK: ${message}`);
  }
}

assert(fs.existsSync(mainPath), 'src/main.tsx istnieje');
assert(fs.existsSync(cssPath), 'src/styles/closeflow-right-rail-source-truth.css istnieje');

const main = fs.existsSync(mainPath) ? fs.readFileSync(mainPath, 'utf8') : '';
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';
const importLine = "import './styles/closeflow-right-rail-source-truth.css';";

assert(main.includes(importLine), 'main.tsx ładuje finalne źródło prawdy bocznych kart');
assert(main.indexOf("import './index.css';") !== -1, 'main.tsx ładuje index.css');
assert(main.indexOf(importLine) > main.indexOf("import './index.css';"), 'right rail source truth ładuje się po index.css, czyli po starych/stage importach');

[
  '--cf-right-rail-card-bg: #ffffff',
  '--cf-right-rail-card-text: #0f172a',
  '.main-leads-html',
  '.main-clients-html',
  '.main-cases-html',
  '.lead-right-card',
  '.lead-top-relations',
  '.clients-right-rail',
  '.cases-shortcuts-rail-card',
  '.cases-risk-rail-card',
  'background: var(--cf-right-rail-card-bg) !important',
  'color: var(--cf-right-rail-card-text) !important',
  '-webkit-text-fill-color: var(--cf-right-rail-card-text) !important'
].forEach((needle) => assert(css.includes(needle), `source truth zawiera: ${needle}`));

const activePageChecks = [
  ['src/pages/Leads.tsx', ['lead-right-card', 'lead-top-relations']],
  ['src/pages/Clients.tsx', ['right-card']],
  ['src/pages/Cases.tsx', ['cases-shortcuts-rail-card', 'cases-risk-rail-card']]
];

for (const [file, needles] of activePageChecks) {
  const full = path.join(repo, file);
  assert(fs.existsSync(full), `${file} istnieje`);
  const text = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
  for (const needle of needles) {
    assert(text.includes(needle), `${file} nadal używa kontrolowanej klasy ${needle}`);
  }
}

const forbiddenSourceTruthDarkPatterns = [
  /background\s*:\s*rgba\(\s*16\s*,\s*20\s*,\s*18\s*,/i,
  /background\s*:\s*#0f172a/i,
  /background\s*:\s*#111827/i,
  /background\s*:\s*#020617/i,
  /background-color\s*:\s*#0f172a/i,
  /background-color\s*:\s*#111827/i,
  /background-color\s*:\s*#020617/i
];

for (const pattern of forbiddenSourceTruthDarkPatterns) {
  assert(!pattern.test(css), `source truth nie ustawia ciemnego tła: ${pattern}`);
}

if (process.exitCode) {
  console.error('\nFAIL: Stage70 right rail source truth guard failed.');
  process.exit(process.exitCode);
}

console.log('\nOK: Stage70 right rail source truth guard passed.');
