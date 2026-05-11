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
  if (existsAny) return 'częściowo istnieje';
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
  if (!files.length) return 'brak trafień statycznych';
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
const dealValueTerms = ['dealValue', 'deal_value', 'deal value', 'value_estimate', 'estimated_value', 'wartość', 'wartosc'];
const paymentTerms = ['payment', 'payments', 'płatn', 'platn', 'paid_at', 'due_at', 'amount', 'currency'];
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
      ? 'Tabela albo alteracje `payments` są wykryte w migracjach Supabase.'
      : 'Nie wykryto `create table payments` ani `alter table payments` w migracjach Supabase.',
    evidence: migrationFiles.length ? `Sprawdzono migracje: ${migrationFiles.length}; payments_table_detected=${yesNo(paymentsTableExists)}` : 'Brak katalogu albo plików supabase/migrations.',
    decision: 'nie ruszać w FIN-0; tylko audyt i decyzja przed prowizjami',
  },
  {
    id: 'payments-columns',
    question: 'Czy payments ma lead_id, client_id, case_id, type, status, amount, currency, paid_at, due_at, note?',
    status: statusFrom({ existsAny: paymentsTableExists || presentPaymentColumns.length > 0, complete: paymentsComplete }),
    answer: `Wykryte kolumny: ${presentPaymentColumns.length ? presentPaymentColumns.join(', ') : 'brak'}. Braki: ${missingPaymentColumns.length ? missingPaymentColumns.join(', ') : 'brak'}.`,
    evidence: paymentsSpecificText ? 'Kolumny sprawdzono w bloku/alterach `payments` w migracjach.' : 'Nie znaleziono bloku/alterów `payments` do sprawdzenia kolumn.',
    decision: 'nie ruszać w FIN-0; brakujące kolumny mają wejść dopiero w osobnym etapie migracji DB',
  },
  {
    id: 'cases-commission',
    question: 'Czy cases ma pola prowizji?',
    status: caseCommissionHits.length ? 'częściowo istnieje' : 'brakuje',
    answer: caseCommissionHits.length
      ? 'W kodzie/migracjach są ślady prowizji przy sprawach, ale FIN-0 nie zakłada, że model jest produkcyjnie kompletny bez osobnej migracji i testu API.'
      : 'Nie wykryto stabilnych pól prowizji dla `cases` w sprawdzonych plikach.',
    evidence: evidenceFiles(caseCommissionHits),
    decision: 'nie ruszać w FIN-0; prowizje projektować dopiero po domknięciu payments',
  },
  {
    id: 'leads-deal-value-commission',
    question: 'Czy leads ma tylko dealValue, czy też prowizję?',
    status: leadDealValueHits.length && leadCommissionHits.length ? 'częściowo istnieje' : leadDealValueHits.length ? 'częściowo istnieje' : 'brakuje',
    answer: leadDealValueHits.length
      ? `Leady mają ślady wartości/dealValue. Prowizja przy leadach: ${leadCommissionHits.length ? 'wykryto ślady, ale wymagają weryfikacji kontraktu' : 'brak stabilnych śladów prowizji'}.`
      : 'Nie wykryto stabilnego `dealValue` ani prowizji przy leadach w sprawdzonych plikach.',
    evidence: `dealValue: ${evidenceFiles(leadDealValueHits)}; commission: ${evidenceFiles(leadCommissionHits)}`,
    decision: 'nie ruszać w FIN-0; nie dokładać prowizji do leadów bez decyzji modelowej',
  },
  {
    id: 'clients-summary-own-value',
    question: 'Czy clients ma tylko summary, czy własne pola wartości?',
    status: clientSummaryHits.length || clientOwnValueHits.length ? 'częściowo istnieje' : 'brakuje',
    answer: clientOwnValueHits.length
      ? 'Wykryto ślady własnych pól wartości klienta; trzeba zweryfikować, czy to źródło prawdy, czy tylko UI/helper.'
      : clientSummaryHits.length
        ? 'Wykryto summary/derived value przy klientach, ale nie potwierdzono stabilnego własnego źródła wartości klienta.'
        : 'Nie wykryto stabilnego modelu wartości klienta.',
    evidence: `summary/value: ${evidenceFiles(clientSummaryHits)}; own-value: ${evidenceFiles(clientOwnValueHits)}`,
    decision: 'nie ruszać w FIN-0; klient powinien mieć jasne źródło wartości po decyzji payments/cases/leads',
  },
  {
    id: 'ui-payments',
    question: 'Czy UI pokazuje płatności?',
    status: uiPaymentHits.length ? 'częściowo istnieje' : 'brakuje',
    answer: uiPaymentHits.length
      ? 'UI zawiera ślady płatności/kwot/statusów finansowych, ale FIN-0 traktuje to jako częściowy obraz, dopóki payments i semantyki finansowe nie są spięte end-to-end.'
      : 'Nie wykryto jednoznacznej prezentacji płatności w sprawdzonych ekranach.',
    evidence: evidenceFiles(uiPaymentHits),
    decision: 'nie ruszać w FIN-0; nie rozbudowywać UI płatności bez modelu DB/API',
  },
  {
    id: 'api-helpers-used',
    question: 'Czy helpery API są używane?',
    status: exists('api/payments.ts') || helperPaymentHits.length ? 'częściowo istnieje' : 'brakuje',
    answer: exists('api/payments.ts')
      ? `api/payments.ts istnieje. Użycie helperów/callsite payments: ${helperPaymentHits.length ? 'wykryto ślady' : 'brak jednoznacznych callsite w sprawdzonych plikach'}.`
      : 'api/payments.ts nie istnieje, więc helpery płatności nie są domknięte.',
    evidence: `api: ${evidenceFiles(apiPaymentHits)}; helpers/callsites: ${evidenceFiles(helperPaymentHits)}`,
    decision: 'nie ruszać w FIN-0; helpery porządkować dopiero po decyzji modelu i kontraktu API',
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
Etap: FIN-0 — Finance model audit  
Tryb: audyt bez migracji runtime, bez zmian DB, bez zmian UI

## Werdykt główny

FIN-0 ma status: **audyt wykonany, nie ruszać modelu finansowego w tym etapie**.

Ten dokument odpowiada, co **istnieje**, co **częściowo istnieje**, czego **brakuje** i czego **nie ruszać** przed wdrożeniem prowizji. Jeżeli odpowiedź brzmi „częściowo istnieje”, nie wolno traktować tego jako gotowego modelu produkcyjnego.

## Legenda statusów

| Status | Znaczenie |
|---|---|
| istnieje | Element jest wykryty w źródłach i wygląda na intencjonalny kontrakt. |
| częściowo istnieje | Są ślady w kodzie, UI, helperach albo migracjach, ale model nie jest domknięty end-to-end. |
| brakuje | Nie wykryto stabilnego źródła prawdy w sprawdzonych plikach. |
| nie ruszać | FIN-0 tylko dokumentuje. Zmiana wymaga osobnego etapu wdrożeniowego. |

## Podsumowanie statusów

| Status | Liczba |
|---|---:|
| istnieje | ${counts['istnieje'] || 0} |
| częściowo istnieje | ${counts['częściowo istnieje'] || 0} |
| brakuje | ${counts['brakuje'] || 0} |

## Odpowiedzi audytu

| Pytanie | Status | Odpowiedź | Dowód statyczny | Decyzja |
|---|---|---|---|---|
${rows}

## Kolumny payments wymagane przez FIN-0

| Kolumna | Status w migracjach |
|---|---|
${columnRows}

## Pliki sprawdzone

### Pliki wymagane w etapie

${auditedFiles.map((rel) => `- ${exists(rel) ? 'istnieje' : 'brakuje'} — \`${rel}\``).join('\n')}

### Migracje Supabase

- liczba plików w \`supabase/migrations\`: ${migrationFiles.length}
${migrationFiles.slice(0, 30).map((rel) => `- \`${rel}\``).join('\n') || '- brak migracji'}${migrationFiles.length > 30 ? `\n- ... +${migrationFiles.length - 30} kolejnych` : ''}

## Sygnały pomocnicze

| Obszar | Trafienia |
|---|---|
| relation-value | ${escapeMd(evidenceFiles(relationValueHits))} |
| supabase-fallback | ${escapeMd(evidenceFiles(supabaseFallbackHits))} |
| data-contract | ${escapeMd(evidenceFiles(dataContractHits))} |
| API payments | ${exists('api/payments.ts') ? 'api/payments.ts istnieje' : 'api/payments.ts brakuje'} |

## Nie ruszać w FIN-0

- Nie dodawać kolumn prowizji.
- Nie zmieniać migracji Supabase.
- Nie zmieniać API płatności, leadów, klientów ani spraw.
- Nie przepinać UI płatności.
- Nie zmieniać helperów relation-value ani supabase-fallback.
- Nie mieszać prowizji z dealValue bez osobnej decyzji modelowej.

## Minimalny następny krok po FIN-0

Najpierw wybrać model źródła prawdy:

1. czy \`payments\` jest osobną tabelą transakcji,
2. czy prowizja jest polem na \`cases\`, osobnym payment type, czy osobną tabelą commission,
3. czy \`leads.dealValue\` jest tylko szansą sprzedażową, czy kwotą rozliczeniową,
4. czy klient ma własną wartość, czy tylko summary liczone z leadów/spraw/płatności.

Dopiero po tej decyzji robić etap FIN-1.

## Kryterium zakończenia FIN-0

- Dokument istnieje.
- Każde pytanie audytu ma odpowiedź.
- Dokument zawiera statusy: istnieje / częściowo istnieje / brakuje / nie ruszać.
- Check przechodzi.
- Build przechodzi.

${missingAuditedFiles.length ? `## Brakujące pliki z listy audytu\n\n${missingAuditedFiles.map((rel) => `- \`${rel}\``).join('\n')}\n` : ''}`;
}

function verifyDoc(text) {
  assert(text.includes(MARKER), 'audit marker missing in doc');
  for (const item of answers) {
    assert(text.includes(item.question), 'audit answer missing from doc: ' + item.question);
  }
  for (const phrase of ['istnieje', 'częściowo istnieje', 'brakuje', 'nie ruszać']) {
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
