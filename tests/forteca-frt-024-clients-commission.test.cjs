const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const contractPath = '_project/contracts/forteca-clean/FRT-024_CLIENTS_COMMISSION.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/024_clients_active_commission.webp';
const clientsPath = 'src/pages/Clients.tsx';
const financeSourcePath = 'src/lib/finance/case-finance-source.ts';
const stylesPath = 'src/styles/forteca-clients-commission.css';

test('FRT-024 pins the active-commission contract and reference', () => {
  const contract = read(contractPath);

  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-024/);
  assert.match(contract, /TARGET_ROUTE: \/clients/);
  assert.match(contract, /TARGET_STATE: Clients — active commission/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/024_clients_active_commission\.webp/);
  assert.ok(fs.existsSync(path.join(root, referencePath)), `FRT-024 reference is missing: ${referencePath}`);
});

test('FRT-024 exposes a distinct active-commission runtime state', () => {
  const source = read(clientsPath);

  for (const marker of [
    "query.get('frt024') === 'active-commission'",
    "data-forteca-frt-024-runtime={isActiveCommissionStage024 ? 'true' : undefined}",
    'data-forteca-frt-024-tabs="true"',
    'data-forteca-frt-024-kpis="true"',
    'data-forteca-frt-024-toolbar="true"',
    'data-forteca-frt-024-table="true"',
    'data-forteca-frt-024-row="true"',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-024 runtime marker: ${marker}`);
  }

  assert.match(source, /isActiveCommissionStage024/);
  assert.match(source, /activeCommissionValueStage024/);
  assert.match(source, /activeCommissionClientCountStage024/);
  assert.match(source, /averageActiveCommissionStage024/);
  assert.match(source, /commissionDueInSevenDaysStage024/);
});

test('FRT-024 derives commission values and statuses from canonical finance truth', () => {
  const source = read(clientsPath);
  const financeSource = read(financeSourcePath);

  for (const marker of [
    'fetchClientsFromSupabase()',
    'fetchCasesFromSupabase().catch(() => [])',
    'fetchPaymentsFromSupabase().catch(() => [])',
    'getClientCasesFinanceSummary({',
    "mode: 'all_active_cases'",
    'getCaseFinanceSummary(',
    'commissionAmount',
    'commissionPaidAmount',
    'commissionRemainingAmount',
  ]) {
    assert.ok(source.includes(marker), `FRT-024 must use live canonical finance input: ${marker}`);
  }

  for (const marker of [
    'CLOSEFLOW_FIN10_CASE_FINANCE_SOURCE_TRUTH',
    'CLOSEFLOW_FIN10_PAYMENTS_ARE_SOURCE_FOR_PAID_AMOUNTS',
    'STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS',
    'export function getCaseFinanceSummary',
    'export function getClientCasesFinanceSummary',
    'commissionPaidAmount = hasPayments ? getCaseCommissionPaidAmount(paymentRows) : getLegacyCommissionPaidAmount(caseRecord)',
    'const commissionRemainingAmount = roundMoney(Math.max(commissionAmount - commissionPaidAmount, 0))',
  ]) {
    assert.ok(financeSource.includes(marker), `missing canonical finance invariant: ${marker}`);
  }

  assert.match(source, /activeCommissionRowsStage024[\s\S]*?clientFinanceByClientId/);
  assert.match(source, /activeCommissionRowsStage024[\s\S]*?getCaseFinanceSummary/);
  assert.match(source, /activeCommissionRowsStage024[\s\S]*?payments/);
  assert.doesNotMatch(source, /activeCommissionRowsStage024\s*=\s*\[/);
});

test('FRT-024 keeps reference-aligned finance labels without screenshot-derived values', () => {
  const source = read(clientsPath);

  for (const copy of [
    'Aktywna prowizja',
    'Łączna aktywna prowizja',
    'Liczba klientów',
    'Do wypłaty w 7 dni',
    'Średnia prowizja na klienta',
    'Dostosuj widok',
    'Eksportuj',
    'Szukaj klienta, sprawy lub opiekuna...',
    'Filtry',
    'Kolumny',
    'Klient',
    'Wartość prowizji',
    'Sprawa',
    'Status',
    'Etap rozliczenia',
    'Termin wypłaty',
    'Opiekun',
  ]) {
    assert.ok(source.includes(copy), `missing FRT-024 finance copy: ${copy}`);
  }

  assert.match(source, /formatClientMoney\(/);
  assert.match(source, /formatClientMoney\(activeCommissionValueStage024\)/);
});

test('FRT-024 keeps search, navigation and supported client actions real', () => {
  const source = read(clientsPath);

  for (const marker of [
    "clientRelationFilterStage232C === 'active_commission'",
    'setClientRelationFilterStage232C',
    'setSearch(event.target.value)',
    'data-forteca-frt-024-search="true"',
    'data-forteca-frt-024-filter="true"',
    'data-forteca-frt-024-columns="true"',
    'data-forteca-frt-024-export="true"',
    "to={'/clients/' + client.id}",
    'handleArchiveClient',
    'aria-label={\'Akcje dla klienta \' + (client.name || \'Klient\')}',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-024 real control/action marker: ${marker}`);
  }

  assert.match(source, /activeCommissionRowsStage024\.filter\([\s\S]*?search/i);
  assert.match(source, /data-forteca-frt-024-row="true"[\s\S]*?data-client-id=\{client\.id\}/);
  assert.match(source, /href|to=/);
});

test('FRT-024 keeps repeated visual meanings on the shared semantic token system', () => {
  const source = read(clientsPath);
  const styles = read(stylesPath);

  assert.match(source, /forteca-clients-commission\.css/);
  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-payment',
    '--cf-vst-color-success',
    '--cf-vst-color-warning',
    '--cf-vst-color-danger',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-muted',
  ]) {
    assert.ok(styles.includes(token), `FRT-024 is missing shared visual token: ${token}`);
  }

  for (const tone of ['primary', 'payment', 'success', 'warning', 'danger']) {
    assert.match(styles, new RegExp(`data-forteca-frt-024-tone=["']${tone}`));
  }

  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(styles, /rgba?\(/i);
});
