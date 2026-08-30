const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const contract = read('_project/contracts/forteca-clean/FRT-035_CASES_READY.md');
const source = read('src/pages/Cases.tsx');
const styles = read('src/styles/forteca-cases-ready.css');
const referencePath = path.join(repoRoot, 'docs/ui/reference/forteca-calm-light/035_cases_ready_to_start.webp');

test('FRT-035 stays locked to the ready-to-start reference and route', () => {
  assert.match(contract, /CONTRACT_STATUS:\s*LOCKED/);
  assert.match(contract, /STAGE_ID:\s*FRT-035/);
  assert.match(contract, /REFERENCE_FILE:\s*docs\/ui\/reference\/forteca-calm-light\/035_cases_ready_to_start\.webp/);
  assert.match(contract, /TARGET_ROUTE:\s*\/cases/);
  assert.match(contract, /TARGET_STATE:\s*Cases — Gotowe do startu/);
  assert.match(contract, /PREDECESSOR:\s*FRT-034/);
  assert.match(contract, /SUCCESSOR:\s*FRT-036/);
  assert.equal(fs.existsSync(referencePath), true, 'FRT-035 reference image must be present');
});

test('ready view derives from the canonical lifecycle predicate and real workspace data', () => {
  assert.match(source, /import ['"]\.\.\/styles\/forteca-cases-ready\.css['"]/);
  assert.match(source, /function isReadyToStartCase\(/);
  assert.match(source, /resolveCaseLifecycleV1/);
  assert.match(source, /APP_ICONS\.rocket\.icon/);
  assert.doesNotMatch(source, /<Rocket\b/);
  assert.match(source, /if \(isWaitingForClientCase\(record\)\) return false/);
  assert.match(source, /if \(isBlockedCase\(record, lifecycle, blockerItems\.length > 0\)\) return false/);
  assert.match(source, /return normalizeCaseStatus\(record\.status\) === ['"]ready_to_start['"] \|\| lifecycle\.bucket === ['"]ready_to_start['"]/);
  assert.match(source, /ready:\s*cases\.filter\(\(record\) => isReadyToStartCase\(/);
  assert.match(source, /caseView === ['"]ready['"] && isReadyToStartCase\(record, lifecycle, blockerItems\)/);
  assert.match(source, /data-cases-state=\{isWaitingView \? ['"]waiting['"] : caseView\}/);
  assert.doesNotMatch(source, /mockCases|fixtureCases|fixtureData|sampleCases/i);
});

test('ready view exposes real selector seams, navigation and dynamic values', () => {
  for (const selector of [
    'cf-cases-ready-toolbar',
    'data-cf-cases-ready-controls',
    'cf-cases-ready-tabs',
    'data-cf-cases-ready-sort',
    'cf-cases-ready-row-head',
    'data-cf-cases-ready-row',
    'cf-cases-ready-case-link',
    'cf-cases-ready-status-cell',
    'cf-cases-ready-completeness-cell',
    'cf-cases-ready-date-cell',
    'cf-cases-ready-next-cell',
    'cf-cases-ready-actions-cell',
    'data-cf-cases-ready-action="open"',
    'data-cf-cases-ready-action="start"',
  ]) {
    assert.match(source, new RegExp(selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing ${selector}`);
  }

  assert.match(source, /stats\.ready/);
  assert.match(source, /data-cf-cases-ready-export=\{isReadyView \? ['"]true['"] : undefined\}/);
  assert.match(source, /getReadySince\(record\)/);
  assert.match(source, /getReadyNextStage\(record\)/);
  assert.match(source, /caseDetailPath\(record\.id\)/);
  assert.match(source, /async function handleStartReadyCase\(record: CaseRecord\)/);
  assert.match(source, /if \(!isReadyToStartCase\(record, lifecycle, blockerItems\)\)/);
  assert.match(source, /updateCaseInSupabase\(\{ id: caseId, status: ['"]in_progress['"], lastActivityAt: startedAt \}\)/);
  assert.match(source, /insertActivityToSupabase\(/);
  assert.match(source, /eventType: ['"]case_lifecycle_started['"]/);
  assert.doesNotMatch(source, /href=["']#["']/);
  assert.doesNotMatch(source, /onClick=\{\(\) => \{?\s*\}\}/);
});

test('ready CSS is route-scoped, responsive and token-based', () => {
  assert.match(styles, /#root \.main-cases-html\[data-cases-state="ready"\]/);
  assert.match(styles, /cf-cases-ready-toolbar/);
  assert.match(styles, /cf-cases-ready-tabs/);
  assert.match(styles, /cf-cases-ready-row-head/);
  assert.match(styles, /cf-cases-ready-row/);
  assert.match(styles, /data-cf-cases-ready-action="start"/);
  assert.match(styles, /data-cf-cases-ready-action="open"/);
  assert.match(styles, /--cf-vst-color-task/);
  assert.match(styles, /--cf-vst-color-primary/);
  assert.match(styles, /--cf-vst-surface/);
  assert.match(styles, /@media \(max-width: 1100px\)/);
  assert.match(styles, /@media \(max-width: 560px\)/);
  assert.match(styles, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(styles, /flex-direction:\s*column/);
  assert.match(styles, /overflow-wrap:\s*anywhere/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i, 'ready view must not introduce one-off hex colors');
  assert.doesNotMatch(styles, /content\s*:\s*["'][^"']+["']/i, 'ready CSS must not synthesize copy, rows or counts');
});
