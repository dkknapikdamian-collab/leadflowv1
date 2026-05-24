const fs = require('fs');
const path = require('path');
const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}
function mustInclude(rel, marker) {
  if (!read(rel).includes(marker)) throw new Error(`${rel} missing marker: ${marker}`);
}

[
  'data-stage178-tasks-operational-panel="true"',
  'Filtry zadań',
  'Najpilniejsze zadania',
  'data-stage178-tasks-right-rail="true"',
  'data-stage178-tasks-grouped-list="true"',
  'data-cf-main-search-stage178="true"',
  'buildTaskGroups',
  'getUrgentTasks',
  "'high' | 'unlinked'",
].forEach((marker) => mustInclude('src/pages/TasksStable.tsx', marker));

mustInclude('src/App.tsx', "closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css");

console.log('OK: Stage178B repair guard passed.');
