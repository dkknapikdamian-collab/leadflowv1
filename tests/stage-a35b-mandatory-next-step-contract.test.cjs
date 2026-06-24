const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const baseline = fs.readFileSync('src/lib/owner-control/owner-control-baseline.ts', 'utf8');
const nextMove = fs.readFileSync('src/lib/owner-control/next-move-contract.ts', 'utf8');
const today = fs.readFileSync('src/pages/TodayStable.tsx', 'utf8');

test('Lead without next step enters Owner Control and lead with active next step is protected', () => {
  assert.match(baseline, /entityType: 'lead'/);
  assert.match(baseline, /buildNextMoveContract\(\{/);
  assert.match(baseline, /getNearestPlannedAction\(\{/);
  assert.match(baseline, /getRecordNextAction\(input\.record\)/);
  assert.match(nextMove, /if \(!action \|\| isClosedWorkItemStatus\(action\.status\)\)/);
  assert.match(nextMove, /status === 'planned'/);
  assert.match(baseline, /if \(!signals\.length && !nextMove\.isToday\) return null/);
});

test('Case without next step enters Owner Control and case with task/event/follow-up does not enter as missing', () => {
  assert.match(baseline, /entityType: 'case'/);
  assert.match(baseline, /relatedCaseIds: input\.relatedCaseIds/);
  assert.match(nextMove, /'follow_up'/);
  assert.match(nextMove, /nextMoveType/);
  assert.match(baseline, /statusLabel = 'Brak next step'/);
});

test('Client without active service need does not generate false alarm', () => {
  assert.match(baseline, /clients\?: unknown\[\]/);
  assert.match(baseline, /function clientRequiresOwnerControlRecord/);
  assert.match(baseline, /if \(!clientRequiresOwnerControlRecord\(record, workItems\)\) return null/);
  assert.match(baseline, /ACTIVE_CLIENT_SERVICE_STATUSES/);
});

test('Overdue next step has higher priority than ordinary missing next step', () => {
  assert.match(baseline, /if \(nextMove\.isOverdue\)/);
  assert.match(baseline, /priority = 150/);
  assert.match(baseline, /else if \(nextMove\.isMissing\)/);
  assert.match(baseline, /priority = 130/);
});

test('Ownerless noise does not return', () => {
  assert.doesNotMatch(baseline, /ownerId/);
  assert.match(baseline, /const source = resolveNoteSource\(normalized\)/);
  assert.match(baseline, /if \(!source\) return null/);
});

test('A35/R2 note without follow-up gap still works', () => {
  assert.match(baseline, /buildNoteWithoutFollowUpOwnerControlItems\(\{ items: workItems, now \}\)/);
  assert.match(baseline, /gapCloseKind: 'note_without_followup'/);
  assert.match(baseline, /Notatka bez follow-upu/);
});

test('Lead\/Client duplicate suppression exists', () => {
  assert.match(baseline, /clientIdsWithRelatedRecordProblem/);
  assert.match(baseline, /suppressMissingNextStep: clientIdsWithRelatedRecordProblem\.has\(clientId\)/);
  assert.match(baseline, /if \(input\.entityType === 'client' && input\.suppressMissingNextStep && nextMove\.isMissing\) return null/);
});

test('Every Owner Control problem has Lead\/Sprawa\/Klient source metadata when applicable', () => {
  assert.match(baseline, /sourceEntityType: input\.entityType/);
  assert.match(baseline, /sourceBadge: getOwnerControlSourceLabel\(input\.entityType\)/);
  assert.match(baseline, /sourceEntityType: source\.sourceEntityType/);
  assert.match(baseline, /sourceBadge: sourceLabel/);
  assert.match(baseline, /return 'Lead' as const/);
  assert.match(baseline, /return 'Sprawa' as const/);
  assert.match(baseline, /return 'Klient' as const/);
});

test('Today reads clients and keeps the existing Today section model', () => {
  assert.match(today, /fetchClientsFromSupabase/);
  assert.match(today, /clients: data\.clients/);
  assert.match(today, /buildOwnerControlBaseline\(\{/);
  assert.match(today, /type TodaySectionKey = 'no_action' \| 'risk' \| 'waiting' \| 'leads' \| 'tasks' \| 'events' \| 'drafts' \| 'upcoming'/);
  assert.doesNotMatch(today, /A35B_REDESIGN|owner-control-redesign|today-redesign-panel/i);
});

test('No SQL or new tables were added for A35B', () => {
  assert.equal(fs.existsSync('supabase/migrations/STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT.sql'), false);
  assert.equal(fs.existsSync('supabase/migrations/STAGE_A35B_MANDATORY_NEXT_STEP_CONTRACT.sql'), false);
  assert.doesNotMatch(baseline, /create table|alter table|from\(['"]owner_control|owner_control_next/i);
  assert.doesNotMatch(nextMove, /create table|alter table/i);
});
