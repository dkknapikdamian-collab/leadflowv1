const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const componentPath = 'src/components/detail/LeadNextStepPrompt.tsx';
const leadDetailPath = 'src/pages/LeadDetail.tsx';
const nearestActionPath = 'src/lib/nearest-action.ts';
const leadsApiPath = 'api/leads.ts';
const taskRoutePath = 'src/server/task-route-stage124f.ts';
const dialogStylesPath = 'src/styles/owners/closeflow-dialogs.css';
const semanticIconPath = 'src/ui-system/icons/SemanticIcon.tsx';
const semanticFoundationPath = 'src/styles/owners/closeflow-foundation.css';
const actionIconPath = 'src/components/ui-system/ActionIcon.tsx';
const actionStylesPath = 'src/styles/owners/closeflow-actions.css';
const contractPath = '_project/contracts/forteca-clean/FRT-019_LEAD_NEXT_STEP.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/019_lead_next_step_prompt.webp';

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-019 pins the active prompt contract and reference', () => {
  const contract = read(contractPath);

  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-019/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(contract, /TARGET_STATE: Lead Detail — set next step prompt/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/019_lead_next_step_prompt\.webp/);
  assert.ok(fs.existsSync(path.join(root, referencePath)), `FRT-019 reference is missing: ${referencePath}`);
});

test('FRT-019 exposes the controlled presentational prompt contract', () => {
  const source = read(componentPath);

  assert.match(source, /data-forteca-frt-019-next-step="true"/);
  assert.match(source, /export type LeadNextStepPromptMode = 'interactive' \| 'preview';/);
  assert.match(source, /mode: LeadNextStepPromptMode/);
  assert.match(source, /const isPreview = mode === 'preview';/);
  assert.match(source, /data-forteca-frt-019-next-step-mode=\{mode\}/);
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-labelledby=\{titleId\}/);
  assert.match(source, /aria-describedby=\{descriptionId\}/);
  assert.match(source, /tabIndex=\{-1\}/);

  for (const prop of [
    'open: boolean',
    'selectedChoice: LeadNextStepChoice | null',
    'selectedAction: LeadNextStepAction | null',
    'date: string',
    'time: string',
    'onClose: () => void',
    'onChange: (field: LeadNextStepField, value: string) => void',
    'onSelect: (selection: LeadNextStepSelection) => void',
    'onSave: () => void | Promise<void>',
    'onCancel: () => void',
  ]) {
    assert.ok(source.includes(prop), `missing controlled prop: ${prop}`);
  }

  for (const copy of [
    'Ustaw kolejny krok',
    'Ten lead jest nadal aktywny.',
    'Nie zostawiaj go bez kolejnego ruchu – zaplanuj następny krok.',
    'Ustaw kolejny krok teraz',
    'Przypomnij jutro',
    'Zostaw bez kroku',
    'Sugerowane kolejne kroki',
    'Rozmowa telefoniczna',
    'Follow-up e-mail',
    'Wyślij ofertę',
    'Spotkanie online',
    'Lead bez ustawionego kolejnego kroku pojawi się w widoku „Bez kolejnego kroku”.',
    'Anuluj',
    'Zapisz',
  ]) {
    assert.ok(source.includes(copy), `missing FRT-019 copy: ${copy}`);
  }

  assert.match(source, /type="date"/);
  assert.match(source, /type="time"/);
  assert.match(source, /value=\{date\}/);
  assert.match(source, /value=\{time\}/);
  assert.match(source, /onChange\('date', event\.target\.value\)/);
  assert.match(source, /onChange\('time', event\.target\.value\)/);
  assert.match(source, /onSelect\(\{ kind: 'choice', value: choice\.value \}\)/);
  assert.match(source, /onSelect\(\{ kind: 'action', value: action\.value \}\)/);
  assert.match(source, /aria-pressed=\{isSelected\}/);
  assert.match(source, /const saveIsDisabled = isPreview \|\| saveDisabled \|\| isSaving;/);
  assert.match(source, /function handleSave\(\) \{\s*if \(isPreview\) return;\s*void onSave\(\);\s*\}/);
  assert.match(source, /onClick=\{handleSave\}/);
  assert.match(source, /disabled=\{saveIsDisabled\}/);
  assert.match(source, /aria-busy=\{isSaving\}/);
  assert.match(source, /Zapisywanie…/);
});

test('FRT-019 routes controls through the central UI and icon sources', () => {
  const source = read(componentPath);

  for (const centralSource of ['Button', 'IconButton', 'CalendarActionIcon', 'SaveActionIcon', 'SemanticIcon', 'FormFooter']) {
    assert.match(source, new RegExp(`\\b${centralSource}\\b`), `missing central source: ${centralSource}`);
  }
  assert.match(source, /from ['"]\.\.\/ui\/button['"]/);
  assert.match(source, /from ['"]\.\.\/ui\/icon-button['"]/);
  assert.match(source, /from ['"]\.\.\/ui-system['"]/);
  assert.doesNotMatch(source, /from ['"]lucide-react['"]/);
  assert.doesNotMatch(source, /<button\b/);
  assert.doesNotMatch(source, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(source, /\b(?:fetch|supabase|ACME)\b/i);
});

test('FRT-019 integrates the prompt with real Lead Detail task/event persistence', () => {
  const source = read(leadDetailPath);

  for (const marker of [
    'data-forteca-frt-019-next-step-trigger="true"',
    '<LeadNextStepPrompt',
    'openLeadNextStepPrompt',
    'handleLeadNextStepSelect',
    'handleLeadNextStepSave',
    "insertTaskToSupabase({",
    "insertEventToSupabase({",
    "updateLeadInSupabase({",
    "nextActionItemId: savedItemId",
  ]) {
    assert.ok(source.includes(marker), `missing Lead Detail integration marker: ${marker}`);
  }

  assert.match(source, /lead_next_step_created/);
  assert.match(source, /lead_next_step_skipped/);
  assert.match(source, /await loadLead\(\{ silent: true \}\)/);
  assert.match(source, /caseId: serviceCaseId \|\| null/);
  assert.match(source, /workspaceId,/);
  assert.match(source, /type: 'meeting'/);
  assert.match(source, /type: 'follow_up'/);
  assert.match(source, /nextActionItemId: leadNextActionItemId \|\| undefined/);
  assert.match(source, /leadNextActionItemId = asText\(lead\?\.nextActionItemId/);
  assert.match(source, /throw new Error\('SAVED_NEXT_STEP_ID_MISSING'\)/);
  assert.match(source, /import\.meta\.env\.DEV/);
  assert.match(source, /get\('frt019'\) === 'prompt'/);
  assert.match(source, /const handleLeadNextStepPreviewSave = async \(\) => undefined;/);
  assert.match(source, /const leadNextStepPromptMode: LeadNextStepPromptMode = frt019DevPromptPreview \? 'preview' : 'interactive';/);
  assert.match(source, /mode=\{leadNextStepPromptMode\}/);
  assert.match(source, /onSave=\{frt019DevPromptPreview \? handleLeadNextStepPreviewSave : handleLeadNextStepSave\}/);

  const previewSaveStart = source.indexOf('const handleLeadNextStepPreviewSave =');
  const previewSaveEnd = source.indexOf('\n', previewSaveStart);
  assert.ok(previewSaveStart >= 0, 'DEV preview must define an explicit no-op save handler');
  assert.doesNotMatch(source.slice(previewSaveStart, previewSaveEnd + 1), /insertTaskToSupabase|insertEventToSupabase|updateLeadInSupabase|addActivity/);
});

test('FRT-019 keeps the next-action pointer and task relations fail-closed', () => {
  const nearestAction = read(nearestActionPath);
  const leadsApi = read(leadsApiPath);
  const taskRoute = read(taskRoutePath);

  assert.match(nearestAction, /nextActionItemId\?: EntityId/);
  assert.match(nearestAction, /const preferredId = asText\(nextActionItemId\)/);
  assert.match(nearestAction, /candidates\.find\(\(candidate\) => candidate\.id === preferredId\)/);
  assert.match(nearestAction, /\|\| candidates\[0\]/);

  assert.match(leadsApi, /async function validateLeadNextActionItemPatch\(/);
  assert.match(leadsApi, /requireScopedRow\(\s*'work_items'/);
  assert.match(leadsApi, /LEAD_NEXT_ACTION_ITEM_NOT_FOUND/);
  assert.match(leadsApi, /LEAD_NEXT_ACTION_ITEM_LEAD_MISMATCH/);
  assert.match(leadsApi, /next_action_item_id = nextActionItemIdPatch/);

  assert.match(taskRoute, /async function validateTaskRelationsStageFRT019\(/);
  assert.match(taskRoute, /requireScopedRow\(/);
  assert.match(taskRoute, /TASK_LEAD_CASE_RELATION_MISMATCH/);
  assert.match(taskRoute, /TASK_CASE_CLIENT_RELATION_MISMATCH/);
  assert.match(taskRoute, /TASK_LEAD_CLIENT_RELATION_MISMATCH/);
  assert.match(taskRoute, /const taskRelationsStageFRT019 = await validateTaskRelationsStageFRT019\(body, workspaceId\)/);
  assert.match(taskRoute, /lead_id: taskRelationsStageFRT019\.leadId/);
  assert.match(taskRoute, /case_id: taskRelationsStageFRT019\.caseId/);
  assert.match(taskRoute, /client_id: taskRelationsStageFRT019\.clientId/);
});

test('FRT-019 maps every prompt choice to the shared visual source of truth', () => {
  const styles = read(dialogStylesPath);
  const semanticIcons = read(semanticIconPath);
  const semanticFoundation = read(semanticFoundationPath);
  const actionIcons = read(actionIconPath);
  const actionStyles = read(actionStylesPath);
  const sectionStart = styles.indexOf('/* FRT-019: Lead next-step prompt.');
  const sectionEnd = styles.indexOf('/* FRT-015 cascade reconciliation:', sectionStart);

  assert.ok(sectionStart >= 0, 'FRT-019 dialog style section is missing');
  assert.ok(sectionEnd > sectionStart, 'FRT-019 dialog style section has no bounded end');

  const section = styles.slice(sectionStart, sectionEnd);
  for (const token of [
    '--cf-vst-color-task',
    '--cf-vst-color-task-soft',
    '--cf-vst-color-task-border',
    '--cf-vst-color-primary',
    '--cf-vst-color-primary-soft',
    '--cf-vst-color-primary-border',
    '--cf-vst-color-event',
    '--cf-vst-color-event-soft',
    '--cf-vst-color-event-border',
    '--cf-vst-overlay-backdrop',
  ]) {
    assert.ok(section.includes(token), `FRT-019 is missing shared token: ${token}`);
  }
  assert.doesNotMatch(section, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(section, /rgba?\(/i);
  assert.match(section, /choice-option="set_now"[\s\S]*--frt-019-choice-color: var\(--cf-vst-color-task\)/);
  assert.match(section, /choice-option="remind_tomorrow"[\s\S]*--frt-019-choice-color: var\(--cf-vst-color-primary\)/);
  assert.match(section, /choice-option="without_step"[\s\S]*--frt-019-choice-color: var\(--cf-vst-color-event\)/);
  const promptSource = read(componentPath);
  assert.match(promptSource, /role=\{action\.icon\}[\s\S]*tone=\{action\.value === 'phone_call' \? 'task' : 'primary'\}/);
  assert.doesNotMatch(section, /--frt-019-suggestion-icon-color/);
  assert.match(section, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(section, /gap: var\(--cf-vst-layout-gap-lg\)/);
  assert.match(section, /min-height: 240px/);
  assert.match(section, /transform: translateY\(calc\(-1 \* var\(--cf-vst-space-lg\)\)\)/);
  assert.match(semanticIcons, /role: 'hint'/);
  assert.match(semanticIcons, /role: 'pause'/);
});

test('FRT-019 preserves one canonical color for semantic delete and trash icons', () => {
  const semanticIcons = read(semanticIconPath);
  const semanticFoundation = read(semanticFoundationPath);
  const actionIcons = read(actionIconPath);
  const actionStyles = read(actionStylesPath);

  assert.match(semanticIcons, /delete: \{ role: 'delete', tone: 'danger'/);
  assert.doesNotMatch(semanticIcons, /text-(?:rose|red)-600/);
  assert.doesNotMatch(semanticIcons, /toneClassName:\s*Record/);
  assert.match(
    semanticFoundation,
    /\.cf-vst-semantic-icon-tone-danger\s*\{[\s\S]*color:\s*var\(--cf-vst-color-delete/,
  );
  assert.match(actionIcons, /export const DeleteActionIcon = createActionIcon\('delete'\)/);
  assert.match(
    actionStyles,
    /\.cf-trash-action-icon,[\s\S]*color:\s*var\(--cf-vst-color-delete\)/,
  );
  assert.match(
    actionStyles,
    /\.cf-vst-button-delete[\s\S]*background:\s*var\(--cf-vst-color-delete-soft\)/,
  );
});
