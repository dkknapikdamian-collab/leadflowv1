const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function fail(message) {
  console.error('STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR_FAIL: ' + message);
  process.exit(1);
}

const pkg = JSON.parse(read('package.json'));
const quiet = read('scripts/closeflow-release-check-quiet.cjs');

if (pkg.scripts['verify:closeflow:quiet'] !== 'node scripts/closeflow-release-check-quiet.cjs') {
  fail('package.json verify:closeflow:quiet must stay exact quiet gate contract');
}

if (!quiet.includes("runQuiet('today tile no-scroll trap'")) {
  fail('closeflow-release-check-quiet.cjs must run R2AD Today tile no-scroll trap guard internally');
}

if (!quiet.includes("scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs")) {
  fail('quiet gate missing R2AD guard script path');
}

if (!fs.existsSync(path.join(root, 'scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs'))) {
  fail('R2AD guard script does not exist');
}

const quietContractTest = read('tests/closeflow-release-gate-quiet.test.cjs');
if (!quietContractTest.includes("assert.equal(pkg.scripts['verify:closeflow:quiet'], 'node scripts/closeflow-release-check-quiet.cjs');")) {
  fail('quiet contract test no longer protects exact verify script');
}

console.log('STAGE223_R2AE_QUIET_GATE_CONTRACT_REPAIR: OK');
