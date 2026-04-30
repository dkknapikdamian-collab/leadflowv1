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

expect('src/index.css', "stage34-calendar-readability-status-forms.css", 'Stage34 CSS import');
expect('src/styles/stage34-calendar-readability-status-forms.css', 'STAGE34_CALENDAR_READABILITY_STATUS_FORMS', 'Stage34 CSS marker');
expect('src/styles/stage34-calendar-readability-status-forms.css', 'white-space: normal !important', 'month text wrapping');
expect('src/styles/stage34-calendar-readability-status-forms.css', 'data-calendar-entry-completed', 'completed entry CSS');
expect('src/styles/stage34-calendar-readability-status-forms.css', '[data-radix-dialog-content] input', 'dialog input contrast');
expect('src/styles/stage34-calendar-readability-status-forms.css', 'max-height: calc(100dvh - 24px)', 'mobile dialog height guard');

expect('src/lib/scheduling.ts', 'STAGE34_CALENDAR_LEAD_NEXT_ACTIONS', 'lead next action calendar marker');
expect('src/lib/scheduling.ts', 'nextActionAt', 'lead nextActionAt support');
expect('src/lib/scheduling.ts', "kind: 'lead' as const", 'lead schedule entries restored');

expect('src/lib/calendar-items.ts', 'STAGE34_CALENDAR_TASK_DATE_FALLBACKS', 'task date fallback marker');
expect('src/lib/calendar-items.ts', 'nextActionAt', 'task nextActionAt fallback');
expect('src/lib/calendar-items.ts', 'followUpAt', 'task followUpAt fallback');

expect('src/pages/Calendar.tsx', 'STAGE34_CALENDAR_COMPLETED_VISIBILITY', 'completed visibility marker');
expect('src/pages/Calendar.tsx', 'calendar-entry-completed', 'completed class on entry card');
expect('src/pages/Calendar.tsx', 'data-calendar-stage34="readability-status-forms"', 'Calendar route Stage34 marker');

console.log('stage34-calendar-readability-status-forms: PASS');
