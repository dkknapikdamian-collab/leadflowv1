const fs = require('fs');
const path = require('path');

const root = process.cwd();
const stage = 'LF-UI-SOT-CZ2-010';
const canonical = 'src/lib/source-of-truth/actions.ts';
const guardPath = 'scripts/guards/verify-lf-ui-sot-cz2-010-action-button-semantics.cjs';
const testPath = 'tests/lf-ui-sot-cz2-010-action-button-semantics.test.cjs';
const errors = [];
const warnings = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}
function exists(file) {
  return fs.existsSync(path.join(root, file));
}
function fail(message) {
  errors.push(message);
}
function hasMojibake(text) {
  return /[\u00c5\u00c4\u0139\ufffd]/.test(text);
}
function blockFor(source, key) {
  const marker = `'${key}':`;
  const start = source.indexOf(marker);
  if (start === -1) return '';
  const open = source.indexOf('{', start + marker.length);
  if (open === -1) return '';
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) return source.slice(open, index + 1);
  }
  return '';
}

if (!exists(canonical)) fail(`missing canonical SOT: ${canonical}`);
if (!exists(guardPath)) fail(`missing guard: ${guardPath}`);
if (!exists(testPath)) fail(`missing test: ${testPath}`);

const source = exists(canonical) ? read(canonical) : '';
const pkg = exists('package.json') ? read('package.json') : '';
const confirmDialog = exists('src/components/confirm-dialog.tsx') ? read('src/components/confirm-dialog.tsx') : '';
const entityActions = exists('src/components/entity-actions.tsx') ? read('src/components/entity-actions.tsx') : '';

for (const symbol of [
  'AppActionKey',
  'AppActionTone',
  'AppActionVariant',
  'AppActionMeta',
  'APP_ACTIONS',
  'getAppActionMeta',
  'getAppActionLabel',
  'getAppActionAriaLabel',
  'getAppActionConfirmCopy',
  'requiresAppActionConfirmation',
]) {
  if (!source.includes(symbol)) fail(`actions.ts missing symbol: ${symbol}`);
}

const requiredKeys = [
  'lead.remove', 'case.remove', 'client.remove', 'task.remove', 'event.remove', 'missingItem.remove',
  'record.copyLink', 'lead.copyEmail', 'lead.copyPhone', 'case.copyLink', 'client.copyLink',
  'task.markDone', 'event.markDone', 'case.markDone', 'missingItem.resolve',
  'task.restore', 'event.restore', 'case.restore', 'lead.restore',
  'task.snooze', 'event.snooze', 'task.postpone', 'event.postpone',
];
for (const key of requiredKeys) {
  if (!source.includes(`'${key}'`)) fail(`actions.ts missing action key: ${key}`);
}

for (const key of ['lead.remove', 'case.remove', 'client.remove', 'task.remove', 'event.remove', 'missingItem.remove']) {
  const block = blockFor(source, key);
  if (!block) fail(`missing metadata block for ${key}`);
  if (!block.includes('requiresConfirmation: true')) fail(`${key} must require confirmation`);
  if (!block.includes('confirmation:')) fail(`${key} missing confirmation metadata`);
  if (!block.includes("tone: 'danger'")) fail(`${key} must use danger tone`);
  if (!block.includes("variant: 'destructive'")) fail(`${key} must use destructive variant`);
}

for (const key of ['record.copyLink', 'lead.copyEmail', 'lead.copyPhone', 'case.copyLink', 'client.copyLink']) {
  const block = blockFor(source, key);
  if (!block) fail(`missing metadata block for ${key}`);
  if (!/label:\s*'[^']+'/.test(block)) fail(`${key} missing label`);
  if (!/ariaLabel:\s*'[^']+'/.test(block)) fail(`${key} missing ariaLabel`);
  if (!block.includes('requiresConfirmation: false')) fail(`${key} must not require confirmation`);
}

for (const key of ['task.markDone', 'event.markDone', 'missingItem.resolve', 'task.restore', 'event.restore', 'task.snooze', 'event.snooze']) {
  const block = blockFor(source, key);
  if (!block) fail(`missing metadata block for ${key}`);
  if (!/label:\s*'[^']+'/.test(block)) fail(`${key} missing label`);
  if (!/ariaLabel:\s*'[^']+'/.test(block)) fail(`${key} missing ariaLabel`);
}

if (!confirmDialog.includes('confirmLabel?: string') || !confirmDialog.includes('confirmTone?:') || !confirmDialog.includes('pending?: boolean') || !confirmDialog.includes('onConfirm:')) {
  fail('ConfirmDialog API does not expose the required confirmation copy contract');
}
if (!entityActions.includes('EntityActionButton') || !entityActions.includes('EntityTrashButton') || !entityActions.includes('actionButtonClass') || !entityActions.includes('trashActionIconClass')) {
  fail('entity-actions.tsx lost required action helpers');
}
if (!pkg.includes('verify:lf-ui-sot-cz2-010-action-button-semantics')) {
  fail('package.json missing CZ2-010 verify script');
}
for (const file of [canonical, guardPath, testPath]) {
  if (exists(file) && hasMojibake(read(file))) fail(`mojibake detected in ${file}`);
}

warnings.push('CZ2-010 does not migrate every button. It only creates the canonical action/button semantics SOT and verification gates.');
const result = {
  ok: errors.length === 0,
  stage,
  decision: 'ACTION_BUTTON_SEMANTICS_SOURCE_OF_TRUTH / SCOPED_NO_RUNTIME_REDESIGN',
  canonical,
  checked: [canonical, 'src/components/confirm-dialog.tsx', 'src/components/entity-actions.tsx', 'package.json', guardPath, testPath],
  warnings,
  errors,
};
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exit(1);
