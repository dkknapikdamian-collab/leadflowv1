const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail('missing file: ' + rel);
  return fs.readFileSync(full, 'utf8').replace(/^\\uFEFF/, '');
}

function fail(message) {
  console.error('STAGE228R15_MISSING_ITEM_DELETE_REFRESH_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

const lead = read('src/pages/LeadDetail.tsx');
const client = read('src/pages/ClientDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const contextHost = read('src/components/ContextActionDialogs.tsx');
const packageJson = JSON.parse(read('package.json'));

[
  'STAGE228R15_MISSING_ITEM_DELETE_AND_CONTEXT_REFRESH',
  'STAGE228R15_LEAD_CONTEXT_ACTION_REFRESH_LISTENER',
  "window.addEventListener('closeflow:context-action-saved'",
  "window.setTimeout(() =>",
  'handleDeleteLeadMissingItemStage228R15',
  'data-stage228r15-lead-missing-delete-action="true"',
  "addActivity('missing_item_deleted'",
  "source: 'stage228r15_lead_missing_item_delete_refresh'",
  "status: 'deleted'",
  "Rozwiąż brak",
  "Usuń brak",
  "'deleted'].includes",
].forEach((token) => requireText(lead, token, 'LeadDetail R15 delete/refresh'));

[
  'STAGE228R15_CLIENT_MISSING_ITEM_DELETE_AND_CONTEXT_REFRESH',
  'STAGE228R15_CLIENT_CONTEXT_ACTION_REFRESH_LISTENER',
  "window.addEventListener('closeflow:context-action-saved'",
  "window.setTimeout(() =>",
  'handleDeleteClientMissingItemStage228R15',
  'data-stage228r15-client-missing-delete-action="true"',
  "eventType: 'missing_item_deleted'",
  "source: 'stage228r15_client_missing_item_delete_refresh'",
  "status: 'deleted'",
  "'deleted'].includes",
].forEach((token) => requireText(client, token, 'ClientDetail R15 delete/refresh'));

[
  'STAGE220A7_CASE_CONTEXT_ACTION_REFRESH',
  "window.addEventListener('closeflow:context-action-saved'",
  'void refreshCaseData();',
].forEach((token) => requireText(caseDetail, token, 'CaseDetail existing context refresh'));

[
  'CONTEXT_ACTION_SAVED_EVENT',
  'window.dispatchEvent(new CustomEvent(CONTEXT_ACTION_SAVED_EVENT',
  "source: 'ContextActionDialogsHost'",
].forEach((token) => requireText(contextHost, token, 'ContextActionDialogs saved event'));

const command = 'node scripts/check-stage228r15-missing-item-delete-refresh.cjs';
if (packageJson.scripts['check:stage228r15-missing-item-delete-refresh'] !== command) {
  fail('package.json missing check:stage228r15-missing-item-delete-refresh script');
}
if (!String(packageJson.scripts.prebuild || '').includes(command)) {
  fail('package.json prebuild missing Stage228R15 guard');
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R15_MISSING_ITEM_DELETE_REFRESH',
  repair: 'R15R2 guard syntax repaired',
  contract: {
    delete: 'Lead/client missing_item delete is soft-delete status=deleted, not DELETE /api/tasks',
    refresh: 'Lead/client listen to closeflow:context-action-saved and reload after any modal save',
    case: 'CaseDetail already reloads on closeflow:context-action-saved'
  },
  sqlRequired: false
}, null, 2));
