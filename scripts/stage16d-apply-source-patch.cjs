const fs = require('fs');
const path = require('path');

const root = process.argv[2] || process.cwd();
function file(rel) { return path.join(root, rel); }
function read(rel) { return fs.readFileSync(file(rel), 'utf8').replace(/^\uFEFF/, ''); }
function write(rel, text) { fs.writeFileSync(file(rel), text, 'utf8'); }

function patchIndexCss() {
  const rel = 'src/index.css';
  let text = read(rel);
  const line = "@import './styles/closeflow-stage16d-tasks-metric-final-lock.css';";
  if (!text.includes(line)) {
    const anchor = "@import './styles/eliteflow-semantic-badges-and-today-sections.css';";
    if (text.includes(anchor)) {
      text = text.replace(anchor, anchor + '\n' + line);
    } else {
      text = text + '\n' + line + '\n';
    }
  }
  write(rel, text);
}

function patchTasks() {
  const rel = 'src/pages/TasksStable.tsx';
  let text = read(rel);
  if (!text.includes('CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK')) {
    const anchor = "const CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR = 'tasks cases visual mobile repair scoped to /tasks';\nvoid CLOSEFLOW_STAGE16C_TASKS_CASES_VISUAL_MOBILE_REPAIR;";
    const insert = anchor + "\nconst CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK = 'tasks metric tile compact parity final lock';\nvoid CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK;";
    if (text.includes(anchor)) text = text.replace(anchor, insert);
    else text = text.replace("const STAGE83_TASK_DONE_NEXT_STEP_PROMPT = 'STAGE83_TASK_DONE_NEXT_STEP_PROMPT';\nvoid STAGE83_TASK_DONE_NEXT_STEP_PROMPT;", "const STAGE83_TASK_DONE_NEXT_STEP_PROMPT = 'STAGE83_TASK_DONE_NEXT_STEP_PROMPT';\nvoid STAGE83_TASK_DONE_NEXT_STEP_PROMPT;\nconst CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK = 'tasks metric tile compact parity final lock';\nvoid CLOSEFLOW_STAGE16D_TASKS_METRIC_TILE_FINAL_LOCK;");
  }
  const oldAttr = 'data-eliteflow-task-stat-grid="true" data-stage16a-metric-visual-parity="true"';
  const newAttr = 'data-eliteflow-task-stat-grid="true" data-stage16a-metric-visual-parity="true" data-stage16d-task-metric-final-lock="true"';
  if (!text.includes('data-stage16d-task-metric-final-lock="true"')) {
    text = text.replace(oldAttr, newAttr);
  }
  write(rel, text);
}

patchIndexCss();
patchTasks();
console.log('STAGE16D_SOURCE_PATCH_OK');
