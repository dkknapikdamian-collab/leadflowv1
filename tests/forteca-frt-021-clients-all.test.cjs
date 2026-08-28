const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const contractPath = '_project/contracts/forteca-clean/FRT-021_CLIENTS_ALL.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/021_clients_all.webp';
const clientsPath = 'src/pages/Clients.tsx';
const layoutPath = 'src/components/Layout.tsx';
const shellStylesPath = 'src/styles/owners/closeflow-page-shell.css';
const clientsStylesPath = 'src/styles/forteca-clients-all.css';

test('FRT-021 pins the all-clients contract, route and reference', () => {
  const contract = read(contractPath);
  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-021/);
  assert.match(contract, /TARGET_ROUTE: \/clients/);
  assert.match(contract, /TARGET_STATE: Clients — Wszyscy/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/021_clients_all\.webp/);
  assert.ok(fs.existsSync(path.join(root, referencePath)), `FRT-021 reference is missing: ${referencePath}`);
});

test('FRT-021 renders the reference-aligned directory from real workspace data', () => {
  const source = read(clientsPath);
  const layout = read(layoutPath);
  const shell = read(shellStylesPath);

  for (const marker of [
    'data-forteca-frt-021-runtime="true"',
    'data-forteca-frt-021-header="true"',
    'data-forteca-frt-021-toolbar="true"',
    'data-forteca-frt-021-table="true"',
    'data-client-id={client.id}',
    'fetchClientsFromSupabase()',
    'clientFinanceByClientId',
    'nearestActionByClientId',
    'getStage021ClientStatus',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-021 runtime marker: ${marker}`);
  }

  for (const copy of [
    'Klienci',
    'Zarządzaj relacjami i prowadź klientów od kontaktu do sprawy.',
    'Import CSV',
    'Dodaj klienta',
    'Wszyscy',
    'Aktywni',
    'Bez sprawy',
    'Aktywna prowizja',
    'Opiekun:',
    'Tag:',
    'Typ relacji:',
    'Aktywna sprawa',
    'Ostatni kontakt',
    'Najbliższy ruch',
    'Prowizja',
  ]) {
    assert.ok(source.includes(copy), `missing reference-aligned FRT-021 copy: ${copy}`);
  }

  assert.match(layout, /isFortecaClientsRoute/);
  assert.match(layout, /cf-route-clients/);
  assert.match(shell, /cf-html-shell\.cf-route-clients/);
  assert.doesNotMatch(source, /data-clients-real-view/);
  assert.doesNotMatch(source, /CloseFlowPageHeaderV2/);
  assert.doesNotMatch(source, /<StatShortcutCard/);
});

test('FRT-021 preserves real list filtering, actions and pagination semantics', () => {
  const source = read(clientsPath);

  for (const marker of [
    'const FRT021_CLIENT_PAGE_SIZE = 7;',
    'setSearch(event.target.value)',
    'handleStatusFilterStage021',
    'ownerFilterStage021',
    'tagFilterStage021',
    'relationTypeFilterStage021',
    'toggleVisibleClientSelectionStage021',
    'handleArchiveClient',
    'handleRestoreClient',
    'handleCreateClient',
    'resetClientFiltersStage021',
    'aria-label="Paginacja klientów"',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-021 behavior marker: ${marker}`);
  }

  assert.match(source, /const filtered = useMemo\(\(\) => \{[\s\S]*clients\s*\.filter/);
  assert.match(source, /const visibleClientsStage021 = filtered\.slice/);
  assert.match(source, /data-client-id=\{client\.id\}/);
  assert.doesNotMatch(source, /mockClients|fixtureClients|ACME Logistics/);
});

test('FRT-021 keeps repeated visual meanings on the shared semantic token system', () => {
  const styles = read(clientsStylesPath);
  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-task',
    '--cf-vst-color-event',
    '--cf-vst-color-payment',
    '--cf-vst-color-delete',
    '--cf-vst-surface-card',
    '--cf-vst-surface-border',
  ]) {
    assert.ok(styles.includes(token), `FRT-021 is missing shared visual token: ${token}`);
  }
  assert.match(styles, /data-forteca-frt-021-tone="?primary/);
  assert.match(styles, /data-forteca-frt-021-tone=.?task/);
  assert.match(styles, /data-forteca-frt-021-tone=.?event/);
  assert.match(styles, /data-forteca-frt-021-tone=.?payment/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(styles, /rgba?\(/i);
});
