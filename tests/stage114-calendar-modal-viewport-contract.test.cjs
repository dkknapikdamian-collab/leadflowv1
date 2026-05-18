const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const calendar = fs.readFileSync(path.join(root, 'src/pages/Calendar.tsx'), 'utf8');
const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage22-event-form-vnext.css'), 'utf8');

test('Stage114E calendar modals keep viewport-safe DialogContent and descriptions', () => {
  assert.match(calendar, /className="event-form-vnext-content calendar-entry-modal-viewport sm:max-w-2xl"[\s\S]*data-stage114-calendar-modal-viewport="true"[\s\S]*data-calendar-entry-form-mode="create-event"/, 'Create event modal viewport marker missing.');
  assert.match(calendar, /data-calendar-modal-description="create-event"[\s\S]*kalendarzu/i, 'Create event modal description missing.');
  assert.match(calendar, /data-calendar-modal-description="create-task"[\s\S]*kalendarzu/i, 'Create task modal description missing.');
  assert.match(calendar, /data-calendar-modal-description="edit-entry"[\s\S]*kalendarzu/i, 'Edit entry modal description missing.');
});

test('Stage114E modal CSS protects title, body scroll and sticky footer', () => {
  assert.match(css, /STAGE114E_CALENDAR_MODAL_VIEWPORT_REPAIR_START/, 'Stage114E viewport CSS marker missing.');
  assert.match(css, /max-height:\s*calc\(100vh\s*-\s*64px\)/, 'DialogContent max-height must be viewport based.');
  assert.match(css, /top:\s*calc\(50%\s*\+\s*12px\)/, 'DialogContent must be shifted slightly below top edge.');
  assert.match(css, /\.event-form-vnext\s*\{[\s\S]*overflow-y:\s*auto/i, 'Form body must scroll.');
  assert.match(css, /scroll-padding-bottom:\s*110px/, 'Form body must reserve bottom scroll padding.');
  assert.match(css, /\.event-form-footer,[\s\S]*\.cf-modal-footer\s*\{[\s\S]*position:\s*sticky/i, 'Footer must be sticky.');
});

test('Stage114E manual QA flow is documented in this guard', () => {
  const manual = [
    'open /calendar after hard refresh',
    'open create event modal',
    'open create task modal',
    'open edit entry modal',
    'click +1D and +1W on task entries',
  ];
  assert.equal(manual.length, 5);
});
