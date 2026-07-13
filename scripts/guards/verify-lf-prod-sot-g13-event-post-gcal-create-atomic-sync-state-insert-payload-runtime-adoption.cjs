const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const { TextDecoder } = require('node:util');

const root = path.resolve(__dirname, '../..');
const allowed = new Set([
  'src/server/event-route-stage124f.ts',
  'scripts/guards/verify-lf-prod-sot-g13-event-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  'tests/lf-prod-sot-g13-event-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.test.cjs',
  'tsconfig.g13.json',
  'package.json',
  '_project/runs/LF-PROD-SOT-G13_EVENT_POST_GCAL_CREATE_ATOMIC_SYNC_STATE_INSERT_PAYLOAD_RUNTIME_ADOPTION.md',
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
  return cp.execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}
function runRaw(command) {
  try { return cp.execSync(command, { cwd: root, encoding: 'utf8' }); }
  catch (error) { return String(error.stdout || '') + String(error.stderr || ''); }
}
function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) throw new Error(`MISSING_REQUIRED_FILE:${file}`);
  return new TextDecoder('utf-8', { fatal: true }).decode(fs.readFileSync(full)).replace(/\r\n/g, '\n');
}
function count(text, pattern) { return (text.match(pattern) || []).length; }
function ok(value, message) { if (!value) throw new Error(message); }

ok(run('git branch --show-current') === 'dev-rollout-freeze', 'WRONG_BRANCH');
for (const line of runRaw('git status --porcelain=v1 --untracked-files=all').split(/\r?\n/).filter(Boolean)) {
  const file = line.slice(3).replace(/^"|"$/g, '');
  ok(allowed.has(file), `OUT_OF_SCOPE:${file}`);
}

const event = read('src/server/event-route-stage124f.ts');
const task = read('src/server/task-route-stage124f.ts');
const helper = read('src/lib/google-calendar-create-sync-state-insert-payload.ts');
const facade = read('src/lib/google-calendar-mutation-sync-state-decision.ts');
const report = read('_project/runs/LF-PROD-SOT-G13_EVENT_POST_GCAL_CREATE_ATOMIC_SYNC_STATE_INSERT_PAYLOAD_RUNTIME_ADOPTION.md');

const importPattern = /import\s*\{\s*buildGoogleCalendarCreateSyncStateInsertPayload,\s*\}\s*from\s*'\.\.\/lib\/google-calendar-create-sync-state-insert-payload\.js';/g;
ok(count(event, importPattern) === 1, 'G12_IMPORT_COUNT');
ok(count(event, /\bbuildGoogleCalendarCreateSyncStateInsertPayload\s*\(/g) === 1, 'G12_CALL_COUNT');

const postGate = event.indexOf("if (req.method !== 'POST')");
const helperCall = event.indexOf('buildGoogleCalendarCreateSyncStateInsertPayload({');
const insertCall = event.indexOf("insertWithVariants(['work_items'], [payload])", helperCall);
ok(postGate >= 0 && helperCall > postGate && insertCall > helperCall, 'POST_BOUNDARY_OR_ORDER');

const postRegion = event.slice(postGate);
ok(postRegion.includes('const eventInsertBaseStageG13 = {'), 'BASE_PAYLOAD_MISSING');
ok(postRegion.includes('...googleCalendarCreateSyncStateStageG13.insertPayload'), 'INSERT_PAYLOAD_SPREAD_MISSING');
ok(postRegion.includes("const payload = {\n      ...eventInsertBaseStageG13,"), 'FINAL_PAYLOAD_MISSING');
ok(count(postRegion, /insertWithVariants\(\['work_items'\], \[payload\]\)/g) === 1, 'WORK_ITEMS_INSERT_COUNT');

for (const field of [
  'recordType:', 'type:', 'status:', 'showInCalendar:', 'hasCalendarTime:',
  'createdByUserId:', 'googleCalendarEventId: null', 'currentGoogleSyncStatus: null',
]) ok(postRegion.includes(field), `HELPER_FIELD:${field}`);

ok(!postRegion.includes('markGoogleCalendarMutationSyncState({'), 'POST_G9_MARKER_FORBIDDEN');
ok(!/google_calendar_sync_status\s*:\s*body\./.test(postRegion), 'CLIENT_SYNC_STATUS_FORBIDDEN');
ok(count(event.slice(0, postGate), /markGoogleCalendarMutationSyncState\(\{/g) === 1, 'EVENT_PATCH_G9_COUNT');
const taskImportPattern = /import\s*\{\s*buildGoogleCalendarCreateSyncStateInsertPayload,\s*\}\s*from\s*'\.\.\/lib\/google-calendar-create-sync-state-insert-payload\.js';/g;
ok(count(task, taskImportPattern) === 1, 'TASK_G12_IMPORT_COUNT');
ok(count(task, /\bbuildGoogleCalendarCreateSyncStateInsertPayload\s*\(/g) === 1, 'TASK_G12_CALL_COUNT');
const taskPostGate = task.indexOf("if (req.method !== 'POST')");
const taskDeleteStart = task.indexOf("if (req.method === 'DELETE')");
const taskDeleteRegion = task.slice(taskDeleteStart, taskPostGate);
ok(!taskDeleteRegion.includes('buildGoogleCalendarCreateSyncStateInsertPayload'), 'TASK_DELETE_HELPER_FORBIDDEN');
ok(!event.includes('LF-PROD-SOT-G15'), 'G15_CREATED');
ok(report.includes('PASS_EVENT_POST_GCAL_CREATE_ATOMIC_SYNC_STATE_INSERT_PAYLOAD_RUNTIME_ADOPTION'), 'REPORT_STATUS');

for (const [name, text] of [
  ['event', event], ['task', task], ['helper', helper], ['facade', facade], ['report', report],
]) {
  ok(!text.includes('`n'), `LITERAL_BACKTICK_N:${name}`);
  ok(!/[ÃÂ�]/.test(text), `MOJIBAKE:${name}`);
}

console.log('G13_GUARD: PASS');
console.log('EVENT_POST_G12_IMPORT_COUNT: 1');
console.log('EVENT_POST_G12_CALL_COUNT: 1');
console.log('EVENT_POST_WORK_ITEMS_INSERT_COUNT: 1');
console.log('EVENT_PATCH_G9_CALL_COUNT: 1');
console.log('TASK_POST_WIRED: YES');
console.log('DELETE_WIRED: NO');
console.log('G15_CREATED: NO');
