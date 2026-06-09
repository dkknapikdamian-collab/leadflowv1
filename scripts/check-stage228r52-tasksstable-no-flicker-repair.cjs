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

const tasksStable = read('src/pages/TasksStable.tsx');
const confirmDeleteTask = bodyOfFunction(tasksStable, 'const confirmDeleteTask = async');

must(confirmDeleteTask.includes('const optimisticSnapshot'), 'TasksStable delete must capture optimisticSnapshot.');
must(confirmDeleteTask.includes('setTasks') && confirmDeleteTask.includes('.filter('), 'TasksStable delete must filter local list immediately.');
must(confirmDeleteTask.includes('await deleteTaskFromSupabase'), 'TasksStable delete must still persist deletion through API.');
must(confirmDeleteTask.includes('setTasks(optimisticSnapshot'), 'TasksStable delete must restore optimisticSnapshot on failure.');
must(!confirmDeleteTask.includes('await refreshData()'), 'TasksStable delete must not force refreshData after successful delete.');

console.log('STAGE228R52_TASKSSTABLE_NO_FLICKER_REPAIR PASS');
