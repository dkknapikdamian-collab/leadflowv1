const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function must(condition, message) {
  if (!condition) throw new Error(message);
}

const guard50 = read('scripts/check-stage228r50-no-flicker-real-anchors.cjs');
const tasksStable = read('src/pages/TasksStable.tsx');
const fallback = read('src/lib/supabase-fallback.ts');

must(guard50.includes('bodyOfFunction') && guard50.includes('confirmDeleteTask'), 'R50 guard must inspect confirmDeleteTask behavior, not only literal formatting.');
must(guard50.includes('optimisticSnapshot'), 'R50 guard must require rollback snapshot.');
must(guard50.includes('setTasks') && guard50.includes('.filter('), 'R50 guard must require local task removal.');
must(tasksStable.includes('optimisticSnapshot'), 'TasksStable must keep optimisticSnapshot.');
must(tasksStable.includes('setTasks') && tasksStable.includes('.filter('), 'TasksStable must locally remove deleted task.');
must(fallback.includes('id: input.id') || fallback.includes('id: String(input.id'), 'softDeleteTaskInSupabase must emit input.id, not whole input object.');

console.log('STAGE228R51_R50_GUARD_REPAIR PASS');
