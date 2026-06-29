const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const actions = fs.readFileSync(path.join(root, 'src/lib/source-of-truth/actions.ts'), 'utf8');
const confirmDialog = fs.readFileSync(path.join(root, 'src/components/confirm-dialog.tsx'), 'utf8');
const entityActions = fs.readFileSync(path.join(root, 'src/components/entity-actions.tsx'), 'utf8');

test('CZ2-010 action semantics SOT exports helpers', () => {
  for (const token of ['APP_ACTIONS', 'getAppActionMeta', 'getAppActionLabel', 'getAppActionAriaLabel', 'getAppActionConfirmCopy', 'requiresAppActionConfirmation']) {
    assert.ok(actions.includes(token), `${token} missing`);
  }
});

test('CZ2-010 action groups are present', () => {
  for (const token of ['record-removal', 'copy-link', 'mark-done', 'restore', 'snooze']) {
    assert.ok(actions.includes(token), `${token} missing`);
  }
});

test('CZ2-010 covers current action key families', () => {
  for (const token of ['lead.remove', 'case.remove', 'client.remove', 'task.remove', 'event.remove', 'missingItem.remove', 'record.copyLink', 'lead.copyEmail', 'lead.copyPhone', 'task.markDone', 'event.markDone', 'missingItem.resolve', 'task.restore', 'event.restore', 'task.snooze', 'event.snooze']) {
    assert.ok(actions.includes(token), `${token} missing`);
  }
});

test('ConfirmDialog and entity action helpers remain compatible', () => {
  for (const token of ['confirmLabel?: string', 'cancelLabel?: string', 'confirmTone?:', 'pending?: boolean', 'onConfirm:']) {
    assert.ok(confirmDialog.includes(token), `${token} missing from ConfirmDialog`);
  }
  for (const token of ['EntityActionButton', 'EntityTrashButton', 'actionButtonClass', 'trashActionIconClass']) {
    assert.ok(entityActions.includes(token), `${token} missing from entity-actions`);
  }
});

test('CZ2-010 source has no mojibake markers', () => {
  assert.equal(/[\u00c5\u00c4\u0139\ufffd]/.test(actions), false);
});
