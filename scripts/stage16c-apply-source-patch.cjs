const fs = require('fs');
const path = require('path');

const root = process.argv[2] || process.cwd();

function file(rel) {
  return path.join(root, rel);
}

function read(rel) {
  return fs.readFileSync(file(rel), 'utf8').replace(/^\uFEFF/, '');
}

function write(rel, content) {
  fs.writeFileSync(file(rel), content, 'utf8');
}

function ensureImport() {
  const rel = 'src/index.css';
  let text = read(rel);
  const line = "@import './styles/closeflow-stage16c-tasks-cases-parity.css';";
  if (!text.includes(line)) {
    const anchor = "@import './styles/closeflow-entity-type-tokens.css';";
    if (text.includes(anchor)) {
      text = text.replace(anchor, anchor + '\n' + line);
    } else {
      text = line + '\n' + text;
    }
  }
  write(rel, text);
}

function patchTasks() {
  const rel = 'src/pages/TasksStable.tsx';
  let text = read(rel);
  if (!text.includes('CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR')) {
    text = text.replace(
      "const STAGE83_TASK_DONE_NEXT_STEP_PROMPT = 'STAGE83_TASK_DONE_NEXT_STEP_PROMPT';\nvoid STAGE83_TASK_DONE_NEXT_STEP_PROMPT;",
      "const STAGE83_TASK_DONE_NEXT_STEP_PROMPT = 'STAGE83_TASK_DONE_NEXT_STEP_PROMPT';\nvoid STAGE83_TASK_DONE_NEXT_STEP_PROMPT;\nconst CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR = 'tasks cases visual mobile repair scoped to /tasks';\nvoid CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR;"
    );
  }
  text = text.replace(
    'data-stage83-task-done-next-step-prompt="true">',
    'data-stage83-task-done-next-step-prompt="true" data-stage16c-tasks-cases-repair="tasks">'
  );
  text = text.replace(
    '<div className="flex flex-wrap gap-2">\n              <Button type="button" variant="outline"',
    '<div className="cf-page-hero-actions flex flex-wrap gap-2">\n              <Button type="button" variant="outline"'
  );
  write(rel, text);
}

function patchCases() {
  const rel = 'src/pages/Cases.tsx';
  let text = read(rel);
  if (!text.includes('CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR')) {
    text = text.replace(
      "const CASES_LIFECYCLE_NEEDS_NEXT_STEP_GUARD = 'Bez kroku';",
      "const CASES_LIFECYCLE_NEEDS_NEXT_STEP_GUARD = 'Bez kroku';\nconst CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR = 'tasks cases visual mobile repair scoped to /cases';"
    );
  }
  text = text.replace(
    '<div className="cf-html-view main-cases-html" data-cases-real-view="true">',
    '<div className="cf-html-view main-cases-html" data-cases-real-view="true" data-stage16c-tasks-cases-repair="cases">'
  );
  text = text.replace(
    '<div className="page-head">',
    '<div className="page-head" data-stage16c-page-head="cases">'
  );
  text = text.replace(
    '<div className="grid-4">',
    '<div className="grid-4" data-stage16c-cases-stat-grid="true">'
  );
  write(rel, text);
}

ensureImport();
patchTasks();
patchCases();
console.log('STAGE16C_SOURCE_PATCH_OK');
