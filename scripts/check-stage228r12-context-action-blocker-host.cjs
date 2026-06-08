const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    fail('missing file: ' + rel);
  }
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function fail(message) {
  console.error('STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

const contract = read('src/lib/context-action-contract.ts');
const host = read('src/components/ContextActionDialogs.tsx');
const leadDetail = read('src/pages/LeadDetail.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const caseQuickActions = read('src/components/CaseQuickActions.tsx');
const packageJson = JSON.parse(read('package.json'));

[
  "CONTEXT_ACTION_KIND_VALUES = ['task', 'event', 'note', 'blocker']",
  "dialogComponent: 'TaskCreateDialog' | 'EventCreateDialog' | 'ContextNoteDialog' | 'MissingItemQuickActionModal'",
  "persistenceTarget: 'tasks' | 'events' | 'activities' | 'task_activity_missing_item' | 'case_items'",
  "blocker: {",
  "label: 'Brak'",
  "dialogComponent: 'MissingItemQuickActionModal'",
  "normalized === 'missing_item'",
  "return 'blocker'",
].forEach((token) => requireText(contract, token, 'context action contract blocker'));

[
  'STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST',
  "export type ContextActionKind = 'task' | 'event' | 'note' | 'blocker';",
  "normalized === 'missing_item'",
  "return 'blocker'",
  'MissingItemQuickActionModal',
  'buildMissingItemModalDraft',
  'insertTaskToSupabase',
  'insertCaseItemToSupabase',
  'insertActivityToSupabase',
  "const openBlocker = request?.kind === 'blocker';",
  "eventType: 'missing_item_created'",
  "eventType: 'item_added'",
  "source: 'context_action_dialogs_blocker'",
  'stage228r12_context_action_blocker_case',
  'stage228r12_context_action_blocker_lead',
  'stage228r12_context_action_blocker_client',
  'data-stage228r12-context-action-blocker-host="true"',
  'data-context-action-contract-kinds={Object.keys(CONTEXT_ACTION_CONTRACT).join',
].forEach((token) => requireText(host, token, 'ContextActionDialogs blocker host'));

[
  'STAGE228R12_LEAD_MISSING_USES_CONTEXT_ACTION_HOST',
  "openLeadContextAction('blocker')",
  "'data-context-action-kind': 'blocker'",
  "'data-context-record-type': 'lead'",
  "'data-context-record-id': leadId || ''",
  "'data-stage228r12-lead-context-blocker': 'true'",
].forEach((token) => requireText(leadDetail, token, 'LeadDetail context blocker trigger'));

[
  'STAGE228R12_CLIENT_MISSING_USES_CONTEXT_ACTION_HOST',
  "openClientContextAction('blocker')",
  'data-context-action-kind="blocker"',
  'data-context-record-type="client"',
  'data-stage228r12-client-context-blocker="true"',
].forEach((token) => requireText(clientDetail, token, 'ClientDetail context blocker trigger'));

[
  'STAGE228R12_CASE_MISSING_USES_CONTEXT_ACTION_HOST',
  "openSharedAction(kind: 'note' | 'task' | 'event' | 'blocker')",
  "openSharedAction('blocker')",
  "'data-context-action-kind': 'blocker'",
  "'data-context-record-type': 'case'",
  "'data-stage228r12-case-context-blocker': 'true'",
].forEach((token) => requireText(caseQuickActions, token, 'CaseQuickActions context blocker trigger'));

[
  "import { useState } from 'react';",
  "import AddCaseMissingItemDialog from './AddCaseMissingItemDialog';",
  'setMissingDialogOpen(true)',
  '<AddCaseMissingItemDialog',
].forEach((token) => forbidText(caseQuickActions, token, 'CaseQuickActions local missing dialog removed'));

const scriptCommand = 'node scripts/check-stage228r12-context-action-blocker-host.cjs';
if (packageJson.scripts['check:stage228r12-context-action-blocker-host'] !== scriptCommand) {
  fail('package.json missing check:stage228r12-context-action-blocker-host script');
}
if (!String(packageJson.scripts.prebuild || '').includes(scriptCommand)) {
  fail('package.json prebuild missing Stage228R12 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST',
  repair: 'R12R2 guard repair',
  contract: 'Brak/blocker is a first-class ContextActionDialogs action without SQL',
  sqlRequired: false
}, null, 2));
