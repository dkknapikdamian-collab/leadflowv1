const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function read(file) {
  const target = path.join(root, file);
  if (!fs.existsSync(target)) throw new Error(`${file}: missing file`);
  return fs.readFileSync(target, 'utf8').replace(/^\uFEFF/, '');
}

function expect(file, needle, label = needle) {
  const body = read(file);
  if (!body.includes(needle)) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}

function expectAny(file, needles, label = needles.join(' OR ')) {
  const body = read(file);
  if (!needles.some((needle) => body.includes(needle))) throw new Error(`${file}: missing ${label}`);
  console.log(`OK: ${file} contains ${label}`);
}

function reject(file, needle, label = needle) {
  const body = read(file);
  if (body.includes(needle)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

function rejectRegex(file, pattern, label = String(pattern)) {
  const body = read(file);
  if (pattern.test(body)) throw new Error(`${file}: forbidden ${label}`);
  console.log(`OK: ${file} excludes ${label}`);
}

function checkNoMojibake(files) {
  const patterns = [
    String.fromCharCode(0x0139),
    String.fromCharCode(0x00c4),
    String.fromCharCode(0x0102),
    String.fromCharCode(0x00e2, 0x20ac),
    String.fromCharCode(0x00c5, 0x00bc),
    String.fromCharCode(0x00c5, 0x00ba),
    String.fromCharCode(0x00c5, 0x201a),
    String.fromCharCode(0x00c5, 0x201e),
    String.fromCharCode(0x00c5, 0x203a),
  ];

  for (const file of files) {
    const lines = read(file).split(/\r?\n/);
    lines.forEach((line, index) => {
      if (patterns.some((pattern) => line.includes(pattern))) {
        throw new Error(`${file}:${index + 1}: mojibake detected`);
      }
    });
  }
}

function checkStage16Today() {
  reject('src/index.css', 'visual-stage16-today-html-reset.css', 'inactive Stage16 global CSS import');
  expect('src/App.tsx', "import('./pages/TodayStable')", 'active TodayStable route import');
  expect('src/pages/TodayStable.tsx', 'P0_TODAY_STABLE_REBUILD', 'active Today stable rebuild marker');
  expect('src/pages/TodayStable.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Today Stage211C canvas import');
  expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Today Stage211E canvas import');
  expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-runtime-source-truth-stage211j.css", 'current Today Stage211J runtime canvas import');
  expect('src/pages/Today.tsx', 'LEGACY_TODAY_TSX_INACTIVE_UI_SURFACE_STAGE15', 'inactive legacy Today marker');
  expect('src/styles/visual-stage16-today-html-reset.css', 'VISUAL_STAGE16_TODAY_HTML_RESET_CSS', 'Stage16 reference CSS marker');
  expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists due_at', 'due_at SQL hotfix');
  expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', 'add column if not exists client_id', 'client_id SQL hotfix');
  expect('supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql', "pg_notify('pgrst', 'reload schema')", 'PostgREST schema reload');
}

function checkV14Theme() {
  reject('src/index.css', 'visual-html-theme-v14.css', 'inactive V14 global CSS import');
  expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'current global visual source import');
  expect('src/App.tsx', "./styles/closeflow-app-viewport-scale-75-stage201.css", 'current app scale source import');
  expect('src/components/Layout.tsx', "../styles/closeflow-compact-top-shell-source-truth.css", 'current compact shell import');
  expect('src/components/Layout.tsx', "../styles/closeflow-operator-top-trim-source-truth.css", 'current top trim import');
  expect('src/components/Layout.tsx', 'VISUAL_HTML_THEME_V14_LAYOUT', 'retained V14 compatibility marker');
  expect('src/components/Layout.tsx', 'cf-html-shell', 'HTML shell compatibility class');
  expect('src/styles/visual-html-theme-v14.css', 'VISUAL_HTML_THEME_V14_CSS', 'V14 reference CSS marker');
}

function checkStage08CaseDetail() {
  reject('src/index.css', 'visual-stage08-case-detail.css', 'inactive Stage08 global CSS import');
  expect('src/pages/CaseDetail.tsx', "../styles/visual-stage13-case-detail-vnext.css", 'current CaseDetail Stage13 import');
  expect('src/pages/CaseDetail.tsx', "../styles/closeflow-case-history-visual-source-truth.css", 'current CaseDetail history visual source import');
  expect('src/pages/CaseDetail.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current CaseDetail canvas import');
  expect('src/pages/CaseDetail.tsx', 'STAGE231D2_R6_CASE_DETAIL_TOP_STRIP_RAIL_LIFT', 'current CaseDetail layout marker');
  expect('src/styles/visual-stage08-case-detail.css', 'VISUAL_STAGE_08_CASE_DETAIL_CSS', 'Stage08 reference CSS marker');
  for (const required of [
    'fetchCaseByIdFromSupabase',
    'fetchCaseItemsFromSupabase',
    'fetchActivitiesFromSupabase',
    'fetchTasksFromSupabase',
    'fetchEventsFromSupabase',
    'insertCaseItemToSupabase',
    'updateCaseItemInSupabase',
    'deleteCaseItemFromSupabase',
    'insertTaskToSupabase',
    'insertActivityToSupabase',
    'createClientPortalTokenInSupabase',
    'resolveCaseLifecycleV1',
    'TabsTrigger',
  ]) expect('src/pages/CaseDetail.tsx', required, `CaseDetail contract ${required}`);
}

function checkStage07Cases() {
  reject('src/index.css', 'visual-stage07-cases.css', 'inactive Stage07 global CSS import');
  expect('src/pages/Cases.tsx', "../styles/visual-stage23-client-case-forms-vnext.css", 'current Cases form CSS import');
  expect('src/pages/Cases.tsx', "../styles/closeflow-record-list-source-truth.css", 'current Cases record-list import');
  expect('src/pages/Cases.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Cases canvas import');
  expect('src/pages/Cases.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Cases canvas source import');
  expect('src/styles/visual-stage07-cases.css', 'VISUAL_STAGE_07_CASES', 'Stage07 reference CSS marker');
  for (const required of [
    'fetchCasesFromSupabase',
    'fetchLeadsFromSupabase',
    'fetchTasksFromSupabase',
    'fetchEventsFromSupabase',
    'createCaseInSupabase',
    'deleteCaseWithRelations',
    'ConfirmDialog',
    'resolveCaseLifecycleV1',
    'StatShortcutCard',
    'searchQuery',
    'isCreateCaseOpen',
    'caseDetailPath',
  ]) expect('src/pages/Cases.tsx', required, `Cases contract ${required}`);
}

function checkStage06ClientDetail() {
  reject('src/index.css', 'visual-stage06-client-detail.css', 'inactive Stage06 global CSS import');
  expect('src/pages/ClientDetail.tsx', "../styles/visual-stage12-client-detail-vnext.css", 'current ClientDetail Stage12 import');
  expect('src/pages/ClientDetail.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current ClientDetail canvas import');
  expect('src/pages/ClientDetail.tsx', 'STAGE231D0_CLIENT_WORKSPACE_UX_CLEANUP', 'current ClientDetail workspace marker');
  expect('src/styles/visual-stage06-client-detail.css', 'VISUAL_STAGE_06_CLIENT_DETAIL', 'Stage06 reference CSS marker');
  for (const required of [
    'fetchClientByIdFromSupabase',
    'fetchLeadsFromSupabase',
    'fetchCasesFromSupabase',
    'fetchPaymentsFromSupabase',
    'fetchTasksFromSupabase',
    'fetchEventsFromSupabase',
    'fetchActivitiesFromSupabase',
    'updateClientInSupabase',
    'updateLeadInSupabase',
    'CreateClientCaseDialog',
    'setActiveTab',
  ]) expect('src/pages/ClientDetail.tsx', required, `ClientDetail contract ${required}`);
}

function checkStage04LeadDetail() {
  reject('src/index.css', 'visual-stage04-lead-detail.css', 'inactive Stage04 global CSS import');
  expect('src/pages/LeadDetail.tsx', "../styles/visual-stage14-lead-detail-vnext.css", 'current LeadDetail Stage14 import');
  expect('src/pages/LeadDetail.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current LeadDetail canvas import');
  expect('src/pages/LeadDetail.tsx', 'STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH', 'current LeadDetail visual source marker');
  expect('src/pages/LeadDetail.tsx', 'STAGE78_LEAD_DETAIL_NO_STATIC_AI_FOLLOWUP_CARD', 'no static AI follow-up card marker');
  reject('src/pages/LeadDetail.tsx', 'LeadAiFollowupDraft', 'removed static AI follow-up component');
  rejectRegex('src/pages/LeadDetail.tsx', /<LeadAiNextAction\b/, 'removed static AI next-action component');
  expect('src/styles/visual-stage04-lead-detail.css', 'VISUAL_STAGE_04_LEAD_DETAIL_UI_SYSTEM', 'Stage04 reference CSS marker');
  for (const required of [
    'startLeadServiceInSupabase',
    'associatedCase',
    'isQuickTaskOpen',
    'isQuickEventOpen',
    'handleCreateQuickTask',
    'handleCreateQuickEvent',
    'handleAddNote',
    'handleUpdateLead',
    'handleDeleteLead',
    'getLeadFinance',
    'TabsTrigger',
  ]) expect('src/pages/LeadDetail.tsx', required, `LeadDetail contract ${required}`);
}

function checkStage03Leads() {
  reject('src/index.css', 'visual-stage03-leads.css', 'inactive Stage03 global CSS import');
  expect('src/pages/Leads.tsx', "../styles/closeflow-record-list-source-truth.css", 'current Leads record-list import');
  expect('src/pages/Leads.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Leads canvas import');
  expect('src/pages/Leads.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Leads canvas source import');
  expect('src/pages/Leads.tsx', 'VISUAL_STAGE25_LEADS_FULL_JSX_HTML_REBUILD', 'current Leads rebuild marker');
  expect('src/styles/visual-stage03-leads.css', 'VISUAL_STAGE_03_LEADS_UI_SYSTEM', 'Stage03 reference CSS marker');
  for (const required of [
    "consumeGlobalQuickAction() === 'lead'",
    'isNewLeadOpen',
    'handleCreateLead',
    'insertLeadToSupabase',
    'handleArchiveLead',
    'handleRestoreLead',
    'toggleTrashView',
    'searchQuery',
    'StatShortcutCard',
  ]) expect('src/pages/Leads.tsx', required, `Leads contract ${required}`);
}

function checkStage02Today() {
  reject('src/index.css', 'visual-stage02-today.css', 'inactive Stage02 global CSS import');
  expect('src/App.tsx', "import('./pages/TodayStable')", 'active TodayStable route import');
  expect('src/pages/TodayStable.tsx', 'P0_TODAY_STABLE_REBUILD', 'active Today stable marker');
  expect('src/pages/TodayStable.tsx', "../styles/closeflow-unified-page-canvas-stage211c.css", 'current Today canvas import');
  expect('src/pages/TodayStable.tsx', "../styles/closeflow-canvas-source-truth-stage211e.css", 'current Today canvas source import');
  expect('src/pages/TodayStable.tsx', 'getAiLeadDraftsAsync', 'AI drafts remain loaded');
  expect('src/pages/TodayStable.tsx', 'deleteTaskFromSupabase', 'task mutation remains present');
  expect('src/pages/TodayStable.tsx', 'deleteEventFromSupabase', 'event mutation remains present');
  expect('src/pages/TodayStable.tsx', 'updateTaskInSupabase', 'task update remains present');
  expect('src/pages/TodayStable.tsx', 'updateEventInSupabase', 'event update remains present');
  expect('src/styles/visual-stage02-today.css', 'VISUAL_STAGE_02_TODAY_CSS', 'Stage02 reference CSS marker');
  checkNoMojibake(['src/components/Layout.tsx', 'src/pages/TodayStable.tsx']);
}

function checkStage01Shell() {
  reject('src/index.css', 'visual-stage01-shell.css', 'inactive Stage01 global CSS import');
  expect('src/App.tsx', "./styles/closeflow-visual-source-truth.css", 'current app visual source import');
  expect('src/App.tsx', "./styles/closeflow-clean-desktop-app-shell-canvas-stage149.css", 'current desktop shell canvas import');
  expect('src/components/Layout.tsx', "../styles/closeflow-compact-top-shell-source-truth.css", 'current compact top shell import');
  expect('src/components/Layout.tsx', "../styles/closeflow-operator-top-trim-source-truth.css", 'current operator top trim import');
  expect('src/components/Layout.tsx', 'VisualFoundationRuntimeStage212M', 'current visual foundation runtime');
  expect('src/components/Layout.tsx', 'OperatorTopBarRuntime', 'current operator top bar runtime');
  expect('src/components/Layout.tsx', 'data-shell-sidebar="true"', 'sidebar shell marker');
  expect('src/components/Layout.tsx', 'data-shell-main="true"', 'main shell marker');
  for (const label of ['Dziś', 'Leady', 'Klienci', 'Sprawy', 'Zadania', 'Kalendarz', 'Aktywność', 'Szkice AI', 'Powiadomienia', 'Rozliczenia', 'Pomoc', 'Ustawienia']) {
    expect('src/components/Layout.tsx', `label: '${label}'`, `${label} navigation`);
  }
  expect('src/components/GlobalQuickActions.tsx', 'data-global-quick-actions-contract="v97"', 'global quick actions contract');
  expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('lead')", 'lead quick action bridge');
  expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('task')", 'task quick action bridge');
  expect('src/components/GlobalQuickActions.tsx', "rememberGlobalQuickAction('event')", 'event quick action bridge');
  expect('src/styles/visual-stage01-shell.css', 'VISUAL_STAGE_01_SHELL_CSS', 'Stage01 reference CSS marker');
  checkNoMojibake(['src/components/Layout.tsx', 'src/components/GlobalQuickActions.tsx']);
}

const checks = {
  stage16: checkStage16Today,
  v14: checkV14Theme,
  stage08: checkStage08CaseDetail,
  stage07: checkStage07Cases,
  stage06: checkStage06ClientDetail,
  stage04: checkStage04LeadDetail,
  stage03: checkStage03Leads,
  stage02: checkStage02Today,
  stage01: checkStage01Shell,
};

function run(key) {
  const check = checks[key];
  if (!check) throw new Error(`UNKNOWN_VISUAL_GUARD_KEY:${key}`);
  check();
  console.log(`OK: reconciled historical visual guard ${key} with current source truth.`);
}

module.exports = { checks, run };
