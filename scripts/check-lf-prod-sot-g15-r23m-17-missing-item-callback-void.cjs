const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/LeadDetail.tsx';
const baseSha = 'b94f069f';

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

function getHandler(source, name, nextName) {
  const start = source.indexOf(`const ${name} = async`);
  const end = source.indexOf(`  const ${nextName}`, start);
  assert(start >= 0 && end > start, `${name} boundary must remain discoverable`);
  return source.slice(start, end);
}

const handlers = [
  ['handleAddLeadMissingFromManagerStage232I4R14', 'handleToggleLeadMissingBlockerStage232I4R14'],
  ['handleToggleLeadMissingBlockerStage232I4R14', 'handleResolveLeadMissingItemStage228R13'],
  ['handleResolveLeadMissingItemStage228R13', 'handleDeleteLeadMissingItemStage228R15'],
  ['handleDeleteLeadMissingItemStage228R15', 'openLeadPaymentDialog'],
];
const current = read(sourcePath);
const base = readFromGit(`${baseSha}:${sourcePath}`);

for (const [name, nextName] of handlers) {
  const currentHandler = getHandler(current, name, nextName);
  const baseHandler = getHandler(base, name, nextName);
  assert(baseHandler.includes('return toast.error('), `fail-first base must show toast return drift in ${name}`);
  assert(!currentHandler.includes('return toast.error('), `${name} must not return the toast identifier`);
  assert(currentHandler.includes('toast.error('), `${name} must preserve error feedback`);
  assert(currentHandler.includes('return;'), `${name} must explicitly return void after early feedback`);
}

const addHandler = getHandler(current, handlers[0][0], handlers[0][1]);
const toggleHandler = getHandler(current, handlers[1][0], handlers[1][1]);
const resolveHandler = getHandler(current, handlers[2][0], handlers[2][1]);
const deleteHandler = getHandler(current, handlers[3][0], handlers[3][1]);
for (const [handler, token] of [
  [addHandler, 'insertTaskToSupabase'],
  [toggleHandler, 'updateTaskInSupabase'],
  [resolveHandler, "status: 'done'"],
  [deleteHandler, 'hardDeleteTaskFromSupabase'],
]) {
  assert(handler.includes(token), `missing-item mutation token lost: ${token}`);
}
assert(addHandler.includes('if (!hasAccess)'), 'add callback auth gate lost');
assert(toggleHandler.includes('if (!hasAccess)'), 'toggle callback auth gate lost');
assert(resolveHandler.includes('if (!hasAccess)'), 'resolve callback auth gate lost');
assert(deleteHandler.includes('if (!hasAccess)'), 'delete callback auth gate lost');

const diff = execFileSync('git', ['diff', '--unified=0', baseSha, '--', sourcePath], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
assert(!diff.split('\n').some((line) => line.startsWith('+') && /\bany\b|@ts-ignore|@ts-expect-error/.test(line)), 'A2-17 must not add any or TypeScript bypasses');

console.log('PASS: A2-17 aligns missing-item callbacks with void-return contracts while preserving auth and mutations.');
