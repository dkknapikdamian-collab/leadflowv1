const fs = require('fs');

const tasksPath = 'src/pages/TasksStable.tsx';
const cssPath = 'src/styles/closeflow-tasks-right-rail-grouped-list-source-truth-stage178.css';

let tasks = fs.readFileSync(tasksPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const beforeTasks = tasks;
const beforeCss = css;

// Add explicit data tooltip attribute to urgent task buttons.
// Handles both original markup and previous Stage181F multiline markup.
if (!tasks.includes('data-stage181g-urgent-custom-tooltip="true"')) {
  if (tasks.includes('data-stage181f-urgent-title-tooltip="true"')) {
    tasks = tasks.replace(
      'data-stage181f-urgent-title-tooltip="true"',
      'data-stage181f-urgent-title-tooltip="true"\n                      data-stage181g-urgent-custom-tooltip="true"\n                      data-cf-tooltip={getTaskTitle(task) + \' - \' + formatTaskMoment(task)}'
    );
  } else {
    const oldButton = `<button key={String(task.id || getTaskTitle(task))} type="button" className="tasks-stage178-urgent-button" onClick={() => { setScope(isTaskDone(task) ? 'done' : 'active'); setSearchQuery(getTaskTitle(task)); }}>`;

    const newButton = `<button
                      key={String(task.id || getTaskTitle(task))}
                      type="button"
                      className="tasks-stage178-urgent-button"
                      title={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      aria-label={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      data-stage181g-urgent-custom-tooltip="true"
                      data-cf-tooltip={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}
                      onClick={() => { setScope(isTaskDone(task) ? 'done' : 'active'); setSearchQuery(getTaskTitle(task)); }}
                    >`;

    if (!tasks.includes(oldButton)) {
      throw new Error('Could not find urgent task button markup to patch.');
    }

    tasks = tasks.replace(oldButton, newButton);
  }
}

if (!tasks.includes('className="tasks-stage178-urgent-title" title={getTaskTitle(task)}')) {
  tasks = tasks.replace(
    `<span className="tasks-stage178-urgent-title">{getTaskTitle(task)}</span>`,
    `<span className="tasks-stage178-urgent-title" title={getTaskTitle(task)}>{getTaskTitle(task)}</span>`
  );
}

const cssBlock = `

/* CLOSEFLOW_STAGE181G_TASKS_CUSTOM_URGENT_TOOLTIP
   LOCAL ONLY
   Native browser title tooltip was not visible enough in /tasks right rail.
   This adds an explicit CSS tooltip on hover/focus for Najpilniejsze zadania.
*/
#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-list {
  overflow: visible !important;
}

#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-rail-card[data-stage178-tasks-urgent-card="true"] {
  overflow: visible !important;
}

#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"] {
  position: relative !important;
  overflow: visible !important;
  z-index: 1 !important;
}

#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]:hover,
#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]:focus-visible {
  z-index: 20 !important;
}

#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]::after {
  content: attr(data-cf-tooltip);
  position: absolute !important;
  left: 0 !important;
  right: 0 !important;
  bottom: calc(100% + 8px) !important;
  display: none !important;
  width: max-content !important;
  max-width: min(360px, 92vw) !important;
  padding: 9px 11px !important;
  border-radius: 12px !important;
  border: 1px solid rgba(15, 23, 42, 0.12) !important;
  background: #0f172a !important;
  color: #ffffff !important;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.22) !important;
  font-size: 12px !important;
  font-weight: 800 !important;
  line-height: 1.35 !important;
  white-space: normal !important;
  text-align: left !important;
  pointer-events: none !important;
}

#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]::before {
  content: "";
  position: absolute !important;
  left: 22px !important;
  bottom: calc(100% + 3px) !important;
  display: none !important;
  width: 10px !important;
  height: 10px !important;
  background: #0f172a !important;
  transform: rotate(45deg) !important;
  pointer-events: none !important;
}

#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]:hover::after,
#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]:hover::before,
#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]:focus-visible::after,
#root [data-stage178-tasks-operational-panel="true"] .tasks-stage178-urgent-button[data-stage181g-urgent-custom-tooltip="true"]:focus-visible::before {
  display: block !important;
}
`;

if (!css.includes('CLOSEFLOW_STAGE181G_TASKS_CUSTOM_URGENT_TOOLTIP')) {
  css += cssBlock;
}

fs.writeFileSync(tasksPath, tasks, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

const nextTasks = fs.readFileSync(tasksPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  'data-stage181g-urgent-custom-tooltip="true"',
  "data-cf-tooltip={getTaskTitle(task) + ' - ' + formatTaskMoment(task)}",
  'className="tasks-stage178-urgent-title" title={getTaskTitle(task)}',
]) {
  if (!nextTasks.includes(token)) failures.push('TasksStable missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181G_TASKS_CUSTOM_URGENT_TOOLTIP',
  'content: attr(data-cf-tooltip)',
  ':hover::after',
  ':focus-visible::after',
  'overflow: visible',
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181G local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (beforeTasks === nextTasks && beforeCss === nextCss) {
  console.log('No changes needed. Stage181G already present.');
} else {
  console.log('Patched Stage181G locally.');
}

console.log('OK Stage181G local: custom urgent task tooltip is active.');
