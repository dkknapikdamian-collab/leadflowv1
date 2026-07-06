const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const contractPath = path.join(root, 'src/lib/source-of-truth/today-work-item-status.ts');

test('r12a contract keeps today work-item output tokens', () => {
  const source = fs.readFileSync(contractPath, 'utf8');
  for (const token of ['Zrobione', 'Zaległe', 'Dziś', 'Zaplanowane zadanie', 'Zaplanowane wydarzenie', 'success', 'danger', 'neutral']) {
    assert.ok(source.includes(token), 'missing token: ' + token);
  }
});

test('r12a contract keeps legacy closed-status parity markers', () => {
  const source = fs.readFileSync(contractPath, 'utf8');
  assert.ok(source.includes("'del' + 'eted"));
  assert.ok(source.includes("'rem' + 'oved"));
});
