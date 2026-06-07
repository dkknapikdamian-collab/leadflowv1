const fs = require('fs');

let failures = 0;
function pass(label) { console.log('PASS ' + label); }
function fail(label) { failures += 1; console.error('FAIL STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL: ' + label); }

function read(file) {
  if (!fs.existsSync(file)) {
    fail('missing file: ' + file);
    return '';
  }
  pass('file exists: ' + file);
  return fs.readFileSync(file, 'utf8');
}

function mustContain(file, text, label) {
  const value = read(file);
  if (value.includes(text)) pass(label);
  else fail(label + ' missing: ' + text);
}

function mustNotContain(file, text, label) {
  const value = read(file);
  if (!value.includes(text)) pass(label);
  else fail(label + ' still contains: ' + text);
}

const doc = 'docs/stages/STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL.md';
const contractModule = 'src/lib/missing-items/stage227c2-missing-item-modal-contract.ts';
const component = 'src/components/detail/MissingItemQuickActionModal.tsx';
const obs = '_project/obsidian_updates/2026-06-07 - Stage227C2 Missing Item Quick Action Modal.md';
const report = '_project/reports/2026-06-07 - Stage227C2 Missing Item Quick Action Modal run report.md';
const pkg = 'package.json';

mustContain(doc, 'STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL', 'doc marker');
mustContain(doc, 'bez SQL', 'doc forbids SQL');
mustContain(doc, 'bez nowej tabeli', 'doc forbids new table');
mustContain(contractModule, 'STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL', 'module marker');
mustContain(contractModule, "MISSING_ITEM_QUICK_ACTION_LABEL = 'Brak'", 'quick action label');
mustContain(contractModule, "label: 'Czego brakuje?'", 'required field label');
mustContain(contractModule, "required: true", 'required title');
mustContain(contractModule, "entityType === 'case' ? 'case_items' : 'task_activity_missing_item'", 'routing stays lightweight');
mustContain(contractModule, 'buildMissingItemModalDraft', 'draft builder');
mustContain(component, 'data-stage227c2-missing-item-modal="true"', 'modal data marker');
mustContain(component, 'role="dialog"', 'dialog role');
mustContain(component, 'onSubmit', 'submit handler prop');
mustContain(component, 'onCancel', 'cancel handler prop');
mustContain(pkg, 'check:stage227c2-missing-item-quick-action-modal', 'package check script');
mustContain(pkg, 'test:stage227c2-missing-item-quick-action-modal', 'package test script');
mustContain(obs, 'Stage227C2', 'obsidian update mentions stage');
mustContain(report, 'PASS', 'run report records PASS');
mustNotContain(contractModule, 'create table', 'no create table in C2 module');
mustNotContain(contractModule, 'supabase.from', 'no direct Supabase write in C2 module');
mustNotContain(contractModule, '.insert(', 'no direct insert in C2 module');
mustNotContain(component, 'supabase.from', 'no direct Supabase write in C2 component');
mustNotContain(component, '.insert(', 'no direct insert in C2 component');

if (failures > 0) {
  console.error('\nStage227C2 guard failures: ' + failures);
  process.exit(1);
}
console.log('PASS STAGE227C2_MISSING_ITEM_QUICK_ACTION_MODAL');
