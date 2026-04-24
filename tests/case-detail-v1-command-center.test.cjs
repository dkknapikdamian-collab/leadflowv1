const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

test('CaseDetail imports and uses V1 lifecycle resolver', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.match(source, /resolveCaseLifecycleV1/);
  assert.match(source, /const caseLifecycle = useMemo/);
  assert.match(source, /items,/);
  assert.match(source, /tasks: linkedTasks/);
  assert.match(source, /events: linkedEvents/);
});

test('CaseDetail exposes V1 command center UI and quick actions', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.match(source, /function CaseDetailV1CommandCenter/);
  assert.match(source, /data-testid="case-detail-v1-command-center"/);
  assert.match(source, /Centrum dowodzenia sprawy V1/);
  assert.match(source, /Najbliższy ruch operatora/);
  assert.match(source, /onAddItem={() => setIsAddItemOpen(true)}/);
  assert.match(source, /onCreateTask={() => setIsQuickTaskOpen(true)}/);
  assert.match(source, /onCreateEvent={() => setIsQuickEventOpen(true)}/);
  assert.match(source, /onCopyPortal={generatePortalLink}/);
});

test('CaseDetail command center changes lifecycle status with activity log', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.match(source, /const setCaseLifecycleStatusV1 = async/);
  assert.match(source, /case_lifecycle_started/);
  assert.match(source, /case_lifecycle_completed/);
  assert.match(source, /case_lifecycle_reopened/);
  assert.match(source, /updateCaseInSupabase({/);
  assert.match(source, /insertActivityToSupabase({/);
  assert.match(source, /source: 'case_detail_v1_command_center'/);
});

test('Activity recognizes CaseDetail lifecycle events', () => {
  const source = read('src/pages/Activity.tsx');

  assert.match(source, /case_lifecycle_started/);
  assert.match(source, /case_lifecycle_completed/);
  assert.match(source, /case_lifecycle_reopened/);
  assert.match(source, /rozpoczął realizację sprawy/);
  assert.match(source, /zakończył sprawę/);
  assert.match(source, /wznowił sprawę do pracy/);
});

test('Case Detail V1 command center documentation and stage map exist', () => {
  const doc = read('docs/CASE_DETAIL_V1_COMMAND_CENTER_2026-04-24.md');
  const stageMap = read('docs/CLOSEFLOW_V1_STAGE_MAP_2026-04-24.md');

  assert.ok(doc.includes('Case Detail V1 command center'));
  assert.ok(doc.includes('Nie dodajemy wykresu'));
  assert.ok(stageMap.includes('Case Detail V1 command center'));
  assert.ok(stageMap.includes('Jedna paczka ma obejmować cały etap produktowy'));
});
