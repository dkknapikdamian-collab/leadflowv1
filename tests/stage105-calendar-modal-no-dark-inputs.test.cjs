const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');

const taskCreate = read('src/components/TaskCreateDialog.tsx');
const calendar = read('src/pages/Calendar.tsx');
const cases = read('src/pages/Cases.tsx');
const css = read('src/styles/closeflow-event-form.css');
const trashCss = read('src/styles/owners/closeflow-actions.css');
const coreCss = read('src/styles/closeflow-visual-source-truth.css');
const quietGate = read('scripts/closeflow-release-check-quiet.cjs');

const stage105Css = css;
const stage105TrashCss = trashCss;

assert.ok(taskCreate.includes("import '../styles/closeflow-event-form.css';"), 'Quick task dialog must import shared event form visual source.');
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

assert.match(stage105Css, /\.event-form-vnext input,[\s\S]*?background:\s*#ffffff;[\s\S]*?color:\s*#111827;/, 'Stage105 modal visual source must keep white inputs and dark text.');
assert.ok(stage105Css.includes('border-color: #93c5fd;'), 'Stage105 modal visual source must use blue focus border.');
assert.ok(stage105Css.includes('rgba(37, 99, 235, 0.12)'), 'Stage105 modal visual block must use blue focus ring.');
assert.ok(stage105Css.includes('background: rgba(255, 255, 255, 0.96);'), 'Stage105 modal visual source must keep footer light.');
for (const forbidden of ['bg-slate-900', 'bg-black', 'background: #0f172a', 'background: rgb(15, 23, 42)', '#22c55e', '#16a34a', 'emerald']) {
  assert.equal(stage105Css.toLowerCase().includes(forbidden.toLowerCase()), false, 'Stage105 modal visual block must not contain forbidden dark/green token: ' + forbidden);
}

assert.equal(cases.includes('className="btn ghost cf-case-row-delete-text-action"'), false, 'Visible case delete action must not combine trash source with btn ghost red plaque style.');
assert.equal(cases.includes('data-cf-header-action="danger"'), false, 'Visible case delete action must not use header danger plaque token.');
assert.equal(cases.includes('cf-case-row-delete-text-action'), false, 'Visible case delete action must not use Stage220A28-forbidden legacy text class.');
assert.ok(cases.includes('data-case-row-delete-action="true"'), 'Visible case delete action must keep a dedicated action marker.');
assert.ok(cases.includes('data-cf-destructive-source="trash-action-source"'), 'Visible case delete action must use shared trash source.');
assert.ok(cases.includes('trashActionIconClass("h-4 w-4")'), 'Visible case delete action must keep shared subtle icon class.');
assert.match(stage105TrashCss, /LF-UI-SOT-007_OWNER[\s\S]*"ownerId":"semantic:actions"[\s\S]*"concerns":\["BUTTONS_ACTIONS"\][\s\S]*"role":"canonical-owner"/, 'Trash action CSS must remain in the registered semantic action owner.');
assert.ok(stage105TrashCss.includes('background: var(--cf-trash-icon-bg) !important;'), 'Stage105 case delete owner must keep a subtle trash background.');
assert.ok(stage105TrashCss.includes('border-color: var(--cf-trash-icon-border) !important;'), 'Stage105 case delete owner must keep a subtle red border.');
assert.equal(stage105TrashCss.includes('background: #dc2626'), false, 'Stage105 case delete owner must not use solid red background.');
assert.ok(coreCss.includes("@import './owners/closeflow-actions.css';"), 'Visual runtime entry must import the registered action owner.');
assert.ok(quietGate.includes('tests/stage105-calendar-modal-no-dark-inputs.test.cjs'), 'Quiet release gate must include Stage105 guard.');

console.log('OK Stage105 modal visual and case delete contract');
