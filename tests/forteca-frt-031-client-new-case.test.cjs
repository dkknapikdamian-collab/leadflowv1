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

const contractPath = '_project/contracts/forteca-clean/FRT-031_CLIENT_NEW_CASE.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/031_client_new_case_modal.webp';
const dialogPath = 'src/components/CreateClientCaseDialog.tsx';
const createSourcePath = 'src/lib/cases/create-client-case.ts';
const detailPath = 'src/pages/ClientDetail.tsx';
const apiPath = 'api/cases.ts';
const cssPath = 'src/styles/forteca-client-new-case.css';
const buttonPath = 'src/components/ui/button.tsx';
const dialogPrimitivePath = 'src/components/ui/dialog.tsx';

test('FRT-031 pins the client-context case contract and reference chain', () => {
  const contract = read(contractPath);
  assert.match(contract, /^STAGE_ID: FRT-031$/m);
  assert.match(contract, /^TARGET_ROUTE: \/clients\/:clientId$/m);
  assert.match(contract, /^TARGET_STATE: New Case for this Client$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/031_client_new_case_modal\.webp$/m);
  assert.match(contract, /^PREDECESSOR: FRT-030$/m);
  assert.match(contract, /^SUCCESSOR: FRT-032$/m);
  assert.match(contract, /^KNOWN_REFERENCE_DEVIATIONS: No screenshot-only case fields or second case-create flow\.$/m);
  assert.ok(exists(referencePath), 'FRT-031 reference is missing: ' + referencePath);
  assert.equal(sha256(referencePath), '7ef598cebad8d06aa73a091f946a5ec8c87f7401f387b177695b1d8708905f6a');
});

test('FRT-031 exposes one controlled client-context dialog with truthful controls', () => {
  const dialog = read(dialogPath);
  const start = dialog.indexOf('type CreateClientCaseDialogProps = {');
  const section = dialog.slice(start);
  assert.ok(start >= 0, 'FRT-031 dialog owner must be present');
  for (const snippet of [
    'open: boolean',
    'client: Record<string, any>',
    'hasAccess: boolean',
    'hasExistingCase: boolean',
    'data-forteca-frt-031-root="true"',
    'data-forteca-frt-031-runtime="true"',
    '<DialogTitle>Nowa sprawa</DialogTitle>',
    'Sprawa zostanie powiązana z wybranym klientem.',
    'data-forteca-frt-031-field="client"',
    '<ClientEntityIcon size="sm" tone="soft" />',
    'data-forteca-frt-031-field="title"',
    'id="create-client-case-title"',
    'Nazwa sprawy *',
    'data-forteca-frt-031-action="cancel"',
    'data-forteca-frt-031-action="submit"',
    'disabled={saving || !title.trim()}',
    'Utwórz sprawę',
  ]) has(section, snippet, 'FRT-031 dialog contract');
  assert.match(section, /clientDisplayName = String\(client\?\.name \|\| client\?\.company/);
  assert.match(section, /<DialogContent[\s\S]*?aria-describedby="create-client-case-description"/);
  assert.match(section, /<Dialog[\s\S]*?onOpenChange=\{\(nextOpen\) => !saving && onOpenChange\(nextOpen\)\}/);
  assert.doesNotMatch(section, /031_client_new_case_modal\.(?:webp|png|jpe?g)/i);
  assert.doesNotMatch(section, /Anna Nowak|anna\.nowak@example\.com|Damian Knapik/);
});

test('FRT-031 sends the real client relation, scope and primary-case semantics', () => {
  const dialog = read(dialogPath);
  const createSource = read(createSourcePath);
  const api = read(apiPath);
  const detail = read(detailPath);
  for (const snippet of [
    'createStarterCaseForClient({',
    'clientId,',
    'clientName: clientDisplayName,',
    'clientEmail: String(client?.email || \'\').trim(),',
    'clientPhone: String(client?.phone || \'\').trim(),',
    'workspaceId,',
    'primaryForClient: !hasExistingCase,',
    "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-detail')",
  ]) has(dialog, snippet, 'FRT-031 client-context mutation wiring');
  for (const snippet of [
    'export type CreateStarterCaseForClientInput',
    'clientId: input.clientId',
    'clientName: input.clientName',
    'workspaceId: input.workspaceId',
    "status: 'new'",
    'primaryForClient: input.primaryForClient',
    'createdCaseId: readCreatedCaseId(createdCase)',
  ]) has(createSource, snippet, 'FRT-031 create source');
  for (const snippet of [
    'const ensuredClient = await ensureClientForCase(finalWorkspaceId, {',
    'clientId: body.clientId ?? linkedLead?.client_id ?? linkedLead?.clientId,',
    'if (body.clientId && !ensuredClient)',
    "throw new Error('CLIENT_NOT_FOUND')",
    'client_id: normalizedClientId,',
    'workspace_id: finalWorkspaceId,',
    'if (wantsPrimaryCase && normalizedClientId)',
    'withWorkspaceFilter(',
  ]) has(api, snippet, 'FRT-031 scoped case API');
  for (const snippet of [
    'const openNewCase = () => {',
    'setClientCaseCreateOpen(true);',
    '<CreateClientCaseDialog',
    'open={clientCaseCreateOpen}',
    'client={client}',
  ]) has(detail, snippet, 'FRT-031 ClientDetail owner');
});

test('FRT-031 keeps the dialog on canonical visual and action owners', () => {
  const dialog = read(dialogPath);
  const css = read(cssPath);
  const button = read(buttonPath);
  const primitive = read(dialogPrimitivePath);
  for (const snippet of [
    "import { Button } from './ui/button';",
    '  DialogContent,',
    "import { Input } from './ui/input';",
    "import { Label } from './ui/label';",
    'modalFooterClass',
    "import { ClientEntityIcon } from './ui-system/EntityIcon';",
    'forteca-client-new-case.css',
  ]) has(dialog, snippet, 'FRT-031 canonical primitive');
  for (const token of [
    '--cf-vst-color-primary-soft',
    '--cf-vst-color-primary-border',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-main',
    '--cf-vst-text-strong',
    '--cf-vst-text-muted',
    '--cf-vst-input-border',
    '--cf-vst-shadow-modal',
  ]) has(css, token, 'FRT-031 Visual SOT token');
  has(css, '[data-forteca-frt-031-root][data-closeflow-modal-visual-system="true"]', 'FRT-031 scoped style root');
  has(button, 'cf-vst-button-primary', 'shared primary action owner');
  has(primitive, 'data-closeflow-modal-visual-system', 'shared dialog visual owner');
  assert.doesNotMatch(dialog, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(css, /\b(?:rgba?|hsla?)\(/i);
});

test('FRT-031 preserves the real-flow boundary and does not fake screenshot-only fields', () => {
  const runtime = read(dialogPath) + '\n' + read(createSourcePath);
  for (const pattern of [
    /data:image\//i,
    /base64,/i,
    /(?:mock|fixture)(?:Case|Data|Name|Payload)/i,
    /priority|category|checklistTemplate|startDate|ownerId|sourceCase/i,
  ]) assert.doesNotMatch(runtime, pattern);
  assert.match(runtime, /createCaseInSupabase\(/);
  assert.match(runtime, /clientId/);
  assert.match(runtime, /workspaceId/);
});
