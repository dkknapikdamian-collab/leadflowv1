const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/Tasks.tsx';
const baseSha = '9d9ef57c';

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

function sliceBetween(source, startToken, endToken) {
  const start = source.indexOf(startToken);
  const end = source.indexOf(endToken, start);
  assert(start >= 0 && end > start, `source boundary missing: ${startToken}`);
  return source.slice(start, end);
}

const current = read(sourcePath);
const base = readFromGit(`${baseSha}:${sourcePath}`);
const currentReset = sliceBetween(current, 'const resetNewTask = () => {', '\n  const topicContactOptions');
const baseReset = sliceBetween(base, 'const resetNewTask = () => {', '\n  const topicContactOptions');
const currentNewPicker = sliceBetween(current, 'const selectedNewTaskOption = useMemo(', '\n\n  const selectedEditTaskOption');
const baseNewPicker = sliceBetween(base, 'const selectedNewTaskOption = useMemo(', '\n\n  const selectedEditTaskOption');
const currentEditPicker = sliceBetween(current, 'const selectedEditTaskOption = useMemo(', '\n\n  const handleSelectNewTaskRelation');
const baseEditPicker = sliceBetween(base, 'const selectedEditTaskOption = useMemo(', '\n\n  const handleSelectNewTaskRelation');

assert(baseReset.includes("caseId: '',") && !baseReset.includes("clientId: '',"), 'fail-first base must show reset clientId omission');
assert(current.includes("clientId: '',") && currentReset.includes("clientId: '',"), 'initial/reset task draft must include clientId');
assert(currentNewPicker.includes('newTask.clientId'), 'new-task picker must read clientId');
assert(currentNewPicker.includes('newTask.clientId, newTask.leadId, topicContactOptions'), 'new-task picker dependency list must include clientId');
assert(currentEditPicker.includes('editTask?.clientId'), 'edit-task picker must read clientId');
assert(currentEditPicker.includes('editTask?.clientId, editTask?.leadId, topicContactOptions'), 'edit-task picker dependency list must include clientId');
assert(baseNewPicker.includes('newTask.clientId') && !baseNewPicker.includes('newTask.clientId, topicContactOptions'), 'fail-first new picker dependency omission must remain evidenced');
assert(baseEditPicker.includes('editTask?.clientId') && !baseEditPicker.includes('editTask?.clientId, editTask?.leadId'), 'fail-first edit picker dependency omission must remain evidenced');
assert(current.includes('clientId: newTask.clientId || null'), 'task save clientId path must remain');

const diff = execFileSync('git', ['diff', '--unified=0', baseSha, '--', sourcePath], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
assert(!diff.split('\n').some((line) => line.startsWith('+') && /\bany\b|@ts-ignore|@ts-expect-error/.test(line)), 'A2-19 must not add any or TypeScript bypasses');

console.log('PASS: A2-19 keeps task client relation state, reset and picker dependencies coherent.');
