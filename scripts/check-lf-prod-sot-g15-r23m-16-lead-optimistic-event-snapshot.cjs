const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/LeadDetail.tsx';
const baseSha = '046dc107';

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

function getDeleteHandler(source) {
  const start = source.indexOf('const handleDeleteLinkedEvent = async');
  const end = source.indexOf('\n\n  const handleSaveLinkedTaskEdit', start);
  assert(start >= 0 && end > start, 'handleDeleteLinkedEvent boundary must remain discoverable');
  return source.slice(start, end);
}

const current = read(sourcePath);
const base = readFromGit(`${baseSha}:${sourcePath}`);
const currentHandler = getDeleteHandler(current);
const baseHandler = getDeleteHandler(base);
const currentSnapshot = 'const optimisticEventSnapshot = linkedEvents;';

assert(baseHandler.includes('const optimisticEventSnapshot = linkedEvents;'), 'fail-first base must contain the original snapshot declaration');
assert(baseHandler.indexOf(currentSnapshot) > baseHandler.indexOf('try {'), 'fail-first base must show the snapshot declared inside try');
assert(currentHandler.includes(currentSnapshot), 'current delete handler must capture the linked event snapshot');
assert(currentHandler.indexOf(currentSnapshot) < currentHandler.indexOf('try {'), 'snapshot must be declared before try so catch can restore it');
assert(currentHandler.includes('setLinkedEvents((previous) => previous.filter'), 'optimistic event removal must remain');
assert(currentHandler.includes('await deleteEventFromSupabase(eventId);'), 'backend event deletion must remain');
assert(currentHandler.includes('setLinkedEvents(optimisticEventSnapshot);'), 'catch rollback must remain');
assert(currentHandler.includes("await loadLead({ silent: true });"), 'successful delete must retain silent refresh');

const diff = execFileSync('git', ['diff', '--unified=0', baseSha, '--', sourcePath], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
assert(!diff.split('\n').some((line) => line.startsWith('+') && /\bany\b|@ts-ignore|@ts-expect-error/.test(line)), 'A2-16 must not add any or TypeScript bypasses');

console.log('PASS: A2-16 keeps the optimistic event snapshot in shared handler scope and preserves delete rollback.');
