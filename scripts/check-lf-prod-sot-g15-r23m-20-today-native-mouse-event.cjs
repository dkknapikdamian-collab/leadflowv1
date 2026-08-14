const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const todayPath = 'src/pages/Today.tsx';
const stablePath = 'src/pages/TodayStable.tsx';
const baseSha = 'bdabf65c';

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

const currentToday = read(todayPath);
const currentStable = read(stablePath);
const baseToday = readFromGit(`${baseSha}:${todayPath}`);
const baseStable = readFromGit(`${baseSha}:${stablePath}`);

assert(baseToday.includes('type MouseEvent'), 'fail-first Today base must import React MouseEvent');
assert(baseStable.includes('type MouseEvent'), 'fail-first TodayStable base must import React MouseEvent');
assert(!currentToday.includes('type MouseEvent'), 'Today must not import React MouseEvent for native listeners');
assert(!currentStable.includes('type MouseEvent'), 'TodayStable must not import React MouseEvent for native listeners');
assert(currentToday.includes('event.stopImmediatePropagation();'), 'Today pipeline capture must preserve immediate propagation control');
for (const [source, label] of [[currentToday, 'Today'], [currentStable, 'TodayStable']]) {
  assert(source.includes("addEventListener('click'"), `${label} native click listener registration must remain`);
  assert(source.includes("removeEventListener('click'"), `${label} native click listener cleanup must remain`);
}
const diff = execFileSync('git', ['diff', '--unified=0', baseSha, '--', todayPath, stablePath], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');
assert(!diff.split('\n').some((line) => line.startsWith('+') && /\bany\b|@ts-ignore|@ts-expect-error/.test(line)), 'A2-20 must not add any or TypeScript bypasses');

console.log('PASS: A2-20 restores DOM MouseEvent typing for Today native listeners and preserves propagation/cleanup.');
