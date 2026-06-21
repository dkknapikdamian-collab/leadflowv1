const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');

function read(path) {
  return fs.existsSync(path) ? fs.readFileSync(path, 'utf8') : '';
}

const manager = read('src/components/detail/MissingItemsManagerDialog.tsx');
const client = read('src/pages/ClientDetail.tsx');
const lead = read('src/pages/LeadDetail.tsx');
const r16oGuard = read('scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs');
const r16oTest = read('tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs');
const runReport = read('_project/runs/STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md');

test('R16Z_R5 final manager layout is the current contract', () => {
  assert.match(manager, /STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE/);
  assert.match(manager, /!w-\[760px\]/);
  assert.match(manager, /sm:!max-w-\[760px\]/);
  assert.match(manager, /flex w-full min-w-0 items-center gap-2 overflow-visible/);
  assert.doesNotMatch(manager, /xl:w-\[1100px\]/);
});

test('old R16O 1100px requirement is not active anymore', () => {
  assert.match(r16oGuard, /STAGE232I4_R16O_CONSOLIDATED_WITH_R16Z_R4/);
  assert.match(r16oTest, /R16O is consolidated with final R16Z_R4 760px flex layout/);
  assert.doesNotMatch(r16oGuard, /must\(manager, 'xl:w-\[1100px\]'/);
  assert.doesNotMatch(r16oTest, /assert\.ok\(manager\.includes\('xl:w-\[1100px\]'\)\)/);
});

test('manager row contains title, blocker checkbox, resolve and delete actions', () => {
  assert.match(manager, /managerItemTitle/);
  assert.match(manager, /data-stage232i4-r16z-r4-manager-blocker-text="readable"/);
  assert.match(manager, /Uzupełnij/);
  assert.match(manager, /Usuń/);
  assert.match(manager, /data-stage232i4-r16z-r4-manager-delete-visible="true"/);
});

test('title fallback reads direct, raw, payload and default title sources', () => {
  assert.match(manager, /item\?\.title/);
  assert.match(manager, /raw\?\.title/);
  assert.match(manager, /payload\?\.title/);
  assert.match(manager, /payload\?\.content/);
  assert.match(manager, /payload\?\.note/);
  assert.match(manager, /Brak bez nazwy/);
});

test('ClientDetail separates quick add from all-missing manager', () => {
  assert.match(client, /setClientMissingModalOpen\(true\)/);
  assert.match(client, /setClientMissingListOpenStage232I6\(false\)/);
  assert.match(client, /setClientMissingListOpenStage232I6\(true\)/);
  assert.match(client, /open=\{clientMissingListOpenStage232I6\}/);
});

test('LeadDetail uses shared manager, not a separate lead-only dialog', () => {
  assert.match(lead, /<MissingItemsManagerDialog/);
  assert.match(lead, /open=\{leadMissingManagerOpen\}/);
  assert.match(lead, /scopeLabel="Lead"/);
  assert.match(lead, /items=\{leadMissingManagerItemsStage232I4R14\}/);
});

test('R16Z_R5 run report contains map and smoke checklist', () => {
  assert.match(runReport, /MAPA R16 \/ R16Z PRZED ZMIANA/);
  assert.match(runReport, /Manual smoke klient/);
  assert.match(runReport, /Manual smoke lead/);
  assert.match(runReport, /STAGE232K/);
});
