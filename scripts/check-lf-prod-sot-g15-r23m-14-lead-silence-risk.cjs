const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/LeadDetail.tsx';
const baseSha = 'e6658f6c';

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

const current = read(sourcePath);
const base = readFromGit(`${baseSha}:${sourcePath}`);
const salesStart = current.indexOf('const leadSalesSignalItemsStage227E4 =');
const salesEnd = current.indexOf('\n\n  const workCenterPanel =', salesStart);
const salesSignal = current.slice(salesStart, salesEnd);
const baseSalesStart = base.indexOf('const leadSalesSignalItemsStage227E4 =');
const baseSalesEnd = base.indexOf('\n\n  const workCenterPanel =', baseSalesStart);
const baseSalesSignal = base.slice(baseSalesStart, baseSalesEnd);
const helperStart = current.indexOf('function getLeadSilenceRisk(');
const helperEnd = current.indexOf('\n\n\nconst STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION', helperStart);
const baseHelperStart = base.indexOf('function getLeadSilenceRisk(');
const baseHelperEnd = base.indexOf('\n\n\nconst STAGE227E4_LEAD_DETAIL_SALES_SIGNAL_SECTION', baseHelperStart);

assert(baseSalesSignal.includes('leadSilenceRisk.riskLabel'), 'fail-first base must contain stale riskLabel consumer');
assert(baseSalesSignal.includes('leadSilenceRisk.riskReason'), 'fail-first base must contain stale riskReason consumer');
assert(salesSignal.includes('leadSilenceRisk.label'), 'sales signal must consume canonical silence risk label');
assert(salesSignal.includes('leadSilenceRisk.details'), 'sales signal must consume canonical silence risk details');
assert(!salesSignal.includes('leadSilenceRisk.riskLabel') && !salesSignal.includes('leadSilenceRisk.riskReason'), 'sales signal must not use stale risk aliases');
assert(current.slice(helperStart, helperEnd) === base.slice(baseHelperStart, baseHelperEnd), 'A2-14 must not alter the canonical silence-risk helper or thresholds');
for (const token of ['label,', 'headline,', 'details,', 'toneClass,']) assert(current.slice(helperStart, helperEnd).includes(token), `canonical helper lost returned field: ${token}`);
assert(!current.includes('@ts-ignore') && !current.includes('@ts-expect-error'), 'A2-14 must not add TypeScript bypass directives');

console.log('PASS: A2-14 aligns LeadDetail with getLeadSilenceRisk label/details without changing the canonical helper.');
