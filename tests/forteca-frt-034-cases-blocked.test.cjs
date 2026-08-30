const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

const contractPath = '_project/contracts/forteca-clean/FRT-034_CASES_BLOCKED.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/034_cases_blocked.webp';

test('FRT-034 pins the blocked-cases contract and reference chain', () => {
  const contract = read(contractPath);

  assert.match(contract, /^STAGE_ID: FRT-034$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases$/m);
  assert.match(contract, /^TARGET_STATE: Cases — Zablokowane$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/034_cases_blocked\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-033$/m);
  assert.match(contract, /^SUCCESSOR: FRT-035$/m);
  assert.ok(exists(referencePath), 'FRT-034 reference is missing: ' + referencePath);
  assert.equal(sha256(referencePath), '641296f025bd471258d91e1941021d8477a05b21e247a0d76cabb5c94484b538');
});

test('FRT-034 makes the blocked view use canonical lifecycle truth', () => {
  const cases = read('src/pages/Cases.tsx');
  const lifecycle = read('src/lib/case-lifecycle-v1.ts');

  assert.match(lifecycle, /bucket: 'blocked'/);
  assert.match(lifecycle, /label: 'Zablokowana'/);
  assert.match(cases, /blocked: lifecycleRows\.filter\(\(entry\) => entry\.bucket === 'blocked'\)\.length/);
  assert.match(cases, /caseView === 'blocked' && lifecycle\.bucket === 'blocked'/);
  assert.match(cases, /label="Zablokowane"/);
  assert.match(cases, /data-cf-operator-rail-item="true"/);
  assert.match(cases, /Blokery i ryzyko/);
});

test('FRT-034 keeps blocker source and resolution action real and case-scoped', () => {
  const detail = read('src/pages/CaseDetail.tsx');

  assert.match(detail, /fetchTasksFromSupabase\(/);
  assert.match(detail, /caseId/);
  assert.match(detail, /label: 'Braki i blokady'/);
  assert.match(detail, /items: workItems\.filter\(\(entry\) => entry\.kind === 'missing'\)/);
  assert.match(detail, /data-stage232i1-case-missing-action="true"/);
  assert.match(detail, /data-stage232i1-resolve-case-missing="true"/);
  assert.match(detail, /onTaskDone\(entry\.source as TaskRecord\)/);
  assert.match(detail, />Uzupełnione<\/button>/);
});

test('FRT-034 persists missing blockers through the deployed tasks route with a DB-safe status', () => {
  const vercel = read('vercel.json');
  const system = read('api/system.ts');
  const route = read('src/server/task-route-stage124f.ts');
  const sourceTruth = read('tests/stage232i4-r8-work-items-api-missing-source-truth.test.cjs');

  assert.match(vercel, /"destination"\s*:\s*"\/api\/system\?apiRoute=tasks"/);
  assert.match(system, /taskRouteStage124FHandler/);
  assert.match(route, /STAGE232I4_R16_TASK_ROUTE_STATUS_DOMAIN_SAFE/);
  assert.match(route, /normalizeMissingItemDbStatusStage232I4R16/);
  assert.match(route, /return normalizeTaskStatus\('todo'\)/);
  assert.match(route, /show_in_calendar:\s*isMissingItemInsertStage232I4R16 \? false : true/);
  assert.match(sourceTruth, /normalizeMissingItemDbStatusStage232I4R9/);
});

test('FRT-034 does not introduce screenshot-only blocked data or a second Cases list owner', () => {
  const cases = read('src/pages/Cases.tsx');
  const detail = read('src/pages/CaseDetail.tsx');
  const runtime = cases + '\n' + detail;

  assert.equal((cases.match(/export default function Cases\(\)/g) || []).length, 1);
  assert.doesNotMatch(runtime, /data:image\//i);
  assert.doesNotMatch(runtime, /base64,/i);
  assert.doesNotMatch(runtime, /(?:mock|fixture)(?:Case|Data|Name|Payload)/i);
});
