const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const componentPath = 'src/components/LeadStartServiceDialog.tsx';
const leadDetailPath = 'src/pages/LeadDetail.tsx';
const handoffPath = 'src/lib/lead-case-handoff.ts';
const fallbackPath = 'src/lib/supabase-fallback.ts';
const apiPath = 'api/leads.ts';
const serverPath = 'src/server/lead-to-case.ts';
const provisionPath = 'src/server/lead-start-service-provision.ts';
const dialogStylesPath = 'src/styles/owners/closeflow-dialogs.css';
const semanticIconPath = 'src/ui-system/icons/SemanticIcon.tsx';
const semanticFoundationPath = 'src/styles/owners/closeflow-foundation.css';
const actionIconPath = 'src/components/ui-system/ActionIcon.tsx';
const actionStylesPath = 'src/styles/owners/closeflow-actions.css';
const idempotencyMigrationPath = 'supabase/migrations/20260828090000_frt020_lead_start_service_provisioning_idempotency.sql';
const contractPath = '_project/contracts/forteca-clean/FRT-020_LEAD_START_CASE.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/020_lead_start_case.webp';

test('FRT-020 pins the active contract and reference', () => {
  const contract = read(contractPath);
  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-020/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(contract, /TARGET_STATE: Lead Detail — start service\/create case/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/020_lead_start_case\.webp/);
  assert.ok(fs.existsSync(path.join(root, referencePath)), `FRT-020 reference is missing: ${referencePath}`);
});

test('FRT-020 exposes a controlled, preview-safe real-flow dialog', () => {
  const source = read(componentPath);
  assert.match(source, /data-forteca-frt-020-start-case="true"/);
  assert.match(source, /export type LeadStartServiceDialogMode = 'interactive' \| 'preview';/);
  assert.match(source, /mode\??:\s*LeadStartServiceDialogMode/);
  assert.match(source, /const isPreview = mode === 'preview';/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-labelledby=\{titleId\}/);
  assert.match(source, /aria-describedby=\{descriptionId\}/);

  for (const copy of [
    'Rozpocznij obsługę',
    'Utwórz sprawę i rozpocznij proces realizacji dla tego klienta.',
    'Nazwa sprawy',
    'Typ usługi',
    'Szablon checklisty',
    'Wartość',
    'Właściciel sprawy',
    'Termin startu',
    'Portal klienta',
    'Wyślij link klientowi',
    'Utwórz pierwszy następny krok dla operatora',
    'Podgląd tego, co zostanie utworzone',
    'Checklisty startowe',
    'Link dla klienta',
    'Zadanie kontrolne za 2 dni',
    'Anuluj',
    'Utwórz sprawę',
  ]) {
    assert.ok(source.includes(copy), `missing FRT-020 copy: ${copy}`);
  }

  for (const field of ['title', 'serviceType', 'checklistTemplate', 'value', 'owner', 'startDate']) {
    assert.match(source, new RegExp(`data-forteca-frt-020-field="${field}"`));
  }
  assert.match(source, /data-forteca-frt-020-start-case-submit="true"/);
  assert.match(source, /const confirmDisabled = isBusy \|\| \(!isPreview/);
  assert.match(source, /function handleSubmit\(event: FormEvent<HTMLFormElement>\)/);
  assert.match(source, /if \((?:isPreview \|\| )?confirmDisabled\) return;/);
  assert.doesNotMatch(source, /from ['"]lucide-react['"]/);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i);
});

test('FRT-020 keeps the reference preview copy and sample plan aligned without a fixture customer', () => {
  const source = read(componentPath);
  const leadDetail = read(leadDetailPath);

  for (const copy of [
    'Po kliknięciu „Utwórz sprawę” zostaną utworzone następujące elementy.',
    'Zostanie dodana checklista na podstawie wybranego szablonu.',
    'Klient otrzyma dostęp do portalu z wglądem w sprawę i postępy.',
    'Pierwsze zadanie dla operatora zostanie utworzone automatycznie.',
    'Przypisane do',
  ]) {
    assert.ok(source.includes(copy), `missing reference-aligned FRT-020 copy: ${copy}`);
  }

  assert.match(leadDetail, /checklistTaskCount: 18/);
  assert.doesNotMatch(source, /ACME Logistics|ACME Sp\. z o\.o\.|Jan Kowalski/);
});

test('FRT-020 wires the dialog to the existing Lead-to-Case mutation', () => {
  const leadDetail = read(leadDetailPath);
  const handoff = read(handoffPath);
  const fallback = read(fallbackPath);
  const api = read(apiPath);
  const server = read(serverPath);
  const provision = read(provisionPath);
  const idempotencyMigration = read(idempotencyMigrationPath);

  for (const marker of [
    '<LeadStartServiceDialog',
    'startLeadToCaseHandoff({',
    'draft: createCaseDraft',
    'startLeadService: startLeadServiceInSupabase',
    'updateTask: updateTaskInSupabase',
    'updateEvent: updateEventInSupabase',
    'navigate(caseDetailPath(result.caseId))',
  ]) {
    assert.ok(leadDetail.includes(marker), `missing real-flow marker: ${marker}`);
  }
  assert.match(leadDetail, /mode=\{frt020DevStartCasePreview \? 'preview' : 'interactive'\}/);
  assert.match(leadDetail, /if \(frt020DevStartCasePreview\) return;/);
  assert.match(leadDetail, /new URLSearchParams\(window\.location\.search \|\| ''\)\.get\('frt020'\) === 'start-service'/);

  for (const field of [
    'value',
    'caseValue',
    'contractValue',
    'currency',
    'portalReady',
    'clientPortal',
    'startDate',
    'serviceType',
    'checklistTemplate',
    'owner',
    'ownerId',
    'sendClientLink',
    'createFirstTask',
  ]) {
    assert.match(handoff, new RegExp(`\\b${field}\\??:`));
  }
  for (const field of [
    'value',
    'caseValue',
    'contractValue',
    'currency',
    'portalReady',
    'startDate',
    'serviceType',
    'checklistTemplate',
    'owner',
    'ownerId',
    'sendClientLink',
    'createFirstTask',
  ]) {
    assert.match(fallback, new RegExp(`\\b${field}\\??:`));
  }
  assert.match(handoff, /LEAD_SERVICE_TIMESTAMP_MISSING/);
  assert.match(handoff, /CLIENT_CREATE_FAILED/);
  assert.match(handoff, /LEAD_TASK_LINKER_MISSING/);
  assert.match(handoff, /LEAD_EVENT_LINKER_MISSING/);
  assert.match(handoff, /await Promise\.all\(operations\)/);
  assert.match(api, /hasExtendedLeadServiceFields/);
  assert.match(api, /startLeadServiceOperation/);
  assert.match(api, /sendClientLink/);
  assert.match(api, /createFirstTask/);
  assert.match(api, /buildLeadServiceResultFromExisting/);
  assert.match(api, /validateLeadStartServiceRequest/);
  assert.match(api, /provisionLeadStartService/);
  assert.match(api, /LEAD_SERVICE_RPC_REQUIRED_FOR_FRT020/);
  assert.match(provision, /LEAD_START_SERVICE_SOURCE = 'frt020_lead_start_service'/);
  assert.match(provision, /lead_start_service_provisioning_claims/);
  assert.match(provision, /LEAD_SERVICE_PROVISIONING_IN_PROGRESS/);
  assert.match(provision, /FRT020_PROVISIONING_CLAIM_FINALIZE_FAILED/);
  assert.match(provision, /requireRequestIdentity/);
  assert.match(provision, /CASE_OWNER_NOT_RESOLVED/);
  assert.match(provision, /profiles\?select=user_id/);
  assert.match(provision, /profiles\?select=auth_user_id/);
  assert.match(provision, /workspace_members\?select=user_id/);
  assert.match(provision, /CASE_OWNER_NOT_WORKSPACE_MEMBER/);
  assert.match(provision, /buildRequestKey\(leadId, body, ownerId \|\| ''\)/);
  assert.doesNotMatch(provision, /profiles\?select=id/);
  assert.match(provision, /owner_id: plan\.ownerId/);
  assert.match(provision, /CASE_OWNER_PERSIST_FAILED/);
  assert.match(provision, /FRT020_PROVISIONING_OWNER_RECEIPT_MISSING/);
  assert.match(provision, /CASE_TEMPLATE_NOT_FOUND/);
  assert.match(provision, /upsertPortalTokenForCase/);
  assert.match(provision, /sendResendEmail/);
  assert.match(provision, /lead_start_service_provisioned/);
  assert.match(provision, /work_items\?select=id,title,scheduled_at/);
  assert.doesNotMatch(provision, /payload:\s*\{[^}]*plaintextToken/);
  assert.match(idempotencyMigration, /lead_start_service_provisioning_claims/);
  assert.match(idempotencyMigration, /cases[\s\S]*add column if not exists owner_id uuid/);
  assert.match(idempotencyMigration, /closeflow_cases_owner_id_idx/);
  assert.match(idempotencyMigration, /profiles_user_id_workspace_uidx/);
  assert.match(idempotencyMigration, /add column if not exists source_type text/);
  assert.match(idempotencyMigration, /add column if not exists description text/);
  assert.match(idempotencyMigration, /work_items_workspace_frt020_source_key_uidx/);
  assert.match(server, /expectedRevenue = asNumber\(body\.value/);
  assert.match(server, /portalReady = body\.portalReady/);
  assert.match(server, /contract_value: expectedRevenue/);
  assert.match(server, /portal_ready: portalReady/);
});

test('FRT-020 keeps semantic colors centralized and consistent across repeated meanings', () => {
  const styles = read(dialogStylesPath);
  const semanticIcons = read(semanticIconPath);
  const semanticFoundation = read(semanticFoundationPath);
  const actionIcons = read(actionIconPath);
  const actionStyles = read(actionStylesPath);
  const start = styles.indexOf('/* FRT-020: Lead-to-case start modal.');
  assert.ok(start >= 0, 'FRT-020 dialog style section is missing');
  const section = styles.slice(start);

  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-task',
    '--cf-vst-color-payment',
    '--cf-vst-color-case-item',
    '--cf-vst-overlay-backdrop',
    '--cf-vst-modal-padding',
  ]) {
    assert.ok(section.includes(token), `FRT-020 is missing shared token: ${token}`);
  }
  assert.doesNotMatch(section, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(section, /rgba?\(/i);
  assert.match(section, /preview-icon--case[\s\S]*--cf-vst-color-case-item/);
  assert.match(section, /preview-icon--template[\s\S]*--cf-vst-color-payment/);
  assert.match(section, /preview-icon--client[\s\S]*--cf-vst-color-task/);
  assert.match(section, /preview-icon--task[\s\S]*--cf-vst-color-task/);
  assert.match(semanticIcons, /delete: \{ role: 'delete', tone: 'danger'/);
  assert.match(semanticFoundation, /\.cf-vst-semantic-icon-tone-danger\s*\{[\s\S]*color:\s*var\(--cf-vst-color-delete/);
  assert.match(actionIcons, /export const DeleteActionIcon = createActionIcon\('delete'\)/);
  assert.match(actionStyles, /\.cf-trash-action-icon,[\s\S]*color:\s*var\(--cf-vst-color-delete\)/);
});
