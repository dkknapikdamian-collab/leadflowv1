const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = '8dfa7387';
const sourcePath = 'src/lib/supabase-fallback.ts';

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
const staleBranch = "      if (!params?.includeArchived && String((row as any).status || '').toLowerCase() === 'archived') return false;\n";

assert(base.includes(staleBranch), 'base must contain the stale payment archive branch');
assert(!current.includes(staleBranch), 'current source must remove the stale payment archive branch');
assert(current === base.replace(staleBranch, ''), 'current source must equal base with only the stale archive branch removed');
for (const token of ['params?.leadId', 'params?.caseId', 'params?.clientId', 'params?.status', 'normalizePaymentListContract']) {
  assert(current.includes(token), `supported payment fallback contract must remain present: ${token}`);
}
assert(!current.includes('/api/payments?includeArchived'), 'payment API must not gain an unsupported includeArchived query');

console.log('PASS: A2-06 removes the unsupported payment archive preview branch without changing supported filters.');
