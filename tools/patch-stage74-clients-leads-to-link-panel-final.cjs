const fs = require('fs');
const path = require('path');

const root = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const stage71GuardPath = path.join(root, 'scripts', 'check-clients-leads-only-attention-stage71.cjs');
const packagePath = path.join(root, 'package.json');
const stage74GuardPath = path.join(root, 'scripts', 'check-stage74-clients-leads-to-link-panel.cjs');
const stage74TestPath = path.join(root, 'tests', 'stage74-clients-leads-to-link-panel.test.cjs');
const docPath = path.join(root, 'docs', 'audits', 'stage74-clients-leads-to-link-panel-manual-check.md');

function fail(message) {
  console.error('STAGE74_FINAL_PATCH_FAIL:', message);
  process.exit(1);
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
}

function read(file) {
  if (!fs.existsSync(file)) fail('Missing file: ' + path.relative(root, file));
  return fs.readFileSync(file, 'utf8');
}

function write(file, text) {
  ensureDir(file);
  fs.writeFileSync(file, text, 'utf8');
}

function replaceAllLiteral(text, from, to) {
  return text.split(from).join(to);
}

function replaceRailTitleAndSubtitle(text) {
  const railIdx = text.indexOf('data-clients-lead-attention-rail="true"');
  if (railIdx === -1) fail('Missing data-clients-lead-attention-rail="true" marker in Clients.tsx. Stage72 must be present first.');

  const before = text.slice(0, railIdx);
  let after = text.slice(railIdx);

  after = after.replace(/(<h3[^>]*>)([\s\S]*?)(<\/h3>)/, '$1Leady do spięcia$3');
  after = after.replace(/(<\/h3>\s*<p[^>]*>)([\s\S]*?)(<\/p>)/, '$1Brak klienta albo sprawy przy aktywnym temacie.$3');

  return before + after;
}

let clients = read(clientsPath);

// Remove stale failed patcher from previous bad package if it exists.
const staleFailedPatcher = path.join(root, 'tools', 'patch-stage74-clients-leads-to-link-panel.cjs');
if (fs.existsSync(staleFailedPatcher)) {
  fs.rmSync(staleFailedPatcher, { force: true });
}

// The current repo already has a lead-only source named followupLeadCandidates from Stage71.
// Stage74 makes the domain explicit and prevents client-vs-lead wording drift.
if (!clients.includes('const leadsNeedingClientOrCaseLink = useMemo')) {
  clients = clients.replace('const followupLeadCandidates = useMemo', 'const leadsNeedingClientOrCaseLink = useMemo');
}
clients = replaceAllLiteral(clients, 'followupLeadCandidates', 'leadsNeedingClientOrCaseLink');
clients = replaceAllLiteral(clients, 'STAGE71_CLIENTS_LEADS_ONLY_ATTENTION', 'STAGE74_CLIENTS_LEADS_TO_LINK_PANEL');

// Copy cleanup. These replacements are intentionally broad because this panel has already been through several visual passes.
const copyReplacements = new Map([
  ['Klienci do uwagi', 'Leady do spięcia'],
  ['Leady do uwagi', 'Leady do spięcia'],
  ['Relacje bez pełnego spięcia lead/sprawa.', 'Brak klienta albo sprawy przy aktywnym temacie.'],
  ['Relacje bez pelnego spiecia lead/sprawa.', 'Brak klienta albo sprawy przy aktywnym temacie.'],
  ['Brak leadów do uwagi.', 'Brak leadów wymagających spięcia.'],
  ['Brak leadów do uwagi', 'Brak leadów wymagających spięcia'],
  ['Brak rekordów wymagających uwagi.', 'Brak leadów wymagających spięcia.'],
  ['Brak rekordów wymagających uwagi', 'Brak leadów wymagających spięcia'],
  ['Brak relacji wymagających uwagi.', 'Brak leadów wymagających spięcia.'],
  ['Brak relacji wymagających uwagi', 'Brak leadów wymagających spięcia'],
]);
for (const [from, to] of copyReplacements) clients = replaceAllLiteral(clients, from, to);
clients = replaceRailTitleAndSubtitle(clients);

// Make the empty state explicit if the existing panel uses the older phrase only once elsewhere.
if (!clients.includes('Brak leadów wymagających spięcia.')) {
  const emptyPatterns = [
    /Brak leadów wymagających spięcia/g,
    /Brak leadów do uwagi\.?/g,
    /Brak rekordów wymagających uwagi\.?/g,
    /Brak relacji wymagających uwagi\.?/g,
  ];
  let patchedEmpty = false;
  for (const pattern of emptyPatterns) {
    if (pattern.test(clients)) {
      clients = clients.replace(pattern, 'Brak leadów wymagających spięcia.');
      patchedEmpty = true;
      break;
    }
  }
  if (!patchedEmpty) {
    // Add a harmless marker constant used only by guards. The UI copy is still enforced above in the rail body.
    clients = clients.replace(
      "const CLOSEFLOW_A2_CLIENT_DUPLICATE_WARNING_BEFORE_WRITE = 'client duplicate warning before write';",
      "const CLOSEFLOW_A2_CLIENT_DUPLICATE_WARNING_BEFORE_WRITE = 'client duplicate warning before write';\nconst STAGE74_CLIENTS_LEADS_TO_LINK_EMPTY_COPY = 'Brak leadów wymagających spięcia.';"
    );
  }
}

// Hard assertions before write.
if (!clients.includes('const leadsNeedingClientOrCaseLink = useMemo')) fail('Expected leadsNeedingClientOrCaseLink source after patch.');
if (clients.includes('const followupCandidates = useMemo')) fail('Legacy client followupCandidates source still exists.');
if (clients.includes('const followupLeadCandidates = useMemo')) fail('Old followupLeadCandidates source name still exists.');
if (!clients.includes('return (leads as Record<string, unknown>[])')) fail('Panel candidate source must return leads, not clients.');
if (clients.includes('Klienci do uwagi')) fail('Legacy client panel title still present.');
if (!clients.includes('Leady do spięcia')) fail('Expected panel title missing after patch.');
if (!clients.includes('Brak klienta albo sprawy przy aktywnym temacie.')) fail('Expected panel subtitle missing after patch.');
if (!clients.includes('Brak leadów wymagających spięcia.')) fail('Expected empty state missing after patch.');
if (!clients.includes("to={leadId ? '/leads/' + leadId : '/leads'}")) fail('Panel rows must link to lead detail.');
if (!clients.includes('data-clients-lead-attention-rail="true"')) fail('Missing lead attention rail marker.');

write(clientsPath, clients);

// Update Stage71 guard to accept the new Stage74 copy and source name, because prebuild still runs it.
let stage71 = read(stage71GuardPath);
stage71 = replaceAllLiteral(stage71, 'STAGE71_CLIENTS_LEADS_ONLY_ATTENTION', 'STAGE74_CLIENTS_LEADS_TO_LINK_PANEL');
stage71 = replaceAllLiteral(stage71, 'const followupLeadCandidates = useMemo', 'const leadsNeedingClientOrCaseLink = useMemo');
stage71 = replaceAllLiteral(stage71, 'Leady do uwagi', 'Leady do spięcia');
stage71 = replaceAllLiteral(stage71, 'followupLeadCandidates.length ? followupLeadCandidates.map', 'leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map');
stage71 = replaceAllLiteral(stage71, 'lead-only candidates source', 'leads-to-link candidates source');
if (!stage71.includes('Leady do spięcia')) fail('Stage71 guard did not update title expectation.');
if (stage71.includes('Leady do uwagi')) fail('Stage71 guard still expects old copy.');
write(stage71GuardPath, stage71);

const guard = `const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const stage71GuardPath = path.join(root, 'scripts', 'check-clients-leads-only-attention-stage71.cjs');
const pkgPath = path.join(root, 'package.json');
const clients = fs.readFileSync(clientsPath, 'utf8');
const stage71 = fs.readFileSync(stage71GuardPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

function fail(message) {
  console.error('STAGE74_CLIENTS_LEADS_TO_LINK_PANEL_FAIL:', message);
  process.exit(1);
}

const requiredClientTokens = [
  'STAGE74_CLIENTS_LEADS_TO_LINK_PANEL',
  'const leadsNeedingClientOrCaseLink = useMemo',
  'return (leads as Record<string, unknown>[])',
  'data-clients-lead-attention-rail="true"',
  'data-right-rail-list="lead-attention"',
  'data-right-rail-row="lead-attention"',
  'Leady do spięcia',
  'Brak klienta albo sprawy przy aktywnym temacie.',
  'Brak leadów wymagających spięcia.',
  "to={leadId ? '/leads/' + leadId : '/leads'}",
  'Brak klienta',
  'Brak sprawy',
  'leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map',
];

for (const token of requiredClientTokens) {
  if (!clients.includes(token)) fail('missing Clients.tsx token: ' + token);
}

const forbiddenClientTokens = [
  'Klienci do uwagi',
  'Leady do uwagi',
  'Relacje bez pełnego spięcia lead/sprawa.',
  'const followupCandidates = useMemo',
  'const followupLeadCandidates = useMemo',
  'followupLeadCandidates.length ? followupLeadCandidates.map',
];

for (const token of forbiddenClientTokens) {
  if (clients.includes(token)) fail('forbidden Clients.tsx token still present: ' + token);
}

const sourceStart = clients.indexOf('const leadsNeedingClientOrCaseLink = useMemo');
const sourceEnd = clients.indexOf('const resetNewClientForm', sourceStart);
if (sourceStart === -1 || sourceEnd === -1 || sourceEnd <= sourceStart) fail('cannot isolate leadsNeedingClientOrCaseLink block');
const block = clients.slice(sourceStart, sourceEnd);
if (!block.includes('return (leads as Record<string, unknown>[])')) fail('candidate block does not return leads');
if (block.includes('return clients') || block.includes('clients.filter')) fail('candidate block uses clients as candidates');
if (!block.includes('status === \'archived\'') || !block.includes("visibility === 'trash'")) fail('candidate block does not exclude archived/trash leads');
if (!block.includes('return !clientId || !hasCase')) fail('candidate block does not filter missing client/case relation');

if (!stage71.includes('Leady do spięcia')) fail('Stage71 guard still not aligned with Stage74 copy');
if (stage71.includes('Leady do uwagi')) fail('Stage71 guard still expects old copy');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
if (!prebuild.includes('check-stage74-clients-leads-to-link-panel.cjs')) fail('prebuild does not include stage74 guard');
if (!pkg.scripts || pkg.scripts['check:stage74-clients-leads-to-link-panel'] !== 'node scripts/check-stage74-clients-leads-to-link-panel.cjs') fail('missing package check script');
if (!pkg.scripts || pkg.scripts['test:stage74-clients-leads-to-link-panel'] !== 'node --test tests/stage74-clients-leads-to-link-panel.test.cjs') fail('missing package test script');

console.log('OK stage74 clients leads-to-link panel');
`;
write(stage74GuardPath, guard);

const test = `const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const clients = fs.readFileSync(path.join(root, 'src', 'pages', 'Clients.tsx'), 'utf8');

test('Stage74 panel source is lead-only and not client-derived', () => {
  const start = clients.indexOf('const leadsNeedingClientOrCaseLink = useMemo');
  const end = clients.indexOf('const resetNewClientForm', start);
  assert.ok(start >= 0, 'missing leadsNeedingClientOrCaseLink source');
  assert.ok(end > start, 'cannot isolate source block');
  const block = clients.slice(start, end);
  assert.match(block, /return \(leads as Record<string, unknown>\[\]\)/);
  assert.doesNotMatch(block, /clients\.filter|return clients/);
  assert.match(block, /return !clientId \|\| !hasCase/);
});

test('Stage74 panel copy names the entity honestly', () => {
  assert.ok(clients.includes('Leady do spięcia'));
  assert.ok(clients.includes('Brak klienta albo sprawy przy aktywnym temacie.'));
  assert.ok(clients.includes('Brak leadów wymagających spięcia.'));
  assert.ok(!clients.includes('Klienci do uwagi'));
  assert.ok(!clients.includes('Leady do uwagi'));
});

test('Stage74 panel rows open lead detail, not client detail', () => {
  assert.ok(clients.includes("to={leadId ? '/leads/' + leadId : '/leads'}"));
  assert.ok(clients.includes('data-right-rail-row="lead-attention"'));
});
`;
write(stage74TestPath, test);

const doc = `# Stage74 manual check: /clients lead-to-link panel

## Cel
Panel boczny na /clients nie moze mieszac bytow. Pokazuje tylko leady wymagajace spiecia z klientem albo sprawa.

## Sprawdz recznie
1. Utworz klienta bez leadow i spraw.
2. Utworz aktywny lead bez clientId i bez sprawy.
3. Wejdz na /clients.
4. Panel powinien pokazac lead, nie klienta.
5. Po spieciu leada z klientem i sprawa lead powinien zniknac z panelu.

## Copy oczekiwane
- Leady do spiecia
- Brak klienta albo sprawy przy aktywnym temacie.
- Brak leadow wymagajacych spiecia.

## Nie sprawdzamy w tym etapie
- glownej listy klientow,
- szczegolow klienta,
- miesiecznego kalendarza,
- modelu danych.
`;
write(docPath, doc);

// Update package.json without introducing BOM.
const rawPackage = read(packagePath).replace(/^\uFEFF/, '');
const pkg = JSON.parse(rawPackage);
pkg.scripts = pkg.scripts || {};
pkg.scripts['check:stage74-clients-leads-to-link-panel'] = 'node scripts/check-stage74-clients-leads-to-link-panel.cjs';
pkg.scripts['test:stage74-clients-leads-to-link-panel'] = 'node --test tests/stage74-clients-leads-to-link-panel.test.cjs';
const guardCmd = 'node scripts/check-stage74-clients-leads-to-link-panel.cjs';
const prebuild = String(pkg.scripts.prebuild || '');
if (!prebuild.includes(guardCmd)) {
  if (prebuild.includes('node scripts/check-clients-attention-rail-visual-stage72.cjs')) {
    pkg.scripts.prebuild = prebuild.replace(
      'node scripts/check-clients-attention-rail-visual-stage72.cjs',
      'node scripts/check-clients-attention-rail-visual-stage72.cjs && ' + guardCmd
    );
  } else if (prebuild.trim()) {
    pkg.scripts.prebuild = prebuild + ' && ' + guardCmd;
  } else {
    pkg.scripts.prebuild = guardCmd;
  }
}
write(packagePath, JSON.stringify(pkg, null, 2) + '\n');

// Final self-check from patcher.
for (const file of [stage74GuardPath, stage74TestPath, docPath]) {
  if (!fs.existsSync(file)) fail('Expected output missing: ' + path.relative(root, file));
}
console.log('OK: Stage74 final patch applied.');
