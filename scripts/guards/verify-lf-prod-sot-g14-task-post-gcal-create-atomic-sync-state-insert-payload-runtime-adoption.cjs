const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const { TextDecoder } = require('node:util');
const root = path.resolve(__dirname, '../..');
const allowed = new Set([
  'src/server/task-route-stage124f.ts',
  'scripts/guards/verify-lf-prod-sot-g12-gcal-create-atomic-sync-state-insert-payload-contract.cjs',
  'scripts/guards/verify-lf-prod-sot-g13-event-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  'tests/lf-prod-sot-g13-event-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.test.cjs',
  'scripts/guards/verify-lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.cjs',
  'tests/lf-prod-sot-g14-task-post-gcal-create-atomic-sync-state-insert-payload-runtime-adoption.test.cjs',
  'scripts/guards/verify-lf-prod-sot-g15-gcal-delete-legacy-workspace-tombstone-and-retry-contract-map.cjs',
  '_project/runs/LF-PROD-SOT-G15-R1_GCAL_DELETE_LEGACY_WORKSPACE_NULL_OWNER_EVIDENCE_DECISION_CONTRACT.md',
  'scripts/guards/verify-lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.cjs',
  'tests/lf-prod-sot-g15-r1-gcal-delete-legacy-workspace-null-owner-evidence-decision-contract.test.cjs',
  'tsconfig.g14.json',
  'package.json',
  '_project/runs/LF-PROD-SOT-G14_TASK_POST_GCAL_CREATE_ATOMIC_SYNC_STATE_INSERT_PAYLOAD_RUNTIME_ADOPTION.md',
]);
function run(command){ return cp.execSync(command,{cwd:root,encoding:'utf8'}).trim(); }
function runRaw(command){ return cp.execSync(command,{cwd:root,encoding:'utf8'}); }
function read(file){ return new TextDecoder('utf-8',{fatal:true}).decode(fs.readFileSync(path.join(root,file))).replace(/\r\n/g,'\n'); }
function count(text,re){ return (text.match(re)||[]).length; }
function ok(v,m){ if(!v) throw new Error(m); }
ok(run('git branch --show-current') === 'dev-rollout-freeze','WRONG_BRANCH');
for(const line of runRaw('git status --porcelain=v1 --untracked-files=all').split(/\r?\n/).filter(Boolean)){
  const file=line.slice(3).replace(/^"|"$/g,''); ok(allowed.has(file),`OUT_OF_SCOPE:${file}`);
}
const task=read('src/server/task-route-stage124f.ts');
const event=read('src/server/event-route-stage124f.ts');
for(const [name,text] of [['task',task],['event',event]]){
  ok(!text.includes('`n'),`LITERAL_BACKTICK_N:${name}`);
  ok(!/[ĂĂ‚ďż˝]/.test(text),`MOJIBAKE:${name}`);
}
ok(count(task,/from '\.\.\/lib\/google-calendar-create-sync-state-insert-payload\.js';/g)===1,'TASK_IMPORT_COUNT');
ok(count(task,/\bbuildGoogleCalendarCreateSyncStateInsertPayload\s*\(/g)===1,'TASK_CALL_COUNT');
const postGate=task.indexOf("if (req.method !== 'POST')");
const helperCall=task.indexOf('buildGoogleCalendarCreateSyncStateInsertPayload({');
const insertCall=task.indexOf("insertWithVariants(['work_items'], [payload])",helperCall);
ok(postGate>=0 && helperCall>postGate && insertCall>helperCall,'TASK_POST_ORDER');
const post=task.slice(postGate);
ok(post.includes('const taskInsertBaseStageG14 = {'),'BASE_PAYLOAD');
ok(post.includes('...googleCalendarCreateSyncStateStageG14.insertPayload'),'INSERT_SPREAD');
ok(count(post,/insertWithVariants\(\['work_items'\], \[payload\]\)/g)===1,'TASK_INSERT_COUNT');
for(const token of [
  'recordType: taskInsertBaseStageG14.record_type',
  'type: taskInsertBaseStageG14.type',
  'status: taskInsertBaseStageG14.status',
  'showInCalendar: taskInsertBaseStageG14.show_in_calendar',
  'createdByUserId: taskInsertBaseStageG14.created_by_user_id',
  'googleCalendarEventId: null',
  'currentGoogleSyncStatus: null',
]) ok(post.includes(token),`MISSING:${token}`);
const hasTime=post.slice(post.indexOf('hasCalendarTime:'),post.indexOf('createdByUserId:'));
ok(hasTime.includes('scheduled_at') && hasTime.includes('start_at'),'HAS_TIME_FIELDS');
ok(!hasTime.includes('created_at') && !hasTime.includes('nowIso'),'HAS_TIME_FALLBACK');
ok(!post.includes('markGoogleCalendarMutationSyncState({'),'TASK_POST_G9');
ok(count(task.slice(0,postGate),/markGoogleCalendarMutationSyncState\(\{/g)===1,'TASK_PATCH_G9');
const deleteRegion=task.slice(task.indexOf("if (req.method === 'DELETE')"),postGate);
ok(!deleteRegion.includes('buildGoogleCalendarCreateSyncStateInsertPayload'),'TASK_DELETE_HELPER');
ok(count(event,/\bbuildGoogleCalendarCreateSyncStateInsertPayload\s*\(/g)===1,'EVENT_POST_HELPER');
ok(count(event,/markGoogleCalendarMutationSyncState\(\{/g)===1,'EVENT_PATCH_G9');
ok(!/google_calendar_sync_status\s*:\s*body\./.test(post),'CLIENT_SYNC_STATUS');
ok(!post.includes('LF-PROD-SOT-G15'),'G15_TASK_POST_RUNTIME_WIRING');
console.log('G14_GUARD: PASS');
console.log('TASK_POST_G12_IMPORT_COUNT: 1');
console.log('TASK_POST_G12_CALL_COUNT: 1');
console.log('TASK_POST_WORK_ITEMS_INSERT_COUNT: 1');
console.log('TASK_POST_POST_INSERT_G9_CALL_COUNT: 0');
console.log('TASK_PATCH_G9_CALL_COUNT: 1');
console.log('EVENT_POST_G12_CALL_COUNT: 1');
console.log('EVENT_PATCH_G9_CALL_COUNT: 1');
console.log('G15_TASK_POST_RUNTIME_WIRING: NO');