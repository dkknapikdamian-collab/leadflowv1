const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const allowed = new Set([
  'src/lib/google-calendar-create-sync-state-insert-payload.ts',
  'scripts/guards/verify-lf-prod-sot-g12-gcal-create-atomic-sync-state-insert-payload-contract.cjs',
  'tests/lf-prod-sot-g12-gcal-create-atomic-sync-state-insert-payload-contract.test.cjs',
  '_project/runs/LF-PROD-SOT-G12_GCAL_CREATE_ATOMIC_SYNC_STATE_INSERT_PAYLOAD_CONTRACT.md',
  'src/server/task-route-stage124f.ts',
  'scripts/guards/verify-lf-prod-sot-g12-gcal-create-atomic-sync-state-insert-payload-contract.cjs',
  'scripts/guards/verify-lf-prod-sot-g13-event-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  'tests/lf-prod-sot-g13-event-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.test.cjs',
  'scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  'tests/lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.test.cjs',
  'tsconfig.g14.json',
  'package.json',
  '_project/runs/LF-PROD-SOT-G14_TASK_POST_GCAL_CREATE_ATOMIC_SYNC_STATE_INSERT_PAYLOAD_RUNTIME_ADOPTION.md',
]);

function run(command) {
  return cp.execSync(command, { cwd: root, encoding: 'utf8' }).trim();
}

function runRaw(command) {
  return cp.execSync(command, { cwd: root, encoding: 'utf8' });
}

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE:${file}`);
  return new TextDecoder('utf-8', { fatal: true })
    .decode(fs.readFileSync(full))
    .replace(/\r\n/g, '\n');
}

function count(text, token) {
  return text.split(token).length - 1;
}

function ok(value, message) {
  if (!value) throw new Error(message);
}

ok(run('git branch --show-current') === 'dev-rollout-freeze', 'WRONG_BRANCH');

for (const line of runRaw('git status --porcelain=v1 --untracked-files=all').split(/\r?\n/).filter(Boolean)) {
  const file = line.slice(3).replace(/^"|"$/g, '');
  ok(allowed.has(file), `OUT_OF_SCOPE:${file}`);
}

const helper = read('src/lib/google-calendar-create-sync-state-insert-payload.ts');
const task = read('src/server/task-route-stage124f.ts');
const event = read('src/server/event-route-stage124f.ts');
const tests = read('tests/lf-prod-sot-g12-gcal-create-atomic-sync-state-insert-payload-contract.test.cjs');
const report = read('_project/runs/LF-PROD-SOT-G12_GCAL_CREATE_ATOMIC_SYNC_STATE_INSERT_PAYLOAD_CONTRACT.md');
const tsconfig = JSON.parse(read('tsconfig.g12.json'));
const pkg = JSON.parse(read('package.json'));

ok(helper.includes("from './google-calendar-mutation-sync-state-decision.js'"), 'G7_IMPORT');
ok(helper.includes("mutationKind: 'create'"), 'CREATE_NOT_HARDCODED');

for (const field of [
  'recordType', 'type', 'status', 'showInCalendar', 'hasCalendarTime',
  'createdByUserId', 'googleCalendarEventId', 'currentGoogleSyncStatus',
]) {
  ok(helper.includes(`${field}: input.${field}`), `FIELD:${field}`);
}

for (const token of [
  'fetch(', 'supabaseRequest', 'insertWithVariants',
  'selectFirstAvailable', 'updateByIdScoped',
  'mutation-snapshot', 'sync-state-marker', '/server/',
]) {
  ok(!helper.includes(token), `FORBIDDEN:${token}`);
}

ok(helper.includes('CREATE_NO_WRITE_OUTCOMES'), 'STRICT_OUTCOME_SET');
ok(helper.includes('isExactPendingWriteDecision'), 'STRICT_PENDING_WRITE');
ok(helper.includes('isExactAlreadyPendingNoWriteDecision'), 'STRICT_ALREADY_PENDING');
ok(helper.includes('isValidCreateNoWriteDecision'), 'STRICT_NO_WRITE');
ok(helper.includes("google_calendar_sync_status: 'pending'"), 'PENDING_PAYLOAD');
ok(!helper.includes("google_calendar_sync_status: 'pending_delete'"), 'PENDING_DELETE_OUTPUT');
ok(helper.includes('GCAL_CREATE_SYNC_STATE_INSERT_PAYLOAD_INVALID_DECISION'), 'INVALID_DECISION_ERROR');

ok(count(task, 'markGoogleCalendarMutationSyncState({') === 1, 'TASK_G9');
ok(count(event, 'markGoogleCalendarMutationSyncState({') === 1, 'EVENT_G9');
const taskPostUsesG12Helper = task.includes('google-calendar-create-sync-state-insert-payload');
if (taskPostUsesG12Helper) {
  ok(count(task, "from '../lib/google-calendar-create-sync-state-insert-payload.js';") === 1, 'TASK_POST_G12_IMPORT_COUNT');
  ok(count(task, 'buildGoogleCalendarCreateSyncStateInsertPayload({') === 1, 'TASK_POST_G12_CALL_COUNT');
}
const eventPostUsesG12Helper =
  event.includes('google-calendar-create-sync-state-insert-payload');

if (eventPostUsesG12Helper) {
  ok(
    count(event, 'buildGoogleCalendarCreateSyncStateInsertPayload({') === 1,
    'EVENT_POST_G13_HELPER_CALL',
  );
}

const expectedAlias =
  'node scripts/guards/verify-lf-prod-sot-g12-gcal-create-atomic-sync-state-insert-payload-contract.cjs && tsc --noEmit -p tsconfig.g12.json && node --test tests/lf-prod-sot-g12-gcal-create-atomic-sync-state-insert-payload-contract.test.cjs';

ok(pkg.scripts['verify:lf-prod-sot-g12'] === expectedAlias, 'PACKAGE_ALIAS');
ok(Array.isArray(tsconfig.include) && tsconfig.include.length === 2, 'TSCONFIG');
ok((tests.match(/\btest\(/g) || []).length >= 52, 'TEST_COUNT');

for (const required of [
  'unknown outcome with null false is rejected',
  'pending with null false is rejected',
  'pending with pending false and non-pending input is rejected',
  'pending with pending false and pending input is accepted',
  'unchanged with null false is accepted',
  'skip_imported with null false is accepted',
  'skip_no_owner with null false is accepted',
  'skip_no_calendar_time with null false is accepted',
]) {
  ok(tests.includes(required), `MISSING_TEST:${required}`);
}

ok(report.includes('PASS_G12_STRICT_CREATE_DECISION_TUPLE_VALIDATION_REPAIR'), 'REPORT_STATUS');
ok(report.includes('G13_CREATED: NO'), 'REPORT_G13');

console.log('TASK_PATCH_G9_CALL_COUNT: 1');
console.log('EVENT_PATCH_G9_CALL_COUNT: 1');
console.log('TASK_POST_G12_IMPORT_COUNT: ' + count(task, "from '../lib/google-calendar-create-sync-state-insert-payload.js';"));
console.log('TASK_POST_G12_CALL_COUNT: ' + count(task, 'buildGoogleCalendarCreateSyncStateInsertPayload({'));
console.log('EVENT_POST_G12_IMPORT_COUNT: ' + count(event, "from '../lib/google-calendar-create-sync-state-insert-payload.js';"));
console.log('EVENT_POST_G12_CALL_COUNT: ' + count(event, 'buildGoogleCalendarCreateSyncStateInsertPayload({'));
console.log('G12_R2_TEST_COUNT: 52');
console.log('G12_FINAL_STATUS: PASS_G12_STRICT_CREATE_DECISION_TUPLE_VALIDATION_REPAIR');
