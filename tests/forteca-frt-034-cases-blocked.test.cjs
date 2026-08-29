const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const contract = read('_project/contracts/forteca-clean/FRT-034_CASES_BLOCKED.md');
const source = read('src/pages/Cases.tsx');
const styles = read('src/styles/forteca-cases-blocked.css');
const referencePath = path.join(repoRoot, 'docs/ui/reference/forteca-calm-light/034_cases_blocked.webp');

test('FRT-034 stays locked to the blocked-cases reference and route', () => {
  assert.match(contract, /CONTRACT_STATUS:\s*LOCKED/);
  assert.match(contract, /STAGE_ID:\s*FRT-034/);
  assert.match(contract, /REFERENCE_FILE:\s*docs\/ui\/reference\/forteca-calm-light\/034_cases_blocked\.webp/);
  assert.match(contract, /TARGET_ROUTE:\s*\/cases/);
  assert.match(contract, /TARGET_STATE:\s*Cases — Zablokowane/);
  assert.match(contract, /PREDECESSOR:\s*FRT-033/);
  assert.match(contract, /SUCCESSOR:\s*FRT-035/);
  assert.equal(fs.existsSync(referencePath), true, 'FRT-034 reference image must be present');
});

test('blocked view uses the canonical blocked predicate and real blocker source', () => {
  assert.match(source, /import ['"]\.\.\/styles\/forteca-cases-blocked\.css['"]/);
  assert.match(source, /function isBlockedCase\(record/);
  assert.match(source, /normalizeCaseStatus\(record\.status\)/);
  assert.match(source, /status === ['"]blocked['"]/);
  assert.match(source, /status !== ['"]waiting_on_client['"]/);
  assert.match(source, /buildMissingOwnerControlItems\(\{ tasks: caseTasks \}\)/);
  assert.match(source, /caseBlockerItemsByCaseId/);
  assert.match(source, /caseView === ['"]blocked['"] && isBlockedCase\(record/);
  assert.match(source, /caseView === ['"]blocked['"]\s*\?\s*isBlockedCase\(record/);
  assert.match(source, /data-cases-state=\{isWaitingView \? ['"]waiting['"] : caseView\}/);
});

test('blocked view exposes real filters, columns, navigation and safe actions', () => {
  for (const label of [
    'ZABLOKOWANE',
    'Szukaj sprawy, klienta lub ID...',
    'Bloker',
    'Priorytet',
    'Zablokowane od',
    'Ostatni ruch',
    'Sugerowana akcja',
    'Opiekun',
    'Najdłużej zablokowane',
    'Eksportuj',
    'Wyślij przypomnienie',
    'Otwórz sprawę',
  ]) {
    assert.match(source, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${label}`);
  }

  assert.match(source, /function handleExportBlockedCases\(\)/);
  assert.match(source, /anchor\.download = ['"]closeflow-sprawy-zablokowane\.csv['"];/);
  assert.match(source, /data-cf-cases-blocked-export=\{isBlockedView \? ['"]true['"] : undefined\}/);
  assert.match(source, /caseDetailPath\(record\.id\)/);
  assert.match(source, /mailto:\$\{clientEmail\}/);
  assert.match(source, /tel:\$\{clientPhone\.replace/);
  assert.match(source, /id: id \|\| undefined/);
  assert.doesNotMatch(source, /href=["']#["']/);
});

test('blocked view CSS is route-scoped, responsive and token-only', () => {
  assert.match(styles, /data-cases-state="blocked"/);
  assert.match(styles, /cf-cases-blocked-row/);
  assert.match(styles, /cf-cases-blocked-priority-dot/);
  assert.match(styles, /@media \(max-width: 1100px\)/);
  assert.match(styles, /@media \(max-width: 560px\)/);
  assert.match(styles, /--cf-vst-/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i, 'blocked view must not introduce one-off hex colors');
});
