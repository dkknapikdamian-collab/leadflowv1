const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) fail('missing file: ' + rel);
  return fs.readFileSync(full, 'utf8').replace(/^\uFEFF/, '');
}

function fail(message) {
  console.error('STAGE228R14_C5_MISSING_ITEMS_NO_SQL_DECISION_FAIL:', message);
  process.exit(1);
}

function requireText(text, token, label) {
  if (!text.includes(token)) fail(label + ' missing token: ' + token);
}

function requireAny(text, tokens, label) {
  if (!tokens.some((token) => text.includes(token))) {
    fail(label + ' missing one of tokens: ' + tokens.join(' OR '));
  }
}

function forbidText(text, token, label) {
  if (text.includes(token)) fail(label + ' forbidden token: ' + token);
}

function scanFiles(dir) {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  const out = [];
  const stack = [full];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const p = path.join(current, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', 'dist', '.git'].includes(entry.name)) stack.push(p);
      } else {
        out.push(p);
      }
    }
  }
  return out;
}

const contextContract = read('src/lib/context-action-contract.ts');
const contextHost = read('src/components/ContextActionDialogs.tsx');
const lead = read('src/pages/LeadDetail.tsx');
const client = read('src/pages/ClientDetail.tsx');
const caseDetail = read('src/pages/CaseDetail.tsx');
const r11 = read('scripts/check-stage228r11-shared-missing-item-flow.cjs');
const r12 = read('scripts/check-stage228r12-context-action-blocker-host.cjs');
const r13 = read('scripts/check-stage228r13-missing-item-status-resolve.cjs');
const decisions = read('_project/04_DECISIONS.md');
const nextSteps = read('_project/07_NEXT_STEPS.md');
const manualTests = read('_project/05_MANUAL_TESTS.md');
const packageJson = JSON.parse(read('package.json'));

[
  "CONTEXT_ACTION_KIND_VALUES = ['task', 'event', 'note', 'blocker']",
  "blocker: {",
  "label: 'Brak'",
  "dialogComponent: 'MissingItemQuickActionModal'",
  "persistenceTarget: 'task_activity_missing_item'",
].forEach((token) => requireText(contextContract, token, 'context action blocker contract'));

[
  'STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST',
  'MissingItemQuickActionModal',
  'insertTaskToSupabase',
  'insertCaseItemToSupabase',
  "source: 'context_action_dialogs_blocker'",
  "eventType: 'missing_item_created'",
  "eventType: 'item_added'",
].forEach((token) => requireText(contextHost, token, 'ContextActionDialogs no-SQL blocker host'));

[
  'STAGE228R13_LEAD_MISSING_ITEM_STATUS_RESOLVE',
  'handleResolveLeadMissingItemStage228R13',
  'data-stage228r13-lead-missing-resolve-action="true"',
  "addActivity('missing_item_resolved'",
  "status: 'done'",
].forEach((token) => requireText(lead, token, 'LeadDetail missing item C5'));

[
  'STAGE228R13_CLIENT_MISSING_ITEM_STATUS_RESOLVE',
  'handleResolveClientMissingItemStage228R13',
  'data-stage228r13-client-missing-resolve-action="true"',
  "eventType: 'missing_item_resolved'",
  "status: 'done'",
].forEach((token) => requireText(client, token, 'ClientDetail missing item C5'));

[
  "key: 'blockers' as CaseActionAccordionGroup",
  "label: 'Braki i blokady'",
  "entry.kind === 'missing'",
  "onItemAccept={(item) => handleItemStatusChange(item, 'accepted')}",
  ".filter((item) => item.status !== 'accepted')",
].forEach((token) => requireText(caseDetail, token, 'CaseDetail missing item C5'));

[
  'STAGE228R11_SHARED_MISSING_ITEM_FLOW',
  'STAGE228R12_CONTEXT_ACTION_BLOCKER_HOST',
  'STAGE228R13_MISSING_ITEM_STATUS_RESOLVE',
].forEach((token) => {
  requireText(r11 + r12 + r13, token, 'R11/R12/R13 guards');
});

[
  'STAGE228R14_C5_MISSING_ITEMS_NO_SQL_DECISION',
  'DECYZJA: Brak zostaje bez SQL po C5',
].forEach((token) => requireText(decisions, token, 'C5 decision record'));

[
  'STAGE228R14_C5_FINAL_LOCAL_TESTS_BEFORE_PUSH',
].forEach((token) => requireText(manualTests, token, 'C5 manual test plan'));

requireAny(
  manualTests,
  [
    'LeadDetail -> Brak -> save -> refresh',
    'LeadDetail -> Brak -> zapisz -> odśwież',
    'LeadDetail -> Brak -> zapisz -> odswiez',
  ],
  'LeadDetail C5 manual creation/reload test'
);
requireAny(
  manualTests,
  [
    'Rozwiąż brak -> refresh',
    'Rozwiąż brak -> odśwież',
    'Rozwiąż brak -> odswiez',
  ],
  'LeadDetail C5 manual resolve/reload test'
);
requireAny(
  manualTests,
  [
    'ClientDetail -> Brak -> save -> refresh',
    'ClientDetail -> Brak -> zapisz -> odśwież',
    'ClientDetail -> Brak -> zapisz -> odswiez',
  ],
  'ClientDetail C5 manual creation/reload test'
);
requireAny(
  manualTests,
  [
    'Rozwiąż -> refresh',
    'Rozwiąż -> odśwież',
    'Rozwiąż -> odswiez',
  ],
  'ClientDetail C5 manual resolve/reload test'
);
requireAny(
  manualTests,
  [
    'CaseDetail -> Brak -> save -> refresh',
    'CaseDetail -> Brak -> zapisz -> odśwież',
    'CaseDetail -> Brak -> zapisz -> odswiez',
  ],
  'CaseDetail C5 manual creation/reload test'
);
requireAny(
  manualTests,
  [
    'accepted/resolved -> refresh',
    'accepted -> refresh',
    'zaakceptuj',
    'rozwiąż istniejącą kontrolką',
  ],
  'CaseDetail C5 manual resolved/reload test'
);

[
  'STAGE228R14_C5_NEXT_STEP_BATCH_PUSH_AFTER_MANUAL_PASS',
  'Nie pushować przed ręcznym PASS C5',
].forEach((token) => requireText(nextSteps, token, 'C5 next steps'));

const command = 'node scripts/check-stage228r14-c5-missing-items-no-sql-decision.cjs';
if (packageJson.scripts['check:stage228r14-c5-missing-items-no-sql-decision'] !== command) {
  fail('package.json missing check:stage228r14-c5-missing-items-no-sql-decision script');
}
if (!String(packageJson.scripts.prebuild || '').includes(command)) {
  fail('package.json prebuild missing Stage228R14 C5 guard');
}

[
  'insertMissingItemToSupabase',
  'updateMissingItemInSupabase',
  'fetchMissingItemsFromSupabase',
  'deleteMissingItemFromSupabase',
  'missing_items',
  'blockers',
].forEach((token) => {
  forbidText(contextHost, token, 'ContextActionDialogs must not depend on new SQL model');
  forbidText(contextContract, token, 'context action contract must not depend on new SQL model');
});

const sqlLikeFiles = [
  ...scanFiles('supabase'),
  ...scanFiles('migrations'),
  ...scanFiles('db'),
  ...scanFiles('sql'),
].filter((p) => /\.(sql|ts|js|mjs|cjs|md)$/i.test(p));

for (const full of sqlLikeFiles) {
  const rel = path.relative(root, full).replace(/\\/g, '/');
  const text = fs.readFileSync(full, 'utf8').toLowerCase();
  if (/create\s+table\s+(if\s+not\s+exists\s+)?(public\.)?(missing_items|blockers)\b/.test(text)) {
    fail('forbidden SQL table creation found in ' + rel);
  }
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE228R14_C5_MISSING_ITEMS_NO_SQL_DECISION',
  repair: 'R14R2 guard accepts detailed manual test wording',
  mode: 'LOCAL_ONLY_UNTIL_MANUAL_C5_PASS',
  contract: {
    decision: 'no SQL table for Brak in C5',
    lead: 'task/activity missing_item with resolved status',
    client: 'task/activity missing_item with resolved status',
    case: 'case_items missing/accepted existing model',
    finalPush: 'after manual C5 PASS only'
  },
  sqlRequired: false
}, null, 2));
