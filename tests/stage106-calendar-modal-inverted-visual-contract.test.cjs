const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const css = read('src/styles/visual-stage22-event-form-vnext.css');
const taskCreate = read('src/components/TaskCreateDialog.tsx');
const calendar = read('src/pages/Calendar.tsx');
const quietGate = read('scripts/closeflow-release-check-quiet.cjs');

function blockBetween(text, start, end) {
  const startIndex = text.indexOf(start);
  assert.notEqual(startIndex, -1, 'Missing block start: ' + start);
  const endIndex = text.indexOf(end, startIndex);
  assert.notEqual(endIndex, -1, 'Missing block end: ' + end);
  return text.slice(startIndex, endIndex + end.length);
}

const block = blockBetween(
  css,
  'STAGE106_MODAL_INVERTED_VISUAL_CONTRACT_START',
  'STAGE106_MODAL_INVERTED_VISUAL_CONTRACT_END'
);

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
    block.includes('html[data-skin] body .event-form-vnext-content[data-calendar-entry-form-source="event-form-vnext"] input:not'),
  'Stage106 block must include skin-scoped input override for calendar entry modals.'
);

assert.ok(
  block.includes('html[data-skin] body .event-form-vnext-content[data-task-create-dialog-stage45m="true"] input') ||
    block.includes('html[data-skin] body .event-form-vnext-content[data-task-create-dialog-stage45m="true"] input:not'),
  'Stage106 block must include skin-scoped input override for quick task modal.'
);

assert.ok(
  block.includes('background: #0f172a !important') ||
    block.includes('background: rgba(15, 23, 42, 0.98) !important'),
  'Stage106 block must provide a dark integrated modal shell/footer.'
);

assert.ok(
  block.includes('background: #ffffff !important') &&
    block.includes('background-color: #ffffff !important') &&
    block.includes('color: #111827 !important') &&
    block.includes('-webkit-text-fill-color: #111827 !important'),
  'Stage106 block must force white form fields with dark readable text.'
);

assert.ok(
  block.includes('border-color: #93c5fd !important') &&
    block.includes('rgba(37, 99, 235, 0.12)'),
  'Stage106 block must use blue focus, not green focus.'
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
