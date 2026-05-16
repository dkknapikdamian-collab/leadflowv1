const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
const sliceAround = (text, marker, leftToken, rightToken) => {
  const markerIndex = text.indexOf(marker);
  assert.notEqual(markerIndex, -1, 'Missing marker: ' + marker);
  const left = text.lastIndexOf(leftToken, markerIndex);
  assert.notEqual(left, -1, 'Missing left token ' + leftToken + ' before ' + marker);
  const right = text.indexOf(rightToken, markerIndex);
  assert.notEqual(right, -1, 'Missing right token ' + rightToken + ' after ' + marker);
  return text.slice(left, right + rightToken.length);
};
const heavyRedClass = /\b(?:bg-red-600|bg-red-500|bg-rose-600|bg-rose-500|bg-red-700|bg-rose-700)\b/;

test('Stage95 entity actions exposes one trash action source of truth', () => {
  const entityActions = read('src/components/entity-actions.tsx');
  assert.match(entityActions, /CLOSEFLOW_TRASH_ACTION_SOURCE_OF_TRUTH/);
  assert.match(entityActions, /function trashActionButtonClass/);
  assert.match(entityActions, /function trashActionIconClass/);
  assert.match(entityActions, /EntityTrashButton/);
  assert.match(entityActions, /data-cf-destructive-source="trash-action-source"/);
});

test('Stage95 trash CSS is subtle, not a solid red plaque', () => {
  const contextCss = read('src/styles/context-action-button-source-truth.css');
  const recordCss = read('src/styles/closeflow-record-list-source-truth.css');
  assert.match(contextCss, /CLOSEFLOW_STAGE95_DESTRUCTIVE_ACTION_SOURCE_OF_TRUTH/);
  assert.match(contextCss, /\.cf-trash-action-button/);
  assert.match(contextCss, /\.cf-trash-action-icon/);
  assert.match(recordCss, /CLOSEFLOW_STAGE95_RECORD_TRASH_ACTION_SOURCE_OF_TRUTH/);
  const sourceBlock = contextCss.slice(contextCss.indexOf('CLOSEFLOW_STAGE95_DESTRUCTIVE_ACTION_SOURCE_OF_TRUTH'));
  assert.doesNotMatch(sourceBlock, /background:\s*(?:#dc2626|#ef4444|#b91c1c|rgb\(220\s+38\s+38\))/i);
  assert.doesNotMatch(sourceBlock, heavyRedClass);
});

test('Stage95 Tasks delete action uses EntityTrashButton and shared icon class', () => {
  const tasks = read('src/pages/TasksStable.tsx');
  const block = sliceAround(tasks, 'data-task-action-visible-stage48="delete"', '<EntityTrashButton', '</EntityTrashButton>');
  assert.match(tasks, /EntityTrashButton/);
  assert.match(tasks, /trashActionIconClass/);
  assert.match(block, /data-task-action-visible-stage48="delete"/);
  assert.match(block, /trashActionIconClass\("mr-2 h-4 w-4"\)/);
  assert.doesNotMatch(block, /actionButtonClass\('danger'/);
  assert.doesNotMatch(block, heavyRedClass);
});

test('Stage95 Cases delete action uses EntityTrashButton without local red slab classes', () => {
  const cases = read('src/pages/Cases.tsx');
  const block = sliceAround(cases, 'data-case-row-delete-action="true"', '<EntityTrashButton', '</EntityTrashButton>');
  assert.match(block, /data-cf-destructive-source="trash-action-source"/);
  assert.match(block, /trashActionIconClass\("h-4 w-4"\)/);
  assert.doesNotMatch(block, /cf-entity-action-danger/);
  assert.doesNotMatch(block, heavyRedClass);
});

test('Stage95 Calendar delete actions use shared trash classes', () => {
  const calendar = read('src/pages/Calendar.tsx');
  assert.match(calendar, /trashActionButtonClass/);
  assert.match(calendar, /trashActionIconClass/);
  assert.doesNotMatch(calendar, /entityActionButtonClass\('danger'/);
  assert.doesNotMatch(calendar, heavyRedClass);
});

test('Stage95 quiet release gate includes destructive action guard', () => {
  const quietGate = read('scripts/closeflow-release-check-quiet.cjs');
  assert.ok(quietGate.includes('tests/stage95-destructive-action-visual-source.test.cjs'));
});
