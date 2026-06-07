const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}
let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227C3B_CLIENT_CASE_MISSING_ITEM_RUNTIME_WIRING: ' + label); }
function contains(text, needle, label) {
  if (text.includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']');
}
function notContains(text, needle, label) {
  if (!text.includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']');
}

const client = read('src/pages/ClientDetail.tsx');
const clientCss = read('src/styles/visual-stage12-client-detail-vnext.css');
const caseQuick = read('src/components/CaseQuickActions.tsx');
const caseDialog = read('src/components/AddCaseMissingItemDialog.tsx');
const pkg = read('package.json');

contains(client, 'STAGE227C3B_CLIENT_MISSING_ITEM_RUNTIME_WIRING', 'client runtime marker');
contains(client, 'MissingItemQuickActionModal', 'client uses shared C2 modal');
contains(client, 'buildMissingItemModalDraft', 'client uses C2 draft builder');
contains(client, 'clientMissingItemsStage227C3B', 'client formal missing list memo');
contains(client, "type === 'missing_item'", 'client filters missing_item type');
contains(client, "status === 'missing_item'", 'client filters missing_item status');
contains(client, 'data-stage227c3b-client-missing-action="true"', 'client Brak action marker');
contains(client, 'data-stage227c3b-client-missing-items-list="true"', 'client missing list marker');
contains(client, "insertTaskToSupabase({", 'client lightweight task persistence');
contains(client, "type: 'missing_item'", 'client task type missing_item');
contains(client, "status: 'missing_item'", 'client task status missing_item');
contains(client, "eventType: 'missing_item_created'", 'client activity event marker');
contains(client, "recordType: 'client'", 'client activity payload record type');
contains(client, 'data-stage227c3b-client-missing-modal="true"', 'client modal runtime marker');
contains(clientCss, 'STAGE227C3B_CLIENT_MISSING_ITEM_RUNTIME_WIRING_START', 'client CSS marker');
contains(clientCss, '.client-detail-missing-items-section', 'client missing section CSS');
contains(clientCss, '.missing-item-modal-backdrop', 'client modal CSS');

contains(caseQuick, "key: 'missing'", 'CaseQuickActions already has missing action');
contains(caseQuick, 'AddCaseMissingItemDialog', 'case uses AddCaseMissingItemDialog');
contains(caseDialog, 'insertCaseItemToSupabase', 'case missing action persists to case_items');
contains(caseDialog, "status: 'missing'", 'case item status missing');
contains(caseDialog, "isRequired: true", 'case item is required');
contains(caseDialog, "eventType: 'item_added'", 'case activity item_added');
notContains(client, 'CREATE TABLE', 'no SQL in ClientDetail');
notContains(client, 'create table', 'no SQL in ClientDetail lowercase');

contains(pkg, 'check:stage227c3b-client-case-missing-item-runtime-wiring', 'package check script');
contains(pkg, 'test:stage227c3b-client-case-missing-item-runtime-wiring', 'package test script');

if (failures) {
  console.error('\nStage227C3B guard failures: ' + failures);
  process.exit(1);
}
console.log('PASS STAGE227C3B_CLIENT_CASE_MISSING_ITEM_RUNTIME_WIRING');
