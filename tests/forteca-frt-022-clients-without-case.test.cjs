const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const contractPath = '_project/contracts/forteca-clean/FRT-022_CLIENTS_WITHOUT_CASE.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/022_clients_without_case.webp';
const clientsPath = 'src/pages/Clients.tsx';
const stylesPath = 'src/styles/forteca-clients-without-case.css';

test('FRT-022 pins the without-case contract and reference', () => {
  const contract = read(contractPath);
  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-022/);
  assert.match(contract, /TARGET_ROUTE: \/clients/);
  assert.match(contract, /TARGET_STATE: Clients — without active case/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/022_clients_without_case\.webp/);
  assert.ok(fs.existsSync(path.join(root, referencePath)), `FRT-022 reference is missing: ${referencePath}`);
});

test('FRT-022 renders a relation-derived without-case state with real workspace data', () => {
  const source = read(clientsPath);

  for (const marker of [
    'data-forteca-frt-022-runtime={isWithoutCaseStage022 ? \'true\' : undefined}',
    'data-forteca-frt-022-tabs="true"',
    'data-forteca-frt-022-toolbar-shell="true"',
    'data-forteca-frt-022-table="true"',
    'data-forteca-frt-022-row="true"',
    'data-forteca-frt-022-guide="true"',
    'fetchClientsFromSupabase()',
    'getStage022LastContactValue',
    'isStage022ContactFilterMatch',
    'countersByClientId.get(client.id)?.cases',
    'nearestActionByClientId',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-022 runtime marker: ${marker}`);
  }

  for (const copy of [
    'Bez sprawy',
    'Klienci bez sprawy',
    'To osoby, z którymi miałeś kontakt, ale nie mają jeszcze aktywnej sprawy.',
    'Szukaj klienta, telefonu lub e-maila...',
    'Wymaga kwalifikacji',
    'Ostatni kontakt (7 dni)',
    'Sugerowany ruch',
    'Dowiedz się więcej',
  ]) {
    assert.ok(source.includes(copy), `missing FRT-022 reference-aligned copy: ${copy}`);
  }

  assert.match(source, /if \(clientRelationFilterStage232C === 'without_case'\)[\s\S]*?countersByClientId\.get\(client\.id\)\?\.cases/);
  assert.doesNotMatch(source, /mockClients|fixtureClients|ACME Logistics/);
});

test('FRT-022 keeps filters, row actions and view switching functional', () => {
  const source = read(clientsPath);

  for (const marker of [
    'setStage022ContactFilter',
    'setStage022ViewMode',
    'aria-label="Więcej filtrów"',
    'data-forteca-frt-022-filter-panel="true"',
    'aria-label="Przełącz widok listy"',
    'aria-label={\'Akcje dla klienta \' + (client.name || \'Klient\')}',
    'handleArchiveClient',
    'aria-label="Paginacja klientów"',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-022 behavior marker: ${marker}`);
  }

  const guide = source.match(/<aside className="forteca-frt-022-guide"[\s\S]*?<\/aside>/)?.[0] || '';
  assert.ok(guide, 'FRT-022 guide panel is missing');
  assert.doesNotMatch(guide, /onClick=/, 'FRT-022 guide actions must not be fake controls');
  assert.match(guide, /to="\/leads"/);
});

test('FRT-022 resolves repeated visual meanings through shared Forteca tokens', () => {
  const source = read(clientsPath);
  const styles = read(stylesPath);
  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-task',
    '--cf-vst-color-event',
    '--cf-vst-color-payment',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-muted',
  ]) {
    assert.ok(styles.includes(token), `FRT-022 is missing shared visual token: ${token}`);
  }
  assert.match(source, /data-forteca-frt-022-tone="primary/);
  assert.match(source, /data-forteca-frt-022-tone="task/);
  assert.match(source, /data-forteca-frt-022-tone="event/);
  assert.match(source, /data-forteca-frt-022-tone="payment/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(styles, /rgba?\(/i);
});
