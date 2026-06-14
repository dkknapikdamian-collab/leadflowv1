const fs = require('fs');
const { execSync } = require('child_process');

const STAGE = 'STAGE231H_R1G3_CASE_DETAIL_MANUAL_UI_PASS';

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function mustInclude(file, needle) {
  const content = read(file);
  if (!content.includes(needle)) {
    throw new Error(`${file} must include ${needle}`);
  }
}

mustInclude('_project/04_ETAPY_ROZWOJU_APLIKACJI.md', STAGE);
mustInclude('_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME');
mustInclude('_project/04_ETAPY_ROZWOJU_APLIKACJI.md', 'STAGE231H_R1E_CASE_DETAIL_REIMBURSED_COST_MARKING');
mustInclude('_project/13_TEST_HISTORY.md', 'PASS_MANUAL_CONFIRMED_BY_DAMIAN');
mustInclude('_project/13_TEST_HISTORY.md', 'jest ok testy reczne');
mustInclude('_project/runs/STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC.md', 'MANUAL_UI_PASS_CONFIRMED_BY_DAMIAN');
mustInclude('_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md', 'R1E reimbursed cost marking still not implemented');

const changed = execSync('git diff --name-only', { encoding: 'utf8' })
  .split(/\r?\n/u)
  .filter(Boolean);

const forbiddenRuntime = changed.filter((file) =>
  file.startsWith('src/') ||
  file.startsWith('sql/') ||
  file.startsWith('migrations/') ||
  file.startsWith('supabase/')
);

if (forbiddenRuntime.length > 0) {
  throw new Error(`Docs-only manual pass stage changed runtime files: ${forbiddenRuntime.join(', ')}`);
}

console.log('STAGE231H_R1G3 PASS: CaseDetail manual UI PASS is recorded without runtime changes.');
