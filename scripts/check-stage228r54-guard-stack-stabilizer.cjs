const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const root = process.cwd();

function run(file) {
  const result = cp.spawnSync('node', [file], { cwd: root, encoding: 'utf8', shell: false });
  if (result.status !== 0) {
    process.stdout.write(result.stdout || '');
    process.stderr.write(result.stderr || '');
    throw new Error(file + ' failed');
  }
  return result.stdout;
}

const outputs = [
  run('scripts/check-stage228r50-no-flicker-real-anchors.cjs'),
  run('scripts/check-stage228r51-r50-guard-repair.cjs'),
  run('scripts/check-stage228r52-tasksstable-no-flicker-repair.cjs'),
  run('scripts/check-stage228r53-leaddetail-savedrecord-guard-repair.cjs')
].join('\n');

for (const token of [
  'STAGE228R50_NO_FLICKER_REAL_ANCHORS PASS',
  'STAGE228R51_R50_GUARD_REPAIR PASS',
  'STAGE228R52_TASKSSTABLE_NO_FLICKER_REPAIR PASS',
  'STAGE228R53_LEADDETAIL_SAVEDRECORD_GUARD_REPAIR PASS'
]) {
  if (!outputs.includes(token)) throw new Error('Missing guard pass token: ' + token);
}

console.log('STAGE228R54_GUARD_STACK_STABILIZER PASS');
