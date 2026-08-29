const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const contract = read('_project/contracts/forteca-clean/FRT-033_CASES_WAITING_CLIENT.md');
const source = read('src/pages/Cases.tsx');
const styles = read('src/styles/forteca-cases-waiting.css');
const referencePath = path.join(repoRoot, 'docs/ui/reference/forteca-calm-light/033_cases_waiting_for_client.webp');

test('FRT-033 stays locked to the waiting-for-client reference and route', () => {
  assert.match(contract, /CONTRACT_STATUS:\s*LOCKED/);
  assert.match(contract, /STAGE_ID:\s*FRT-033/);
  assert.match(contract, /REFERENCE_FILE:\s*docs\/ui\/reference\/forteca-calm-light\/033_cases_waiting_for_client\.webp/);
  assert.match(contract, /TARGET_ROUTE:\s*\/cases/);
  assert.match(contract, /TARGET_STATE:\s*Cases — Czekają na klienta/);
  assert.match(contract, /ACCEPTANCE_CRITERIA:.*real status/i);
  assert.equal(fs.existsSync(referencePath), true, 'FRT-033 reference image must be present');
});

test('waiting view is derived from canonical status and keeps the all-cases route separate', () => {
  assert.match(source, /import ['"]\.\.\/styles\/forteca-cases-waiting\.css['"]/);
  assert.match(source, /data-cases-state=\{isWaitingView \? ['"]waiting['"] : caseView\}/);
  assert.match(source, /function isWaitingForClientCase\(record/);
  assert.match(source, /normalizeCaseStatus\(record\.status\) === ['"]waiting_on_client['"]/);
  assert.match(source, /caseView === ['"]waiting['"] && isWaitingForClientCase\(record\)/);
  assert.match(source, /waiting: cases\.filter\(\(record\) => isWaitingForClientCase\(record\)\)/);
});

test('waiting view exposes the reference information architecture with real data actions', () => {
  for (const label of [
    'Czekają na klienta',
    'Aktywne',
    'W trakcie',
    'Zablokowane',
    'Gotowe do startu',
    'Czego brakuje',
    'Czekamy od',
    'Ostatnie przypomnienie',
    'Najbliższy ruch',
    'Opiekun',
    'Akcja',
    'Zapisz widok',
  ]) {
    assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${label}`);
  }

  assert.match(source, /placeholder=\{isWaitingView \? ['"]Szukaj sprawy, klienta, opiekuna\.\.\.['"]/);
  assert.match(source, /value=\{isWaitingView \? ['"]waiting_on_client['"] : statusFilter\}/);
  assert.match(source, /data-cf-cases-export=\{isWaitingView \? ['"]true['"] : undefined\}/);
  assert.match(source, /function handleExportWaitingCases\(\)/);
  assert.match(source, /anchor\.download = ['"]closeflow-sprawy-czekaja-na-klienta\.csv['"]/);
  assert.match(source, /mailto:\$\{clientEmail\}/);
  assert.match(source, /tel:\$\{clientPhone\.replace/);
  assert.match(source, /function handleSaveWaitingView\(\)/);
  assert.match(source, /localStorage\.setItem\(['"]closeflow\.cases\.waiting-view\.v1['"]/);
});

test('waiting view responsive layer consumes shared visual tokens', () => {
  assert.match(styles, /data-cases-state="waiting"/);
  assert.match(styles, /@media \(max-width: 1100px\)/);
  assert.match(styles, /@media \(max-width: 560px\)/);
  assert.match(styles, /--cf-vst-/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i, 'waiting view must not introduce one-off hex colors');
});
