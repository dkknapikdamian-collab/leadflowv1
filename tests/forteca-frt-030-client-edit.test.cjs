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

const contractPath = '_project/contracts/forteca-clean/FRT-030_CLIENT_EDIT.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/030_client_edit_modal.webp';
const dialogPath = 'src/components/ClientCreateDialog.tsx';
const detailPath = 'src/pages/ClientDetail.tsx';
const cssPath = 'src/styles/forteca-client-edit.css';
const fallbackPath = 'src/lib/supabase-fallback.ts';
const apiPath = 'api/clients.ts';
const buttonPath = 'src/components/ui/button.tsx';

test('FRT-030 pins the exact edit contract and reference chain', () => {
  const contract = read(contractPath);
  assert.match(contract, /^CONTRACT_STATUS: LOCKED$/m);
  assert.match(contract, /^STAGE_ID: FRT-030$/m);
  assert.match(contract, /^TARGET_ROUTE: \/clients\/:clientId$/m);
  assert.match(contract, /^TARGET_STATE: Edit Client modal$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/030_client_edit_modal\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-029$/m);
  assert.match(contract, /^SUCCESSOR: FRT-031$/m);
  assert.ok(exists(referencePath), 'FRT-030 reference is missing: ' + referencePath);
  assert.equal(sha256(referencePath), 'a7a16807a15a11e3cd29244bb75513f8f41b2c5d23fd65f304ac7d50ef7eefb7');
});

test('FRT-030 exposes one populated, controlled edit dialog with the reference controls', () => {
  const dialog = read(dialogPath);
  const detail = read(detailPath);
  for (const snippet of [
    'export type ClientEditDialogProps',
    'export function ClientEditDialog(',
    'client: ClientEditRecord | null',
    'onUpdated?: () => void | Promise<void>',
    'onDeleted?: () => void | Promise<void>',
    'data-forteca-frt-030-root="true"',
    'data-forteca-frt-030-runtime="true"',
    '<DialogTitle>Edytuj klienta</DialogTitle>',
    'FormField label="Imię i nazwisko / nazwa firmy" required',
    'id="forteca-frt-030-client-name"',
    'id="forteca-frt-030-client-phone"',
    'id="forteca-frt-030-client-email"',
    'id="forteca-frt-030-client-address"',
    'id="forteca-frt-030-client-source"',
    'id="forteca-frt-030-client-owner"',
    'label="Notatka"',
    'data-forteca-frt-030-action="cancel"',
    'data-forteca-frt-030-action="delete"',
    'Usuń klienta',
    'data-forteca-frt-030-action="submit"',
    'Zapisz zmiany',
  ]) has(dialog, snippet, 'FRT-030 dialog contract');
  for (const icon of ['Phone', 'Mail', 'MapPin', 'UserRound']) has(dialog, '<' + icon, 'FRT-030 semantic icon');
  has(detail, "import { ClientEditDialog } from '../components/ClientCreateDialog';", 'ClientDetail edit owner');
  has(detail, '<ClientEditDialog', 'ClientDetail edit dialog mount');
  has(detail, 'open={clientEditOpen}', 'ClientDetail edit dialog state');
});

test('FRT-030 populates from the current record and writes the full real client payload', () => {
  const dialog = read(dialogPath);
  const detail = read(detailPath);
  for (const field of ['name', 'phone', 'email', 'address', 'company', 'sourcePrimary', 'ownerId', 'notes']) {
    assert.match(dialog, new RegExp(field + ':\\s*String\\(client\\?\\.'), 'field must be populated from client: ' + field);
  }
  for (const field of ['name', 'phone', 'email', 'address', 'sourcePrimary', 'ownerId', 'notes']) {
    assert.match(dialog, new RegExp('value=\\{form\\.' + field + '\\}'), 'field must remain controlled: ' + field);
  }
  for (const field of ['name', 'company', 'email', 'phone', 'address', 'sourcePrimary', 'ownerId', 'notes']) {
    assert.match(dialog, new RegExp(field + ':\\s*prepared\\.' + field), 'field must reach update payload: ' + field);
  }
  has(dialog, 'await updateClientInSupabase({', 'real update mutation');
  has(dialog, 'await onUpdated?.();', 'detail refresh callback');
  has(detail, 'await deleteClientFromSupabase(clientId);', 'real soft-delete owner');
  has(detail, "navigate('/clients');", 'post-delete navigation');
  assert.doesNotMatch(dialog, /Anna Nowak|anna\.nowak@example\.com|ul\. Kwiatowa 15\/7|Damian Knapik/);
  assert.doesNotMatch(detail, /Anna Nowak|anna\.nowak@example\.com|ul\. Kwiatowa 15\/7|Damian Knapik/);
});

test('FRT-030 preserves semantic source options and safe delete semantics', () => {
  const dialog = read(dialogPath);
  const css = read(cssPath);
  const fallback = read(fallbackPath);
  const api = read(apiPath);
  const button = read(buttonPath);
  has(dialog, 'CLIENT_SOURCE_OPTIONS', 'canonical client-source options');
  has(dialog, 'window.confirm(\'Zarchiwizować tego klienta?\')', 'delete confirmation');
  has(dialog, 'variant="destructive"', 'semantic destructive button');
  has(css, '[data-forteca-frt-030-root][data-closeflow-modal-visual-system="true"]', 'scoped FRT-030 style root');
  has(css, 'width: min(583px', 'reference modal width');
  has(css, 'height: min(641px', 'reference modal height');
  has(css, '--cf-vst-color-primary', 'primary VST token');
  has(css, '--cf-vst-color-delete', 'delete VST token');
  has(button, 'cf-vst-button-delete', 'shared delete button token');
  has(fallback, 'export async function deleteClientFromSupabase', 'delete mutation facade');
  has(api, "method === 'DELETE'", 'API delete branch');
  assert.doesNotMatch(dialog, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgba?|hsla?)\(/i);
});

test('FRT-030 keeps the old add dialog intact and scopes edit CSS to the new consumer', () => {
  const dialog = read(dialogPath);
  const addCss = read('src/styles/forteca-client-add.css');
  assert.match(dialog, /export default function ClientCreateDialog\s*\(/);
  assert.match(dialog, /data-forteca-frt-029-root="true"/);
  assert.match(dialog, /createClientInSupabase\(clientPayload\)/);
  assert.match(addCss, /\[data-forteca-frt-029-root\]/);
  assert.match(read(cssPath), /^\[data-forteca-frt-030-root\]/m);
});
