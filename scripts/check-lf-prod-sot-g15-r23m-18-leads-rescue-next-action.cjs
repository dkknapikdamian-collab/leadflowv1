const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/Leads.tsx';
const baseSha = '638e64f8';

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
const rescue = sliceBetween(current, 'data-stage226-lost-lead-rescue-row', 'data-stage25-lead-table-card');
const baseRescue = sliceBetween(base, 'data-stage226-lost-lead-rescue-row', 'data-stage25-lead-table-card');
const ordinaryStart = current.indexOf('const nextAction = nextActionByLeadId.get(leadId);');
assert(ordinaryStart >= 0, 'ordinary lead-row next-action declaration must remain discoverable');
const ordinaryWindow = current.slice(ordinaryStart, ordinaryStart + 1400);
const diff = execFileSync('git', ['diff', '--unified=0', baseSha, '--', sourcePath], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');

assert(baseRescue.includes('title={nextActionMeta.title}'), 'fail-first base must show stale nextActionMeta rescue reference');
assert(rescue.includes("title={row.nextMoveTitle || 'Brak zaplanowanej akcji'}"), 'rescue row must use its canonical nextMoveTitle field');
assert(!rescue.includes('nextActionMeta'), 'rescue branch must not reference ordinary-row nextActionMeta');
assert(ordinaryWindow.includes('const nextActionMeta = buildNextActionMeta(nextAction);'), 'ordinary lead rows must retain the canonical nextActionMeta builder');
assert(current.indexOf('nextActionMeta.title', ordinaryStart) > ordinaryStart, 'ordinary lead-row display must remain intact');
assert(!diff.split('\n').some((line) => line.startsWith('+') && /\bany\b|@ts-ignore|@ts-expect-error/.test(line)), 'A2-18 must not add any or TypeScript bypasses');

console.log('PASS: A2-18 scopes Leads rescue next-action title to row data and preserves ordinary lead-row metadata.');
