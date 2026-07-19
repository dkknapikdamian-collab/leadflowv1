const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '../..');
const testPath = path.join(root, 'tests/lf-prod-sot-g15-r3-task-delete-owner-evidence-fail-closed-runtime-adoption.test.cjs');
const taskPath = path.join(root, 'src/server/task-route-stage124f.ts');

for (const required of [testPath, taskPath]) {
  if (!fs.existsSync(required)) throw new Error(`MISSING_REQUIRED_FILE:${path.relative(root, required)}`);
}

const source = fs.readFileSync(testPath, 'utf8').replace(/\r\n/g, '\n');
if (!source.includes("const root = path.resolve(__dirname, '..');")) {
  throw new Error('G15_R3_TEST_ROOT_NOT_REPOSITORY_ROOT');
}
if (!source.includes("const taskPath = path.join(root, 'src/server/task-route-stage124f.ts');")) {
  throw new Error('G15_R3_TEST_RUNTIME_PATH_NOT_CANONICAL');
}
if (source.includes("const root = __dirname;") || source.includes("path.join(root, 'task-route-stage124f.ts')")) {
  throw new Error('G15_R3_TEST_LEGACY_TEMP_LAYOUT_REFERENCE_PRESENT');
}

const run = spawnSync(process.execPath, ['--test', testPath], {
  cwd: root,
  encoding: 'utf8',
  env: process.env,
});
process.stdout.write(run.stdout || '');
process.stderr.write(run.stderr || '');
if (run.status !== 0) throw new Error(`G15_R3_TEST_FAILED:${run.status}`);
const output = `${run.stdout || ''}\n${run.stderr || ''}`;
if (!/# pass 20\b/.test(output) || !/# fail 0\b/.test(output)) {
  throw new Error('G15_R3_EXPECTED_20_PASS_0_FAIL_NOT_PROVEN');
}

console.log('G15_R3_R1_PORTABILITY_GUARD: PASS');
console.log('G15_R3_TEST_SOURCE: src/server/task-route-stage124f.ts');
console.log('G15_R3_TEST_RESULT: 20_PASS_0_FAIL');
console.log('RUNTIME_CHANGED: NO');
