const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/ClientDetail.tsx';
const baseSha = '02bf7cef';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

function readFromGit(spec) {
  return execFileSync('git', ['show', spec], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
}

const current = read(sourcePath);
const base = readFromGit(`${baseSha}:${sourcePath}`);
const baseClientRail = base.slice(base.indexOf('className="client-detail-right-actions'), base.indexOf('<section className="right-card client-detail-right-card"', base.indexOf('className="client-detail-right-actions')));
const currentClientRail = current.slice(current.indexOf('className="client-detail-right-actions'), current.indexOf('<section className="right-card client-detail-right-card"', current.indexOf('className="client-detail-right-actions')));

assert((baseClientRail.match(/variant="outline"/g) || []).length === 2, 'fail-first base must contain both stale variant props');
assert((baseClientRail.match(/size="sm"/g) || []).length === 2, 'fail-first base must contain both stale size props');
assert((currentClientRail.match(/<ContextActionButton/g) || []).length === 2, 'both ClientDetail context action buttons must remain');
assert((currentClientRail.match(/variant=/g) || []).length === 0, 'ContextActionButton must not receive unsupported variant');
assert((currentClientRail.match(/size=/g) || []).length === 0, 'ContextActionButton must not receive unsupported size');
for (const token of [
  'kind="task"',
  'kind="event"',
  'recordType="client"',
  'openContextQuickAction({',
  "kind: 'task'",
  "kind: 'event'",
  'disabled={!hasAccess}',
]) {
  assert(currentClientRail.includes(token), `ClientDetail action rail lost canonical routing token: ${token}`);
}
assert(current.includes("import ContextActionButton from '../components/ContextActionButton';"), 'ClientDetail must keep the shared ContextActionButton owner');
assert(current.includes('.context-action-button--task') || read('src/styles/context-action-button-source-truth.css').includes('.context-action-button--task'), 'task visual source of truth must remain available');
assert(current.includes('.context-action-button--event') || read('src/styles/context-action-button-source-truth.css').includes('.context-action-button--event'), 'event visual source of truth must remain available');
assert(!current.includes('@ts-ignore') && !current.includes('@ts-expect-error'), 'A2-13 must not add TypeScript bypass directives');

console.log('PASS: A2-13 aligns ClientDetail with the ContextActionButton contract and preserves action routing and visual SOT.');
