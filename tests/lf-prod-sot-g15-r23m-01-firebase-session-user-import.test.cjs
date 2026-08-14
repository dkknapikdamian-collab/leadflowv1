const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const test = require('node:test');

const root = process.cwd();
const sourcePath = 'src/hooks/useFirebaseSession.ts';
const guardPath = 'scripts/check-lf-prod-sot-g15-r23m-01-firebase-session-user-import.cjs';
const baseSha = '299a4e165e27bc36d73b72980beab30f79b246f9';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function normalizeEol(value) {
  return value.replace(/\r\n/g, '\n');
}

test('A2-01 guard passes on the repaired hook', () => {
  const output = execFileSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.match(output, /PASS: A2-01/);
});

test('A2-01 removes exactly the diagnosed import', () => {
  const base = execFileSync('git', ['show', `${baseSha}:${sourcePath}`], { cwd: root, encoding: 'utf8' });
  const current = read(sourcePath);
  const expected = normalizeEol(base).replace("import { User } from 'lucide-react';\n", '');

  assert.notEqual(normalizeEol(current), normalizeEol(base));
  assert.equal(normalizeEol(current), expected);
  assert.equal(current.includes("import { User } from 'lucide-react';"), false);
  assert.equal(current.split("type Auth, type User } from 'firebase/auth'").length - 1, 1);
});

test('A2-01 preserves the Firebase listener and tuple return contract', () => {
  const current = read(sourcePath);
  assert.match(current, /onAuthStateChanged\(auth, \(nextUser\) => \{/);
  assert.match(current, /setUser\(nextUser\);/);
  assert.match(current, /return \[user, loading\] as const;/);
});
