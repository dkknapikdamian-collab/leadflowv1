const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const taskCreate = read('src/components/TaskCreateDialog.tsx');
const calendar = read('src/pages/Calendar.tsx');
const cases = read('src/pages/Cases.tsx');
const css = read('src/styles/visual-stage22-event-form-vnext.css');
const trashCss = read('src/styles/context-action-button-source-truth.css');
const coreCss = read('src/styles/core/core-contracts.css');
const quietGate = read('scripts/closeflow-release-check-quiet.cjs');

function blockBetween(text, start, end) {
  const startIndex = text.indexOf(start);
  assert.notEqual(startIndex, -1, 'Missing block start: ' + start);
  const endIndex = text.indexOf(end, startIndex);
  assert.notEqual(endIndex, -1, 'Missing block end: ' + end);
  return text.slice(startIndex, endIndex + end.length);
}

const stage105Css = blockBetween(css, 'STAGE105_CALENDAR_MODAL_NO_DARK_INPUTS_START', 'STAGE105_CALENDAR_MODAL_NO_DARK_INPUTS_END');
const stage105TrashCss = blockBetween(trashCss, 'STAGE105_CASE_DELETE_NO_RED_PLAQUE_START', 'STAGE105_CASE_DELETE_NO_RED_PLAQUE_END');

assert.ok(taskCreate.includes("import '../styles/visual-stage22-event-form-vnext.css';"), 'Quick task dialog must import shared event form visual source.');
assert.ok(taskCreate.includes("import { modalFooterClass } from './entity-actions';"), 'Quick task dialog must use modalFooterClass source.');
assert.ok(taskCreate.includes("TASK_CREATE_DIALOG_STAGE105_FORM_SOURCE = 'event-form-vnext'"), 'Quick task dialog must define Stage105 source constant once.');
assert.equal((taskCreate.match(/TASK_CREATE_DIALOG_STAGE105_FORM_SOURCE = 'event-form-vnext'/g) || []).length, 1, 'Quick task source constant must be declared exactly once.');
assert.ok(taskCreate.includes('className="event-form-vnext-content sm:max-w-2xl"'), 'Quick task dialog must use event-form-vnext content surface.');
assert.ok(taskCreate.includes('data-calendar-entry-form-mode="quick-task"'), 'Quick task dialog must expose quick-task form mode.');
assert.ok(taskCreate.includes('className="event-form-vnext"'), 'Quick task form must use event-form-vnext body class.');
assert.ok(taskCreate.includes('className="event-form-select"'), 'Quick task selects must use shared event-form-select.');
assert.ok(taskCreate.includes('className={taskCreateDialogFooterClass}'), 'Quick task footer must use modalFooterClass.');
assert.equal(taskCreate.includes('className="max-w-xl"'), false, 'Quick task dialog must not use legacy max-w-xl content class.');
assert.equal(taskCreate.includes('className="space-y-4"'), false, 'Quick task form must not use local legacy spacing as primary form source.');
assert.equal(taskCreate.includes('h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm'), false, 'Quick task selects must not use local legacy select classes.');

const calendarSourceCount = (calendar.match(/data-calendar-entry-form-source="event-form-vnext"/g) || []).length;
assert.ok(calendarSourceCount >= 3, 'Calendar create event, create task and edit entry must keep event-form-vnext source.');
assert.ok(calendar.includes('data-calendar-entry-form-mode="create-event"'), 'Calendar create event mode must stay visible.');
assert.ok(calendar.includes('data-calendar-entry-form-mode="create-task"'), 'Calendar create task mode must stay visible.');
assert.ok(calendar.includes("data-calendar-entry-form-mode={editEntry?.kind === 'event' ? 'edit-event' : 'edit-task'}"), 'Calendar edit modal must keep shared edit mode.');

assert.ok(stage105Css.includes('background: #ffffff !important;'), 'Stage105 modal visual block must force white inputs.');
assert.ok(stage105Css.includes('color: #111827 !important;'), 'Stage105 modal visual block must force dark text.');
assert.ok(stage105Css.includes('border-color: #93c5fd !important;'), 'Stage105 modal visual block must use blue focus border.');
assert.ok(stage105Css.includes('rgba(37, 99, 235, 0.12)'), 'Stage105 modal visual block must use blue focus ring.');
assert.ok(stage105Css.includes('background: rgba(255, 255, 255, 0.96) !important;'), 'Stage105 modal visual block must keep footer light.');
for (const forbidden of ['bg-slate-900', 'bg-black', 'background: #0f172a', 'background: rgb(15, 23, 42)', '#22c55e', '#16a34a', 'emerald']) {
  assert.equal(stage105Css.toLowerCase().includes(forbidden.toLowerCase()), false, 'Stage105 modal visual block must not contain forbidden dark/green token: ' + forbidden);
}

assert.equal(cases.includes('className="btn ghost cf-case-row-delete-text-action"'), false, 'Visible case delete action must not combine trash source with btn ghost red plaque style.');
assert.equal(cases.includes('data-cf-header-action="danger"'), false, 'Visible case delete action must not use header danger plaque token.');
assert.ok(cases.includes('className="cf-case-row-delete-text-action"'), 'Visible case delete action must keep a dedicated subtle class.');
assert.ok(stage105TrashCss.includes('background: var(--cf-trash-bg) !important;'), 'Stage105 case delete block must keep white trash background.');
assert.ok(stage105TrashCss.includes('border: 1px solid var(--cf-trash-border-color) !important;'), 'Stage105 case delete block must keep subtle red border.');
assert.equal(stage105TrashCss.includes('background: #dc2626'), false, 'Stage105 case delete block must not use solid red background.');
assert.ok(coreCss.includes("@import '../context-action-button-source-truth.css';"), 'Core CSS must import context action/trash source truth.');
assert.ok(quietGate.includes('tests/stage105-calendar-modal-no-dark-inputs.test.cjs'), 'Quiet release gate must include Stage105 guard.');

console.log('OK Stage105 modal visual and case delete contract');
