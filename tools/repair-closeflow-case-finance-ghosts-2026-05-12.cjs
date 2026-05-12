/*
  CLOSEFLOW_CASE_FINANCE_GHOSTS_REPAIR_2026_05_12
  Cel: odciąć pełny panel rozliczeń od ClientDetail/LeadDetail oraz zatrzymać render pustych finansów sprawy podczas loading/route transition.
  Tryb: minimalny, odwracalny, bez zmian DB i bez przebudowy UI.
*/
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const changed = [];

function repoPath(...parts) {
  return path.join(root, ...parts);
}

function read(rel) {
  const full = repoPath(rel);
  if (!fs.existsSync(full)) throw new Error('Brak pliku: ' + rel);
  return fs.readFileSync(full, 'utf8');
}

function write(rel, content) {
  const full = repoPath(rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  const previous = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : null;
  if (previous !== content) {
    fs.writeFileSync(full, content, 'utf8');
    changed.push(rel);
  }
}

function normalizeSlashes(value) {
  return String(value || '').replace(/\\/g, '/');
}

function detectRouteCaseIdExpression(text) {
  const destructured = text.match(/const\s*\{\s*([^}]+?)\s*\}\s*=\s*useParams(?:\s*<[^>]+>)?\s*\(\s*\)/s);
  if (destructured) {
    const vars = destructured[1]
      .split(',')
      .map((part) => part.trim().split(':').pop().trim())
      .filter(Boolean);
    if (vars.includes('caseId')) return 'caseId';
    if (vars.includes('id')) return 'id';
  }

  const assigned = text.match(/const\s+([A-Za-z_$][\w$]*)\s*=\s*useParams(?:\s*<[^>]+>)?\s*\(\s*\)/s);
  if (assigned) {
    const name = assigned[1];
    return '(' + name + ' as any).caseId || (' + name + ' as any).id';
  }

  return null;
}

function ensureCaseSettlementSection() {
  const content = String.raw`import type { ComponentProps } from 'react';
import CaseSettlementPanel from './CaseSettlementPanel';
export type { CaseSettlementCommissionInput, CaseSettlementPaymentInput } from './CaseSettlementPanel';

const CLOSEFLOW_CASE_SETTLEMENT_SECTION_ROUTE_GUARD = 'case finance must render only for loaded matching CaseDetail record';
void CLOSEFLOW_CASE_SETTLEMENT_SECTION_ROUTE_GUARD;

type CaseSettlementPanelProps = ComponentProps<typeof CaseSettlementPanel>;

export type CaseSettlementSectionProps = CaseSettlementPanelProps & {
  routeCaseId?: string | number | null;
  isLoading?: boolean;
};

function readRecordId(record: CaseSettlementPanelProps['record']) {
  if (!record || typeof record !== 'object') return '';
  const value = (record as Record<string, unknown>).id;
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : '';
}

export function CaseSettlementSection({
  record = null,
  payments = [],
  routeCaseId = null,
  isLoading = false,
  ...rest
}: CaseSettlementSectionProps) {
  const recordId = readRecordId(record);
  const expectedRouteId = typeof routeCaseId === 'string' || typeof routeCaseId === 'number'
    ? String(routeCaseId).trim()
    : '';

  if (isLoading || !record || !recordId) {
    return null;
  }

  if (expectedRouteId && expectedRouteId !== recordId) {
    return null;
  }

  return (
    <section
      data-cf-case-finance-section="case-detail-only"
      data-cf-case-id={recordId}
      aria-label="Rozliczenie sprawy"
    >
      <CaseSettlementPanel
        {...rest}
        key={recordId}
        record={record}
        payments={payments}
      />
    </section>
  );
}

export default CaseSettlementSection;
`;
  write('src/components/finance/CaseSettlementSection.tsx', content);
}

function patchCaseDetail() {
  const rel = 'src/pages/CaseDetail.tsx';
  let text = read(rel);
  const original = text;

  if (text.includes('../components/finance/CaseSettlementPanel')) {
    text = text.replaceAll('../components/finance/CaseSettlementPanel', '../components/finance/CaseSettlementSection');
  }
  if (/\bCaseSettlementPanel\b/.test(text)) {
    text = text.replace(/\bCaseSettlementPanel\b/g, 'CaseSettlementSection');
  }

  const routeExpr = detectRouteCaseIdExpression(text);
  if (routeExpr && /<CaseSettlementSection\b/.test(text)) {
    text = text.replace(/<CaseSettlementSection\b([^>]*)>/gs, (match, attrs) => {
      if (/\brouteCaseId\s*=/.test(match)) return match;
      return '<CaseSettlementSection\n              routeCaseId={' + routeExpr + '}' + attrs + '>';
    });
  }

  if (original !== text) write(rel, text);
}

function patchPackageJson() {
  const rel = 'package.json';
  const json = JSON.parse(read(rel));
  json.scripts = json.scripts || {};
  json.scripts['check:case-finance-ghosts'] = 'node scripts/check-case-finance-ghosts-2026-05-12.cjs';
  json.scripts['diagnose:finance-ghosts'] = 'node scripts/diagnose-finance-ghosts-2026-05-12.cjs';
  write(rel, JSON.stringify(json, null, 2) + '\n');
}

function ensureCheckScript() {
  const content = String.raw`const fs = require('fs');
const path = require('path');

const root = process.cwd();
const errors = [];
const warnings = [];

function read(rel) {
  const full = path.join(root, rel);
  return fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
}

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

const fullFinanceActionCopy = [
  'Dodaj wpłatę',
  'Dodaj płatność prowizji',
  'Edytuj prowizję',
];

const fullFinanceMetricCopy = [
  'Wartość transakcji',
  'Prowizja należna',
  'Prowizja do zapłaty',
  'Wpłacono od klienta',
  'Status prowizji',
];

const clientDetail = read('src/pages/ClientDetail.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const section = read('src/components/finance/CaseSettlementSection.tsx');
const panel = read('src/components/finance/CaseSettlementPanel.tsx');

if (!section) fail('Brak src/components/finance/CaseSettlementSection.tsx');
if (!caseDetail.includes('CaseSettlementSection')) fail('CaseDetail nie używa CaseSettlementSection. Pełny panel rozliczeń nie ma bramki loading/route.');
if (caseDetail.includes('CaseSettlementPanel')) fail('CaseDetail nadal używa CaseSettlementPanel bezpośrednio.');
if (caseDetail.includes('../components/finance/CaseSettlementPanel')) fail('CaseDetail nadal importuje bezpośredni CaseSettlementPanel.');
if (!caseDetail.includes('routeCaseId=')) warn('CaseDetail nie przekazuje routeCaseId do CaseSettlementSection. Wrapper nadal blokuje pusty rekord, ale słabiej chroni przed starym rekordem przy zmianie route.');

if (!section.includes('data-cf-case-finance-section="case-detail-only"')) fail('CaseSettlementSection nie ma znacznika case-detail-only.');
if (!section.includes('!recordId')) fail('CaseSettlementSection nie blokuje pustego record.id.');
if (!section.includes('expectedRouteId && expectedRouteId !== recordId')) fail('CaseSettlementSection nie blokuje rozjazdu routeCaseId vs record.id.');
if (!panel.includes('FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1')) fail('CaseSettlementPanel utracił FIN-5 guard.');

for (const pair of [
  ['src/pages/ClientDetail.tsx', clientDetail],
  ['src/pages/LeadDetail.tsx', leadDetail],
]) {
  const rel = pair[0];
  const content = pair[1];
  if (/CaseSettlement(?:Panel|Section)/.test(content)) {
    fail(rel + ' importuje albo renderuje pełny panel rozliczenia sprawy. Klient/lead mogą mieć tylko skrót, nie edycję płatności sprawy.');
  }
  const actionHits = fullFinanceActionCopy.filter((copy) => content.includes(copy));
  const metricHits = fullFinanceMetricCopy.filter((copy) => content.includes(copy));
  if (actionHits.length >= 2) {
    fail(rel + ' zawiera kilka pełnych akcji finansowych sprawy: ' + actionHits.join(', ') + '.');
  }
  if (metricHits.length >= 3) {
    fail(rel + ' wygląda jak pełny panel rozliczenia sprawy, bo zawiera metryki: ' + metricHits.join(', ') + '.');
  }
}

if (!clientDetail.includes('ClientFinanceRelationSummary')) {
  warn('ClientDetail nie używa ClientFinanceRelationSummary. To może być OK, ale klient powinien mieć najwyżej skrót relacji finansowych, nie pełny panel.');
}

if (warnings.length) {
  console.log('WARNINGS:');
  for (const message of warnings) console.log(' - ' + message);
}

if (errors.length) {
  console.error('CASE FINANCE GHOST CHECK FAILED');
  for (const message of errors) console.error(' - ' + message);
  process.exit(1);
}

console.log('OK: case finance section is guarded and full finance editor is not exposed in ClientDetail/LeadDetail.');
`;
  write('scripts/check-case-finance-ghosts-2026-05-12.cjs', content);
}

function ensureDiagnoseScript() {
  const content = String.raw`const fs = require('fs');
const path = require('path');

const root = process.cwd();
const targets = ['src/pages', 'src/components', 'src/lib'];
const patterns = [
  'CaseSettlementPanel',
  'CaseSettlementSection',
  'ClientFinanceRelationSummary',
  'Dodaj wpłatę',
  'Dodaj płatność prowizji',
  'Edytuj prowizję',
  'Rozliczenie sprawy',
  'Wartość transakcji',
  'Prowizja należna',
  'Wpłacono od klienta',
];

function walk(dir, out = []) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return out;
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(rel, out);
    else if (/\.(tsx?|jsx?|css)$/.test(entry.name)) out.push(rel);
  }
  return out;
}

const files = targets.flatMap((target) => walk(target));
const hits = [];
for (const rel of files) {
  const text = fs.readFileSync(path.join(root, rel), 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const pattern of patterns) {
      if (line.includes(pattern)) {
        hits.push({ file: rel, line: index + 1, pattern, text: line.trim().slice(0, 180) });
      }
    }
  });
}

if (!hits.length) {
  console.log('Brak trafień finansowych w skanowanym zakresie.');
  process.exit(0);
}

for (const hit of hits) {
  console.log(hit.file + ':' + hit.line + ' [' + hit.pattern + '] ' + hit.text);
}
`;
  write('scripts/diagnose-finance-ghosts-2026-05-12.cjs', content);
}

function ensureReleaseDoc() {
  const content = String.raw`# CLOSEFLOW_CASE_FINANCE_GHOSTS_REPAIR_2026-05-12

## Cel

Naprawa błędu, w którym pełny panel rozliczeń sprawy potrafił pojawić się jako duch podczas przechodzenia między klientem, leadem i sprawą albo w stanie ładowania rekordu.

## Zmiany

- Dodano \`src/components/finance/CaseSettlementSection.tsx\` jako jedyną bramkę dla pełnego panelu rozliczenia sprawy.
- \`CaseDetail.tsx\` ma używać \`CaseSettlementSection\`, nie bezpośrednio \`CaseSettlementPanel\`.
- Wrapper blokuje render, jeśli:
  - sprawa jeszcze się ładuje,
  - rekord nie ma \`id\`,
  - \`routeCaseId\` nie zgadza się z \`record.id\`.
- Dodano check wykrywający pełne akcje finansowe w \`ClientDetail\` i \`LeadDetail\`.
- Dodano diagnostykę miejsc, gdzie występują teksty i komponenty finansowe.

## Zakres świadomie nietknięty

- Brak zmian bazy danych.
- Brak zmian API płatności.
- Brak zmian globalnego modułu Rozliczenia.
- Brak zmian flow lead -> sprawa.

## Test ręczny

1. Klient -> sprawa -> klient -> inna sprawa.
2. Podczas ładowania sprawy nie może pojawić się karta finansów z zerami.
3. Pełne przyciski \`Dodaj wpłatę\`, \`Dodaj płatność prowizji\`, \`Edytuj prowizję\` mają być tylko na CaseDetail.
4. ClientDetail i LeadDetail mogą pokazywać tylko skróty finansowe albo wartość leada, bez pełnego edytora rozliczeń sprawy.
`;
  write('docs/release/CLOSEFLOW_CASE_FINANCE_GHOSTS_REPAIR_2026-05-12.md', content);
}

function main() {
  ensureCaseSettlementSection();
  patchCaseDetail();
  ensureCheckScript();
  ensureDiagnoseScript();
  ensureReleaseDoc();
  patchPackageJson();

  console.log('CLOSEFLOW_CASE_FINANCE_GHOSTS_REPAIR_2026_05_12');
  if (!changed.length) {
    console.log('Brak zmian: repo wygląda już na naprawione.');
    return;
  }
  for (const rel of changed) console.log('changed: ' + normalizeSlashes(rel));
}

main();
