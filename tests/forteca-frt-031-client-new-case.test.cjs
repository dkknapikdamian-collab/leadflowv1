const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { test } = require('node:test');

const ROOT = path.resolve(__dirname, '..');
const CONTRACT_PATH = '_project/contracts/forteca-clean/FRT-031_CLIENT_NEW_CASE.md';
const REFERENCE_PATH = 'docs/ui/reference/forteca-calm-light/031_client_new_case_modal.webp';
const DIALOG_PATH = 'src/components/CreateClientCaseDialog.tsx';
const CREATE_CASE_PATH = 'src/lib/cases/create-client-case.ts';
const SUPABASE_FALLBACK_PATH = 'src/lib/supabase-fallback.ts';
const CLIENT_DETAIL_PATH = 'src/pages/ClientDetail.tsx';
const CSS_PATH = 'src/styles/forteca-client-case-create.css';
const DIALOG_PRIMITIVE_PATH = 'src/components/ui/dialog.tsx';
const BUTTON_PRIMITIVE_PATH = 'src/components/ui/button.tsx';
const VISUAL_SOURCE_TRUTH_PATH = 'src/styles/closeflow-visual-source-truth.css';

const EXPECTED_REFERENCE_SHA256 = '7ef598cebad8d06aa73a091f946a5ec8c87f7401f387b177695b1d8708905f6a';

function read(relativePath) {
  return fs.readFileSync(path.join(ROOT, relativePath), 'utf8').replace(/\r\n/g, '\n');
}

function sha256(relativePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(ROOT, relativePath))).digest('hex');
}

function has(source, snippet, label = snippet) {
  assert.ok(source.includes(snippet), `missing ${label}`);
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function sourceSection(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.notEqual(start, -1, `missing section start: ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.notEqual(end, -1, `missing section end: ${endMarker}`);
  return source.slice(start, end);
}

function assertInOrder(source, markers) {
  let previous = -1;
  for (const marker of markers) {
    const current = source.indexOf(marker);
    assert.ok(current > previous, `expected ${marker} after the preceding visible control`);
    previous = current;
  }
}

const dialog = read(DIALOG_PATH);
const createCaseSource = read(CREATE_CASE_PATH);
const supabaseFallback = read(SUPABASE_FALLBACK_PATH);
const clientDetail = read(CLIENT_DETAIL_PATH);
const caseCreateCss = read(CSS_PATH);
const dialogPrimitive = read(DIALOG_PRIMITIVE_PATH);
const buttonPrimitive = read(BUTTON_PRIMITIVE_PATH);
const visualSourceTruth = read(VISUAL_SOURCE_TRUTH_PATH);

const componentStart = dialog.indexOf('export function CreateClientCaseDialog');
assert.notEqual(componentStart, -1, 'CreateClientCaseDialog definition must exist');
const renderStart = dialog.indexOf('  return (\n    <Dialog', componentStart);
assert.notEqual(renderStart, -1, 'CreateClientCaseDialog render must exist');
const dialogRender = dialog.slice(renderStart);
const submitStart = dialog.indexOf('const handleSubmit = async', componentStart);
assert.notEqual(submitStart, -1, 'CreateClientCaseDialog submit handler must exist');
const submitHandler = dialog.slice(submitStart, renderStart);

test('FRT-031 contract and reference stay pinned', () => {
  const contract = read(CONTRACT_PATH);

  assert.match(contract, /^CONTRACT_STATUS: LOCKED$/m);
  assert.match(contract, /^STAGE_ID: FRT-031$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/031_client_new_case_modal\.webp$/m);
  assert.match(contract, /^TARGET_ROUTE: \/clients\/:clientId$/m);
  assert.match(contract, /^TARGET_STATE: New Case for this Client$/m);
  assert.match(contract, /^PREDECESSOR: FRT-030$/m);
  assert.match(contract, /^SUCCESSOR: FRT-032$/m);
  assert.match(contract, /^CURRENT_RUNTIME_OWNERS:.*CreateClientCaseDialog\.tsx.*ClientDetail.*case create source/m);
  assert.match(contract, /^VISIBLE_CONTROL_INVENTORY:.*case fields.*client relation.*Save\/Create.*Cancel.*close.*validation.*success navigation\/refresh\.$/m);
  assert.equal(sha256(REFERENCE_PATH), EXPECTED_REFERENCE_SHA256, 'FRT-031 reference asset hash changed');
});

test('FRT-031 modal exposes one rooted, ordered control surface', () => {
  assert.equal(countMatches(dialog, /export function CreateClientCaseDialog\b/g), 1);
  assert.equal(countMatches(dialog, /<DialogContent\b/g), 1);
  assert.equal(countMatches(dialog, /<form\b/g), 1);
  has(dialog, "import '../styles/forteca-client-case-create.css';", 'the FRT-031 stylesheet import');
  has(dialogRender, '<Dialog open={open} onOpenChange={(nextOpen) => !saving && onOpenChange(nextOpen)}>');
  assert.match(
    dialogRender,
    /<DialogContent\s+aria-describedby="create-client-case-description"\s+className="forteca-frt-031-case-create"\s+data-forteca-frt-031-root="true"\s*>/,
  );
  has(dialogRender, '<form className="forteca-frt-031-form" onSubmit={handleSubmit} noValidate');
  has(dialogRender, 'data-forteca-frt-031-runtime="true"');
  has(dialogRender, '<DialogTitle>Nowa sprawa</DialogTitle>');
  has(dialogRender, 'Utwórz sprawę powiązaną z wybranym klientem.');

  const visibleControls = [
    '<CaseField id="create-client-case-client" label="Klient" labelFor={null}',
    '<CaseField id="create-client-case-title" label="Nazwa sprawy" required>',
    '<CaseField id="create-client-case-type" label="Typ sprawy" required>',
    '<CaseField id="create-client-case-category" label="Kategoria usługi" required>',
    '<CaseField id="create-client-case-priority" label="Priorytet" required>',
    '<CaseField id="create-client-case-value" label="Wartość (PLN)" required>',
    '<CaseField id="create-client-case-start-date" label="Termin startu" required>',
    '<CaseField id="create-client-case-planned-date" label="Planowany termin">',
    '<CaseField id="create-client-case-owner" label="Opiekun" required>',
    '<CaseField id="create-client-case-source" label="Źródło sprawy">',
    '<CaseField id="create-client-case-note" label="Notatka startowa" className="forteca-frt-031-field--full">',
    '<section className="forteca-frt-031-checklist"',
    '<DialogFooter className="forteca-frt-031-dialog-footer">',
  ];
  for (const marker of visibleControls) has(dialogRender, marker);
  assertInOrder(dialogRender, visibleControls);

  has(dialogRender, 'id="create-client-case-client"');
  assert.match(dialogRender, /<EntityIcon\s+entity="client"[^>]*\/>/);
  has(dialogRender, 'id="create-client-case-title"');
  has(dialogRender, 'autoFocus');
  has(dialogRender, 'placeholder="Np. Podział działki"');
  has(dialogRender, 'id="create-client-case-type"');
  has(dialogRender, 'id="create-client-case-category"');
  has(dialogRender, 'id="create-client-case-priority"');
  has(dialogRender, 'placeholder="12 500,00"');
  has(dialogRender, 'inputMode="decimal"');
  has(dialogRender, 'id="create-client-case-start-date"');
  has(dialogRender, 'id="create-client-case-planned-date"');
  assert.ok(countMatches(dialogRender, /<CalendarActionIcon\b/g) >= 2, 'both date fields use the shared calendar icon');
  has(dialogRender, 'id="create-client-case-owner"');
  has(dialogRender, 'id="create-client-case-source"');
  has(dialogRender, 'placeholder="Dodaj kontekst, który pomoże rozpocząć pracę..."');
  assert.match(dialogRender, /role="switch"[\s\S]*?aria-label="Utwórz checklistę od razu"/);
  has(dialogRender, 'role="alert"');
  assert.match(dialogRender, /<Button type="button" variant="outline"[\s\S]*?>\s*Anuluj\s*<\/Button>/);
  assert.match(dialogRender, /<Button type="submit"[\s\S]*?disabled=\{saving\}[\s\S]*?>[\s\S]*?(?:Tworzenie…|Utwórz sprawę)[\s\S]*?<\/Button>/);
});

test('FRT-031 validates before mutation and preserves cancel/navigation semantics', () => {
  assert.match(submitHandler, /event\.preventDefault\(\)/);
  has(submitHandler, 'if (submitInFlightRef.current) return;');
  for (const validationGuard of [
    '!hasAccess',
    '!workspaceId || !clientId',
    '!preparedTitle',
    '!draft.caseType',
    '!draft.category',
    '!draft.priority',
    'contractValue === null || contractValue <= 0',
    '!draft.owner',
    '!selectedOwnerId',
    'draft.createChecklist && !selectedChecklistTemplate',
  ]) {
    has(submitHandler, validationGuard);
  }
  for (const message of [
    'Brak dostępu do tworzenia spraw.',
    'Nie udało się ustalić klienta lub workspace.',
    'Podaj nazwę sprawy.',
    'Wybierz typ sprawy.',
    'Wybierz kategorię usługi.',
    'Wybierz priorytet.',
    'Podaj wartość sprawy większą od zera.',
  ]) {
    has(submitHandler, message);
  }

  const beforeMutation = submitHandler.slice(0, submitHandler.indexOf('setSaving(true)'));
  assert.doesNotMatch(beforeMutation, /createStarterCaseForClient\s*\(/, 'validation must finish before the real write');
  has(dialog, 'setDraft(createDefaultDraft(client, preferredOwnerName));');
  has(dialog, "setValidationMessage('');");
  has(dialogRender, 'onClick={() => onOpenChange(false)}');
  has(submitHandler, "toast.success('Sprawa utworzona.')");
  has(submitHandler, 'onOpenChange(false);');
  has(submitHandler, "navigate('/cases/' + encodeURIComponent(createdCaseId) + '?finance=1&source=client-detail');");
  has(submitHandler, 'submitInFlightRef.current = false;');
});

test('FRT-031 reaches the real client-scoped createCaseInSupabase path', () => {
  has(dialog, "import { createStarterCaseForClient } from '../lib/cases/create-client-case';");
  assert.equal(countMatches(dialog, /createStarterCaseForClient\s*\(/g), 1);
  has(submitHandler, 'await createStarterCaseForClient({');
  for (const payloadField of [
    'title: preparedTitle',
    'clientId,',
    'clientName,',
    'clientEmail: readClientText(client, [\'email\'])',
    'clientPhone: readClientText(client, [\'phone\', \'telephone\'])',
    'workspaceId,',
    'primaryForClient: !hasExistingCase',
    'contractValue: contractValue as number',
    "currency: 'PLN'",
    'startedAt: startDateIso',
    'plannedAt: plannedDateIso',
    'ownerId: selectedOwnerId || null',
    'caseType: draft.caseType',
    'category: draft.category',
    'priority: draft.priority',
    'source: draft.source',
    'note: draft.note',
    'createChecklist: draft.createChecklist',
    'checklistTemplateId: selectedChecklistTemplate?.id',
    'checklistTemplateName: selectedChecklistTemplate?.name',
    'checklistItems: selectedChecklistTemplate?.items',
  ]) {
    has(submitHandler, payloadField);
  }

  assert.match(createCaseSource, /import\s*\{[\s\S]*\bcreateCaseInSupabase\b[\s\S]*\}\s*from '\.\.\/supabase-fallback';/);
  assert.equal(countMatches(createCaseSource, /createCaseInSupabase\s*\(/g), 1);
  has(createCaseSource, 'await createCaseInSupabase({');
  for (const persistedField of [
    'title: input.title.trim()',
    'clientId: input.clientId',
    'clientName: input.clientName',
    "status: 'new'",
    'contractValue: typeof input.contractValue === \'number\' ? input.contractValue : 0',
    "currency: input.currency || 'PLN'",
    'primaryForClient: input.primaryForClient',
    'workspaceId: input.workspaceId',
    'ownerId: input.ownerId',
  ]) {
    has(createCaseSource, persistedField);
  }
  assert.match(supabaseFallback, /export async function createCaseInSupabase\(input: CaseUpsertInput\)/);
  has(supabaseFallback, "callApi<SupabaseInsertResult>('/api/cases', { method: 'POST', body: JSON.stringify(input) });");

  has(clientDetail, "import { CreateClientCaseDialog } from '../components/CreateClientCaseDialog';");
  has(clientDetail, '<CreateClientCaseDialog');
  has(clientDetail, 'client={client}');
  has(clientDetail, "workspaceId={String(workspace?.id || '')}");
  has(clientDetail, 'hasAccess={hasAccess}');
  has(clientDetail, 'hasExistingCase={clientRelatedCasesStage231B0R8.length > 0}');
  assert.doesNotMatch(dialog, /(?:fetch\s*\(|axios|supabase\.from\s*\()/i);
  assert.doesNotMatch(createCaseSource, /(?:fetch\s*\(|axios|supabase\.from\s*\()/i);
});

test('FRT-031 keeps one shared icon/action flow and a scoped CSS owner', () => {
  assert.doesNotMatch(dialog, /from ['"]lucide-react['"]/);
  assert.doesNotMatch(dialog, /<svg\b/);
  has(dialog, "from './ui-system';");
  for (const sharedIcon of ['CalendarActionIcon', 'EntityIcon', 'SemanticIcon']) has(dialog, sharedIcon);
  assert.equal(countMatches(dialog, /createCaseInSupabase/g), 0, 'the component must not bypass the real mutation helper');
  assert.equal(countMatches(dialog, /forteca-client-case-create\.css/g), 1);
  assert.equal(countMatches(caseCreateCss, /data-forteca-frt-031-root/g) > 0, true);

  assert.match(caseCreateCss, /^\/\* LF-UI-SOT-007_OWNER .*"ownerId":"runtime:src\/styles\/forteca-client-case-create\.css".*\*\/$/m);
  has(caseCreateCss, '"consumerRoots":["src/components/CreateClientCaseDialog.tsx"]');
  has(caseCreateCss, '"role":"scoped-adapter"');
  has(caseCreateCss, '"whyNotDuplicate":"The dialog keeps the shared Dialog, form controls, button and icon primitives;');
  assert.doesNotMatch(caseCreateCss, /#[0-9a-f]{3,8}\b/i, 'component CSS must not own one-off color literals');
  assert.doesNotMatch(caseCreateCss, /\b(?:rgba?|hsla?)\s*\(/i, 'component CSS must not own one-off color functions');
  assert.doesNotMatch(caseCreateCss, /\b(?:bg|text|border)-(?:red|blue|green|emerald|amber|slate|gray)-\d{2,3}\b/i, 'component CSS must not use Tailwind color utilities');

  const cssWithoutComments = caseCreateCss.replace(/\/\*[\s\S]*?\*\//g, '');
  const cssRuleHeaders = [...cssWithoutComments.matchAll(/([^{}]+)\{/g)]
    .map((match) => match[1].trim())
    .filter((header) => header && !header.startsWith('@'));
  for (const header of cssRuleHeaders) {
    for (const selector of header.split(',').map((item) => item.trim()).filter(Boolean)) {
      assert.ok(
        selector.includes('data-forteca-frt-031-root') || selector.includes('.cf-vst-overlay:has'),
        `unscoped FRT-031 selector: ${selector}`,
      );
    }
  }
});

test('FRT-031 responsive rules resolve through the Visual SOT token owners', () => {
  has(visualSourceTruth, "@import './owners/closeflow-foundation.css';");
  has(visualSourceTruth, "@import './owners/closeflow-dialogs.css';");
  has(dialogPrimitive, 'data-closeflow-modal-visual-system="true"');
  has(dialogPrimitive, 'className="cf-vst-dialog-close cf-modal-close');
  has(dialogPrimitive, '<X className="h-4 w-4" />');
  has(buttonPrimitive, 'cf-vst-button-primary');
  has(buttonPrimitive, 'data-cf-vst-button="true"');

  assert.match(caseCreateCss, /@media \(max-width: 640px\)/);
  has(caseCreateCss, 'width: calc(100vw - (var(--cf-vst-space-md) * 2))');
  has(caseCreateCss, 'height: calc(100vh - (var(--cf-vst-space-lg) * 2))');
  has(caseCreateCss, 'grid-template-columns: 1fr');
  has(caseCreateCss, 'flex-direction: column-reverse');
  has(caseCreateCss, 'width: 100% !important');
  has(caseCreateCss, 'overflow-y: auto');

  assert.doesNotMatch(caseCreateCss, /^\s*--(?!cf-vst-)[a-z0-9-]+\s*:/im, 'local CSS must not define an unowned custom property');
  const referencedTokens = [...caseCreateCss.matchAll(/var\((--[a-z0-9-]+)/g)].map((match) => match[1]);
  assert.ok(referencedTokens.length > 0, 'FRT-031 CSS must consume semantic tokens');
  assert.ok(referencedTokens.every((token) => token.startsWith('--cf-vst-')), 'all FRT-031 CSS tokens must belong to the Visual SOT');
});

test('FRT-031 test remains runnable as a browser-free Node test', () => {
  assert.doesNotThrow(() => {
    execFileSync(process.execPath, ['--check', __filename], {
      cwd: ROOT,
      stdio: 'pipe',
    });
  });
});
