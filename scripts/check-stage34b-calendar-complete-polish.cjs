const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function expect(rel, text, label = text) {
  const body = read(rel);
  if (!body.includes(text)) {
    throw new Error(`${rel}: missing ${label}`);
  }
  console.log(`OK: ${rel} contains ${label}`);
}

expect('src/index.css', 'stage34b-calendar-complete-polish.css', 'Stage34B CSS import');
expect('src/styles/stage34b-calendar-complete-polish.css', 'STAGE34B_CALENDAR_COMPLETE_POLISH', 'Stage34B CSS marker');
expect('src/styles/stage34b-calendar-complete-polish.css', 'white-space: normal !important', 'month entry text wrap');
expect('src/styles/stage34b-calendar-complete-polish.css', 'calendar-month-entry-completed', 'month completed entry styling');
expect('src/styles/stage34b-calendar-complete-polish.css', 'background-color: #ffffff !important', 'dialog form light fields');
expect('src/styles/stage34b-calendar-complete-polish.css', 'max-height: calc(100dvh - 20px)', 'mobile modal height guard');

expect('src/lib/calendar-items.ts', 'STAGE34B_CALENDAR_TASK_DATE_FALLBACKS', 'robust task date fallback marker');
expect('src/lib/calendar-items.ts', 'STAGE34B_CALENDAR_EVENT_DATE_FALLBACKS', 'robust event date fallback marker');
expect('src/lib/calendar-items.ts', 'STAGE34B_CALENDAR_BUNDLE_LEADS', 'calendar bundle lead marker');
expect('src/lib/calendar-items.ts', 'fetchLeadsFromSupabase', 'lead fetch in calendar bundle');
expect('src/lib/calendar-items.ts', 'nextActionAt', 'task/lead nextActionAt support');
expect('src/lib/calendar-items.ts', 'followUpAt', 'task/lead followUpAt support');
expect('src/lib/calendar-items.ts', 'leads: leadItems as Record<string, unknown>[]', 'lead rows returned to calendar');

expect('src/lib/scheduling.ts', 'STAGE34B_CALENDAR_LEAD_NEXT_ACTIONS', 'lead next-action schedule entries marker');
expect('src/lib/scheduling.ts', "kind: 'lead' as const", 'lead schedule entries are emitted');
expect('src/lib/scheduling.ts', 'nextActionDate', 'lead nextActionDate support');
expect('src/lib/scheduling.ts', 'followUpDate', 'lead followUpDate support');

expect('src/pages/Calendar.tsx', 'STAGE34B_CALENDAR_COMPLETED_VISIBILITY', 'completed visibility marker');
expect('src/pages/Calendar.tsx', 'calendar-entry-completed', 'completed class in calendar list');
expect('src/pages/Calendar.tsx', 'calendar-month-entry-completed', 'completed class in month entries');
expect('src/pages/Calendar.tsx', 'data-calendar-stage34b="complete-polish"', 'Calendar Stage34B marker');

console.log('stage34b-calendar-complete-polish: PASS');
