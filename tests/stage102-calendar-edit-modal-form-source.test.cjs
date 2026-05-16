const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const calendar = read('src/pages/Calendar.tsx');
const css = read('src/styles/visual-stage22-event-form-vnext.css');
const entityActions = read('src/components/entity-actions.tsx');
const quietGate = read('scripts/closeflow-release-check-quiet.cjs');

const sourceAttr = 'data-calendar-entry-form-source="event-form-vnext"';
const sourceAttrCount = (calendar.match(new RegExp(sourceAttr, 'g')) || []).length;

assert.ok(
  calendar.includes('CALENDAR_EDIT_MODAL_FORM_SOURCE_STAGE102'),
  'Calendar must contain Stage102 edit modal source marker.',
);

assert.ok(
  calendar.includes('modalFooterClass') && calendar.includes("calendarEntryModalFooterClass = modalFooterClass('event-form-footer')"),
  'Calendar must use shared modalFooterClass for calendar entry modal footers.',
);

assert.ok(
  entityActions.includes('export function modalFooterClass'),
  'entity-actions must remain the footer class source of truth.',
);

assert.ok(
  sourceAttrCount >= 3,
  'Create event, create task and edit entry forms must share data-calendar-entry-form-source="event-form-vnext".',
);

assert.ok(
  calendar.includes('data-calendar-entry-form-mode="create-event"'),
  'Create event modal must expose shared form mode.',
);

assert.ok(
  calendar.includes('data-calendar-entry-form-mode="create-task"'),
  'Create task modal must expose shared form mode.',
);

assert.ok(
  calendar.includes("data-calendar-entry-form-mode={editEntry?.kind === 'event' ? 'edit-event' : 'edit-task'}"),
  'Edit modal must expose edit-task/edit-event mode from the same shared source attribute.',
);

assert.ok(
  calendar.includes('className="event-form-vnext-content sm:max-w-2xl"'),
  'Calendar entry modals must use the vnext content surface without local dark overflow shell classes.',
);

assert.ok(
  !calendar.includes('className="event-form-footer"'),
  'Calendar entry modal footers must not use a raw event-form-footer class string.',
);

assert.ok(
  (calendar.match(/className=\{calendarEntryModalFooterClass\}/g) || []).length >= 3,
  'All calendar entry modal submit footers must use the shared calendarEntryModalFooterClass.',
);

assert.match(
  css,
  /\.event-form-vnext(?:,|\s)[\s\S]*?background:\s*#f9fafb;/,
  'Shared form body must keep a light neutral background.',
);

assert.match(
  css,
  /\.event-form-vnext input,[\s\S]*?background:\s*#ffffff\s*!important;[\s\S]*?color:\s*#111827\s*!important;/,
  'Inputs/selects inside shared calendar form must have white background and dark text.',
);

const footerBlock = css.match(/\.event-form-footer\s*\{[\s\S]*?\}/)?.[0] || '';
assert.ok(footerBlock, 'Shared event-form-footer CSS block must exist.');
assert.ok(!/#0f172a|#111827|rgb\(15,\s*23,\s*42\)|bg-slate-900|bg-black/i.test(footerBlock), 'Shared footer must not be a dark footer bar.');
assert.ok(/background:\s*rgba\(255,\s*255,\s*255/.test(footerBlock) || /background:\s*#fff/.test(footerBlock), 'Shared footer must stay light.');
assert.ok(/bottom:\s*0/.test(footerBlock), 'Shared footer must not use the old negative bottom offset.');

assert.ok(
  quietGate.includes('tests/stage102-calendar-edit-modal-form-source.test.cjs'),
  'Quiet release gate must include Stage102 calendar edit modal source guard.',
);
