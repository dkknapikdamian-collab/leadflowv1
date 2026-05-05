const fs = require('fs');
const path = require('path');

const root = process.cwd();
function fail(message) {
  console.error('FAIL STAGE83_TASK_DONE_NEXT_STEP_PROMPT: ' + message);
  process.exit(1);
}
function read(rel) {
  const file = path.join(root, rel);
  if (!fs.existsSync(file)) fail('missing ' + rel);
  return fs.readFileSync(file, 'utf8');
}
function requireIncludes(label, text, markers) {
  for (const marker of markers) {
    if (!text.includes(marker)) fail(label + ' missing marker: ' + marker);
  }
}

const tasks = read('src/pages/TasksStable.tsx');
const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};

requireIncludes('TasksStable.tsx', tasks, [
  'STAGE83_TASK_DONE_NEXT_STEP_PROMPT',
  'NextStepPromptState',
  'shouldOfferNextStepPrompt',
  'buildNextStepPromptState',
  'handleCreateNextStepTask',
  'data-stage83-task-done-next-step-prompt="true"',
  'Ustaw kolejny krok',
  'Zadanie jest zrobione',
  'insertTaskToSupabase({',
  "type: 'follow_up'",
  "status: 'todo'",
  'setNextStepPrompt(buildNextStepPromptState(task))',
]);

if (!scripts['check:stage83-task-done-next-step-prompt']) fail('package.json missing check:stage83-task-done-next-step-prompt');
if (!scripts['verify:stage83-task-next-step']) fail('package.json missing verify:stage83-task-next-step');

console.log('PASS STAGE83_TASK_DONE_NEXT_STEP_PROMPT');
