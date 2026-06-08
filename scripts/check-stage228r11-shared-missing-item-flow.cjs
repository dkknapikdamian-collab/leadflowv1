const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    fail('missing file: ' + rel);
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function fail(message) {
  console.error('STAGE228R11_SHARED_MISSING_ITEM_FLOW_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

const contract = read('src/lib/missing-items/stage227c2-missing-item-modal-contract.ts');
const modal = read('src/components/detail/MissingItemQuickActionModal.tsx');
const contextHost = read('src/components/ContextActionDialogs.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const caseQuickActions = read('src/components/CaseQuickActions.tsx');
const caseMissingDialog = read('src/components/AddCaseMissingItemDialog.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const packageJson = JSON.parse(read('package.json'));

[
  "export type MissingItemEntityType = 'lead' | 'client' | 'case';",
  "export type MissingItemPersistenceTarget = 'task_activity_missing_item' | 'case_items';",
  'MISSING_ITEM_QUICK_ACTION_LABEL',
  "title: 'Dodaj brak'",
  "submit: 'Zapisz brak'",
  "label: 'Czego brakuje?'",
  "return entityType === 'case' ? 'case_items' : 'task_activity_missing_item';",
  'buildMissingItemModalDraft',
].forEach((token) => requireText(contract, token, 'shared missing item contract'));

[
  'STAGE227C2_MISSING_ITEM_MODAL_COMPONENT',
  'data-stage227c2-missing-item-modal="true"',
  'MISSING_ITEM_MODAL_FIELDS',
  'onTitleChange',
  'onNoteChange',
  'onSubmit',
].forEach((token) => requireText(modal, token, 'shared missing item modal'));

[
  'STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST',
  "export type ContextActionKind = 'task' | 'event' | 'note' | 'blocker';",
  "normalized === 'missing_item'",
  "return 'blocker'",
  'MissingItemQuickActionModal',
  'buildMissingItemModalDraft',
  'insertTaskToSupabase',
  'insertCaseItemToSupabase',
  "eventType: 'missing_item_created'",
  "eventType: 'item_added'",
  'data-stage228r12-context-action-blocker-host="true"',
].forEach((token) => requireText(contextHost, token, 'ContextActionDialogs host'));

[
  'STAGE227C3A_LEAD_MISSING_ITEM_RUNTIME_WIRING',
  'STAGE228R12_LEAD_MISSING_USES_CONTEXT_ACTION_HOST',
  "openLeadContextAction('blocker')",
  "'data-context-action-kind': 'blocker'",
  "'data-stage228r12-lead-context-blocker': 'true'",
  'leadBlockerEntries',
].forEach((token) => requireText(leadDetail, token, 'LeadDetail missing item flow'));

[
  'STAGE227C3B_CLIENT_MISSING_ITEM_RUNTIME_WIRING',
  'STAGE228R12_CLIENT_MISSING_USES_CONTEXT_ACTION_HOST',
  "openClientContextAction('blocker')",
  'data-stage228r12-client-context-blocker="true"',
  'data-context-action-kind="blocker"',
  'clientMissingItemsStage227C3B',
  "Brak otwartych braków.",
].forEach((token) => requireText(clientDetail, token, 'ClientDetail missing item flow'));

[
  'STAGE227E3_CASE_QUICK_ACTIONS_USES_SHARED_BAR',
  'STAGE228R12_CASE_MISSING_USES_CONTEXT_ACTION_HOST',
  "recordType=\"case\"",
  "key: 'missing'",
  "label: 'Brak'",
  "tone: 'missing'",
  "openSharedAction('blocker')",
  "'data-context-action-kind': 'blocker'",
  "'data-stage228r12-case-context-blocker': 'true'",
].forEach((token) => requireText(caseQuickActions, token, 'CaseQuickActions missing action flow'));

[
  'insertCaseItemToSupabase',
  'insertActivityToSupabase',
  'data-add-case-missing-item-dialog="true"',
  'Dodaj brak w sprawie',
  'Czego brakuje?',
  "status: 'missing'",
  'isRequired: true',
  "eventType: 'item_added'",
].forEach((token) => requireText(caseMissingDialog, token, 'legacy case missing item dialog remains available'));

[
  'fetchCaseItemsFromSupabase',
  'insertCaseItemToSupabase',
  'updateCaseItemInSupabase',
  'deleteCaseItemFromSupabase',
  "type CaseItemStatus = 'missing'",
  "kind === 'missing'",
  'handleAddItem',
  'handleItemStatusChange',
  'handleDeleteItem',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail case_items missing CRUD'));

const scriptCommand = 'node scripts/check-stage228r11-shared-missing-item-flow.cjs';
if (packageJson.scripts['check:stage228r11-shared-missing-item-flow'] !== scriptCommand) {
  fail('package.json missing check:stage228r11-shared-missing-item-flow script');
}
if (!String(packageJson.scripts.prebuild || '').includes(scriptCommand)) {
  fail('package.json prebuild missing Stage228R11 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R11_SHARED_MISSING_ITEM_FLOW',
  repair: 'R12R2-compatible guard',
  contract: {
    lead: 'ContextActionDialogs blocker -> MissingItemQuickActionModal -> task/activity missing_item -> Braki i blokady',
    client: 'ContextActionDialogs blocker -> MissingItemQuickActionModal -> task/activity missing_item -> Braki i blokady',
    case: 'ContextActionDialogs blocker -> MissingItemQuickActionModal -> case_items status missing + activity item_added'
  },
  sqlRequired: false
}, null, 2));
