const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = process.cwd();
const sourcePath = 'src/pages/LeadDetail.tsx';
const baseSha = '554761c0';

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
const currentButtonStart = current.indexOf('function LeadActionButton(');
const currentButtonEnd = current.indexOf('\n\nconst CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT', currentButtonStart);
const currentButton = current.slice(currentButtonStart, currentButtonEnd);
const baseButtonStart = base.indexOf('function LeadActionButton(');
const baseButtonEnd = base.indexOf('\n\nconst CLOSEFLOW_FORM_ACTION_FOOTER_CONTRACT', baseButtonStart);
const baseButton = base.slice(baseButtonStart, baseButtonEnd);
const directBrakStart = current.indexOf('data-stage228r16-lead-direct-brak-button');
const directBrak = current.slice(current.lastIndexOf('<LeadActionButton', directBrakStart), current.indexOf('</LeadActionButton>', directBrakStart));
const diff = execFileSync('git', ['diff', '--unified=0', baseSha, '--', sourcePath], { cwd: root, encoding: 'utf8' }).replace(/\r\n/g, '\n');

assert(baseButton.includes('children, onClick, disabled'), 'fail-first base must show the narrow LeadActionButton contract');
assert(!baseButton.includes('onPointerDown={onPointerDown}'), 'fail-first base must not forward pointerdown');
assert(current.includes('type PointerEventHandler'), 'LeadActionButton pointer handler must use a typed React handler');
assert(currentButton.includes('onPointerDown?: PointerEventHandler<HTMLButtonElement>'), 'LeadActionButton contract must declare typed onPointerDown');
assert(currentButton.includes('onPointerDown={onPointerDown}'), 'LeadActionButton must forward onPointerDown to the native button');
assert(currentButton.includes('onClick={onClick}'), 'LeadActionButton click fallback must remain');
for (const token of ['onPointerDown=', 'onClick=', 'disabled={!hasAccess}', 'data-stage228r16-lead-direct-brak-button', "kind: 'blocker'", 'recordType: \'lead\'']) {
  assert(directBrak.includes(token), `direct lead Brak routing lost token: ${token}`);
}
assert(!diff.includes('+') || !diff.split('\n').some((line) => line.startsWith('+') && /\bany\b|@ts-ignore|@ts-expect-error/.test(line)), 'A2-15 must not add any or TypeScript bypasses');
assert(current.includes('if (hasAccess) openContextQuickAction'), 'pointerdown access gate must remain');

console.log('PASS: A2-15 types and forwards LeadActionButton pointerdown while preserving click fallback and access-gated Brak routing.');
