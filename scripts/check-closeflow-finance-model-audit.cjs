#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const DOC_PATH = 'docs/finance/CLOSEFLOW_FINANCE_MODEL_AUDIT_2026-05-09.md';
const MARKER = 'CLOSEFLOW_FINANCE_MODEL_AUDIT_FIN0';
const writeMode = process.argv.includes('--write');

function file(rel) {
  return path.join(repo, rel);
}

function exists(rel) {
  return fs.existsSync(file(rel));
}

function read(rel) {
  return exists(rel) ? fs.readFileSync(file(rel), 'utf8') : '';
}

function fail(message) {
  console.error('CLOSEFLOW_FINANCE_MODEL_AUDIT_FIN0_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function ensureDir(rel) {
  fs.mkdirSync(file(rel), { recursive: true });
}

function walk(rel, out = []) {
  const abs = file(rel);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const child = path.join(rel, entry.name).replace(/\\/g, '/');
    if (entry.isDirectory()) walk(child, out);
    else out.push(child);
  }
  return out;
}

function normalize(text) {
  return String(text || '').toLowerCase();
}

function yesNo(value) {
  return value ? 'tak' : 'nie';
}

function statusFrom({ existsAny, complete }) {
  if (complete) return 'istnieje';
  if (existsAny) return 'cz\u0119\u015Bciowo istnieje';
  return 'brakuje';
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function detectTerms(files, terms) {
  const hits = [];
  for (const rel of files) {
    const text = read(rel);
    if (!text) continue;
    const lower = normalize(text);
    const matched = terms.filter((term) => lower.includes(normalize(term)));
    if (matched.length) hits.push({ file: rel, terms: unique(matched) });
  }
  return hits;
}

function evidenceFiles(hits, limit = 10) {
  const files = unique(hits.map((hit) => hit.file));
  if (!files.length) return 'brak trafie\u0144 statycznych';
  const trimmed = files.slice(0, limit).join(', ');
  return files.length > limit ? `${trimmed}, ... +${files.length - limit}` : trimmed;
}

function readAll(files) {
  return files.map((rel) => `\n/* ${rel} */\n` + read(rel)).join('\n');
}

function extractTableSpecificText(allSql, tableName) {
  const chunks = [];
  const createRegex = new RegExp(`create\\s+table\\s+(?:if\\s+not\\s+exists\\s+)?(?:public\\.)?${tableName}\\s*\\(([\\s\\S]*?)\\);`, 'gi');
  let match;
  while ((match = createRegex.exec(allSql))) chunks.push(match[0]);

  const lines = allSql.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (new RegExp(`\\b${tableName}\\b`, 'i').test(line)) {
      chunks.push(lines.slice(Math.max(0, i - 1), Math.min(lines.length, i + 4)).join('\n'));
    }
  }
  return chunks.join('\n');
}

const auditedFiles = [
  'src/lib/relation-value.ts',
  'src/lib/supabase-fallback.ts',
  'src/lib/data-contract.ts',
  'api/payments.ts',
  'api/cases.ts',
  'api/leads.ts',
  'api/clients.ts',
  'api/system.ts',
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
];

const migrationFiles = walk('supabase/migrations').filter((rel) => /\.(sql|ts|js|md)$/i.test(rel));
const pageFiles = [
  'src/pages/Leads.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Cases.tsx',
  'src/pages/LeadDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/CaseDetail.tsx',
];
const apiFiles = ['api/payments.ts', 'api/cases.ts', 'api/leads.ts', 'api/clients.ts', 'api/system.ts'];
const libFiles = ['src/lib/relation-value.ts', 'src/lib/supabase-fallback.ts', 'src/lib/data-contract.ts'];

const allMigrationText = readAll(migrationFiles);
const allMigrationLower = normalize(allMigrationText);
const paymentsSpecificText = extractTableSpecificText(allMigrationText, 'payments');
const paymentsSpecificLower = normalize(paymentsSpecificText);

const requiredPaymentColumns = ['lead_id', 'client_id', 'case_id', 'type', 'status', 'amount', 'currency', 'paid_at', 'due_at', 'note'];
const paymentsTableExists = /create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?payments\b/i.test(allMigrationText) || /alter\s+table\s+(?:public\.)?payments\b/i.test(allMigrationText);
const paymentColumnMap = Object.fromEntries(
  requiredPaymentColumns.map((column) => [column, new RegExp(`\\b${column}\\b`, 'i').test(paymentsSpecificText)])
);
const missingPaymentColumns = requiredPaymentColumns.filter((column) => !paymentColumnMap[column]);
const presentPaymentColumns = requiredPaymentColumns.filter((column) => paymentColumnMap[column]);
const paymentsComplete = paymentsTableExists && missingPaymentColumns.length === 0;

const commissionTerms = ['commission', 'commission_', 'commissionAmount', 'commission_amount', 'commissionStatus', 'commission_status', 'prowiz'];
const dealValueTerms = ['dealValue', 'deal_value', 'deal value', 'value_estimate', 'estimated_value', 'warto\u015B\u0107', 'wartosc'];
const paymentTerms = ['payment', 'payments', 'p\u0142atn', 'platn', 'paid_at', 'due_at', 'amount', 'currency'];
const summaryTerms = ['summary', 'totalValue', 'total_value', 'relationValue', 'relation-value', 'lifetime', 'revenue', 'dealValue', 'deal_value', 'value'];

const caseFiles = ['api/cases.ts', 'src/pages/Cases.tsx', 'src/pages/CaseDetail.tsx', 'src/lib/data-contract.ts', ...migrationFiles];
const leadFiles = ['api/leads.ts', 'src/pages/Leads.tsx', 'src/pages/LeadDetail.tsx', 'src/lib/data-contract.ts', 'src/lib/relation-value.ts', ...migrationFiles];
const clientFiles = ['api/clients.ts', 'src/pages/Clients.tsx', 'src/pages/ClientDetail.tsx', 'src/lib/data-contract.ts', 'src/lib/relation-value.ts', ...migrationFiles];

const caseCommissionHits = detectTerms(caseFiles, commissionTerms);
const leadDealValueHits = detectTerms(leadFiles, dealValueTerms);
const leadCommissionHits = detectTerms(leadFiles, commissionTerms);
const clientSummaryHits = detectTerms(clientFiles, summaryTerms);
const clientOwnValueHits = detectTerms(clientFiles, ['client_value', 'clientValue', 'client_total_value', 'clientTotalValue', 'own_value', 'ownValue', 'customer_value']);
const uiPaymentHits = detectTerms(pageFiles, paymentTerms);
const apiPaymentHits = detectTerms(apiFiles, paymentTerms);
const helperPaymentHits = detectTerms([...libFiles, ...pageFiles, ...apiFiles], ['api/payments', '/api/payments', 'payments', 'payment', 'savePayment', 'fetchPayments', 'loadPayments']);

const relationValueHits = detectTerms(['src/lib/relation-value.ts'], ['dealValue', 'deal_value', 'payments', 'payment', 'amount', 'relation']);
const supabaseFallbackHits = detectTerms(['src/lib/supabase-fallback.ts'], ['payments', 'payment', 'dealValue', 'deal_value', 'case_id', 'client_id', 'lead_id']);
const dataContractHits = detectTerms(['src/lib/data-contract.ts'], ['payments', 'payment', 'dealValue', 'deal_value', 'commission', 'amount', 'currency']);

const answers = [
  {
    id: 'payments-db',
    question: 'Czy payments istnieje w DB/migracjach?',
    status: statusFrom({ existsAny: paymentsTableExists || /\bpayments\b/i.test(allMigrationText), complete: paymentsTableExists }),
    answer: paymentsTableExists
      ? 'Tabela albo alteracje `payments` s\u0105 wykryte w migracjach Supabase.'
      : 'Nie wykryto `create table payments` ani `alter table payments` w migracjach Supabase.',
    evidence: migrationFiles.length ? `Sprawdzono migracje: ${migrationFiles.length}; payments_table_detected=${yesNo(paymentsTableExists)}` : 'Brak katalogu albo plik\u00F3w supabase/migrations.',
    decision: 'nie rusza\u0107 w FIN-0; tylko audyt i decyzja przed prowizjami',
  },
  {
    id: 'payments-columns',
    question: 'Czy payments ma lead_id, client_id, case_id, type, status, amount, currency, paid_at, due_at, note?',
    status: statusFrom({ existsAny: paymentsTableExists || presentPaymentColumns.length > 0, complete: paymentsComplete }),
    answer: `Wykryte kolumny: ${presentPaymentColumns.length ? presentPaymentColumns.join(', ') : 'brak'}. Braki: ${missingPaymentColumns.length ? missingPaymentColumns.join(', ') : 'brak'}.`,
    evidence: paymentsSpecificText ? 'Kolumny sprawdzono w bloku/alterach `payments` w migracjach.' : 'Nie znaleziono bloku/alter\u00F3w `payments` do sprawdzenia kolumn.',
    decision: 'nie rusza\u0107 w FIN-0; brakuj\u0105ce kolumny maj\u0105 wej\u015B\u0107 dopiero w osobnym etapie migracji DB',
  },
  {
    id: 'cases-commission',
    question: 'Czy cases ma pola prowizji?',
    status: caseCommissionHits.length ? 'cz\u0119\u015Bciowo istnieje' : 'brakuje',
    answer: caseCommissionHits.length
      ? 'W kodzie/migracjach s\u0105 \u015Blady prowizji przy sprawach, ale FIN-0 nie zak\u0142ada, \u017Ce model jest produkcyjnie kompletny bez osobnej migracji i testu API.'
      : 'Nie wykryto stabilnych p\u00F3l prowizji dla `cases` w sprawdzonych plikach.',
    evidence: evidenceFiles(caseCommissionHits),
    decision: 'nie rusza\u0107 w FIN-0; prowizje projektowa\u0107 dopiero po domkni\u0119ciu payments',
  },
  {
    id: 'leads-deal-value-commission',
    question: 'Czy leads ma tylko dealValue, czy te\u017C prowizj\u0119?',
    status: leadDealValueHits.length && leadCommissionHits.length ? 'cz\u0119\u015Bciowo istnieje' : leadDealValueHits.length ? 'cz\u0119\u015Bciowo istnieje' : 'brakuje',
    answer: leadDealValueHits.length
      ? `Leady maj\u0105 \u015Blady warto\u015Bci/dealValue. Prowizja przy leadach: ${leadCommissionHits.length ? 'wykryto \u015Blady, ale wymagaj\u0105 weryfikacji kontraktu' : 'brak stabilnych \u015Blad\u00F3w prowizji'}.`
      : 'Nie wykryto stabilnego `dealValue` ani prowizji przy leadach w sprawdzonych plikach.',
    evidence: `dealValue: ${evidenceFiles(leadDealValueHits)}; commission: ${evidenceFiles(leadCommissionHits)}`,
    decision: 'nie rusza\u0107 w FIN-0; nie dok\u0142ada\u0107 prowizji do lead\u00F3w bez decyzji modelowej',
  },
  {
    id: 'clients-summary-own-value',
    question: 'Czy clients ma tylko summary, czy w\u0142asne pola warto\u015Bci?',
    status: clientSummaryHits.length || clientOwnValueHits.length ? 'cz\u0119\u015Bciowo istnieje' : 'brakuje',
    answer: clientOwnValueHits.length
      ? 'Wykryto \u015Blady w\u0142asnych p\u00F3l warto\u015Bci klienta; trzeba zweryfikowa\u0107, czy to \u017Ar\u00F3d\u0142o prawdy, czy tylko UI/helper.'
      : clientSummaryHits.length
        ? 'Wykryto summary/derived value przy klientach, ale nie potwierdzono stabilnego w\u0142asnego \u017Ar\u00F3d\u0142a warto\u015Bci klienta.'
        : 'Nie wykryto stabilnego modelu warto\u015Bci klienta.',
    evidence: `summary/value: ${evidenceFiles(clientSummaryHits)}; own-value: ${evidenceFiles(clientOwnValueHits)}`,
    decision: 'nie rusza\u0107 w FIN-0; klient powinien mie\u0107 jasne \u017Ar\u00F3d\u0142o warto\u015Bci po decyzji payments/cases/leads',
  },
  {
    id: 'ui-payments',
    question: 'Czy UI pokazuje p\u0142atno\u015Bci?',
    status: uiPaymentHits.length ? 'cz\u0119\u015Bciowo istnieje' : 'brakuje',
    answer: uiPaymentHits.length
      ? 'UI zawiera \u015Blady p\u0142atno\u015Bci/kwot/status\u00F3w finansowych, ale FIN-0 traktuje to jako cz\u0119\u015Bciowy obraz, dop\u00F3ki payments i semantyki finansowe nie s\u0105 spi\u0119te end-to-end.'
      : 'Nie wykryto jednoznacznej prezentacji p\u0142atno\u015Bci w sprawdzonych ekranach.',
    evidence: evidenceFiles(uiPaymentHits),
    decision: 'nie rusza\u0107 w FIN-0; nie rozbudowywa\u0107 UI p\u0142atno\u015Bci bez modelu DB/API',
  },
  {
    id: 'api-helpers-used',
    question: 'Czy helpery API s\u0105 u\u017Cywane?',
    status: exists('api/payments.ts') || helperPaymentHits.length ? 'cz\u0119\u015Bciowo istnieje' : 'brakuje',
    answer: exists('api/payments.ts')
      ? `api/payments.ts istnieje. U\u017Cycie helper\u00F3w/callsite payments: ${helperPaymentHits.length ? 'wykryto \u015Blady' : 'brak jednoznacznych callsite w sprawdzonych plikach'}.`
      : 'api/payments.ts nie istnieje, wi\u0119c helpery p\u0142atno\u015Bci nie s\u0105 domkni\u0119te.',
    evidence: `api: ${evidenceFiles(apiPaymentHits)}; helpers/callsites: ${evidenceFiles(helperPaymentHits)}`,
    decision: 'nie rusza\u0107 w FIN-0; helpery porz\u0105dkowa\u0107 dopiero po decyzji modelu i kontraktu API',
  },
];

function statusCounts() {
  return answers.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
}

function escapeMd(value) {
  return String(value || '').replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function renderDoc() {
  const counts = statusCounts();
  const missingAuditedFiles = auditedFiles.filter((rel) => !exists(rel));
  const timestamp = new Date().toISOString();
  const rows = answers.map((item) => `| ${escapeMd(item.question)} | ${item.status} | ${escapeMd(item.answer)} | ${escapeMd(item.evidence)} | ${escapeMd(item.decision)} |`).join('\n');
  const columnRows = requiredPaymentColumns.map((column) => `| ${column} | ${paymentColumnMap[column] ? 'istnieje' : 'brakuje'} |`).join('\n');

  return `# CloseFlow Finance Model Audit

Marker: \`${MARKER}\`
Data dokumentu: 2026-05-09
Wygenerowano: ${timestamp}
Etap: FIN-0 \u2014 Finance model audit
Tryb: audyt bez migracji runtime, bez zmian DB, bez zmian UI

## Werdykt g\u0142\u00F3wny

FIN-0 ma status: **audyt wykonany, nie rusza\u0107 modelu finansowego w tym etapie**.

Ten dokument odpowiada, co **istnieje**, co **cz\u0119\u015Bciowo istnieje**, czego **brakuje** i czego **nie rusza\u0107** przed wdro\u017Ceniem prowizji. Je\u017Celi odpowied\u017A brzmi \u201Ecz\u0119\u015Bciowo istnieje\u201D, nie wolno traktowa\u0107 tego jako gotowego modelu produkcyjnego.

## Legenda status\u00F3w

| Status | Znaczenie |
|---|---|
| istnieje | Element jest wykryty w \u017Ar\u00F3d\u0142ach i wygl\u0105da na intencjonalny kontrakt. |
| cz\u0119\u015Bciowo istnieje | S\u0105 \u015Blady w kodzie, UI, helperach albo migracjach, ale model nie jest domkni\u0119ty end-to-end. |
| brakuje | Nie wykryto stabilnego \u017Ar\u00F3d\u0142a prawdy w sprawdzonych plikach. |
| nie rusza\u0107 | FIN-0 tylko dokumentuje. Zmiana wymaga osobnego etapu wdro\u017Ceniowego. |

## Podsumowanie status\u00F3w

| Status | Liczba |
|---|---:|
| istnieje | ${counts['istnieje'] || 0} |
| cz\u0119\u015Bciowo istnieje | ${counts['cz\u0119\u015Bciowo istnieje'] || 0} |
| brakuje | ${counts['brakuje'] || 0} |

## Odpowiedzi audytu

| Pytanie | Status | Odpowied\u017A | Dow\u00F3d statyczny | Decyzja |
|---|---|---|---|---|
${rows}

## Kolumny payments wymagane przez FIN-0

| Kolumna | Status w migracjach |
|---|---|
${columnRows}

## Pliki sprawdzone

### Pliki wymagane w etapie

${auditedFiles.map((rel) => `- ${exists(rel) ? 'istnieje' : 'brakuje'} \u2014 \`${rel}\``).join('\n')}

### Migracje Supabase

- liczba plik\u00F3w w \`supabase/migrations\`: ${migrationFiles.length}
${migrationFiles.slice(0, 30).map((rel) => `- \`${rel}\``).join('\n') || '- brak migracji'}${migrationFiles.length > 30 ? `\n- ... +${migrationFiles.length - 30} kolejnych` : ''}

## Sygna\u0142y pomocnicze

| Obszar | Trafienia |
|---|---|
| relation-value | ${escapeMd(evidenceFiles(relationValueHits))} |
| supabase-fallback | ${escapeMd(evidenceFiles(supabaseFallbackHits))} |
| data-contract | ${escapeMd(evidenceFiles(dataContractHits))} |
| API payments | ${exists('api/payments.ts') ? 'api/payments.ts istnieje' : 'api/payments.ts brakuje'} |

## Nie rusza\u0107 w FIN-0

- Nie dodawa\u0107 kolumn prowizji.
- Nie zmienia\u0107 migracji Supabase.
- Nie zmienia\u0107 API p\u0142atno\u015Bci, lead\u00F3w, klient\u00F3w ani spraw.
- Nie przepina\u0107 UI p\u0142atno\u015Bci.
- Nie zmienia\u0107 helper\u00F3w relation-value ani supabase-fallback.
- Nie miesza\u0107 prowizji z dealValue bez osobnej decyzji modelowej.

## Minimalny nast\u0119pny krok po FIN-0

Najpierw wybra\u0107 model \u017Ar\u00F3d\u0142a prawdy:

1. czy \`payments\` jest osobn\u0105 tabel\u0105 transakcji,
2. czy prowizja jest polem na \`cases\`, osobnym payment type, czy osobn\u0105 tabel\u0105 commission,
3. czy \`leads.dealValue\` jest tylko szans\u0105 sprzeda\u017Cow\u0105, czy kwot\u0105 rozliczeniow\u0105,
4. czy klient ma w\u0142asn\u0105 warto\u015B\u0107, czy tylko summary liczone z lead\u00F3w/spraw/p\u0142atno\u015Bci.

Dopiero po tej decyzji robi\u0107 etap FIN-1.

## Kryterium zako\u0144czenia FIN-0

- Dokument istnieje.
- Ka\u017Cde pytanie audytu ma odpowied\u017A.
- Dokument zawiera statusy: istnieje / cz\u0119\u015Bciowo istnieje / brakuje / nie rusza\u0107.
- Check przechodzi.
- Build przechodzi.

${missingAuditedFiles.length ? `## Brakuj\u0105ce pliki z listy audytu\n\n${missingAuditedFiles.map((rel) => `- \`${rel}\``).join('\n')}\n` : ''}`;
}

function verifyDoc(text) {
  assert(text.includes(MARKER), 'audit marker missing in doc');
  for (const item of answers) {
    assert(text.includes(item.question), 'audit answer missing from doc: ' + item.question);
  }
  for (const phrase of ['istnieje', 'cz\u0119\u015Bciowo istnieje', 'brakuje', 'nie rusza\u0107']) {
    assert(text.includes(phrase), 'required status phrase missing from doc: ' + phrase);
  }
  for (const column of requiredPaymentColumns) {
    assert(text.includes(column), 'required payment column missing from doc: ' + column);
  }
}

if (writeMode) {
  ensureDir('docs/finance');
  fs.writeFileSync(file(DOC_PATH), renderDoc(), 'utf8');
  console.log('CLOSEFLOW_FINANCE_MODEL_AUDIT_FIN0_DOC_WRITTEN');
}

assert(exists(DOC_PATH), 'missing audit document: ' + DOC_PATH + ' (run node scripts/check-closeflow-finance-model-audit.cjs --write)');
verifyDoc(read(DOC_PATH));

const pkg = JSON.parse(read('package.json'));
assert(
  pkg.scripts && pkg.scripts['check:closeflow-finance-model-audit'] === 'node scripts/check-closeflow-finance-model-audit.cjs',
  'package.json missing script check:closeflow-finance-model-audit'
);

console.log('CLOSEFLOW_FINANCE_MODEL_AUDIT_FIN0_CHECK_OK');
console.log('answers=' + answers.length);
console.log('payments_table_exists=' + yesNo(paymentsTableExists));
console.log('payments_columns_present=' + presentPaymentColumns.length + '/' + requiredPaymentColumns.length);
console.log('migrations_checked=' + migrationFiles.length);
