const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = 'f8ff90de';
const sourcePath = 'src/lib/missing-items/stage227c2-missing-item-modal-contract.ts';

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

const current = normalizeEol(fs.readFileSync(path.join(root, sourcePath), 'utf8'));
const base = normalizeEol(execFileSync('git', ['show', `${baseSha}:${sourcePath}`], {
  cwd: root,
  encoding: 'utf8',
}));

const oldBlock = [
  '  const result = validateMissingItemTitle(input.title);',
  '  if (!result.ok) {',
  '    throw new Error(result.error);',
  '  }',
].join('\n');
const newBlock = [
  '  const result = validateMissingItemTitle(input.title);',
  '  if (result.ok === false) {',
  '    throw new Error(result.error);',
  '  }',
].join('\n');

assert(base.includes(oldBlock), 'base must contain the implicit union narrowing check');
assert(!current.includes(oldBlock), 'current source must not retain the implicit union narrowing check');
assert(current.includes(newBlock), 'current source must use the explicit false discriminant');
assert(current === base.replace(oldBlock, newBlock), 'current source must equal base with only explicit union narrowing');
assert(current.includes('validateMissingItemTitle'), 'validation helper must remain the source of title validation');
assert(current.includes('buildMissingItemModalDraft'), 'draft builder contract must remain present');
assert(current.includes("getMissingItemPersistenceTarget(context.entityType)"), 'persistence target routing must remain unchanged');
assert(!/\bany\b|@ts-ignore|@ts-expect-error|as unknown as/.test(current), 'missing-item contract must not add a type bypass');

console.log('PASS: A2-05 makes missing-item validation union narrowing explicit without changing runtime wiring.');
