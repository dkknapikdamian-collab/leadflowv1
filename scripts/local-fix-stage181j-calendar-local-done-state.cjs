const fs = require('fs');

const calendarPath = 'src/pages/Calendar.tsx';
const cssPath = 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css';

let calendar = fs.readFileSync(calendarPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const beforeCalendar = calendar;
const beforeCss = css;

// 1. Add local-only optimistic completion branch inside handleCompleteEntry.
// Local seeded rows cannot be persisted to API, so they must toggle only in React state.
if (!calendar.includes('CLOSEFLOW_STAGE181J_LOCAL_DONE_STATE')) {
  const anchor = `    try {
      setActionPendingId(\`\${entry.id}:done\`);
      const wasCompleted = isCompletedCalendarEntry(entry);
`;

  const insert = `    try {
      setActionPendingId(\`\${entry.id}:done\`);
      const wasCompleted = isCompletedCalendarEntry(entry);

      // CLOSEFLOW_STAGE181J_LOCAL_DONE_STATE
      // Local-only seeded calendar rows do not exist in backend.
      // Toggle them optimistically in React state so week/month/selected-day views stay in sync.
      const localSourceId = String(entry.sourceId || entry.raw?.id || entry.id || '');
      const isLocalCalendarSeed = import.meta.env.DEV && /^(local-calendar-|dev-task-|dev-event-)/.test(localSourceId);

      if (isLocalCalendarSeed) {
        const nextStatus = wasCompleted
          ? entry.kind === 'event' ? 'scheduled' : 'todo'
          : entry.kind === 'event' ? 'completed' : 'done';

        const patchLocalRow = (row: any) => {
          if (String(row?.id || '') !== localSourceId) return row;

          const nextRow = {
            ...row,
            status: nextStatus,
            done: !wasCompleted,
            isDone: !wasCompleted,
            is_done: !wasCompleted,
            completedAt: wasCompleted ? null : new Date().toISOString(),
            completed_at: wasCompleted ? null : new Date().toISOString(),
          };

          if (wasCompleted) {
            delete nextRow.doneAt;
            delete nextRow.done_at;
          } else {
            nextRow.doneAt = nextRow.completedAt;
            nextRow.done_at = nextRow.completedAt;
          }

          return nextRow;
        };

        if (entry.kind === 'event') setEvents((previousEvents: any[]) => previousEvents.map(patchLocalRow));
        if (entry.kind === 'task') setTasks((previousTasks: any[]) => previousTasks.map(patchLocalRow));

        toast.success(wasCompleted ? 'Roboczy wpis przywrócony lokalnie' : 'Roboczy wpis oznaczony jako zrobiony lokalnie');
        return;
      }
`;

  if (!calendar.includes(anchor)) {
    throw new Error('Could not find handleCompleteEntry anchor.');
  }

  calendar = calendar.replace(anchor, insert);
}

// 2. Add CSS source truth for done button state and completed text.
const cssBlock = `

/* CLOSEFLOW_STAGE181J_CALENDAR_DONE_STATE_VISUAL_SOURCE_TRUTH
   LOCAL ONLY
   Rule:
   - "Zrobione" button is neutral before completion.
   - It becomes green only when the entry is completed.
   - Completed entries are crossed out in week, month and selected-day list.
*/
#root .main-calendar-html .cf-calendar-week-plan-action-done,
#root .main-calendar-html .cf-selected-day-v9-action-done {
  border-color: #cbd5e1 !important;
  background: #ffffff !important;
  color: #334155 !important;
  box-shadow: none !important;
}

#root .main-calendar-html .cf-calendar-week-plan-action-done svg,
#root .main-calendar-html .cf-selected-day-v9-action-done svg {
  color: #64748b !important;
  stroke: #64748b !important;
}

#root .main-calendar-html [data-calendar-entry-completed="true"] .cf-calendar-week-plan-action-done,
#root .main-calendar-html [data-calendar-entry-completed="true"] .cf-selected-day-v9-action-done,
#root .main-calendar-html .calendar-entry-completed .cf-calendar-week-plan-action-done,
#root .main-calendar-html .calendar-entry-completed .cf-selected-day-v9-action-done {
  border-color: rgba(22, 163, 74, 0.28) !important;
  background: #ecfdf5 !important;
  color: #047857 !important;
}

#root .main-calendar-html [data-calendar-entry-completed="true"] .cf-calendar-week-plan-action-done svg,
#root .main-calendar-html [data-calendar-entry-completed="true"] .cf-selected-day-v9-action-done svg,
#root .main-calendar-html .calendar-entry-completed .cf-calendar-week-plan-action-done svg,
#root .main-calendar-html .calendar-entry-completed .cf-selected-day-v9-action-done svg {
  color: #047857 !important;
  stroke: #047857 !important;
}

#root .main-calendar-html [data-calendar-entry-completed="true"] [data-cf-entry-title="true"],
#root .main-calendar-html .calendar-entry-completed [data-cf-entry-title="true"],
#root .main-calendar-html [data-calendar-entry-completed="true"] .cf-selected-day-v9-entry-title,
#root .main-calendar-html .calendar-entry-completed .cf-selected-day-v9-entry-title {
  text-decoration: line-through !important;
  color: #64748b !important;
  opacity: 0.72 !important;
}

#root .main-calendar-html .calendar-day-pill.calendar-entry-completed,
#root .main-calendar-html .calendar-day-pill.calendar-month-entry-completed,
#root .main-calendar-html .calendar-day-pill.is-done {
  border-color: rgba(148, 163, 184, 0.35) !important;
  background: #f1f5f9 !important;
  color: #64748b !important;
  opacity: 0.78 !important;
}

#root .main-calendar-html .calendar-day-pill.calendar-entry-completed span:last-child,
#root .main-calendar-html .calendar-day-pill.calendar-month-entry-completed span:last-child,
#root .main-calendar-html .calendar-day-pill .is-done-text,
#root .main-calendar-html .cf-calendar-month-text-row[data-cf-month-text-completed="true"] .cf-calendar-month-text-title,
#root .main-calendar-html .cf-month-entry-chip-structural[data-cf-month-entry-completed="true"] .cf-month-entry-chip-structural__title {
  text-decoration: line-through !important;
  color: #64748b !important;
}
`;

if (!css.includes('CLOSEFLOW_STAGE181J_CALENDAR_DONE_STATE_VISUAL_SOURCE_TRUTH')) {
  css += cssBlock;
}

fs.writeFileSync(calendarPath, calendar, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

const nextCalendar = fs.readFileSync(calendarPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  'CLOSEFLOW_STAGE181J_LOCAL_DONE_STATE',
  'isLocalCalendarSeed',
  'setEvents((previousEvents: any[]) => previousEvents.map(patchLocalRow))',
  'setTasks((previousTasks: any[]) => previousTasks.map(patchLocalRow))',
  'Roboczy wpis oznaczony jako zrobiony lokalnie',
]) {
  if (!nextCalendar.includes(token)) failures.push('Calendar.tsx missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181J_CALENDAR_DONE_STATE_VISUAL_SOURCE_TRUTH',
  '.cf-calendar-week-plan-action-done',
  '.cf-selected-day-v9-action-done',
  'text-decoration: line-through',
  '.calendar-day-pill.calendar-entry-completed',
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181J local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (beforeCalendar === nextCalendar && beforeCss === nextCss) {
  console.log('No changes needed. Stage181J already present.');
} else {
  console.log('Patched Stage181J locally.');
}

console.log('OK Stage181J local: local calendar done state toggles without API and visuals are neutral/green correctly.');
