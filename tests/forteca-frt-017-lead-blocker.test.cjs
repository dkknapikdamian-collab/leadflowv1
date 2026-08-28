const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const paths = Object.freeze({
  contract: '_project/contracts/forteca-clean/FRT-017_LEAD_ADD_BLOCKER.md',
  modal: 'src/components/detail/MissingItemQuickActionModal.tsx',
  contextActions: 'src/components/ContextActionDialogs.tsx',
  clientDetail: 'src/pages/ClientDetail.tsx',
  modalContract: 'src/lib/missing-items/stage227c2-missing-item-modal-contract.ts',
  dialogStyles: 'src/styles/owners/closeflow-dialogs.css',
});

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();

function sourceBetween(source, startAnchor, endAnchor) {
  const start = source.indexOf(startAnchor);
  assert.ok(start >= 0, 'missing source anchor: ' + startAnchor);
  const end = source.indexOf(endAnchor, start + startAnchor.length);
  assert.ok(end > start, 'missing source boundary: ' + endAnchor);
  return source.slice(start, end);
}

function assertIncludes(source, expected, owner) {
  assert.ok(source.includes(expected), owner + ' is missing: ' + expected);
}

function fortecaFrt017CssBlock(source) {
  const start = source.search(/\/\*\s*FRT-017\b/);
  assert.ok(start >= 0, 'FRT-017 must have a canonical CSS block');
  const rest = source.slice(start + 1);
  const nextStage = rest.search(/\n\/\*\s*(?:\*+\s*)?FRT-\d+\b/);
  assert.ok(nextStage >= 0, 'FRT-017 CSS block must end before the next stage block');
  return source.slice(start, start + 1 + nextStage);
}

test('FRT-017 pins the active contract, reference file and immutable visual source', () => {
  const contract = read(paths.contract);
  const referenceMatch = contract.match(/^REFERENCE_FILE:\s*(.+)$/m);

  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-017/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(contract, /TARGET_STATE: Lead Detail — add missing item\/blocker modal/);
  assert.match(contract, /BEHAVIOR_TO_PRESERVE: Existing case-item relation, workspace scope, status lifecycle, refresh and permission checks/);
  assert.ok(referenceMatch, 'FRT-017 must declare a reference file');

  const referencePath = path.join(root, referenceMatch[1].trim());
  assert.ok(fs.existsSync(referencePath), 'FRT-017 reference file must exist');
  assert.equal(
    sha256(referencePath),
    '773CB03ABC5251C6A050062A559E3C2F1FA37E2677A59D678E1306080FB20A60',
    'FRT-017 reference changed without an explicit source-of-truth update',
  );
});

test('FRT-017 wires the current modal markers, reference copy and VST component tokens', () => {
  const contract = read(paths.modalContract);
  const modal = read(paths.modal);

  for (const marker of [
    'data-forteca-frt-017-lead-blocker="true"',
    'data-forteca-frt-017-modal="true"',
    'data-forteca-frt-017-form="true"',
    'data-forteca-frt-017-context="true"',
    'data-cf-vst-dialog="true"',
    'className="cf-vst-overlay forteca-frt-017-overlay"',
    'className="cf-vst-dialog forteca-frt-017-dialog"',
    'className="cf-vst-dialog-close forteca-frt-017-close"',
    'className="forteca-frt-017-form"',
    'className="forteca-frt-017-footer"',
    'className="forteca-frt-017-secondary"',
    'className="forteca-frt-017-primary"',
  ]) {
    assertIncludes(modal, marker, 'FRT-017 modal marker/class wiring');
  }

  for (const copy of [
    'Brak',
    'Dodaj brak / blokadę',
    'Zarejestruj brakujące elementy lub blokady, które mogą wpływać na realizację projektu.',
    'Dodaj brak',
    'Anuluj',
    'Tytuł braku',
    'Kategoria',
    'Dokument',
    'Decyzja',
    'Kontakt',
    'Płatność',
    'Dane',
    'Inne',
    'Poziom pilności',
    'Wysoki',
    'Średni',
    'Niski',
    'Termin oczekiwany',
    'Odpowiedzialny',
    'Opis',
    'Czy blokuje start realizacji?',
    'Co blokuje?',
    'Czy wymaga decyzji klienta?',
    'Brak przypisania w bieżącym kontrakcie.',
    'Brak pola w bieżącym kontrakcie.',
     'Podaj więcej szczegółów — co jest potrzebne i dlaczego to blokuje postęp.',
    'Zamknij',
    'Zapisywanie...',
  ]) {
    assertIncludes(contract + modal, copy, 'FRT-017 reference copy');
  }

  for (const expression of [
    'MISSING_ITEM_MODAL_COPY.title',
    'MISSING_ITEM_MODAL_COPY.subtitle',
    'MISSING_ITEM_MODAL_COPY.submit',
    'MISSING_ITEM_MODAL_COPY.cancel',
    'MISSING_ITEM_MODAL_COPY.noteHelp',
    'MISSING_ITEM_MODAL_COPY.blocksProgressLabel',
    'MISSING_ITEM_MODAL_COPY.clientDecisionLabel',
    'MISSING_ITEM_MODAL_COPY.unsupportedResponsible',
    'MISSING_ITEM_MODAL_COPY.unsupportedClientDecision',
  ]) {
    assertIncludes(modal, expression, 'FRT-017 shared copy wiring');
  }

  assertIncludes(contract, 'MISSING_ITEM_QUICK_ACTION_LABEL', 'FRT-017 shared quick-action copy');
  assertIncludes(modal, 'STAGE227C2_MISSING_ITEM_MODAL_COMPONENT', 'FRT-017 component marker');
  assertIncludes(modal, 'STAGE232A_R4_MISSING_ITEM_MODAL_BLOCKER_FIELDS', 'FRT-017 blocker-field marker');
  assertIncludes(modal, 'MissingItemQuickActionModal exposes missingKind, priority, dueDate, blocksProgress and blockScope', 'FRT-017 blocker-field marker value');
  assertIncludes(modal, 'STAGE232A_R5_MISSING_ITEM_MODAL_VISUAL_SOURCE_TRUTH', 'FRT-017 visual source marker');
  assertIncludes(modal, 'FRT-017 MissingItemQuickActionModal uses the canonical Forteca calm-light dialog source of truth', 'FRT-017 visual source marker value');

  assert.match(modal, /aria-labelledby="forteca-frt-017-title"/);
  assert.match(modal, /aria-describedby="forteca-frt-017-description"/);
  assert.match(modal, /id="forteca-frt-017-title-input"[\s\S]{0,600}required/);
  assert.match(modal, /id="forteca-frt-017-category-input"[\s\S]{0,600}required/);
  assert.match(modal, /id="forteca-frt-017-priority-input"[\s\S]{0,600}required/);
  assert.match(modal, /id="forteca-frt-017-due-date-input"[\s\S]{0,600}required/);
  assert.match(modal, /id="forteca-frt-017-description-input"[\s\S]{0,600}required/);
  assert.match(modal, /type="date"/);
  assert.match(modal, /value=\{props\.priorityValue\}/);
  assert.match(modal, /value=\{props\.dueDateValue\}/);
  assert.match(modal, /props\.onPriorityChange\(event\.target\.value/);
  assert.match(modal, /props\.onDueDateChange\(event\.target\.value/);
});

test('FRT-017 validates required fields and normalizes draft whitespace at the shared contract boundary', () => {
  const contract = read(paths.modalContract);
  const titleValidator = sourceBetween(contract, 'export function validateMissingItemTitle', 'export function normalizeMissingItemPriority');
  const kindValidator = sourceBetween(contract, 'export function validateMissingItemKind', 'export function getMissingItemPersistenceTarget');
  const noteValidator = sourceBetween(contract, 'export function validateMissingItemNote', 'export function validateMissingItemDueDate');
  const dueDateValidator = sourceBetween(contract, 'export function validateMissingItemDueDate', 'export function buildMissingItemModalDraft');
  const draftBuilder = sourceBetween(contract, 'export function buildMissingItemModalDraft', 'export function getMissingItemModalFields');

  assertIncludes(contract, "return value.trim().replace(/\\s+/g, ' ');", 'title whitespace normalization');
  assert.match(titleValidator, /const title = normalizeMissingItemTitle\(value\);/);
  assert.match(titleValidator, /if \(!title\)/);
  assert.match(titleValidator, /MISSING_ITEM_MODAL_COPY\.requiredTitleMessage/);
  assert.match(titleValidator, /return \{ ok: true, title \};/);

  assert.match(kindValidator, /Object\.prototype\.hasOwnProperty\.call\(MISSING_ITEM_KIND_LABELS, normalized\)/);
  assert.match(kindValidator, /return \{ ok: true, missingKind: normalized as MissingItemKind \};/);
  assert.match(contract, /export type MissingItemPersistenceTarget = 'task_activity_missing_item';/);
  assert.match(contract, /return 'task_activity_missing_item';/);

  assert.match(noteValidator, /const note = String\(value \|\| ''\)\.trim\(\);/);
  assert.match(noteValidator, /if \(!note\)/);
  assert.match(noteValidator, /MISSING_ITEM_MODAL_COPY\.requiredNoteMessage/);
  assert.match(noteValidator, /return \{ ok: true, note \};/);

  assert.match(dueDateValidator, /const dueDate = String\(value \|\| ''\)\.trim\(\);/);
  assert.match(dueDateValidator, /if \(!\/\^\\d\{4\}-\\d\{2\}-\\d\{2\}\$\/\.test\(dueDate\)\)/);
  assert.match(dueDateValidator, /MISSING_ITEM_MODAL_COPY\.requiredDueDateMessage/);
  assert.match(dueDateValidator, /new Date\(Date\.UTC\(year, month - 1, day\)\)/);
  assert.match(dueDateValidator, /calendarDate\.getUTCFullYear\(\) !== year/);
  assert.match(dueDateValidator, /return \{ ok: true, dueDate \};/);

  for (const requiredCopy of [
    "requiredTitleMessage: 'Wpisz tytuł braku.'",
    "requiredNoteMessage: 'Dodaj opis braku lub blokady.'",
    "requiredDueDateMessage: 'Wybierz oczekiwany termin.'",
  ]) {
    assertIncludes(contract, requiredCopy, 'FRT-017 validation copy');
  }

  assert.match(draftBuilder, /const result = validateMissingItemTitle\(input\.title\);/);
  assert.match(draftBuilder, /const noteResult = validateMissingItemNote\(input\.note \|\| ''\);/);
  assert.match(draftBuilder, /const dueDateResult = validateMissingItemDueDate\(input\.dueDate \|\| ''\);/);
  assert.match(draftBuilder, /title: result\.title/);
  assert.match(draftBuilder, /note: noteResult\.note/);
  assert.match(draftBuilder, /blockScope: \(input\.blockScope \|\| ''\)\.trim\(\)/);
});

test('FRT-017 propagates priority and due date through the shared modal, ContextAction host and ClientDetail state', () => {
  const modal = read(paths.modal);
  const host = read(paths.contextActions);
  const clientDetail = read(paths.clientDetail);

  assert.match(modal, /priorityValue: MissingItemPriority(?: \| '')?;/);
  assert.match(modal, /dueDateValue: string;/);
  assert.match(modal, /onPriorityChange: \(value: MissingItemPriority(?: \| '')?\) => void;/);
  assert.match(modal, /onDueDateChange: \(value: string\) => void;/);

  for (const stateWiring of [
    "const [missingPriority, setMissingPriority] = useState<MissingItemPriority | ''>('');",
    "const [missingDueDate, setMissingDueDate] = useState('');",
    'priorityValue={missingPriority}',
    'dueDateValue={missingDueDate}',
    'onPriorityChange={setMissingPriority}',
    'onDueDateChange={(value) => { setMissingDueDate(value);',
    'priority: missingPriority',
    'dueDate: missingDueDate',
  ]) {
    assertIncludes(host, stateWiring, 'ContextAction priority/due-date propagation');
  }

  for (const stateWiring of [
    "const [clientMissingPriority, setClientMissingPriority] = useState<MissingItemPriority | ''>('');",
    "const [clientMissingDueDate, setClientMissingDueDate] = useState('');",
    'priorityValue={clientMissingPriority}',
    'dueDateValue={clientMissingDueDate}',
    'onPriorityChange={setClientMissingPriority}',
    'setClientMissingDueDate(value);',
    'priority: clientMissingPriority',
    'dueDate: clientMissingDueDate',
  ]) {
    assertIncludes(clientDetail, stateWiring, 'ClientDetail priority/due-date propagation');
  }
});

test('FRT-017 keeps ContextAction and ClientDetail persistence fields, relations and active-list propagation explicit', () => {
  const host = read(paths.contextActions);
  const clientDetail = read(paths.clientDetail);
  const hostSave = sourceBetween(host, 'const handleSaveBlocker = async () => {', '  const openTask');
  const clientSave = sourceBetween(clientDetail, 'const handleSaveClientMissingItemStage227C3B = useCallback(async () => {', '  const handleToggleClientMissingBlockerStage232I4R13F');
  const templateQuote = String.fromCharCode(96);
  const scheduledAtField = 'scheduledAt: ' + templateQuote + '$' + '{draft.dueDate}T09:00' + templateQuote;

  for (const inputField of [
    'title: missingTitle',
    'note: missingNote',
    'missingKind,',
    'priority: missingPriority',
    'dueDate: missingDueDate',
    'blocksProgress: missingBlocksProgress',
    'blockScope: missingBlockScope',
  ]) {
    assertIncludes(hostSave, inputField, 'ContextAction draft input');
  }

  assert.equal((hostSave.match(/insertTaskToSupabase\(\{/g) || []).length, 2, 'ContextAction must retain task persistence for case and non-case records');
  assert.equal((hostSave.match(/insertActivityToSupabase\(\{/g) || []).length, 2, 'ContextAction must retain activity persistence for case and non-case records');
  for (const persistedField of [
    'title: draft.title',
    "type: 'missing_item'",
    "status: draft.blocksProgress ? 'blocking_missing_item' : 'missing_item'",
    'priority: draft.priority',
    'date: draft.dueDate',
    scheduledAtField,
    'dueAt: draft.dueDate',
    'description: draft.note',
    'workspaceId',
    'missingKind: draft.missingKind',
    'blocksProgress: draft.blocksProgress',
    'blockScope: draft.blockScope || null',
    'payload: {',
  ]) {
    assertIncludes(hostSave, persistedField, 'ContextAction persisted field');
  }
  for (const relation of [
    'leadId: leadId || null',
    'clientId: clientId || null',
    'caseId: caseId || null',
    'recordType: request.recordType',
    'recordId: request.recordId',
    'sourceEntityType: request.recordType',
    'sourceEntityId: request.recordId',
    'persistenceTarget: draft.persistenceTarget',
    "eventType: 'missing_item_created'",
  ]) {
    assertIncludes(hostSave, relation, 'ContextAction relation/persistence target');
  }
  assertIncludes(hostSave, 'emitCloseflowWorkItemNoFlickerMutation', 'ContextAction active-list propagation');
  assertIncludes(hostSave, 'recordType: request.recordType', 'ContextAction active-list relation');
  assertIncludes(hostSave, 'recordId: request.recordId', 'ContextAction active-list record relation');

  assert.equal((clientSave.match(/insertTaskToSupabase\(\{/g) || []).length, 1, 'ClientDetail must persist one normalized task record');
  assert.equal((clientSave.match(/insertActivityToSupabase\(\{/g) || []).length, 1, 'ClientDetail must persist one creation activity');
  for (const persistedField of [
    'title: draft.title',
    "type: 'missing_item'",
    "status: draft.blocksProgress ? 'blocking_missing_item' : 'missing_item'",
    'priority: draft.priority',
    'date: draft.dueDate',
    scheduledAtField,
    'dueAt: draft.dueDate',
    'description: draft.note',
    'workspaceId: workspace?.id',
    'clientId: safeClientId',
    "sourceEntityType: 'client'",
    'sourceEntityId: safeClientId',
    "recordType: 'client'",
    'recordId: safeClientId',
    'missingKind: draft.missingKind',
    'blocksProgress: draft.blocksProgress',
    'blockScope: draft.blockScope || null',
    'payload: {',
  ]) {
    assertIncludes(clientSave, persistedField, 'ClientDetail persisted field');
  }
  for (const relation of [
    "eventType: 'missing_item_created'",
    "entityType: 'client'",
    'entityId: safeClientId',
    "sourceEntityType: 'client'",
    'sourceEntityId: safeClientId',
    'clientId: safeClientId',
  ]) {
    assertIncludes(clientSave, relation, 'ClientDetail activity relation');
  }
  assertIncludes(clientSave, 'setTasks((previous) => [optimisticTask, ...previous])', 'ClientDetail active-list task propagation');
  assertIncludes(clientSave, 'setActivities((previous) =>', 'ClientDetail active-list activity propagation');

  const clientContextAction = sourceBetween(clientDetail, 'const openClientContextAction = (kind: ContextActionKind) => {', '  const clientCaseRows');
  assertIncludes(clientContextAction, "recordType: 'client'", 'ClientDetail context relation type');
  assertIncludes(clientContextAction, 'recordId: clientId', 'ClientDetail context relation id');
  assertIncludes(clientContextAction, 'clientId,', 'ClientDetail context client relation');
});

test('FRT-017 scopes the new CSS block to VST tokens without raw hex or rgba colors', () => {
  const cssBlock = fortecaFrt017CssBlock(read(paths.dialogStyles));

  assert.match(cssBlock, /data-forteca-frt-017-lead-blocker="true"/);
  assert.match(cssBlock, /data-forteca-frt-017-modal="true"/);
  assert.match(cssBlock, /\.cf-vst-dialog/);
  assert.match(cssBlock, /\.forteca-frt-017-form/);
  assert.match(cssBlock, /\.forteca-frt-017-footer/);
  assert.ok((cssBlock.match(/var\(--cf-vst-[^)]+\)/g) || []).length >= 20, 'FRT-017 CSS must use the VST semantic token family throughout the scoped block');
  assert.doesNotMatch(cssBlock, /#[0-9a-f]{3,8}\b/i, 'FRT-017 CSS must not introduce raw hex colors');
  assert.doesNotMatch(cssBlock, /rgba?\([^)]*\)/i, 'FRT-017 CSS must not introduce raw rgb/rgba colors');

  const colorDeclarations = cssBlock.match(/(?:^|\n)\s*(?:background|background-color|border|border-color|color|box-shadow|-webkit-text-fill-color):\s*([^;]+);/g) || [];
  assert.ok(colorDeclarations.length > 0, 'FRT-017 CSS must declare tokenized visual properties');
  for (const declaration of colorDeclarations) {
    if (/\btransparent\b|\bnone\b/i.test(declaration)) continue;
    assert.match(declaration, /var\(--cf-vst-/i, 'FRT-017 visual declaration must resolve through a VST token: ' + declaration.trim());
  }
});
