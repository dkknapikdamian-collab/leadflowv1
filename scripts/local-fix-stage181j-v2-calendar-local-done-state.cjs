const fs = require('fs');

const calendarPath = 'src/pages/Calendar.tsx';
const cssPath = 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css';

let calendar = fs.readFileSync(calendarPath, 'utf8');
let css = fs.readFileSync(cssPath, 'utf8');

const beforeCalendar = calendar;
const beforeCss = css;

if (!calendar.includes('CLOSEFLOW_STAGE181J_V2_LOCAL_DONE_STATE')) {
  const marker = 'const wasCompleted = isCompletedCalendarEntry(entry);';
  const index = calendar.indexOf(marker);

  if (index === -1) {
    throw new Error('Could not find wasCompleted marker in handleCompleteEntry.');
  }

  const insertAt = index + marker.length;

  const localBranch = `

      // CLOSEFLOW_STAGE181J_V2_LOCAL_DONE_STATE
      // Robocze wpisy local/dev nie istnieją w backendzie, więc kliknięcie "Zrobione"
      // ma działać lokalnie bez updateTaskInSupabase/updateEventInSupabase.
      const localSourceId = String(entry.sourceId || entry.raw?.id || entry.id || '');
      const isLocalCalendarSeed = import.meta.env.DEV && /^(local-calendar-|dev-task-|dev-event-)/.test(localSourceId);

      if (isLocalCalendarSeed) {
        const completedAt = new Date().toISOString();
        const nextStatus = wasCompleted
          ? entry.kind === 'event' ? 'scheduled' : 'todo'
          : entry.kind === 'event' ? 'completed' : 'done';

        const patchLocalRow = (row: any) => {
          if (String(row?.id || '') !== localSourceId) return row;

          const nextRow: any = {
            ...row,
            status: nextStatus,
            done: !wasCompleted,
            isDone: !wasCompleted,
            is_done: !wasCompleted,
            completedAt: wasCompleted ? null : completedAt,
            completed_at: wasCompleted ? null : completedAt,
            doneAt: wasCompleted ? null : completedAt,
            done_at: wasCompleted ? null : completedAt,
          };

          return nextRow;
        };

        if (entry.kind === 'event') {
          setEvents((previousEvents: any[]) => previousEvents.map(patchLocalRow));
        }

        if (entry.kind === 'task') {
          setTasks((previousTasks: any[]) => previousTasks.map(patchLocalRow));
        }

        toast.success(wasCompleted ? 'Roboczy wpis przywrócony lokalnie' : 'Roboczy wpis oznaczony jako zrobiony lokalnie');
        return;
      }`;

  calendar = calendar.slice(0, insertAt) + localBranch + calendar.slice(insertAt);
}

const cssBlock = `

/* CLOSEFLOW_STAGE181J_V2_CALENDAR_DONE_STATE_VISUAL_SOURCE_TRUTH
   LOCAL ONLY
   Rule:
   - "Zrobione" button is neutral before completion.
   - It becomes green only after completion.
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

if (!css.includes('CLOSEFLOW_STAGE181J_V2_CALENDAR_DONE_STATE_VISUAL_SOURCE_TRUTH')) {
  css += cssBlock;
}

fs.writeFileSync(calendarPath, calendar, 'utf8');
fs.writeFileSync(cssPath, css, 'utf8');

const nextCalendar = fs.readFileSync(calendarPath, 'utf8');
const nextCss = fs.readFileSync(cssPath, 'utf8');

const failures = [];

for (const token of [
  'CLOSEFLOW_STAGE181J_V2_LOCAL_DONE_STATE',
  'isLocalCalendarSeed',
  'setEvents((previousEvents: any[]) => previousEvents.map(patchLocalRow))',
  'setTasks((previousTasks: any[]) => previousTasks.map(patchLocalRow))',
  'Roboczy wpis oznaczony jako zrobiony lokalnie',
]) {
  if (!nextCalendar.includes(token)) failures.push('Calendar.tsx missing token: ' + token);
}

for (const token of [
  'CLOSEFLOW_STAGE181J_V2_CALENDAR_DONE_STATE_VISUAL_SOURCE_TRUTH',
  '.cf-calendar-week-plan-action-done',
  '.cf-selected-day-v9-action-done',
  'text-decoration: line-through',
  '.calendar-day-pill.calendar-entry-completed',
]) {
  if (!nextCss.includes(token)) failures.push('CSS missing token: ' + token);
}

if (failures.length) {
  console.error('Stage181J v2 local guard failed:');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

if (beforeCalendar === nextCalendar && beforeCss === nextCss) {
  console.log('No changes needed. Stage181J v2 already present.');
} else {
  console.log('Patched Stage181J v2 locally.');
}

console.log('OK Stage181J v2 local: local calendar done state toggles without API and visuals are neutral/green correctly.');
