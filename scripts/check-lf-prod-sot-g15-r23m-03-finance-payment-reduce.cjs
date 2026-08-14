const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = '5501ee0f1f9bc61bb1f768f4bae64da1f8b47422';
const sourcePath = 'src/lib/finance/case-finance-source.ts';

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

const oldBlocks = [
  [
    '    .reduce((sum, payment) => {',
    '      const amount = paymentAmount(payment);',
    "      return sum + (paymentType(payment) === 'refund' ? -amount : amount);",
    '    }, 0);',
  ].join('\n'),
  '      .reduce((sum, payment) => sum + paymentAmount(payment), 0),',
  '      .reduce((sum, payment) => sum + paymentAmount(payment), 0),',
];
const newBlocks = [
  [
    '    .reduce<number>((sum, payment) => {',
    '      const amount = paymentAmount(payment);',
    "      return sum + (paymentType(payment) === 'refund' ? -amount : amount);",
    '    }, 0);',
  ].join('\n'),
  '      .reduce<number>((sum, payment) => sum + paymentAmount(payment), 0),',
  '      .reduce<number>((sum, payment) => sum + paymentAmount(payment), 0),',
];

let expected = base;
for (let index = 0; index < oldBlocks.length; index += 1) {
  assert(expected.includes(oldBlocks[index]), `base reducer block ${index + 1} is missing`);
  expected = expected.replace(oldBlocks[index], newBlocks[index]);
}

assert(current === expected, 'current source must equal base with only three numeric reducer annotations');
assert((current.match(/\.reduce<number>\(/g) || []).length === 3, 'exactly three numeric reducers must be present');
assert(!current.includes('.reduce((sum, payment)'), 'untyped payment reducers must not remain');
assert(current.includes("paymentType(payment) === 'refund' ? -amount : amount"), 'refund sign behavior must remain unchanged');
assert(current.includes("paymentType(payment) !== 'commission'"), 'client paid filter must remain unchanged');
assert(current.includes("paymentType(payment) === 'commission'"), 'commission filter must remain unchanged');

console.log('PASS: A2-03 adds numeric reducer accumulators without changing finance payment semantics.');
