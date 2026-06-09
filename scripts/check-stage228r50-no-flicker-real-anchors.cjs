const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function must(condition, message) {
  if (!condition) throw new Error(message);
}
function bodyOfFunction(src, needle) {
  const start = src.indexOf(needle);
  if (start < 0) return '';
  const brace = src.indexOf('{', start);
  if (brace < 0) return '';
  let depth = 0;
  for (let i = brace; i < src.length; i += 1) {
    const ch = src[i];
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  return src.slice(start);
}

const lead = read('src/pages/LeadDetail.tsx');
const tasksStable = read('src/pages/TasksStable.tsx');
const context = read('src/components/ContextActionDialogs.tsx');
const fallback = read('src/lib/supabase-fallback.ts');
const helper = read('src/lib/work-items/no-flicker-mutation.ts');

must(lead.includes('linkedTasks') && lead.includes('setLinkedTasks'), 'LeadDetail must use linkedTasks/setLinkedTasks anchors.');
must(lead.includes('linkedEvents') && lead.includes('setLinkedEvents'), 'LeadDetail must use linkedEvents/setLinkedEvents anchors.');
must(lead.includes('savedRecord'), 'LeadDetail must consume savedRecord from context-action-saved.');
must(lead.includes('loadLead({ silent: true })'), 'LeadDetail must keep context refresh silent.');
must(lead.includes('closeflow:context-action-saved'), 'LeadDetail must listen to closeflow:context-action-saved.');
must(lead.includes('setLinkedTasks') && lead.includes('setLinkedEvents'), 'LeadDetail must locally update linked task/event state.');

const confirmDeleteTask = bodyOfFunction(tasksStable, 'const confirmDeleteTask = async');
must(confirmDeleteTask, 'TasksStable confirmDeleteTask function missing.');
must(confirmDeleteTask.includes('deleteTaskFromSupabase'), 'TasksStable confirmDeleteTask must call deleteTaskFromSupabase.');
must(confirmDeleteTask.includes('setTasks') && confirmDeleteTask.includes('.filter('), 'TasksStable confirmDeleteTask must locally filter deleted task.');
must(confirmDeleteTask.includes('optimisticSnapshot'), 'TasksStable confirmDeleteTask must keep rollback snapshot.');
must(confirmDeleteTask.includes('catch') && confirmDeleteTask.includes('setTasks(optimisticSnapshot'), 'TasksStable confirmDeleteTask must rollback task list on delete failure.');
must(!confirmDeleteTask.includes('await refreshData()'), 'TasksStable confirmDeleteTask must not force refreshData after delete.');

must(context.includes('savedRecord'), 'ContextActionDialogs must emit savedRecord.');
must(context.includes('CONTEXT_ACTION_SAVED_EVENT'), 'ContextActionDialogs must keep context action saved event.');
must(fallback.includes('emitCloseflowWorkItemNoFlickerMutation'), 'supabase-fallback must emit no-flicker mutation events.');
must(!fallback.includes("id: input, source: 'stage228r48_softDeleteTaskInSupabase_no_flicker_delete'"), 'softDeleteTaskInSupabase must not emit whole input object as id.');
must(helper.includes('closeflow:work-item-no-flicker-mutation'), 'no-flicker helper must define shared work-item mutation event.');

console.log('STAGE228R50_NO_FLICKER_REAL_ANCHORS PASS');
