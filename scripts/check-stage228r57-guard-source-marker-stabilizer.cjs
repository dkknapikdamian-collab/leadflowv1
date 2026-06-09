const fs = require('fs');
const path = require('path');

const root = process.cwd();
const rel = 'src/lib/supabase-fallback.ts';
const content = fs.readFileSync(path.join(root, rel), 'utf8');

function fail(message) { throw new Error(message); }
function must(label, condition) { if (!condition) fail(label); }
function mustInclude(label, haystack, token) { must(label + ' missing token: ' + token, haystack.includes(token)); }
function sliceBetween(startToken, endToken) {
  const start = content.indexOf(startToken);
  must('missing start token ' + startToken, start >= 0);
  const end = content.indexOf(endToken, start + startToken.length);
  must('missing end token ' + endToken, end > start);
  return content.slice(start, end);
}

const taskBlock = sliceBetween('export async function updateTaskInSupabase', 'export async function updateEventInSupabase');

must('task function block must not contain malformed arrow/function tail', !/\}\)\s*\{/.test(taskBlock));
must('task function block must not contain stale broken return result tail', !/return\s+result;\s*\}\)/.test(taskBlock));
must('task function block must not emit object input as no-flicker id', !/id:\s*input\s*[,}]/.test(taskBlock));
must('task function block should contain exactly one updateTaskInSupabase declaration', (taskBlock.match(/export async function updateTaskInSupabase/g) || []).length === 1);
must('task function block should contain exactly one hardDeleteTaskFromSupabase declaration', (taskBlock.match(/export async function hardDeleteTaskFromSupabase/g) || []).length === 1);
must('task function block should contain exactly one softDeleteTaskInSupabase declaration', (taskBlock.match(/export async function softDeleteTaskInSupabase/g) || []).length === 1);
must('task function block should contain exactly one deleteTaskFromSupabase declaration', (taskBlock.match(/export async function deleteTaskFromSupabase/g) || []).length === 1);
mustInclude('updateTaskInSupabase api route', taskBlock, "callApi<SupabaseInsertResult>('/api/tasks'");
mustInclude('updateTaskInSupabase patch method', taskBlock, "method: 'PATCH'");
mustInclude('updateTaskInSupabase no-flicker emitter', taskBlock, 'emitCloseflowWorkItemNoFlickerMutation');
mustInclude('updateTaskInSupabase update action', taskBlock, "action: 'update'");
mustInclude('updateTaskInSupabase task kind', taskBlock, "kind: 'task'");
mustInclude('updateTaskInSupabase id contract', taskBlock, 'id: taskId');
mustInclude('updateTaskInSupabase record contract', taskBlock, 'record: result');
mustInclude('hardDeleteTaskFromSupabase delete method', taskBlock, "method: 'DELETE'");
mustInclude('hardDeleteTaskFromSupabase source id', taskBlock, 'sourceId: taskId');
mustInclude('softDeleteTaskInSupabase deletedAt', taskBlock, 'const deletedAt = new Date().toISOString()');
mustInclude('softDeleteTaskInSupabase deleted status', taskBlock, "status: 'deleted'");
mustInclude('softDeleteTaskInSupabase no-flicker emitter', taskBlock, 'emitCloseflowWorkItemNoFlickerMutation');
mustInclude('softDeleteTaskInSupabase delete action', taskBlock, "action: 'delete'");
mustInclude('softDeleteTaskInSupabase task kind', taskBlock, "kind: 'task'");
must('softDeleteTaskInSupabase id contract must use normalized taskId', /id:\s*taskId\b/.test(taskBlock));
mustInclude('deleteTaskFromSupabase delegates to soft delete', taskBlock, 'return softDeleteTaskInSupabase({ id');
const obsoleteSourceMarker = 'stage228r50' + '_updateTaskInSupabase_no_flicker_update';
const r55 = fs.existsSync(path.join(root, 'scripts/check-stage228r55-supabase-fallback-syntax-repair.cjs')) ? fs.readFileSync(path.join(root, 'scripts/check-stage228r55-supabase-fallback-syntax-repair.cjs'), 'utf8') : '';
const r56 = fs.existsSync(path.join(root, 'scripts/check-stage228r56-supabase-fallback-task-functions.cjs')) ? fs.readFileSync(path.join(root, 'scripts/check-stage228r56-supabase-fallback-task-functions.cjs'), 'utf8') : '';
must('R55 guard must not require obsolete exact R50 source marker', !r55.includes(obsoleteSourceMarker));
must('R56 guard must not require obsolete exact R50 source marker', !r56.includes(obsoleteSourceMarker));
console.log('STAGE228R57_GUARD_SOURCE_MARKER_STABILIZER PASS');
