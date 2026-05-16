const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function includesAny(source, values) {
  return values.some((value) => source.includes(value));
}

test('CaseDetail imports V1 lifecycle resolver', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('resolveCaseLifecycleV1'));
  assert.ok(source.includes('../lib/case-lifecycle-v1'));
});

test('CaseDetail exposes V1 command center UI and quick actions', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('function CaseDetailV1CommandCenter'));
  assert.ok(source.includes('data-testid="case-detail-v1-command-center"'));
  assert.ok(source.includes('Centrum dowodzenia sprawy V1'));

  assert.ok(
    includesAny(source, [
      'Dodaj element',
      'Dodaj dokument',
      'Dodaj brak',
      'checklist',
      'items',
      'caseItems',
    ]),
    'Command center powinien mie\u0107 akcj\u0119 albo kontekst dodawania element\u00F3w/checklisty.',
  );

  assert.ok(
    includesAny(source, [
      'setIsQuickTaskOpen(true)',
      'Dodaj zadanie',
      'quickTask',
      'task_created',
    ]),
    'Command center powinien mie\u0107 akcj\u0119 zadania.',
  );

  assert.ok(
    includesAny(source, [
      'setIsQuickEventOpen(true)',
      'Dodaj wydarzenie',
      'quickEvent',
      'event_created',
    ]),
    'Command center powinien mie\u0107 akcj\u0119 wydarzenia.',
  );

  assert.ok(
    includesAny(source, [
      'generatePortalLink',
      'Portal klienta',
      'portal_token_created',
      'client portal',
    ]),
    'Command center powinien mie\u0107 akcj\u0119 portalu klienta.',
  );
});

test('CaseDetail command center changes lifecycle status with activity log', () => {
  const source = read('src/pages/CaseDetail.tsx');

  assert.ok(source.includes('const setCaseLifecycleStatusV1 = async'));
  assert.ok(source.includes('case_lifecycle_started'));
  assert.ok(source.includes('case_lifecycle_completed'));
  assert.ok(source.includes('case_lifecycle_reopened'));
  assert.ok(source.includes('updateCaseInSupabase({'));
  assert.ok(source.includes('insertActivityToSupabase({'));
  assert.ok(source.includes("source: 'case_detail_v1_command_center'"));
});

test('Activity recognizes CaseDetail lifecycle events', () => {
  const source = read('src/pages/Activity.tsx');

  assert.ok(source.includes('case_lifecycle_started'));
  assert.ok(source.includes('case_lifecycle_completed'));
  assert.ok(source.includes('case_lifecycle_reopened'));
});

test('Case Detail V1 command center documentation and stage map exist', () => {
  const doc = read('docs/CASE_DETAIL_V1_COMMAND_CENTER_2026-04-24.md');
  const stageMap = read('docs/CLOSEFLOW_V1_STAGE_MAP_2026-04-24.md');

  assert.ok(doc.includes('Case Detail V1 command center'));
  assert.ok(doc.includes('Nie dodajemy wykresu'));
  assert.ok(doc.includes('case_lifecycle_started'));
  assert.ok(stageMap.includes('Case Detail V1 command center'));
});
