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
  assert.match(source, /if \(status === ['"]waiting_on_client['"]\) return false/);
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
    'Otwórz wiadomość',
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
  assert.match(source, /getBlockedSince\(record, blockerItems\)/);
  assert.match(source, /if \(leftBlockedDate && !rightBlockedDate\) return -1/);
  assert.match(source, /if \(!leftBlockedDate && rightBlockedDate\) return 1/);
  assert.match(source, /Promise\.allSettled\(/);
  assert.match(source, /caseTaskFeedError/);
  assert.match(source, /data-cf-cases-task-feed-state="error"/);
});

test('blocked and waiting views stay disjoint and task-feed failures stay visible', () => {
  assert.match(source, /if \(status === ['"]waiting_on_client['"]\) return false/);
  assert.match(source, /setCaseTaskFeedError\(taskResult\.status === ['"]rejected['"]/);
  assert.match(source, /Odśwież źródło/);
  assert.doesNotMatch(source, /getBlockedSince\(record\)\s*\|\|\s*toUpdatedDate\(record\.createdAt/);
  assert.doesNotMatch(source, /\['blockedSince',\s*['"]blocked_since['"],\s*['"]statusChangedAt['"],\s*['"]status_changed_at['"],\s*['"]updatedAt['"],\s*['"]createdAt['"]\]/);
});

test('canonical blocker projection recognizes safe missing-item variants and truthful blocker dates', () => {
  const blockerSource = read('src/lib/owner-control/owner-control-missing-blockers.ts');
  const baselineSource = read('src/lib/owner-control/owner-control-baseline.ts');
  assert.match(blockerSource, /missing_kind/);
  assert.match(blockerSource, /blocks_progress/);
  assert.match(blockerSource, /priority/);
  assert.match(blockerSource, /payload|metadata|data/);
  assert.match(blockerSource, /blockedSince/);
  assert.match(baselineSource, /blockedSince\?: string \| null/);
  assert.match(blockerSource, /status === ['"]blocking_missing_item['"]/);
  assert.doesNotMatch(blockerSource, /readString\(source\.record, \[['"]createdAt['"],\s*['"]created_at['"],\s*['"]updatedAt['"],\s*['"]updated_at['"]\]\)/);
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
