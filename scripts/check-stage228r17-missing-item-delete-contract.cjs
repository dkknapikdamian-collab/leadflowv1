const fs = require('fs');
const path = require('path');
const root = process.cwd();
function read(file) { return fs.readFileSync(path.join(root, file), 'utf8').replace(/^\uFEFF/, ''); }
function assert(condition, message) { if (!condition) { console.error('FAIL:', message); process.exitCode = 1; } }
function between(text, startNeedle, endNeedle) {
  const start = text.indexOf(startNeedle);
  const end = text.indexOf(endNeedle, start + startNeedle.length);
  if (start === -1 || end === -1) return '';
  return text.slice(start, end);
}
const lead = read('src/pages/LeadDetail.tsx');
const taskRoute = read('src/server/task-route-stage124f.ts');
const fallback = read('src/lib/supabase-fallback.ts');
const deleteFn = between(lead, 'const handleDeleteLeadMissingItemStage228R15', 'const openLeadPaymentDialog');
assert(lead.includes('STAGE228R17_MISSING_ITEM_DELETE_CONTRACT'), 'LeadDetail must contain Stage228R17 marker.');
assert(lead.includes('softDeleteTaskInSupabase'), 'LeadDetail must import/use softDeleteTaskInSupabase.');
assert(deleteFn.includes('await softDeleteTaskInSupabase({'), 'Missing item delete must use backend soft-delete helper.');
assert(!deleteFn.includes('await updateTaskInSupabase({'), 'Missing item delete must not use generic updateTaskInSupabase.');
assert(deleteFn.includes('previous.filter'), 'Missing item delete must optimistically remove the row from local state.');
assert(deleteFn.includes('optimisticSnapshot') && deleteFn.includes('setLinkedTasks(optimisticSnapshot)'), 'Missing item delete must rollback optimistic state on backend failure.');
assert(deleteFn.includes('await loadLead({ silent: true })'), 'Missing item delete must refresh silently without full loader.');
assert(taskRoute.includes('clearLeadNextActionIfMatchingTaskStage228R17'), 'Task route must clear lead next_action when deleted task was current next action.');
assert(taskRoute.includes('CLOSED_TASK_STATUSES_FOR_LEAD_NEXT_ACTION_STAGE228R17'), 'Task route must define closed statuses for next action guard.');
assert(taskRoute.includes('isMissingItemTypeForLeadNextActionStage228R17'), 'Task route must avoid promoting missing_item to lead next action.');
assert(taskRoute.includes('body.leadId && !isMissingItemTypeForLeadNextActionStage228R17'), 'Task create must not sync missing_item as lead next action.');
assert(taskRoute.includes('isClosedTaskStatusForLeadNextActionStage228R17(nextStatusForLeadAction)'), 'Task patch must branch for closed/deleted task status.');
assert(fallback.includes('softDeleteTaskInSupabase'), 'supabase-fallback must expose softDeleteTaskInSupabase.');
if (process.exitCode) process.exit(1);
console.log('PASS stage228r17 missing item delete contract');
