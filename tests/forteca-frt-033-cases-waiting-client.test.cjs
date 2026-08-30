const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');

test('FRT-033 pins the waiting-for-client contract and reference chain', () => {
  const contractPath = '_project/contracts/forteca-clean/FRT-033_CASES_WAITING_CLIENT.md';
  const contract = read(contractPath);

  assert.match(contract, /^STAGE_ID: FRT-033$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases$/m);
  assert.match(contract, /^TARGET_STATE: Cases — Czekają na klienta$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/033_cases_waiting_for_client\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-032$/m);
  assert.match(contract, /^SUCCESSOR: FRT-034$/m);
  assert.equal(
    sha256('docs/ui/reference/forteca-calm-light/033_cases_waiting_for_client.webp'),
    'f0d6fa2f7bfe608f70fd5267e299f4a3ebca351c63e3afbe053c34ffc342ddaa'
  );
});

test('FRT-033 gives waiting_on_client its own lifecycle bucket before generic blockers', () => {
  const lifecycle = read('src/lib/case-lifecycle-v1.ts');
  const waitingBranch = lifecycle.indexOf("if (status === 'waiting_on_client')");
  const blockedBranch = lifecycle.indexOf("if (missingRequiredCount > 0 || status === 'blocked')");

  assert.ok(waitingBranch >= 0, 'waiting_on_client branch is required');
  assert.ok(blockedBranch > waitingBranch, 'waiting_on_client must be resolved before generic blocked logic');
  assert.match(lifecycle, /bucket: 'waiting_on_client'/);
  assert.match(lifecycle, /label: 'Czeka na klienta'/);
  assert.match(lifecycle, /Sprawa czeka na odpowiedź albo materiały od klienta/);
  assert.match(lifecycle, /Wyślij przypomnienie do klienta/);
  assert.doesNotMatch(lifecycle.slice(blockedBranch), /status === 'waiting_on_client'/);
});

test('FRT-033 keeps Cases waiting and blocked counters and filters disjoint', () => {
  const cases = read('src/pages/Cases.tsx');
  const statusRepository = read('src/lib/source-of-truth/status-repository.ts');

  assert.match(cases, /waiting: lifecycleRows\.filter\(\(entry\) => entry\.bucket === 'waiting_on_client'\)\.length/);
  assert.match(cases, /blocked: lifecycleRows\.filter\(\(entry\) => entry\.bucket === 'blocked'\)\.length/);
  assert.match(cases, /caseView === 'waiting' && lifecycle\.bucket === 'waiting_on_client'/);
  assert.match(cases, /caseView === 'blocked' && lifecycle\.bucket === 'blocked'/);
  assert.doesNotMatch(cases, /caseView === 'waiting' && \(lifecycle\.bucket === 'blocked'/);
  assert.match(statusRepository, /make\(\['blocked','waiting_on_client','waiting_approval'/);
});

test('FRT-033 does not create a second Cases list owner or screenshot data', () => {
  const cases = read('src/pages/Cases.tsx');
  const lifecycle = read('src/lib/case-lifecycle-v1.ts');
  const runtime = cases + '\n' + lifecycle;

  assert.equal((cases.match(/export default function Cases\(\)/g) || []).length, 1);
  assert.match(cases, /resolveCaseLifecycleV1/);
  assert.doesNotMatch(runtime, /data:image\//i);
  assert.doesNotMatch(runtime, /base64,/i);
  assert.doesNotMatch(runtime, /(?:mock|fixture)(?:Case|Data|Name|Payload)/i);
});
