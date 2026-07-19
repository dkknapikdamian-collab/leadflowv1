const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const vault = process.env.OBSIDIAN_VAULT_PATH
  ? path.resolve(process.env.OBSIDIAN_VAULT_PATH)
  : path.resolve(root, '..', '00_OBSIDIAN_VAULT');
const baseHead = '1212a3b64f5a306621c510b800936e9a12580800';
const stage = 'LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT';
const nextStage = 'LF-PROD-SOT-G15-R2_EVENT_DELETE_OWNER_EVIDENCE_FAIL_CLOSED_RUNTIME_ADOPTION';
const projectRoot = '10_PROJEKTY/CloseFlow_Lead_App';

const rel = {
  contract: `${projectRoot}/STAGES/${stage}.md`,
  report: `_project/runs/${stage}.md`,
  obsReport: `${projectRoot}/90_RAPORTY/${stage}_REPORT.md`,
  current: `${projectRoot}/02_AKTUALNY_STAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  decisions: `${projectRoot}/03_AKTYWNE_DECYZJE - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  queue: `${projectRoot}/04_KIERUNEK_DO_WDROZENIA.md`,
  history: `${projectRoot}/08_HISTORIA_ZMIAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  testsLedger: `${projectRoot}/09_TESTY_DO_WYKONANIA_I_WYNIKI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  delivery: `${projectRoot}/10_ZIPY_WDROZENIA_PUSH - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  risks: `${projectRoot}/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`,
  index: `${projectRoot}/STAGES/README.md`,
  task: 'src/server/task-route-stage124f.ts',
  event: 'src/server/event-route-stage124f.ts',
  requestScope: 'src/server/_request-scope.ts',
  g14Guard: 'scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  g15Guard: 'scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs',
  r1Guard: 'scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs',
  package: 'package.json',
};

function read(base, file) {
  return fs.readFileSync(path.join(base, file), 'utf8').replace(/\r\n/g, '\n');
}
function sh(args) {
  return execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
}
function section(text, start, end) {
  const a = text.indexOf(start);
  const b = text.indexOf(end, a + start.length);
  assert.ok(a >= 0 && b > a, `missing section ${start}`);
  return text.slice(a, b);
}

const contract = read(vault, rel.contract);
const report = read(root, rel.report);
const obsReport = read(vault, rel.obsReport);
const current = read(vault, rel.current);
const decisions = read(vault, rel.decisions);
const queue = read(vault, rel.queue);
const history = read(vault, rel.history);
const testsLedger = read(vault, rel.testsLedger);
const delivery = read(vault, rel.delivery);
const risks = read(vault, rel.risks);
const index = read(vault, rel.index);
const task = read(root, rel.task);
const event = read(root, rel.event);
const requestScope = read(root, rel.requestScope);
const g14Guard = read(root, rel.g14Guard);
const g15Guard = read(root, rel.g15Guard);
const r1Guard = read(root, rel.r1Guard);
const pkg = JSON.parse(read(root, rel.package));
const taskDelete = section(task, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");
const eventDelete = section(event, "if (req.method === 'DELETE')", "if (req.method !== 'POST')");

test('01 branch is dev-rollout-freeze', () => {
  assert.equal(sh(['branch', '--show-current']), 'dev-rollout-freeze');
});

test('02 G15-R1 input head is an ancestor', () => {
  const result = spawnSync('git', ['merge-base', '--is-ancestor', baseHead, 'HEAD'], { cwd: root });
  assert.equal(result.status, 0);
});

test('03 canonical contract exists', () => {
  assert.equal(fs.existsSync(path.join(vault, rel.contract)), true);
});

test('04 app and Obsidian reports exist', () => {
  assert.equal(fs.existsSync(path.join(root, rel.report)), true);
  assert.equal(fs.existsSync(path.join(vault, rel.obsReport)), true);
});

test('05 later authorized runtime adoption changes only Event route', () => {
  const files = new Set();
  for (const args of [
    ['diff', '--name-only', `${baseHead}..HEAD`],
    ['diff', '--name-only'],
    ['diff', '--cached', '--name-only'],
  ]) {
    for (const file of sh(args).split(/\r?\n/).filter(Boolean)) files.add(file);
  }
  assert.deepEqual([...files].filter((file) => file.startsWith('src/')), ['src/server/event-route-stage124f.ts']);
});

test('06 owner evidence comes only from verified Supabase user ID', () => {
  for (const text of [contract, report, obsReport]) {
    assert.match(text, /OWNER_EVIDENCE_SOURCE:\s*\nVERIFIED_SUPABASE_USER_ID_ONLY/);
  }
  assert.match(requestScope, /requireSupabaseRequestContext\(req\)/);
  assert.match(requestScope, /userId:\s*asText\(context\.userId\)\s*\|\|\s*null/);
});

test('07 owner match is normalized created_by_user_id against request user ID', () => {
  assert.match(contract, /normalize\(created_by_user_id\) === normalize\(requestIdentity\.userId\)/);
});

test('08 email, body and request header are forbidden owner evidence', () => {
  assert.match(contract, /EMAIL_OWNER_MATCH_ALLOWED:\s*\nNO/);
  assert.match(contract, /REQUEST_BODY_OWNER_EVIDENCE_ALLOWED:\s*\nNO/);
  assert.match(contract, /REQUEST_HEADER_OWNER_EVIDENCE_ALLOWED:\s*\nNO/);
});

test('09 exact workspace owner match keeps future outbound eligibility', () => {
  assert.match(contract, /EXACT_WORKSPACE_OWNER_MATCH:\s*\nLOCAL_TOMBSTONE_ALLOWED_AND_FUTURE_OUTBOUND_ELIGIBLE/);
});

test('10 exact workspace owner missing is local-only', () => {
  assert.match(contract, /EXACT_WORKSPACE_OWNER_MISSING:\s*\nLOCAL_TOMBSTONE_ONLY_NO_REMOTE_DELETE/);
});

test('11 exact workspace owner mismatch is local-only', () => {
  assert.match(contract, /EXACT_WORKSPACE_OWNER_MISMATCH:\s*\nLOCAL_TOMBSTONE_ONLY_NO_REMOTE_DELETE/);
});

test('12 non-null workspace mismatch is 409 and unchanged', () => {
  assert.match(contract, /NON_NULL_WORKSPACE_MISMATCH:\s*\nFAIL_CLOSED_409_UNCHANGED/);
  assert.match(contract, /\| 06 \| non-null workspace mismatch \| 409 \| no \| unchanged \| none \|/);
});

test('13 legacy-null exact owner match permits local tombstone only', () => {
  for (const text of [contract, report, obsReport]) {
    assert.match(text, /LEGACY_WORKSPACE_NULL_OWNER_MATCH:\s*\nLOCAL_TOMBSTONE_ONLY/);
  }
  assert.match(contract, /\| 07 \| workspace null \+ exact owner match \| 200 \| local only \| `legacy_local_tombstone_only` \| forbidden \|/);
});

test('14 legacy-null owner missing fails closed 403 unchanged', () => {
  for (const text of [contract, report, obsReport]) {
    assert.match(text, /LEGACY_WORKSPACE_NULL_OWNER_MISSING:\s*\nFAIL_CLOSED_403_UNCHANGED/);
  }
});

test('15 legacy-null owner mismatch fails closed 403 unchanged', () => {
  for (const text of [contract, report, obsReport]) {
    assert.match(text, /LEGACY_WORKSPACE_NULL_OWNER_MISMATCH:\s*\nFAIL_CLOSED_403_UNCHANGED/);
  }
  assert.match(contract, /403 response for owner missing and owner mismatch is intentionally identical/);
});

test('16 legacy claim, pending delete and remote delete stay forbidden', () => {
  for (const text of [contract, report, obsReport]) {
    assert.match(text, /LEGACY_WORKSPACE_CLAIM_ALLOWED:\s*\nNO/);
    assert.match(text, /LEGACY_REMOTE_DELETE_ALLOWED:\s*\nNO/);
  }
  assert.match(contract, /LEGACY_PENDING_DELETE_ALLOWED:\s*\nNO/);
  assert.match(contract, /LEGACY_REMOTE_DELETE_ALLOWED:\s*\nNO/);
  assert.match(contract, /LEGACY_REMOTE_ID_CLEAR_ALLOWED:\s*\nNO/);
});

test('17 imported Google row can never trigger remote delete', () => {
  assert.match(contract, /IMPORTED_GOOGLE_EVENT_REMOTE_DELETE:\s*\nFORBIDDEN/);
});

test('18 owner missing and mismatch do not leak owner data', () => {
  assert.match(contract, /must not expose owner data/);
});

test('19 Task DELETE and Event DELETE remain unwired to G9', () => {
  assert.doesNotMatch(taskDelete, /markGoogleCalendarMutationSyncState\s*\(/);
  assert.doesNotMatch(eventDelete, /markGoogleCalendarMutationSyncState\s*\(/);
  assert.match(contract, /TASK_DELETE_RUNTIME:\s*\nNOT_AUTHORIZED/);
  assert.match(contract, /EVENT_DELETE_RUNTIME:\s*\nNOT_AUTHORIZED_UNTIL_NEXT_STAGE/);
});

test('20 Task remains unchanged while Event adopts owner evidence', () => {
  assert.doesNotMatch(taskDelete, /created_by_user_id/);
  assert.match(eventDelete, /created_by_user_id/);
  assert.match(eventDelete, /verifiedRequestUserIdStageG15R2/);
  assert.match(report, /DELETE select paths currently omit `created_by_user_id`/);
});

test('21 Task keeps legacy writer while Event replaces it with owner-filtered update', () => {
  assert.match(taskDelete, /selectFirstAvailable\(\[selectPathStage228R23\]\)/);
  assert.match(taskDelete, /updateById\('work_items', id, payloadStage228R23\)/);
  assert.match(eventDelete, /selectFirstAvailable\(\[selectPathStage228R23\]\)/);
  assert.match(eventDelete, /workspace_id=is\.null&created_by_user_id=eq\./);
  assert.doesNotMatch(eventDelete, /updateById\('work_items', id, payloadStage228R23\)/);
});

test('22 G14/G15 guards accept exact R1 artifacts while G15 blocks R2 plus G16', () => {
  assert.match(g14Guard, /LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT/);
  assert.match(g15Guard, /LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT/);
  assert.match(g15Guard, /LF-PROD-SOT-G15-R2_/);
  assert.match(g15Guard, /LF-PROD-SOT-G16_/);
  assert.match(g15Guard, /G15_R1_OBSIDIAN_INPUT_HEAD/);
  assert.match(r1Guard, /G15_R1_OBSIDIAN_INPUT_HEAD_REQUIRED/);
});

test('23 next stage is Event DELETE G15-R2, not G16', () => {
  for (const text of [contract, report, obsReport, current, queue, history, testsLedger, delivery, risks, index]) {
    assert.match(text, new RegExp(nextStage));
  }
  const decisionsHasNextRouting =
    decisions.includes(nextStage) ||
    (
      /## DEC-G15-R2-01/.test(decisions) &&
      /FIRST_RUNTIME_CONSUMER:\s*EVENT_DELETE_ONLY/.test(decisions) &&
      /TASK_DELETE_RUNTIME:\s*NOT_AUTHORIZED/.test(decisions) &&
      /G16:\s*NOT_AUTHORIZED/.test(decisions)
    );
  assert.equal(decisionsHasNextRouting, true);
  for (const text of [contract, report, obsReport]) {
    assert.match(text, /G16_ARTIFACT_CREATED:\s*\nNO/);
  }
});

test('24 package alias and canonical routing are complete', () => {
  assert.equal(
    pkg.scripts?.['verify:lf-prod-sot-g15-r1'],
    'node scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs && node --test tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',
  );
  assert.match(index, new RegExp(`\\[\\[${stage}\\]\\]`));
  for (const text of [current, decisions, queue, history, testsLedger, delivery, risks]) {
    assert.match(text, new RegExp(stage));
  }
});
