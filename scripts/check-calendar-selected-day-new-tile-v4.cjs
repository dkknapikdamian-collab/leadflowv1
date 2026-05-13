const fs = require('fs');
const path = require('path');

const root = process.cwd();
const calendar = fs.readFileSync(path.join(root, 'src', 'pages', 'Calendar.tsx'), 'utf8');
const cssPath = path.join(root, 'src', 'styles', 'closeflow-calendar-selected-day-new-tile-v4.css');
const css = fs.readFileSync(cssPath, 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(calendar.includes('data-cf-calendar-selected-day-new-tile-v4="true"'), 'Calendar must render the new selected-day V4 tile');
assert(calendar.includes("import '../styles/closeflow-calendar-selected-day-new-tile-v4.css';"), 'Calendar must import selected-day V4 CSS');
assert(!calendar.includes('data-cf-calendar-selected-day="true"'), 'Legacy selected-day data attr must not stay in Calendar.tsx');
assert(!calendar.includes("import '../styles/closeflow-calendar-selected-day-agenda-actions-v2.css';"), 'Old V2 selected-day agenda CSS import must be removed');
assert(calendar.includes('<ScheduleEntryCard'), 'Selected-day tile must use ScheduleEntryCard for real actions');
assert(calendar.includes('onEdit={openEditDialog}') || calendar.includes('onEdit={handleEditEntry}') || calendar.includes('onEdit='), 'Selected-day entries must expose edit action wiring');
assert(calendar.includes('onDelete={handleDeleteEntry}') || calendar.includes('onDelete='), 'Selected-day entries must expose delete action wiring');
assert(css.includes('[data-cf-calendar-selected-day-new-tile-v4="true"]'), 'V4 CSS must be scoped to new tile marker');
assert(css.includes('calendar-entry-card'), 'V4 CSS must style entry cards inside the new tile');

console.log('OK: selected-day new tile v4 guard passed');
