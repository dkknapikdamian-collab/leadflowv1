const fs = require('fs');
const path = require('path');

const root = process.cwd();
const docRel = 'docs/ui/CLOSEFLOW_VISUAL_QA_STAGE16B_2026-05-08.md';
const scriptRel = 'scripts/check-closeflow-visual-qa-stage16b.cjs';
const pkgRel = 'package.json';
const marker = 'CLOSEFLOW_VISUAL_QA_STAGE16B_2026_05_08';
const commandName = 'check:closeflow-visual-qa-stage16b';
const commandValue = 'node scripts/check-closeflow-visual-qa-stage16b.cjs';

function fail(message) {
  console.error('[closeflow-visual-qa-stage16b] FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function abs(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(abs(rel));
}

function read(rel) {
  return fs.readFileSync(abs(rel), 'utf8');
}

function readBytes(rel) {
  return fs.readFileSync(abs(rel));
}

function assertNoBom(rel) {
  const bytes = readBytes(rel);
  const hasBom = bytes.length >= 3 && bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf;
  assert(!hasBom, rel + ' must be UTF-8 without BOM');
}

function assertNoControlChars(rel, text) {
  assert(!/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text), rel + ' contains control chars');
}

function assertNoMojibake(rel, text) {
  const markers = [
    String.fromCharCode(0x00c4),
    String.fromCharCode(0x00c5),
    String.fromCharCode(0x0139),
    String.fromCharCode(0xfffd),
  ];
  for (const item of markers) {
    assert(!text.includes(item), rel + ' contains mojibake-like marker U+' + item.charCodeAt(0).toString(16).toUpperCase());
  }
}

for (const rel of [docRel, scriptRel, pkgRel]) {
  assert(exists(rel), 'Missing required file: ' + rel);
  assertNoBom(rel);
  const text = read(rel);
  assertNoControlChars(rel, text);
  assertNoMojibake(rel, text);
}

const doc = read(docRel);
const script = read(scriptRel);
const pkg = JSON.parse(read(pkgRel));

assert(doc.includes(marker), 'Stage16B document missing marker');
assert(script.includes(marker), 'Stage16B check missing marker');
assert(pkg.scripts && pkg.scripts[commandName] === commandValue, 'package.json missing ' + commandName);

const routes = ['/tasks', '/cases', '/leads', '/clients', '/ai-drafts', '/activity', '/notifications', '/calendar', '/templates'];
for (const route of routes) {
  assert(doc.includes(route), 'Stage16B document missing route ' + route);
}

const criteria = [
  'top metric tiles',
  'label nie lamie',
  'icons maja ten sam rozmiar',
  'value/liczba',
  'page hero/header',
  'action cluster',
  'mobile wrapping',
];
for (const token of criteria) {
  assert(doc.toLowerCase().includes(token.toLowerCase()), 'Stage16B document missing visual criterion: ' + token);
}

const allowed = ['OK', 'WYMAGA_STAGE16C', 'POZA_ZAKRESEM'];
for (const status of allowed) {
  assert(doc.includes(status), 'Stage16B document missing status ' + status);
}

for (const route of routes) {
  const rowPattern = new RegExp('\\|\\s*' + route.replace('/', '\\/') + '\\s*\\|\\s*(OK|WYMAGA_STAGE16C|POZA_ZAKRESEM)\\s*\\|');
  assert(rowPattern.test(doc), 'Stage16B decision table missing allowed decision for ' + route);
}

assert(/\|\s*\/tasks\s*\|\s*WYMAGA_STAGE16C\s*\|/.test(doc), '/tasks must require Stage16C after user screenshot feedback');
assert(/\|\s*\/cases\s*\|\s*WYMAGA_STAGE16C\s*\|/.test(doc), '/cases must require Stage16C after user screenshot feedback');
assert(/\|\s*\/notifications\s*\|\s*POZA_ZAKRESEM\s*\|/.test(doc), '/notifications must be explicitly outside top metric parity scope');

console.log('CLOSEFLOW_VISUAL_QA_STAGE16B_OK: visual QA decisions documented');
