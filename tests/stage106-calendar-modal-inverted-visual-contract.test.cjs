const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const css = read('src/styles/closeflow-event-form.css');
const taskCreate = read('src/components/TaskCreateDialog.tsx');
const calendar = read('src/pages/Calendar.tsx');
const quietGate = read('scripts/closeflow-release-check-quiet.cjs');

const block = css;

assert.ok(
  taskCreate.includes('data-calendar-entry-form-mode="quick-task"') &&
    taskCreate.includes('data-task-create-dialog-stage105="event-form-vnext"'),
  'Global quick task modal must stay on event-form-vnext source.'
);

assert.ok(
  calendar.includes('data-calendar-entry-form-mode="create-event"') &&
    calendar.includes('data-calendar-entry-form-mode="create-task"') &&
    calendar.includes("data-calendar-entry-form-mode={editEntry?.kind === 'event' ? 'edit-event' : 'edit-task'}"),
  'Calendar create/edit modals must stay on shared event-form-vnext source.'
);

assert.ok(
  block.includes('html[data-skin] body .event-form-vnext-content[data-calendar-entry-form-source="event-form-vnext"] input') ||
    block.includes('.event-form-vnext-content[data-calendar-entry-form-source="event-form-vnext"] input'),
  'Current form owner must include a source-scoped input override for calendar entry modals.'
);

assert.ok(
  block.includes('.event-form-vnext-content[data-task-create-dialog-layout="true"] input'),
  'Current form owner must include a layout-scoped input override for quick task modal.'
);

assert.ok(
  block.includes('background: rgba(255, 255, 255, 0.98)') || block.includes('background: #ffffff'),
  'Current form owner must provide a light integrated modal shell.'
);

assert.ok(
  block.includes('background: #ffffff') &&
    block.includes('color: #111827') &&
    block.includes('-webkit-text-fill-color: #111827'),
  'Current form owner must keep white form fields with dark readable text.'
);

assert.ok(
  block.includes('border-color: #93c5fd') &&
    block.includes('rgba(37, 99, 235, 0.12)'),
  'Current form owner must use blue focus, not green focus.'
);

assert.equal(
  /(border-green|ring-green|emerald|#22c55e|#16a34a)/i.test(block),
  false,
  'Stage106 modal visual block must not contain green focus tokens.'
);

assert.ok(
  quietGate.includes('tests/stage106-calendar-modal-inverted-visual-contract.test.cjs'),
  'Quiet release gate must include Stage106 modal inverted visual guard.'
);
