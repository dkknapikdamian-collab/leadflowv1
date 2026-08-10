const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/pages/LeadDetail.tsx';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-14-lead-silence-risk.cjs';

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

test('A2-14 focused guard passes', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-14/);
});

test('A2-14 composes sales signals from canonical silence-risk fields', () => {
  const source = read(sourcePath);
  const start = source.indexOf('const leadSalesSignalItemsStage227E4 =');
  const end = source.indexOf('\n\n  const workCenterPanel =', start);
  const salesSignal = source.slice(start, end);
  assert.match(salesSignal, /leadSilenceRisk\.label/);
  assert.match(salesSignal, /leadSilenceRisk\.details/);
  assert.doesNotMatch(salesSignal, /leadSilenceRisk\.(?:riskLabel|riskReason)/);
});

test('A2-14 preserves the helper return contract and risk decision logic', () => {
  const source = read(sourcePath);
  const start = source.indexOf('function getLeadSilenceRisk(');
  const end = source.indexOf('\n\n\nconst STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION', start);
  const helper = source.slice(start, end);
  assert.match(helper, /return \{[\s\S]*?label,[\s\S]*?headline,[\s\S]*?details,[\s\S]*?toneClass,/);
  assert.match(helper, /settings\.criticalDays/);
  assert.match(helper, /settings\.warningDays/);
  assert.doesNotMatch(helper, /riskLabel|riskReason/);
});
