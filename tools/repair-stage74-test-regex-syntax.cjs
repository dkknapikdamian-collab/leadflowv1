const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const testPath = path.join(root, 'tests', 'stage74-clients-leads-to-link-panel.test.cjs');
const guardPath = path.join(root, 'scripts', 'check-stage74-clients-leads-to-link-panel.cjs');
const packagePath = path.join(root, 'package.json');
const stalePatchers = [
  path.join(root, 'tools', 'patch-stage74-clients-leads-to-link-panel.cjs'),
];

function fail(message) {
  console.error('STAGE74_TEST_REGEX_REPAIR_FAIL:', message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text, 'utf8');
}

for (const stale of stalePatchers) {
  if (fs.existsSync(stale)) {
    fs.rmSync(stale, { force: true });
    console.log('Removed stale failed patcher:', path.relative(root, stale));
  }
}

const clientsText = read(clientsPath);
for (const token of [
  'data-clients-lead-attention-rail="true"',
  'leadsNeedingClientOrCaseLink',
  'Leady do spięcia',
  'Brak klienta albo sprawy przy aktywnym temacie.',
  'Brak leadów wymagających spięcia.',
]) {
  if (!clientsText.includes(token)) fail(`Clients.tsx missing Stage74 token before test repair: ${token}`);
}

const testText = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const guardPath = path.join(root, 'scripts', 'check-stage74-clients-leads-to-link-panel.cjs');

function readClients() {
  return fs.readFileSync(clientsPath, 'utf8');
}

test('Stage74 guard and this test file are syntactically valid', () => {
  execFileSync(process.execPath, ['--check', guardPath], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, ['--check', __filename], { cwd: root, stdio: 'pipe' });
});

test('Stage74 clients rail uses lead-only source and final copy', () => {
  const text = readClients();
  assert.ok(text.includes('const leadsNeedingClientOrCaseLink = useMemo'), 'missing lead-only source name');
  assert.ok(text.includes('Leady do spięcia'), 'missing final title');
  assert.ok(text.includes('Brak klienta albo sprawy przy aktywnym temacie.'), 'missing final subtitle');
  assert.ok(text.includes('Brak leadów wymagających spięcia.'), 'missing final empty state');
  assert.equal(text.includes('Klienci do uwagi'), false, 'legacy client title still present');
  assert.equal(text.includes('Relacje bez pełnego spięcia lead/sprawa.'), false, 'legacy misleading subtitle still present');
  assert.equal(text.includes('Leady do uwagi'), false, 'old vague lead title still present');
});

test('Stage74 candidate source iterates leads, not clients', () => {
  const text = readClients();
  const start = text.indexOf('const leadsNeedingClientOrCaseLink = useMemo');
  const end = text.indexOf('const resetNewClientForm', start);
  assert.ok(start >= 0 && end > start, 'source block exists');
  const block = text.slice(start, end);
  assert.ok(block.includes('(leads as Record<string, unknown>[])'), 'candidate source must iterate leads');
  assert.equal(/clients\\.filter\\s*\\(/.test(block), false, 'candidate source must not filter clients');
  assert.match(block, /status\\s*===\\s*['"]archived['"]/);
  assert.match(block, /visibility\\s*===\\s*['"]trash['"]/);
  assert.match(block, /return\\s+!clientId\\s*\\|\\|\\s*!hasCase/);
});

test('Stage74 render block links rows to lead detail', () => {
  const text = readClients();
  const start = text.indexOf('data-clients-lead-attention-rail="true"');
  const end = text.indexOf('</aside>', start);
  assert.ok(start >= 0 && end > start, 'rail render block exists');
  const block = text.slice(start, end);
  assert.ok(block.includes('leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map'), 'rail must render lead-only source');
  assert.ok(block.includes("to={leadId ? '/leads/' + leadId : '/leads'}"), 'rail rows must link to lead detail');
  assert.equal(block.includes('client.name'), false, 'rail must not render client.name');
  assert.equal(block.includes('client.company'), false, 'rail must not render client.company');
});
`;
write(testPath, testText);

const guardText = read(guardPath);
if (guardText.includes("block.includes('status === 'archived'')")) {
  fail('Stage74 guard still contains the old unescaped archived string. Re-run guard syntax repair first.');
}

let packageText = read(packagePath);
if (packageText.charCodeAt(0) === 0xfeff) packageText = packageText.slice(1);
let changedPackage = false;
if (!packageText.includes('"check:stage74-clients-leads-to-link-panel"')) {
  const anchor = '"check:clients-attention-rail-visual-stage72"';
  const idx = packageText.indexOf(anchor);
  if (idx === -1) fail('Cannot insert Stage74 package script: Stage72 package script anchor missing.');
  const lineStart = packageText.lastIndexOf('\n', idx) + 1;
  const lineEnd = packageText.indexOf('\n', idx);
  const line = packageText.slice(lineStart, lineEnd === -1 ? packageText.length : lineEnd);
  const indent = line.match(/^\s*/)?.[0] || '    ';
  const insertAfter = lineEnd === -1 ? packageText.length : lineEnd + 1;
  const addition = `${indent}"check:stage74-clients-leads-to-link-panel":  "node scripts/check-stage74-clients-leads-to-link-panel.cjs",\n`;
  packageText = packageText.slice(0, insertAfter) + addition + packageText.slice(insertAfter);
  changedPackage = true;
}
if (!String(packageText).includes('node scripts/check-stage74-clients-leads-to-link-panel.cjs')) {
  const prebuildPattern = /("prebuild"\s*:\s*")([^"]*)(")/;
  if (!prebuildPattern.test(packageText)) fail('Cannot update prebuild: prebuild script missing.');
  packageText = packageText.replace(prebuildPattern, (_m, start, body, end) => `${start}${body} && node scripts/check-stage74-clients-leads-to-link-panel.cjs${end}`);
  changedPackage = true;
}
if (changedPackage) {
  write(packagePath, packageText);
  console.log('Updated package.json Stage74 script/prebuild wiring.');
} else {
  console.log('package.json Stage74 wiring already present.');
}

console.log('OK: Stage74 test regex syntax repair applied.');
