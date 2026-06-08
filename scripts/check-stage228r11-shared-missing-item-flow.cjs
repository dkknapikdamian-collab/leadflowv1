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

function requireRegex(text, regex, label) {
  if (!regex.test(text)) fail(label + ' missing regex: ' + regex);
}

function requireOrder(text, first, second, label) {
  const firstIndex = text.indexOf(first);
  const secondIndex = text.indexOf(second);
  if (firstIndex === -1 || secondIndex === -1 || firstIndex > secondIndex) {
    fail(label + ' invalid order: ' + first + ' before ' + second);
  }
}

const contract = read('src/lib/missing-items/stage227c2-missing-item-modal-contract.ts');
const modal = read('src/components/detail/MissingItemQuickActionModal.tsx');
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
  'STAGE227C3A_LEAD_MISSING_ITEM_RUNTIME_WIRING',
  "import { MissingItemQuickActionModal }",
  "import { buildMissingItemModalDraft }",
  'openLeadMissingItemDialog',
  'handleSaveLeadMissingItem',
  "dataStage=\"stage227e3-lead-quick-actions-bar\"",
  "key: 'missing'",
  "label: 'Brak'",
  "data-stage227c3a-lead-missing-action",
  "data-stage227c3a-lead-missing-modal-instance",
  "entityType: 'lead'",
  "type: 'missing_item'",
  "status: 'missing_item'",
  "eventType: 'missing_item_created'",
  "persistenceTarget: draft.persistenceTarget",
  'leadBlockerEntries',
  "type === 'missing_item'",
  "status === 'missing_item'",
  "payloadType.includes('missing_item')",
].forEach((token) => requireText(leadDetail, token, 'LeadDetail missing item flow'));

requireOrder(
  leadDetail,
  "key: 'missing'",
  'data-stage227c3a-lead-missing-modal-instance',
  'LeadDetail missing quick action must be wired before modal instance'
);

[
  'STAGE227C3B_CLIENT_MISSING_ITEM_RUNTIME_WIRING',
  "import { MissingItemQuickActionModal }",
  "import { buildMissingItemModalDraft }",
  'clientMissingItemsStage227C3B',
  'openClientMissingItemModalStage227C3B',
  'handleSaveClientMissingItemStage227C3B',
  "data-stage227c3b-client-missing-action",
  "data-stage227c3b-client-missing-items-list",
  "entityType: 'client'",
  "type: 'missing_item'",
  "status: 'missing_item'",
  "eventType: 'missing_item_created'",
  "source: 'stage227c3b_client_missing_item_quick_action'",
  "Brak otwartych braków.",
].forEach((token) => requireText(clientDetail, token, 'ClientDetail missing item flow'));

requireOrder(
  clientDetail,
  'openClientMissingItemModalStage227C3B',
  'data-stage227c3b-client-missing-items-list',
  'ClientDetail missing open handler must exist before missing items list render'
);

[
  'STAGE227E3_CASE_QUICK_ACTIONS_USES_SHARED_BAR',
  'STAGE228R7_R8_CASE_QUICK_ACTIONS_CARD_SOURCE_TRUTH',
  'AddCaseMissingItemDialog',
  "recordType=\"case\"",
  "key: 'missing'",
  "label: 'Brak'",
  "tone: 'missing'",
  'setMissingDialogOpen(true)',
  "data-stage227e3-case-missing-action",
  'onSaved={onAfterMutation}',
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
  "source: 'case_quick_actions'",
].forEach((token) => requireText(caseMissingDialog, token, 'case missing item dialog'));

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
  "toast.success('Brak dodany do sprawy')",
  "toast.success('Status braku zmieniony')",
  "toast.success('Brak usunięty')",
].forEach((token) => requireText(caseDetail, token, 'CaseDetail case_items missing CRUD'));

requireRegex(leadDetail, /insertTaskToSupabase\(\{[\s\S]*?type:\s*'missing_item'[\s\S]*?status:\s*'missing_item'[\s\S]*?leadId/s, 'LeadDetail task persistence contract');
requireRegex(clientDetail, /insertTaskToSupabase\(\{[\s\S]*?type:\s*'missing_item'[\s\S]*?status:\s*'missing_item'[\s\S]*?clientId/s, 'ClientDetail task persistence contract');
requireRegex(caseMissingDialog, /insertCaseItemToSupabase\(\{[\s\S]*?caseId[\s\S]*?status:\s*'missing'[\s\S]*?isRequired:\s*true/s, 'Case missing item persistence contract');

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
  contract: {
    lead: 'MissingItemQuickActionModal -> task missing_item + activity missing_item_created -> Braki i blokady',
    client: 'MissingItemQuickActionModal -> task missing_item + activity missing_item_created -> Braki i blokady',
    case: 'CaseQuickActions -> AddCaseMissingItemDialog -> case_items status missing + activity item_added'
  },
  sqlRequired: false
}, null, 2));
