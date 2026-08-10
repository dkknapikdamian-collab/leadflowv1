const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/lib/finance/case-finance-source.ts';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-03-finance-payment-reduce.cjs';
const baseSha = '5501ee0f1f9bc61bb1f768f4bae64da1f8b47422';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-03 guard passes on the numeric payment reducers', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-03/);
});

test('A2-03 adds exactly three numeric reducer annotations', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' });
  const current = read(sourcePath);
  assert.equal((current.match(/\.reduce<number>\(/g) || []).length, 3);
  assert.equal((base.match(/\.reduce<number>\(/g) || []).length, 0);
  assert.notEqual(current, base.replace(/\.reduce\(/g, '.reduce<number>('));
});

test('A2-03 preserves refund and commission payment source rules', () => {
  const current = read(sourcePath);
  assert.match(current, /paymentType\(payment\) === 'refund' \? -amount : amount/);
  assert.match(current, /paymentType\(payment\) !== 'commission'/);
  assert.match(current, /paymentType\(payment\) === 'commission'/);
});
