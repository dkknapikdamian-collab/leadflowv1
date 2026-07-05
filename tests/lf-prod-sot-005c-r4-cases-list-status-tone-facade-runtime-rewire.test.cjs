const test = require('node:test');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
const fs = require('node:fs');

const cases = () => fs.readFileSync('src/pages/Cases.tsx', 'utf8');

test('R4 repair guard passes', () => {
  assert.doesNotThrow(() => {
    cp.execFileSync('node', [
      'scripts/guards/verify-lf-prod-sot-005c-r4-cases-list-status-tone-facade-runtime-rewire.cjs'
    ], { stdio: 'pipe' });
  });
});

test('Cases list status tone uses facade and preserves safe boundaries', () => {
  const text = cases();

  assert.match(text, /import \{ getCaseStatusLabel, getCaseStatusTone \} from '\.\.\/lib\/config\/case-status';/);
  assert.match(text, /const statusLabel = getCaseStatusLabel\(record\.status\);/);
  assert.match(text, /const statusTone = isCaseClosedStage231B0R13 \? 'green' : getCaseStatusTone\(record\.status\);/);
  assert.doesNotMatch(text, /record\.status === 'blocked' \? 'red' : record\.status === 'waiting_on_client' \? 'amber' : 'blue'/);

  assert.match(text, /<option value="in_progress">W realizacji<\/option>/);
  assert.match(text, /<option value="waiting_on_client">Czeka na klienta<\/option>/);
  assert.match(text, /<option value="blocked">Zablokowana<\/option>/);
  assert.match(text, /<option value="ready_to_start">Gotowa do startu<\/option>/);

  assert.match(text, /status: newCase\.status/);
  assert.match(text, /\(\) => cases\.filter\(\(record\) => !isClosedCaseStatus\(record\.status\)\)/);
  assert.match(text, /\(\) => cases\.filter\(\(record\) => isClosedCaseStatus\(record\.status\)\)/);
});