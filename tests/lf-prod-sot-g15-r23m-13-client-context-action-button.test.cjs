const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/ClientDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-13-client-context-action-button.cjs';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-13 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-13/);
});

test('A2-13 keeps both client task and event actions on the shared component', () => {
  const source = read(sourcePath);
  const start = source.indexOf('className="client-detail-right-actions');
  const end = source.indexOf('<section className="right-card client-detail-right-card"', start);
  const rail = source.slice(start, end);
  assert.equal((rail.match(/<ContextActionButton/g) || []).length, 2);
  assert.match(rail, /kind="task"/);
  assert.match(rail, /kind="event"/);
  assert.match(rail, /openContextQuickAction\(\{[\s\S]*?kind: 'task'/);
  assert.match(rail, /openContextQuickAction\(\{[\s\S]*?kind: 'event'/);
});

test('A2-13 does not widen ContextActionButton or duplicate its visual source', () => {
  const source = read(sourcePath);
  const component = read('src/components/ContextActionButton.tsx');
  const start = source.indexOf('className="client-detail-right-actions');
  const end = source.indexOf('<section className="right-card client-detail-right-card"', start);
  const rail = source.slice(start, end);
  assert.doesNotMatch(component, /variant\?:|size\?:/);
  assert.doesNotMatch(rail, /<ContextActionButton[\s\S]*?variant=/);
  assert.doesNotMatch(rail, /<ContextActionButton[\s\S]*?size=/);
  assert.match(component, /context-action-button--" \+ resolvedKind/);
  assert.match(read('src/styles/context-action-button-source-truth.css'), /\.context-action-button--task/);
  assert.match(read('src/styles/context-action-button-source-truth.css'), /\.context-action-button--event/);
});
