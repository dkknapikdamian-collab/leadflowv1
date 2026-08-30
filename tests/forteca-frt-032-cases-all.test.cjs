const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex');
const has = (source, snippet, label) => assert.ok(source.includes(snippet), (label || 'source') + ' must include: ' + snippet);

const contractPath = '_project/contracts/forteca-clean/FRT-032_CASES_ALL.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/032_cases_all.webp';
const casesPath = 'src/pages/Cases.tsx';
const supabaseSourcePath = 'src/lib/supabase-fallback.ts';
const apiCasesPath = 'api/cases.ts';
const statusSourcePath = 'src/lib/config/case-status.ts';
const confirmDialogPath = 'src/components/confirm-dialog.tsx';

test('FRT-032 pins the all-cases contract and reference chain', () => {
  const contract = read(contractPath);
  assert.match(contract, /^STAGE_ID: FRT-032$/m);
  assert.match(contract, /^TARGET_ROUTE: \/cases$/m);
  assert.match(contract, /^TARGET_STATE: Cases — Wszystkie$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/032_cases_all\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-031$/m);
  assert.match(contract, /^SUCCESSOR: FRT-033$/m);
  assert.ok(exists(referencePath), 'FRT-032 reference is missing: ' + referencePath);
  assert.equal(sha256(referencePath), '199cf7ee0747dc786480f49ffa3fe369f86e2402b29a88281bc2bc579fefc3a9');
});

test('FRT-032 reads real workspace cases and makes the all view authoritative', () => {
  const cases = read(casesPath);
  const supabaseSource = read(supabaseSourcePath);
  const apiCases = read(apiCasesPath);
  const statusSource = read(statusSourcePath);

  for (const snippet of [
    'fetchCasesFromSupabase()',
    'workspaceLoading || !workspace?.id',
    "const [caseRows, leadRows, clientRows, taskRows, eventRows] = await Promise.all([",
    "caseView === 'all' ? cases :",
    "caseView === 'closed' ? closedCases :",
    'caseView === \'all\'',
    'record.title?.toLowerCase().includes(normalizedQuery)',
    'record.clientName?.toLowerCase().includes(normalizedQuery)',
    'record.clientEmail?.toLowerCase().includes(normalizedQuery)',
    'record.clientPhone?.toLowerCase().includes(normalizedQuery)',
    'record.status?.toLowerCase().includes(normalizedQuery)',
    'setSearchParams({ view })',
    'isClosedCaseStatus(record.status)',
  ]) has(cases, snippet, 'FRT-032 all-cases runtime');

  has(supabaseSource, 'export async function fetchCasesFromSupabase', 'workspace case source');
  has(apiCases, 'withWorkspaceFilter', 'workspace-scoped case query');
  has(apiCases, 'resolveRequestWorkspaceId', 'workspace resolution');
  has(apiCases, 'cases?select=', 'workspace case list query');
  has(statusSource, 'getCaseStatusLabel', 'canonical case status source');
  assert.doesNotMatch(cases, /FRT032|mockCase|fixtureCase/i);
});

test('FRT-032 keeps shared list rows, navigation and destructive action owners', () => {
  const cases = read(casesPath);
  const confirmDialog = read(confirmDialogPath);

  for (const snippet of [
    '<Button',
    'Nowa sprawa',
    'Wszystkie sprawy',
    'Czeka na klienta',
    'Zablokowane',
    'Gotowe',
    'Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie...',
    'filteredCases.map((record, index) => {',
    'Link to={caseDetailPath(record.id)}',
    'data-case-row-delete-action="true"',
    '<ConfirmDialog',
    'confirmLabel="Usuń sprawę"',
  ]) has(cases, snippet, 'FRT-032 list/action owner');

  has(confirmDialog, 'title: string', 'shared confirmation dialog');
  has(confirmDialog, 'onConfirm: () => void | Promise<void>', 'shared confirmation dialog');
  assert.doesNotMatch(cases, /window\.confirm\(/);
});

test('FRT-032 does not introduce screenshot-only data or a second list owner', () => {
  const runtime = read(casesPath) + '\n' + read(supabaseSourcePath) + '\n' + read(apiCasesPath);
  for (const pattern of [
    /data:image\//i,
    /base64,/i,
    /(?:mock|fixture)(?:Case|Data|Name|Payload)/i,
    /032_cases_all_modal\.(?:webp|png|jpe?g)/i,
  ]) assert.doesNotMatch(runtime, pattern);

  assert.equal((read(casesPath).match(/export default function Cases\(\)/g) || []).length, 1);
  assert.match(runtime, /fetchCasesFromSupabase\(/);
  assert.match(runtime, /withWorkspaceFilter\(/);
});
