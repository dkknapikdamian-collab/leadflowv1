const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const sourcePath = path.join(root, 'src/lib/finance/case-finance-source.ts');

function readSource() {
  return fs.readFileSync(sourcePath, 'utf8');
}

function extractFunctionBody(source, functionName) {
  const start = source.indexOf(`export function ${functionName}`);
  assert.ok(start >= 0, `missing function ${functionName}`);
  const braceStart = source.indexOf('{', start);
  assert.ok(braceStart >= 0, `missing body for ${functionName}`);
  let depth = 0;
  for (let index = braceStart; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') depth -= 1;
    if (depth === 0) return source.slice(braceStart + 1, index);
  }
  throw new Error(`unterminated function ${functionName}`);
}

test('FIN-10 source exports required public functions', () => {
  const source = readSource();
  for (const name of [
    'getCaseFinanceValue',
    'getCaseFinanceCurrency',
    'getCaseClientPaidAmount',
    'getCaseCommissionPaidAmount',
    'getCaseCommissionDue',
    'getCaseFinanceSummary',
    'buildCaseFinancePatch',
  ]) {
    assert.match(source, new RegExp(`export function ${name}\\s*\\(`));
  }
});

test('FIN-10 paid-like statuses include product contract values', () => {
  const source = readSource();
  for (const status of ['paid', 'fully_paid', 'deposit_paid', 'partially_paid']) {
    assert.ok(source.includes(`'${status}'`), `missing paid-like status ${status}`);
  }
});

test('FIN-10 patch builder does not expose paidAmount or remainingAmount as editable source fields', () => {
  const source = readSource();
  const fn = extractFunctionBody(source, 'buildCaseFinancePatch');
  assert.ok(fn.includes('contractValue'));
  assert.ok(fn.includes('commissionMode'));

  const returnStart = fn.indexOf('return {');
  assert.ok(returnStart >= 0, 'buildCaseFinancePatch must return an object literal');
  const returnedObject = fn.slice(returnStart);

  assert.doesNotMatch(returnedObject, /\bpaidAmount\s*[:,]/);
  assert.doesNotMatch(returnedObject, /\bremainingAmount\s*[:,]/);
  assert.doesNotMatch(returnedObject, /\bpaid_amount\s*[:,]/);
  assert.doesNotMatch(returnedObject, /\bremaining_amount\s*[:,]/);
});

test('FIN-10 source contains expected calculation rules', () => {
  const source = readSource();
  assert.ok(source.includes("paymentType(payment) !== 'commission'"), 'client paid amount must exclude commission payments');
  assert.ok(source.includes("paymentType(payment) === 'commission'"), 'commission paid amount must use commission payments');
  assert.ok(source.includes('contractValue - clientPaidAmount'), 'remaining amount must derive from contract value minus client paid amount');
  assert.ok(source.includes('commissionAmount - commissionPaidAmount'), 'commission remaining must derive from commission due minus paid commission');
});
