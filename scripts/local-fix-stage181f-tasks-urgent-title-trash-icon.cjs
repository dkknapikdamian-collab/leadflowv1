const fs = require('fs');

const tasksPath = 'src/pages/TasksStable.tsx';
const cssPath = 'src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css';

let tasks = fs.readFileSync(tasksPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const beforeTasks = tasks;
const beforeCss = css;

// 1. Urgent list: add title + aria-label to the button and title attr to the text.
// This gives full browser tooltip on hover while keeping visible text ellipsized.
const urgentButtonOld = `<button key={String(task.id || getTaskTitle(task))} type="button" className="tasks-stage178-urgent-button" onClick={() => { setScope(isTaskDone(task) ? 'done' : 'active'); setSearchQuery(getTaskTitle(task)); }}>`;

const urgentButtonNew = `<button
                      key={String(task.id || getTaskTitle(task))}
                      type="button"
                      className="tasks-stage178-urgent-button"
                      title={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      aria-label={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      data-stage181f-urgent-title-tooltip="true"
                      onClick={() => { setScope(isTaskDone(task) ? 'done' : 'active'); setSearchQuery(getTaskTitle(task)); }}
                    >`;

if (tasks.includes(urgentButtonOld)) {
  tasks = tasks.replace(urgentButtonOld, urgentButtonNew);
} else if (!tasks.includes('data-stage181f-urgent-title-tooltip="true"')) {
  throw new Error('Could not find urgent task button markup to patch.');
}

const urgentTitleOld = `<span className="tasks-stage178-urgent-title">{getTaskTitle(task)}</span>`;
const urgentTitleNew = `<span className="tasks-stage178-urgent-title" title={getTaskTitle(task)}>{getTaskTitle(task)}</span>`;

if (tasks.includes(urgentTitleOld)) {
  tasks = tasks.replace(urgentTitleOld, urgentTitleNew);
} else if (!tasks.includes('className="tasks-stage178-urgent-title" title={getTaskTitle(task)}')) {
  throw new Error('Could not find urgent task title span to patch.');
}

// 2. Delete action: ensure title/aria and explicit source marker on the one-source-truth trash button.
const trashButtonOld = `<EntityTrashButton type="button" variant="outline" className="tasks-stage47-action-button tasks-stage48-task-action-button tasks-stage48-danger-action" data-task-action-visible-stage48="delete" onClick={() => void deleteTask(task)}>`;
const trashButtonNew = `<EntityTrashButton
                                type="button"
                                variant="outline"
                                className="tasks-stage47-action-button tasks-stage48-task-action-button tasks-stage48-danger-action"
                                title="Usuń zadanie"
                                aria-label="Usuń zadanie"
                                data-task-action-visible-stage48="delete"
                                data-stage181f-trash-source-truth="true"
                                onClick={() => void deleteTask(task)}
                              >`;

if (tasks.includes(trashButtonOld)) {
  tasks = tasks.replace(trashButtonOld, trashButtonNew);
} else if (!tasks.includes('data-stage181f-trash-source-truth="true"')) {
  throw new Error('Could not find task trash button markup to patch.');
}

const cssBlock = `

/* CLOSEFLOW_STAGE181F_TASKS_URGENT_TOOLTIP_TRASH_ICON_SOURCE_TRUTH
   LOCAL ONLY
   Scope: /tasks right rail and task row delete action.
   Fix:
   - urgent task title has title/tooltip contract in TSX;
   - visible urgent text stays ellipsized;
   - trash icon uses the shared cf-trash-action-icon source and is red, not purple.
*/
#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181f-urgent-title-tooltip="true"] {
  position: relative !important;
}

#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181f-urgent-title-tooltip="true"] .tasks-stage178-urgent-title {
  display: block !important;
  min-width: 0 !important;
  max-width: 100% !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
}

#root [data-stage178-tasks-operational-panel="true"] [data-stage181f-trash-source-truth="true"][data-cf-trash-action="true"] {
  color: #dc2626 !important;
  border-color: rgba(220, 38, 38, 0.20) !important;
  background: #ffffff !important;
}

#root [data-stage178-tasks-operational-panel="true"] [data-stage181f-trash-source-truth="true"][data-cf-trash-action="true"]:hover {
  color: #b91c1c !important;
  border-color: rgba(220, 38, 38, 0.34) !important;
  background: #fef2f2 !important;
}

#root [data-stage178-tasks-operational-panel="true"] [data-stage181f-trash-source-truth="true"][data-cf-trash-action="true"] .cf-trash-action-icon,
#root [data-stage178-tasks-operational-panel="true"] [data-stage181f-trash-source-truth="true"][data-cf-trash-action="true"] svg.cf-trash-action-icon,
#root [data-stage178-tasks-operational-panel="true"] [data-stage181f-trash-source-truth="true"][data-cf-trash-action="true"] .cf-trash-action-icon svg {
  color: #dc2626 !important;
  stroke: #dc2626 !important;
  -webkit-text-fill-color: #dc2626 !important;
}
`;

if (!css.includes('CLOSEFLOW_STAGE181F_TASKS_URGENT_TOOLTIP_TRASH_ICON_SOURCE_TRUTH')) {
  css += cssBlock;
}

fs.writeFileSync(tasksPath, tasks, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

const nextTasks = fs.readFileSync(tasksPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  'data-stage181f-urgent-title-tooltip="true"',
  'title={getTaskTitle(task) + \\' - \\' + formatTaskMoment(task)}',
  'aria-label={getTaskTitle(task) + \\' - \\' + formatTaskMoment(task)}',
  'className="tasks-stage178-urgent-title" title={getTaskTitle(task)}',
  'data-stage181f-trash-source-truth="true"',
  'title="Usuń zadanie"',
  'aria-label="Usuń zadanie"',
]) {
  if (!nextTasks.includes(token)) failures.push('TasksStable missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181F_TASKS_URGENT_TOOLTIP_TRASH_ICON_SOURCE_TRUTH',
  'data-stage181f-urgent-title-tooltip',
  'data-stage181f-trash-source-truth',
  '.cf-trash-action-icon',
  '#dc2626',
  'text-overflow: ellipsis',
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181F local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (beforeTasks === nextTasks && beforeCss === nextCss) {
  console.log('No changes needed. Stage181F already present.');
} else {
  console.log('Patched Stage181F locally.');
}

console.log('OK Stage181F local: urgent task hover tooltip and red trash icon source truth.');
