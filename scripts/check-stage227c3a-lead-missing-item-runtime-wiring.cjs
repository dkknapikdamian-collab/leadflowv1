const fs = require('fs');

let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227C3A_LEAD_MISSING_ITEM_RUNTIME_WIRING: ' + label); }
function contains(text, needle, label) { if (String(text).includes(needle)) pass(label); else fail('missing: ' + label + ' [' + needle + ']'); }
function notContains(text, needle, label) { if (!String(text).includes(needle)) pass(label); else fail('still contains: ' + label + ' [' + needle + ']'); }

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');
const modal = fs.readFileSync('src/components/detail/MissingItemQuickActionModal.tsx', 'utf8');
const contract = fs.readFileSync('src/lib/missing-items/stage227c2-missing-item-modal-contract.ts', 'utf8');
const pkg = fs.readFileSync('package.json', 'utf8');

contains(lead, 'STAGE227C3A_LEAD_MISSING_ITEM_RUNTIME_WIRING', 'stage marker');
contains(lead, "import { MissingItemQuickActionModal }", 'modal component import');
contains(lead, "buildMissingItemModalDraft", 'modal draft contract import/use');
contains(lead, "openLeadMissingItemDialog", 'open missing item dialog handler');
contains(lead, "handleSaveLeadMissingItem", 'save missing item handler');
contains(lead, "data-stage227c3a-lead-missing-action", 'lead quick action marker');
contains(lead, "onClick: openLeadMissingItemDialog", 'Brak quick action opens modal');
contains(lead, "insertTaskToSupabase({", 'lead/client lightweight task persistence');
contains(lead, "type: 'missing_item'", 'missing item task type');
contains(lead, "status: 'missing_item'", 'missing item task status marker');
contains(lead, "insertActivityToSupabase({", 'activity log persistence');
contains(lead, "eventType: 'missing_item_created'", 'activity event marker');
contains(lead, "data-stage227c3a-lead-missing-modal-instance", 'modal runtime instance');
contains(lead, "type === 'missing_item'", 'formal blocker filter by type');
contains(lead, "payloadType.includes('missing_item')", 'formal blocker filter by payload marker');
contains(css, 'STAGE227C3A_MISSING_ITEM_MODAL_RUNTIME_START', 'modal CSS marker');
contains(modal, 'data-stage227c2-missing-item-modal', 'C2 modal still shared');
contains(contract, "getMissingItemPersistenceTarget(entityType", 'C2 persistence target contract remains');
contains(pkg, 'check:stage227c3a-lead-missing-item-runtime-wiring', 'package check script');
contains(pkg, 'test:stage227c3a-lead-missing-item-runtime-wiring', 'package test script');
notContains(lead, 'create table', 'no SQL/new table in LeadDetail');
notContains(contract, 'create table', 'no SQL/new table in contract');

if (failures) {
  console.error('\nStage227C3A guard failures: ' + failures);
  process.exit(1);
}
console.log('PASS STAGE227C3A_LEAD_MISSING_ITEM_RUNTIME_WIRING');
