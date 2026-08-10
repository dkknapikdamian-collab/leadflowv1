const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const baseSha = '299a4e165e27bc36d73b72980beab30f79b246f9';
const sourcePath = 'src/hooks/useFirebaseSession.ts';
const sourceFile = path.join(root, sourcePath);

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readCurrent() {
  return fs.readFileSync(sourceFile, 'utf8');
}

function readBase() {
  return execFileSync('git', ['show', `${baseSha}:${sourcePath}`], {
    cwd: root,
    encoding: 'utf8',
  });
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

const base = readBase();
const current = readCurrent();
const staleLucideImport = "import { User } from 'lucide-react';";
const firebaseUserImport = "import { onAuthStateChanged, type Auth, type User } from 'firebase/auth';";

assert(base.includes(staleLucideImport), 'base must contain the diagnosed stale Lucide User import');
assert(!current.includes(staleLucideImport), 'current hook must not import User from lucide-react');
assert(current.split(firebaseUserImport).length - 1 === 1, 'current hook must contain exactly one Firebase User type import');
const expected = normalizeEol(base).replace(`${staleLucideImport}\n`, '');
const normalizedCurrent = normalizeEol(current);
assert(normalizedCurrent === expected, 'current hook must equal base with only the stale import removed');
assert(normalizedCurrent.includes('onAuthStateChanged(auth, (nextUser) => {'), 'Firebase auth listener must remain unchanged');
assert(normalizedCurrent.includes('return [user, loading] as const;'), 'hook return contract must remain unchanged');

console.log('PASS: A2-01 removes only the colliding Lucide User import and preserves Firebase session behavior.');
