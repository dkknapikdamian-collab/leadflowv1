const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/LeadDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-15-lead-action-button-pointer.cjs';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-15 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-15/);
});

test('A2-15 keeps pointerdown and click on the direct lead Brak action', () => {
  const source = read(sourcePath);
  const start = source.lastIndexOf('<LeadActionButton', source.indexOf('data-stage228r16-lead-direct-brak-button'));
  const end = source.indexOf('</LeadActionButton>', start);
  const action = source.slice(start, end);
  assert.match(action, /onPointerDown=/);
  assert.match(action, /onClick=/);
  assert.match(action, /disabled=\{!hasAccess\}/);
  assert.match(action, /data-stage228r16-lead-direct-brak-button/);
  assert.match(action, /kind: 'blocker'/);
});

test('A2-15 declares a typed wrapper contract and forwards it', () => {
  const source = read(sourcePath);
  const start = source.indexOf('function LeadActionButton(');
  const end = source.indexOf('\n\nconst CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT', start);
  const button = source.slice(start, end);
  assert.match(source, /type PointerEventHandler/);
  assert.match(button, /onPointerDown\?: PointerEventHandler<HTMLButtonElement>/);
  assert.match(button, /onPointerDown=\{onPointerDown\}/);
  assert.match(button, /onClick=\{onClick\}/);
  assert.doesNotMatch(button, /\bany\b|@ts-(?:ignore|expect-error)/);
});
