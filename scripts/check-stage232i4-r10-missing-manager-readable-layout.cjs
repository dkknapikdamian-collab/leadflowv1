#!/usr/bin/env node
/* STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT guard */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const failures = [];
const assert = (condition, message) => { if (!condition) failures.push(message); };

const managerPath = 'src/components/detail/MissingItemsManagerDialog.tsx';
assert(exists(managerPath), `Missing file: ${managerPath}`);
const src = exists(managerPath) ? read(managerPath) : '';

assert(src.includes('STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT'), 'Missing R10 stage marker.');
assert(src.includes('data-stage232i4-r10-readable-layout="true"'), 'Dialog lacks R10 readable layout marker.');
assert(src.includes('data-stage232i4-r14-missing-manager-dialog'), 'R10 must preserve R14 dialog contract marker.');
assert(src.includes('data-stage232i4-r14-manager-row="true"'), 'R10 must preserve R14 manager row marker.');
assert(src.includes('data-stage232i4-r14-manager-row-checkbox="true"'), 'R10 must preserve R14 row checkbox marker.');
assert(src.includes('data-stage232i4-r14-manager-resolve-action="true"'), 'R10 must preserve resolve action marker.');
assert(src.includes('data-stage232i4-r14-manager-delete-action="true"'), 'R10 must preserve delete action marker.');

for (const token of [
  'max-w-4xl',
  'sm:max-w-4xl',
  'bg-slate-950',
  'text-slate-100',
  'border-slate-700',
  'text-slate-300',
  'max-h-[48vh]',
  'overflow-y-auto',
  'space-y-3',
  'rounded-2xl',
  'border-t border-slate-800',
  'flex flex-wrap items-center gap-2',
  'data-stage232i4-r10-manager-row-actions="separated-flex-wrap-gap"',
]) {
  assert(src.includes(token), `Missing readable layout token: ${token}`);
}

assert(src.includes('priority') && src.includes("priority === 'high'"), 'R10 must recognize R9 blocker signal from priority=high.');
assert(src.includes('Brak informacyjny') && src.includes('Blokuje sprawę'), 'R10 row must expose readable status badges.');
assert(src.includes('<CheckCircle2') && src.includes('<Trash2'), 'R10 actions must use separated readable action icons.');
assert(!src.includes('grid-cols-[auto_minmax(0,1fr)_auto_auto_auto]'), 'R10 must not use compressed one-line row grid.');

if (failures.length) {
  console.error('STAGE232I4_R10 missing manager readable layout guard FAIL');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('STAGE232I4_R10 missing manager readable layout guard PASS');
