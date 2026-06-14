const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}
function assertContains(file, needle, label) {
  const text = read(file);
  if (!text.includes(needle)) {
    console.error(`[STAGE231H_R1G2][FAIL] ${label}: missing ${needle} in ${file}`);
    process.exit(1);
  }
}
function assertExists(file, label) {
  if (!fs.existsSync(path.join(process.cwd(), file))) {
    console.error(`[STAGE231H_R1G2][FAIL] missing ${label}: ${file}`);
    process.exit(1);
  }
}

assertExists('_project/runs/STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC.md', 'R1G2 run report');
assertExists('_project/obsidian_updates/2026-06-14_STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC.md', 'R1G2 Obsidian payload');

assertContains('_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC', 'central stages include R1G2');
assertContains('_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME', 'central stages include R1D2 non-colliding dictation stage');
assertContains('_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING', 'central stages include R1E reimbursed cost marking');
assertContains('_project/runs/STAGE231H_R1F4_PAYMENT_SAVE_AND_GUARD_REPAIR.md', 'red-guard push repair', 'R1F4 report keeps compatibility phrase');
assertContains('_project/runs/STAGE231H_R1G_COST_OTHER_NAME_AND_REIMBURSABLE_FLAG.md', 'SERVER_UI_REQUIRED', 'R1G remains honest about server UI validation');
assertContains('_project/runs/STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC.md', 'Docs-only closeout', 'R1G2 report documents docs-only scope');
assertContains('_project/runs/STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC.md', 'Manual UI remains required', 'R1G2 report does not fake manual PASS');

console.log('STAGE231H_R1G2 PASS: CaseDetail cost/payment closeout ledgers are synced without runtime changes.');
