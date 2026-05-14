const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const guardPath = path.join(root, 'scripts', 'check-stage74-clients-leads-to-link-panel.cjs');
const testPath = path.join(root, 'tests', 'stage74-clients-leads-to-link-panel.test.cjs');
const packagePath = path.join(root, 'package.json');
const stalePatchers = [
  path.join(root, 'tools', 'patch-stage74-clients-leads-to-link-panel.cjs'),
];

function fail(message) {
  console.error('STAGE74_GUARD_REPAIR_FAIL:', message);
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
if (!clientsText.includes('data-clients-lead-attention-rail="true"')) {
  fail('Clients rail marker not found. Re-run the Stage74 final patch first or inspect Clients.tsx manually.');
}
if (!clientsText.includes('Leady do spięcia')) {
  fail('Stage74 final copy is not present in Clients.tsx: missing "Leady do spięcia".');
}
if (!clientsText.includes('Brak leadów wymagających spięcia.')) {
  fail('Stage74 final empty state is not present in Clients.tsx.');
}
if (!clientsText.includes('leadsNeedingClientOrCaseLink')) {
  fail('Stage74 lead-only data source is not present in Clients.tsx.');
}

const guardText = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const packagePath = path.join(root, 'package.json');
const clients = fs.readFileSync(clientsPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

function fail(message) {
  console.error('STAGE74_CLIENTS_LEADS_TO_LINK_PANEL_FAIL:', message);
  process.exit(1);
}

function requireToken(token, message) {
  if (!clients.includes(token)) fail(message || ('missing token: ' + token));
}

requireToken('data-clients-lead-attention-rail="true"', 'missing lead attention rail marker');
requireToken('const leadsNeedingClientOrCaseLink = useMemo', 'missing explicit lead-only data source');
requireToken('Leady do spięcia', 'missing final panel title');
requireToken('Brak klienta albo sprawy przy aktywnym temacie.', 'missing final panel subtitle');
requireToken('Brak leadów wymagających spięcia.', 'missing final empty state');
requireToken('data-right-rail-list="lead-attention"', 'missing right rail list marker');
requireToken('data-right-rail-row="lead-attention"', 'missing right rail row marker');
requireToken('right-list-row-main', 'missing shared right rail row layout');
requireToken('right-list-title', 'missing shared right rail title layout');
requireToken('right-list-meta', 'missing shared right rail meta layout');
requireToken('right-list-badges', 'missing shared right rail badge layout');
requireToken('right-list-pill right-list-pill-ok', 'missing ok relation pill');
requireToken('right-list-pill right-list-pill-warn', 'missing warn relation pill');

if (clients.includes('Klienci do uwagi')) fail('legacy client attention copy still present');
if (clients.includes('Relacje bez pełnego spięcia lead/sprawa.')) fail('legacy misleading subtitle still present');
if (clients.includes('Leady do uwagi')) fail('old vague lead attention copy still present');
if (clients.includes('const followupCandidates = useMemo')) fail('legacy client candidates source still exists');
if (clients.includes('const followupLeadCandidates = useMemo')) fail('old followupLeadCandidates source still exists; use leadsNeedingClientOrCaseLink');
if (clients.includes('followupLeadCandidates.length ? followupLeadCandidates.map')) fail('rail still renders old followupLeadCandidates');

const sourceStart = clients.indexOf('const leadsNeedingClientOrCaseLink = useMemo');
const sourceEnd = clients.indexOf('const resetNewClientForm', sourceStart);
if (sourceStart === -1 || sourceEnd === -1 || sourceEnd <= sourceStart) fail('cannot isolate lead-only candidate source block');
const block = clients.slice(sourceStart, sourceEnd);

if (!block.includes('(leads as Record<string, unknown>[])')) fail('candidate source does not iterate leads');
if (/return\\s+clients\\s*\\./.test(block) || /clients\\.filter\\s*\\(/.test(block)) fail('candidate source still filters clients');
if (!/status\\s*===\\s*['"]archived['"]/.test(block) || !/visibility\\s*===\\s*['"]trash['"]/.test(block)) {
  fail('candidate block does not exclude archived/trash leads');
}
if (!block.includes('getStage35RelationClientId(lead)')) fail('candidate block does not resolve client relation from lead');
if (!block.includes('caseLeadIds') || !block.includes('caseClientIds')) fail('candidate block does not inspect lead/case relation sets');
if (!/return\\s+!clientId\\s*\\|\\|\\s*!hasCase/.test(block)) fail('candidate block does not keep leads missing client or case link');

const renderStart = clients.indexOf('data-clients-lead-attention-rail="true"');
const renderEnd = clients.indexOf('</aside>', renderStart);
if (renderStart === -1 || renderEnd === -1 || renderEnd <= renderStart) fail('cannot isolate lead attention rail render block');
const renderBlock = clients.slice(renderStart, renderEnd);
if (!renderBlock.includes('leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map')) fail('rail does not render leadsNeedingClientOrCaseLink');
if (!renderBlock.includes("to={leadId ? '/leads/' + leadId : '/leads'}")) fail('lead attention rows do not link to lead detail');
if (renderBlock.includes('client.name') || renderBlock.includes('client.company')) fail('rail render block still reads client row fields');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
if (!prebuild.includes('check-stage74-clients-leads-to-link-panel.cjs')) fail('prebuild does not include Stage74 guard');
if (!pkg.scripts || pkg.scripts['check:stage74-clients-leads-to-link-panel'] !== 'node scripts/check-stage74-clients-leads-to-link-panel.cjs') {
  fail('missing package script check:stage74-clients-leads-to-link-panel');
}

console.log('OK stage74 clients leads-to-link panel');
`;
write(guardPath, guardText);

const testText = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const guardPath = path.join(root, 'scripts', 'check-stage74-clients-leads-to-link-panel.cjs');

test('Stage74 guard is syntactically valid', () => {
  execFileSync(process.execPath, ['--check', guardPath], { cwd: root, stdio: 'pipe' });
});

test('Stage74 clients rail uses lead-only source and copy', () => {
  const text = fs.readFileSync(clientsPath, 'utf8');
  assert.match(text, /const leadsNeedingClientOrCaseLink = useMemo/);
  assert.match(text, /Leady do spię[ćc]ia/);
  assert.match(text, /Brak klienta albo sprawy przy aktywnym temacie\./);
  assert.match(text, /Brak leadów wymagających spięcia\./);
  assert.doesNotMatch(text, /Klienci do uwagi/);
  assert.doesNotMatch(text, /Relacje bez pełnego spięcia lead\/sprawa\./);
});

test('Stage74 candidate source iterates leads, not clients', () => {
  const text = fs.readFileSync(clientsPath, 'utf8');
  const start = text.indexOf('const leadsNeedingClientOrCaseLink = useMemo');
  const end = text.indexOf('const resetNewClientForm', start);
  assert.ok(start >= 0 && end > start, 'source block exists');
  const block = text.slice(start, end);
  assert.match(block, /\(leads as Record<string, unknown>\[\]\)/);
  assert.doesNotMatch(block, /clients\.filter\s*\(/);
  assert.match(block, /status\s*===\s*['"]archived['"]/);
  assert.match(block, /visibility\s*===\s*['"]trash['"]/);
  assert.match(block, /return\s+!clientId\s*\|\|\s*!hasCase/);
});
`;
write(testPath, testText);

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
if (!packageText.includes('node scripts/check-stage74-clients-leads-to-link-panel.cjs')) {
  const prebuildPattern = /("prebuild"\s*:\s*")([^"]*)(")/;
  if (!prebuildPattern.test(packageText)) fail('Cannot update prebuild: prebuild script missing.');
  packageText = packageText.replace(prebuildPattern, (_m, start, body, end) => {
    if (body.includes('check-stage74-clients-leads-to-link-panel.cjs')) return _m;
    return `${start}${body} && node scripts/check-stage74-clients-leads-to-link-panel.cjs${end}`;
  });
  changedPackage = true;
}
if (changedPackage) {
  write(packagePath, packageText);
  console.log('Updated package.json Stage74 script/prebuild wiring.');
} else {
  console.log('package.json Stage74 wiring already present.');
}

console.log('OK: Stage74 guard syntax/finalizer repair applied.');
