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
const section = (source, startMarker, endMarker) => {
  const start = source.indexOf(startMarker);
  assert.ok(start >= 0, 'missing section start: ' + startMarker);
  const end = endMarker ? source.indexOf(endMarker, start + startMarker.length) : -1;
  return source.slice(start, end >= 0 ? end : source.length);
};

const contractPath = '_project/contracts/forteca-clean/FRT-029_CLIENT_ADD.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/029_client_add_modal.webp';
const dialogPath = 'src/components/ClientCreateDialog.tsx';
const clientsPath = 'src/pages/Clients.tsx';
const cssPath = 'src/styles/forteca-client-add.css';
const apiPath = 'api/clients.ts';
const fallbackPath = 'src/lib/supabase-fallback.ts';
const dataContractPath = 'src/lib/data-contract.ts';
const migrationPath = 'supabase/migrations/20260829100000_frt029_client_address_owner.sql';
const foundationPath = 'src/styles/owners/closeflow-foundation.css';
const visualEntryPath = 'src/styles/closeflow-visual-source-truth.css';
const buttonPrimitivePath = 'src/components/ui/button.tsx';

test('FRT-029 pins the exact client-add contract, route, reference and stage chain', () => {
  const contract = read(contractPath);
  assert.match(contract, /^CONTRACT_STATUS: LOCKED$/m);
  assert.match(contract, /^STAGE_ID: FRT-029$/m);
  assert.match(contract, /^TARGET_ROUTE: \/clients$/m);
  assert.match(contract, /^TARGET_STATE: Add Client modal$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/029_client_add_modal\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-028$/m);
  assert.match(contract, /^SUCCESSOR: FRT-030$/m);
  assert.ok(exists(referencePath), 'FRT-029 reference is missing: ' + referencePath);
  assert.equal(sha256(referencePath), '0e7166de7f41ed86cc8916fa37172f7be9af66460efec25d34a106846c80f061');
});

test('FRT-029 uses one controlled create owner on /clients and keeps list refresh in Clients', () => {
  const clients = read(clientsPath);
  assert.match(clients, /import\s+ClientCreateDialog\s+from\s+['"]\.\.\/components\/ClientCreateDialog['"];?/);
  assert.match(clients, /<ClientCreateDialog[\s\S]*?open=\{isCreateOpen\}[\s\S]*?onOpenChange=\{setIsCreateOpen\}[\s\S]*?onCreated=\{reload\}/);
  const reload = section(clients, 'const reload = useCallback(async () => {', '\n  }, [workspace?.id]);');
  has(reload, 'fetchClientsFromSupabase()', 'Clients reload owner');
  has(reload, 'setClients(clientRows as ClientRecord[])', 'Clients reload owner');
  assert.doesNotMatch(clients, /const\s+handleCreateClient\s*=\s*async/);
  assert.doesNotMatch(clients, /<Dialog\s+open=\{isCreateOpen\}[\s\S]*?<form\s+onSubmit=\{handleCreateClient\}/);
  assert.doesNotMatch(clients, /\bcreateClientInSupabase\b/);
  assert.doesNotMatch(clients, /clientConflict(Open|Candidates|PendingInput)/);
});

test('FRT-029 exposes the reference-shaped controlled dialog and real fields', () => {
  const dialog = read(dialogPath);
  assert.match(dialog, /export default function ClientCreateDialog\s*\(/);
  assert.match(dialog, /open:\s*boolean/);
  assert.match(dialog, /onOpenChange:\s*\(open:\s*boolean\)\s*=>\s*void/);
  assert.match(dialog, /onCreated\?:\s*\(\)\s*=>\s*void\s*\|\s*Promise<void>/);
  assert.match(dialog, /<Dialog\s+open=\{open\}/);
  assert.match(dialog, /data-forteca-frt-029-root="true"/);
  assert.match(dialog, /data-forteca-frt-029-runtime="true"/);
  assert.match(dialog, /data-client-create-dialog-semantic172="true"/);
  assert.match(dialog, /data-client-create-form-semantic172="true"/);
  assert.match(dialog, /<DialogTitle>Dodaj klienta<\/DialogTitle>/);
  for (const snippet of [
    'FormField label="Imię i nazwisko / nazwa firmy" required',
    'placeholder="Wpisz imię i nazwisko lub nazwę firmy"',
    'FormField label="Telefon" required',
    'placeholder="+48 000 000 000"',
    'FormField label="E-mail"',
    'placeholder="adres@email.pl"',
    'FormField label="Adres"',
    'placeholder="Ulica, nr domu / lokalu, kod pocztowy, miasto"',
    'FormField label="Źródło klienta"',
    'option value="">Wybierz źródło</option>',
    'FormField label="Przypisany opiekun" required',
    'option value="">Wybierz opiekuna</option>',
    'label="Notatka"',
    'placeholder="Dodatkowe informacje o kliencie..."',
    'Utwórz sprawę od razu',
    'Po zapisaniu klienta zostanie utworzona nowa sprawa.',
  ]) has(dialog, snippet, 'FRT-029 dialog field contract');
  for (const icon of ['Phone', 'Mail', 'MapPin', 'UserRound']) {
    has(dialog, icon === 'UserRound' ? '<UserRound' : 'iconForField(' + icon + ')', 'FRT-029 semantic field icon');
  }
  assert.match(dialog, /CLIENT_SOURCE_OPTIONS\.map\(/);
  assert.match(dialog, /id="forteca-frt-029-client-owner"[\s\S]*?required/);
  assert.match(dialog, /<input\s+type="checkbox"[\s\S]*?checked=\{form\.createCase\}/);
  assert.match(dialog, /createCase:\s*false/);
  assert.match(dialog, /data-forteca-frt-029-action="cancel"[\s\S]*?Anuluj/);
  assert.match(dialog, /data-forteca-frt-029-action="submit"[\s\S]*?Zapisz klienta/);
});

test('FRT-029 keeps validation, duplicate safety and guards before the real write', () => {
  const dialog = read(dialogPath);
  const submit = section(dialog, 'const handleSubmit = async (event: FormEvent) => {', '\n  return (');
  const trimForm = section(dialog, 'function trimForm(form: ClientCreateFormState) {', '\n}\n\nfunction readCreatedClientId');
  for (const snippet of [
    'event.preventDefault();',
    'if (!hasAccess)',
    "toast.error('Twój trial wygasł.')",
    'const workspaceId = requireWorkspaceId(workspace);',
    'if (!workspaceId)',
    "toast.error('Kontekst workspace nie jest jeszcze gotowy.')",
    'const prepared = trimForm(form);',
    'if (!prepared.name)',
    "toast.error('Podaj nazwę klienta.')",
    'if (!prepared.phone)',
    "toast.error('Podaj telefon klienta.')",
    'if (!prepared.ownerId)',
    "toast.error('Wybierz opiekuna klienta.')",
    'findEntityConflictsInSupabase(',
    'setConflictCandidates(candidates)',
    'setConflictDraft(prepared)',
    'createPreparedClient(prepared)',
  ]) has(submit, snippet, 'submit guard');
  for (const field of ['name', 'phone', 'email', 'address', 'sourcePrimary', 'ownerId', 'notes', 'caseTitle']) {
    assert.match(trimForm, new RegExp(field + ':\\s*form\\.' + field + '\\.trim\\(\\)'));
  }
});

test('FRT-029 closes and resets the controlled form', () => {
  const dialog = read(dialogPath);
  const closeAndReset = section(dialog, 'const closeAndReset = () => {', '\n  };');
  has(closeAndReset, 'onOpenChange(false);');
  has(closeAndReset, 'setForm(buildDefaultClientCreateForm());');
  assert.match(dialog, /<Dialog\s+open=\{open\}\s+onOpenChange=\{\(nextOpen\) => \{[\s\S]*?onOpenChange\(nextOpen\);[\s\S]*?if\s*\(!nextOpen\)\s*setForm\(buildDefaultClientCreateForm\(\)\);/);
});

test('FRT-029 writes through the real mutation, refreshes and preserves case follow-up', () => {
  const dialog = read(dialogPath);
  const createPrepared = section(dialog, 'const createPreparedClient = async (', '\n  const handleSubmit');
  has(createPrepared, 'await createClientInSupabase(clientPayload)');
  for (const field of ['name', 'phone', 'email', 'address', 'company', 'sourcePrimary', 'ownerId', 'notes']) {
    assert.match(createPrepared, new RegExp(field + ':\\s*prepared\\.' + field));
  }
  has(createPrepared, 'workspaceId: requireWorkspaceId(workspace)');
  assert.match(createPrepared, /allowDuplicate:\s*Boolean\(options\?\.forceDuplicate\)/);
  assert.match(createPrepared, /toast\.success\('Klient dodany'\)/);
  assert.match(createPrepared, /onCreated\?\.\(\)/);
  assert.match(createPrepared, /closeAndReset\(\)/);
  assert.match(dialog, /finally\s*\{[\s\S]*?setSaving\(false\)/);
  assert.match(createPrepared, /if\s*\(prepared\.createCase\)/);
  assert.match(createPrepared, /await\s+createStarterCaseForClient\(/);
  assert.match(createPrepared, /navigate\(['"]\/cases\/['"]\s*\+/);
  assert.match(createPrepared, /finance=1&source=client-create/);
});

test('FRT-029 keeps modal geometry, colors, icons and actions on the canonical Visual SOT', () => {
  const dialog = read(dialogPath);
  const css = read(cssPath);
  const foundation = read(foundationPath);
  const visualEntry = read(visualEntryPath);
  const buttonPrimitive = read(buttonPrimitivePath);
  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-main',
    '--cf-vst-text-muted',
    '--cf-vst-input-border',
    '--cf-vst-modal-padding',
    '--cf-vst-shadow-modal',
  ]) assert.ok(foundation.includes(token), 'canonical Visual SOT is missing token: ' + token);
  for (const owner of [
    "@import './owners/closeflow-foundation.css';",
    "@import './owners/closeflow-actions.css';",
    "@import './owners/closeflow-dialogs.css';",
  ]) has(visualEntry, owner, 'Visual SOT entrypoint');
  has(dialog, "import { Button } from './ui/button';");
  has(dialog, "import { FormField } from './ui/form-field';");
  has(dialog, "import { modalFooterClass } from './entity-actions';");
  has(css, '[data-forteca-frt-029-root][data-closeflow-modal-visual-system="true"]');
  has(css, 'width: min(528px');
  has(css, 'grid-template-columns: repeat(2, minmax(0, 1fr))');
  has(css, '--cf-vst-color-primary');
  has(css, '--cf-vst-surface-card-solid');
  has(buttonPrimitive, 'cf-vst-button-primary');
  has(buttonPrimitive, 'cf-vst-button-delete');
  assert.doesNotMatch(dialog, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(dialog, /\b(?:rgba?|hsla?)\(/i);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgba?|hsla?)\(/i);
  assert.doesNotMatch(css, /\b(?:bg|text|border)-(?:red|blue|green|emerald|amber|slate)-\d{2,3}\b/i);
});

test('FRT-029 persists address and assignment through the workspace-scoped real data contract', () => {
  const api = read(apiPath);
  const fallback = read(fallbackPath);
  const dataContract = read(dataContractPath);
  const migration = read(migrationPath);
  has(fallback, 'export type ClientCreateInput');
  has(fallback, 'address?: string | null');
  has(fallback, 'ownerId?: string | null');
  has(fallback, "'address'");
  has(fallback, "'ownerId'");
  has(dataContract, 'address: string;');
  has(dataContract, 'ownerId: string | null;');
  has(dataContract, "address: ['address']");
  has(dataContract, "ownerId: ['ownerId', 'owner_id']");
  has(api, "'address', 'owner_id'");
  has(api, 'address: asText(body.address) || null');
  has(api, 'owner_id: ownerInput.value');
  has(api, 'findWorkspaceScopedOwner');
  has(api, 'CLIENT_OWNER_NOT_IN_WORKSPACE');
  has(api, 'CLIENT_OWNER_FIELD_UNAVAILABLE');
  assert.match(migration, /add column if not exists address text/i);
  assert.match(migration, /add column if not exists owner_id uuid/i);
  assert.match(migration, /on public\.clients \(workspace_id, owner_id\)/i);
  assert.doesNotMatch(migration, /drop\s+(?:column|table)|truncate\s+/i);
});

test('FRT-029 rejects screenshot fixtures and generated client payloads in the live create path', () => {
  const dialog = read(dialogPath);
  const clients = read(clientsPath);
  const runtime = dialog + '\n' + clients;
  for (const pattern of [
    /029_client_add_modal\.(?:webp|png|jpe?g)/i,
    /data:image\//i,
    /base64,/i,
    /(?:mock|fixture)(?:Client|Data|Name|Payload)/i,
  ]) assert.doesNotMatch(runtime, pattern);
  for (const field of ['name', 'phone', 'email', 'address', 'sourcePrimary', 'ownerId', 'notes', 'caseTitle']) {
    assert.match(dialog, new RegExp(field + ':\\s*[\'"][\'"]'));
    assert.match(dialog, new RegExp('value=\\{form\\.' + field + '\\}'));
  }
});
