const fs = require('fs');
const path = require('path');

const root = process.cwd();
const queuePath = path.join(root, '_project', '04_ETAPY_ROZWOJU_APLIKACJI.md');
const currentPath = path.join(root, '_project', '03_CURRENT_STAGE.md');
const guardLedgerPath = path.join(root, '_project', '06_GUARDS_AND_TESTS.md');
const changelogPath = path.join(root, '_project', '08_CHANGELOG_AI.md');
const testHistoryPath = path.join(root, '_project', '13_TEST_HISTORY.md');
const runPath = path.join(root, '_project', 'runs', '2026-06-16_CF_STAGE_QUEUE_RECONCILE_005.md');
const obsidianPayloadPath = path.join(root, '_project', 'obsidian_updates', '10_PROJEKTY', 'CloseFlow_Lead_App', '90_RAPORTY', '2026-06-16 - CF STAGE QUEUE RECONCILE 005.md');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function pass(msg) {
  console.log(`PASS ${msg}`);
}

function fail(msg) {
  throw new Error(msg);
}

const queue = read(queuePath);
const current = read(currentPath);
const guards = read(guardLedgerPath);
const changelog = read(changelogPath);
const history = read(testHistoryPath);
read(runPath);
read(obsidianPayloadPath);

const stage232AMatch = queue.match(/### 1\. STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH([\s\S]*?)(?=\n### 2\. STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH)/);
if (!stage232AMatch) fail('Could not isolate STAGE232A canonical queue section.');
const stage232A = stage232AMatch[1];
const statusLineA = (stage232A.match(/Status:\s*([^\r\n]+)/) || [])[1] || '';

if (/NAJBLI|NAJBLIŻSZY|DO WDROŻENIA|DO_WDROZENIA/.test(statusLineA)) {
  fail(`STAGE232A still looks like a next implementation stage: ${statusLineA}`);
}
if (!/TECH_PUSHED/.test(statusLineA) || !/(DO_SPRAWDZENIA|TEST_RECZNY|TEST_RĘCZNY)/.test(statusLineA)) {
  fail(`STAGE232A status does not preserve technical pushed/manual QA state: ${statusLineA}`);
}
if (!stage232A.includes('CF-STAGE-QUEUE-RECONCILE-005')) {
  fail('STAGE232A section does not record CF-STAGE-QUEUE-RECONCILE-005 reconciliation marker.');
}
pass('STAGE232A canonical queue no longer says it is the next stage to implement');

const stage232BMatch = queue.match(/### 2\. STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH([\s\S]*?)(?=\n### 3\. STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH)/);
if (!stage232BMatch) fail('Could not isolate STAGE232B canonical queue section.');
const statusLineB = (stage232BMatch[1].match(/Status:\s*([^\r\n]+)/) || [])[1] || '';
if (!/TECH_PUSHED/.test(statusLineB) || !/(TEST_RECZNY|TEST_RĘCZNY|DO_SPRAWDZENIA)/.test(statusLineB)) {
  fail(`STAGE232B must remain technical/manual QA, not silently promoted: ${statusLineB}`);
}
pass('STAGE232B remains manual QA / technical pushed, not silently closed');

const stage232CMatch = queue.match(/### 3\. STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH([\s\S]*?)(?=\n### 4\. STAGE232D_CASES_OPERATIONAL_TILES_SOURCE_OF_TRUTH)/);
if (!stage232CMatch) fail('Could not isolate STAGE232C canonical queue section.');
const statusLineC = (stage232CMatch[1].match(/Status:\s*([^\r\n]+)/) || [])[1] || '';
if (!/MANUAL_QA_STAGE232A_R5/.test(statusLineC) || !/STAGE232B/.test(statusLineC)) {
  fail(`STAGE232C status must be gated by manual QA for STAGE232A_R5 and STAGE232B: ${statusLineC}`);
}
pass('STAGE232C is gated until manual QA confirms STAGE232A_R5 and STAGE232B');

for (const [label, text] of [
  ['current stage', current],
  ['guard ledger', guards],
  ['changelog', changelog],
  ['test history', history],
]) {
  if (!text.includes('CF-STAGE-QUEUE-RECONCILE-005')) {
    fail(`${label} does not record CF-STAGE-QUEUE-RECONCILE-005`);
  }
}
pass('project ledgers record CF-STAGE-QUEUE-RECONCILE-005');

console.log(JSON.stringify({ stage: 'CF-STAGE-QUEUE-RECONCILE-005', status: 'PASS' }, null, 2));
