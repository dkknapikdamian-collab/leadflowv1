const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const sourcePath = path.join(root, 'src/components/ContextActionDialogs.tsx');
const guardPath = path.join(root, 'scripts/check-g15-r23c-context-action-native-mouse-event.cjs');
const source = fs.readFileSync(sourcePath, 'utf8');

function occurrences(text, value) {
  return text.split(value).length - 1;
}

test('R23C focused guard passes', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /PASS: R23C/);
});

test('native document click listener uses the DOM MouseEvent contract', () => {
  assert.equal(occurrences(source, 'const capture = (event: globalThis.MouseEvent) => {'), 1);
  assert.equal(occurrences(source, 'const capture = (event: MouseEvent) => {'), 0);
  assert.equal(occurrences(source, "document.addEventListener('click', capture, true);"), 1);
  assert.equal(occurrences(source, "document.removeEventListener('click', capture, true);"), 1);
});

test('React synthetic MouseEvent import is removed without changing hooks', () => {
  assert.match(source, /^import \{ useEffect, useMemo, useState \} from 'react';/);
  assert.doesNotMatch(source, /^import \{[^\n]*type MouseEvent[^\n]*\} from 'react';/m);
});

test('capture behavior remains fail-closed and unchanged', () => {
  assert.equal(occurrences(source, 'event.preventDefault();'), 1);
  assert.equal(occurrences(source, 'event.stopPropagation();'), 1);
  assert.equal(occurrences(source, 'event.stopImmediatePropagation?.();'), 1);
  assert.match(source, /const target = event\.target instanceof Element \? event\.target : null;/);
  assert.match(source, /setRequest\(\{ \.\.\.context, kind \}\);/);
});

test('R23C does not repair the later context-action debt items', () => {
  assert.match(source, /request\.recordType === 'case'/);
  assert.match(source, /item: createdMissingTaskRecordStage232N,/);
  assert.match(source, /record: createdMissingTaskRecordStage232N,/);
});
