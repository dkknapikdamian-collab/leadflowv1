const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const contractPath = '_project/contracts/forteca-clean/FRT-023_CLIENTS_NEED_CONTACT.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/023_clients_need_contact.webp';
const clientsPath = 'src/pages/Clients.tsx';
const stylesPath = 'src/styles/forteca-clients-needs-contact.css';

test('FRT-023 pins the needs-contact contract and reference', () => {
  const contract = read(contractPath);
  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-023/);
  assert.match(contract, /TARGET_ROUTE: \/clients/);
  assert.match(contract, /TARGET_STATE: Clients — requires contact/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/023_clients_need_contact\.webp/);
  assert.ok(fs.existsSync(path.join(root, referencePath)), `FRT-023 reference is missing: ${referencePath}`);
});

test('FRT-023 derives attention state from canonical contact cadence and real relations', () => {
  const source = read(clientsPath);
  for (const marker of [
    'data-forteca-frt-023-runtime={isNeedsContactStage023 ? \'true\' : undefined}',
    'data-forteca-frt-023-tabs="true"',
    'data-forteca-frt-023-toolbar-shell="true"',
    'data-forteca-frt-023-table="true"',
    'data-forteca-frt-023-row="true"',
    'NEEDS_CONTACT_BUCKETS_STAGE232C',
    'buildContactCadenceGrid',
    'contactCadenceRowByClientIdStage023',
    'isStage023ReasonFilterMatch',
    'isStage023ContactFilterMatch',
    'nearestActionByClientId',
    'fetchClientsFromSupabase()',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-023 runtime marker: ${marker}`);
  }
  assert.match(source, /if \(clientRelationFilterStage232C === 'needs_contact'\)[\s\S]*?needsContactClientIdsStage232C\.has/);
  assert.doesNotMatch(source, /mockClients|fixtureClients|ACME Logistics/);
});

test('FRT-023 keeps filters, navigation, contact actions and archive action real', () => {
  const source = read(clientsPath);
  for (const marker of [
    'Dostosuj widok',
    'Wyczyść filtry',
    'setStage023ReasonFilter',
    'setStage023ContactFilter',
    'data-forteca-frt-023-customize-panel="true"',
    'Szukaj klienta, firmy, e-maila lub telefonu...',
    'tel:',
    'mailto:',
    'handleArchiveClient',
    'aria-label="Paginacja klientów"',
  ]) {
    assert.ok(source.includes(marker), `missing FRT-023 action/filter marker: ${marker}`);
  }
  assert.match(source, /data-forteca-frt-023-tab="overdue-payment"/);
  assert.match(source, /data-forteca-frt-023-tab="inactive"/);
  assert.match(source, /href=\{phoneHref\}/);
  assert.match(source, /href=\{emailHref\}/);
});

test('FRT-023 uses the single Forteca semantic color source', () => {
  const source = read(clientsPath);
  const styles = read(stylesPath);
  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-task',
    '--cf-vst-color-event',
    '--cf-vst-color-danger',
    '--cf-vst-color-warning',
    '--cf-vst-color-delete',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-muted',
  ]) {
    assert.ok(styles.includes(token), `FRT-023 is missing shared visual token: ${token}`);
  }
  assert.match(source, /data-forteca-frt-023-priority=\{attention\.tone\}/);
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(styles, /rgba?\(/i);
});
