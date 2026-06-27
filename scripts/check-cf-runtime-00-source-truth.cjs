#!/usr/bin/env node
// CF_RUNTIME_00_R21_BRITTLE_PARSER_MASS_GUARD_SYNTAX_FIX
// CF_RUNTIME_00_STAGE232A_R6_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE232A_R7_CASE_ITEMS_SCHEMA_COMPAT
// CF_RUNTIME_00_STAGE232A_R8_LEAD_MISSING_UI_SOURCE_COMPAT
// CF_RUNTIME_00_STAGE232A_R8_R6_R6_GUARD_COMPAT
// CF_RUNTIME_00_STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY
// CF_RUNTIME_00_STAGE232A_R9_R2_R8_GUARD_COMPAT
// CF_RUNTIME_00_STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH
// CF_RUNTIME_00_STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE
// CF_RUNTIME_00_STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH
// CF_RUNTIME_00_STAGE232A_R10_R2_R1_LITERAL_NEWLINE_FIX
// CF_RUNTIME_00_STAGE232J_R1_LEADS_SCROLL_TOP_CUT
// CF_RUNTIME_00_STAGE232A_R11_MISSING_MODAL_VISUAL_SOURCE
// CF_RUNTIME_00_STAGE232A_R11_R2_R10_GUARD_COMPAT
// CF_RUNTIME_00_STAGE232A_R11_R3_R10_GUARD_CONTRACT_RELAX
// CF_RUNTIME_00_STAGE232A_R12_MISSING_MODAL_DARK_SOURCE
// CF_RUNTIME_00_STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE
// CF_RUNTIME_00_STAGE232D_R1_OWNER_CONTACT_DONE
// CF_RUNTIME_00_STAGE232I0_MISSING_BLOCKER_CONTRACT
// CF_RUNTIME_00_STAGE232I1_CASE_MISSING_BLOCKER_RUNTIME
// CF_RUNTIME_00_STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE232I4_CLIENT_MISSING_TOP_TILE_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE232I4_R16Z_R5_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE_A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE_A35B_MANDATORY_NEXT_STEP_CONTRACT_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE232I1_R8_MISSING_MODAL_READABLE_STYLE
// CF_RUNTIME_00_R19_MASS_SCOPE_CLOSURE_ALLOWED
// CF_RUNTIME_00_R18_SHEBANG_SCOPE_ALLOWED
// CF_RUNTIME_00_R17_TRIAL14_SCOPE_ALLOWED
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repoRoot = path.resolve(__dirname, '..');
const errors = [];

function rel(...parts) {
  return path.join(repoRoot, ...parts);
}

function exists(relativePath) {
  return fs.existsSync(rel(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(rel(relativePath), 'utf8');
}

function expect(condition, message) {
  if (!condition) errors.push(message);
}

const requiredFiles = [
  'src/lib/closeflow-runtime-source-truth.ts',
  'tests/cf-runtime-00-source-truth.test.cjs',
  'scripts/check-cf-runtime-00-source-truth.cjs',
  'tests/stage231h-r1g4-newline-syntax-repair.test.cjs',
  'tests/stage231h-r1g-cost-other-name-and-reimbursable-flag.test.cjs',
  'tests/stage231h-r1f4-payment-save-and-guard-repair.test.cjs',
  'tests/stage231h-r1f-payment-and-cost-full-correction.test.cjs',
  'tests/stage231h-r1d2-r12g-case-quick-note-scope-client-dedupe-finish.test.cjs',
  'tests/stage231h-r1d-finance-correction-modal-compact.test.cjs',
  'tests/stage231b0-r15-r3-client-detail-width-source-truth.test.cjs',
  'tests/stage231b0-r15-r2-client-detail-shared-canvas-width.test.cjs',
  'tests/stage230d0-text-input-contrast-sweep.test.cjs',
  'scripts/check-stage231h-r1g4-newline-syntax-repair.cjs',
  'scripts/check-stage231h-r1g-cost-other-name-and-reimbursable-flag.cjs',
  'scripts/check-stage231h-r1f4-payment-save-and-guard-repair.cjs',
  'scripts/check-stage231h-r1f-payment-and-cost-full-correction.cjs',
  'scripts/check-stage231h-r1d2-r12g-case-quick-note-scope-client-dedupe-finish.cjs',
  'scripts/check-stage231h-r1d-finance-correction-modal-compact.cjs',
  'scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs',
  'scripts/check-stage231b0-r15-r2-client-detail-shared-canvas-width.cjs',
  'scripts/check-stage230d0-text-input-contrast-sweep.cjs',
];

for (const file of requiredFiles) {
  expect(exists(file), `Missing required file: ${file}`);
}

if (exists('package.json')) {
  const pkg = JSON.parse(read('package.json'));
  const scripts = pkg.scripts || {};
  expect(
    scripts['check:cf-runtime-00-source-truth'] === 'node scripts/check-cf-runtime-00-source-truth.cjs',
    'package.json missing check:cf-runtime-00-source-truth script',
  );
  expect(
    scripts['test:cf-runtime-00-source-truth'] === 'node --test tests/cf-runtime-00-source-truth.test.cjs',
    'package.json missing test:cf-runtime-00-source-truth script',
  );
} else {
  errors.push('Missing package.json');
}

if (exists('src/lib/closeflow-runtime-source-truth.ts')) {
  const helper = read('src/lib/closeflow-runtime-source-truth.ts');
  expect(helper.includes('CF_RUNTIME_00_SOURCE_TRUTH_STAGE_OPEN'), 'helper missing stage marker CF_RUNTIME_00_SOURCE_TRUTH_STAGE_OPEN');
  expect(helper.includes('MISSING_GUARD_TEST_STAGE_OPEN'), 'helper missing MISSING_GUARD_TEST_STAGE_OPEN marker');
  expect(helper.includes('CASE_DETAIL_CANONICAL_ROUTE_PREFIX'), 'helper missing CASE_DETAIL_CANONICAL_ROUTE_PREFIX');
  expect(helper.includes("CASE_DETAIL_CANONICAL_ROUTE_PREFIX = '/cases'"), 'helper canonical route must remain /cases');
  expect(helper.includes("CASE_DETAIL_LEGACY_ROUTE_PREFIX = '/case'"), 'helper legacy route alias must remain /case');
  expect(helper.includes('buildRuntimeAccessPlanTruth'), 'helper missing buildRuntimeAccessPlanTruth');
  expect(helper.includes("planSource: 'fallback_status'"), 'helper must expose fallback_status for paid_active without planId');
  expect(helper.includes('requiresPlanIdConfirmation: true'), 'helper must require planId confirmation for paid_active without planId');
  expect(helper.includes('isMissingItemLike'), 'helper missing missing-item classifier');
  expect(helper.includes('isBlockerLike'), 'helper missing blocker classifier');
}

if (exists('scripts/closeflow-release-check-quiet.cjs')) {
  const gate = read('scripts/closeflow-release-check-quiet.cjs');
  expect(
    gate.includes('tests/cf-runtime-00-source-truth.test.cjs'),
    'quiet release gate missing cf-runtime-00 runtime test',
  );
  expect(
    gate.includes('scripts/check-cf-runtime-00-source-truth.cjs') || gate.includes('CF_RUNTIME_00_QUIET_GATE_SKIP_WITH_REASON'),
    'quiet release gate missing cf-runtime-00 guard or explicit skip marker',
  );
} else {
  errors.push('Missing scripts/closeflow-release-check-quiet.cjs');
}

const allowedChangePrefixes = [
  // STAGE232T_R1D_TODAY_WORK_ITEM_ACTIONS_SOURCE_TRUTH_ALLOWLIST
  'src/pages/TodayStable.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Calendar.tsx',
  'src/server/task-route-stage124f.ts',
  'src/server/event-route-stage124f.ts',
  'src/components/work-item-card.tsx',
  'scripts/check-stage232t-r3-operational-entry-state-machine.cjs',
  'tests/stage232t-r3-operational-entry-state-machine.test.cjs',
  'tests/stage124-calendar-shift-freeze-guard.test.cjs',
  'tests/stage121-calendar-shift-lead-branch-contract.test.cjs',
  'tests/stage123-calendar-task-shift-payload-source-contract.test.cjs',
  'tests/stage114-calendar-shift-persistence-contract.test.cjs',
  '_project/runs/STAGE232T_R3_OPERATIONAL_ENTRY_ACTION_STATE_MACHINE_GUARD.md',

  // STAGE232T_R4_CALENDAR_LEAD_SHADOW_ACTIONS_FIX_ALLOWLIST
  'api/leads.ts',
  'src/pages/Calendar.tsx',
  'src/lib/calendar-operational-entry-contract.ts',
  'src/lib/calendar-lead-shadow-entry-policy.ts',
  'scripts/check-stage232t-r4-calendar-lead-shadow-actions.cjs',
  'tests/stage232t-r4-calendar-lead-shadow-actions.test.cjs',
  '_project/runs/STAGE232T_R4_CALENDAR_LEAD_SHADOW_ACTIONS_FIX.md',  'scripts/check-stage232t-r1d-today-work-item-actions-source-truth.cjs',

  // STAGE232T_R5_CALENDAR_LEAD_DONE_PERSIST_AFTER_REFRESH_ALLOWLIST
  'src/pages/Calendar.tsx',
  'src/server/task-route-stage124f.ts',
  'scripts/check-stage232t-r5-calendar-lead-done-persist-after-refresh.cjs',
  'tests/stage232t-r5-calendar-lead-done-persist-after-refresh.test.cjs',
  '_project/runs/STAGE232T_R5_CALENDAR_LEAD_DONE_PERSIST_AFTER_REFRESH.md',
  // STAGE232T_R6D_CALENDAR_LEAD_DELETE_AND_RELATION_LABEL_ALLOWLIST
  'src/pages/Calendar.tsx',
  'scripts/check-stage232t-r6d-calendar-lead-delete-and-relation-label.cjs',
  'tests/stage232t-r6d-calendar-lead-delete-and-relation-label.test.cjs',
  '_project/runs/STAGE232T_R6D_CALENDAR_LEAD_DELETE_AND_RELATION_LABEL.md',
  // STAGE232T_R6E_CALENDAR_LEAD_DONE_NO_DUPLICATE_ALLOWLIST
  'scripts/check-stage232t-r6e-calendar-lead-done-no-duplicate.cjs',
  'tests/stage232t-r6e-calendar-lead-done-no-duplicate.test.cjs',
  '_project/runs/STAGE232T_R6E_CALENDAR_LEAD_DONE_NO_DUPLICATE.md',  'tests/stage232t-r1d-today-work-item-actions-source-truth.test.cjs',
  'tests/stage97-today-overdue-task-done-button.test.cjs',
  '_project/runs/STAGE232T_R1D_TODAY_WORK_ITEM_ACTIONS_SOURCE_TRUTH.md',
  // STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST_ALLOWLIST
  'scripts/check-stage232t-r1e-today-actions-closeout-delete-edit-trash-vst.cjs',
  'tests/stage232t-r1e-today-actions-closeout-delete-edit-trash-vst.test.cjs',
  '_project/runs/STAGE232T_R1E_TODAY_ACTIONS_CLOSEOUT_DELETE_EDIT_TRASH_VST.md',
  // STAGE_A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_ALLOWLIST
  'src/lib/owner-control/owner-control-baseline.ts',
  'src/pages/TodayStable.tsx',
  'scripts/check-cf-runtime-00-source-truth.cjs',
  // STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_ALLOWLIST
  'src/styles/closeflow-canvas-runtime-source-truth-stage211j.css',
  'scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs',
  'tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs',
  '_project/runs/STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH.md',
  'scripts/check-stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.cjs',
  'tests/stage-a35-r1-owner-control-baseline-gap-close-and-queue-sync.test.cjs',
  // STAGE_A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE_ALLOWLIST
  'scripts/check-stage-a35-r2-remove-single-user-ownerless-noise.cjs',
  'tests/stage-a35-r2-remove-single-user-ownerless-noise.test.cjs',
  '_project/runs/STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE.md',
  '_project/obsidian_updates/2026-06-24_STAGE-A35_R2_REMOVE_SINGLE_USER_OWNERLESS_NOISE.md',
  '_project/runs/STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.md',
  '_project/obsidian_updates/2026-06-24_STAGE-A35_R1_OWNER_CONTROL_BASELINE_GAP_CLOSE_AND_QUEUE_SYNC.md',
  '_project/CODEX_CONTEXT_INDEX.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  // STAGE_A35B_MANDATORY_NEXT_STEP_CONTRACT_ALLOWLIST
  'src/lib/owner-control/owner-control-baseline.ts',
  'src/lib/owner-control/next-move-contract.ts',
  'src/pages/TodayStable.tsx',
  'scripts/check-stage-a35b-mandatory-next-step-contract.cjs',
  'tests/stage-a35b-mandatory-next-step-contract.test.cjs',
  '_project/runs/STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT.md',
  '_project/obsidian_updates/2026-06-24_STAGE-A35B_MANDATORY_NEXT_STEP_CONTRACT.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/10_ZIPY_WDROZENIA_PUSH.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  // STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE_ALLOWLIST
  'src/App.tsx',
  'src/pages/Cases.tsx',
  'src/lib/routes.ts',
  'src/lib/closeflow-runtime-source-truth.ts',
  'scripts/check-stage233a-route-canonicalization.cjs',
  'tests/stage233a-route-canonicalization.test.cjs',
  '_project/runs/STAGE233A_R1_CASE_DETAIL_CANONICAL_ROUTE.md',
  // STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R3_ALLOWLIST
  'api/work-items.ts',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX.md',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX.md',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_CONTEXT.txt',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_CONTEXT.txt',
  'scripts/check-stage232g-r1e1-work-items-vercel-tsc-hotfix.cjs',
  'scripts/check-stage232g-r1e1-work-items-vercel-tsc-hotfix-r2-resume.cjs',
  'tests/stage232g-r1e1-work-items-vercel-tsc-hotfix.test.cjs',
  'tests/stage232g-r1e1-work-items-vercel-tsc-hotfix-r2-resume.test.cjs',

  // STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE_ALLOWLIST
  '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/CODEX_CONTEXT_INDEX.md',
  'scripts/check-cf-runtime-00-source-truth.cjs',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md',
  '_project/runs/STAGE232G_R1F_CALENDAR_TODAY_FINAL_PARITY_GUARD_AND_SMOKE.md',
  'scripts/check-stage232g-r1f-calendar-today-final-parity-guard-and-smoke.cjs',
  'scripts/check-stage232g-r1i-calendar-completed-retention-after-refresh-fix.cjs',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md',
  '_project/runs/STAGE232G_R1I_R2_CALENDAR_COMPLETED_RETENTION_AFTER_REFRESH_FIX.md',
  'tests/stage232g-r1i-calendar-completed-retention-after-refresh-fix.test.cjs',
  '_project/obsidian_updates/2026-06-24_STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION.md',
  '_project/runs/STAGE232G_R1I_R3_CALENDAR_DELETE_RELEASES_COMPLETED_RETENTION.md',
  // STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY_ALLOWLIST
  'src/server/google-calendar-inbound.ts',
  'scripts/check-stage232g-r2-google-inbound-sync-idempotency.cjs',
  'tests/stage232g-r2-google-inbound-sync-idempotency.test.cjs',
  '_project/runs/STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY.md',
  '_project/obsidian_updates/2026-06-25_STAGE232G_R2_GOOGLE_INBOUND_SYNC_IDEMPOTENCY.md',
  // STAGE232G_R1J_GOOGLE_CALENDAR_INBOUND_SYNC_IDEMPOTENT_UPSERT_ALLOWLIST
  'scripts/check-stage232g-r1j-google-calendar-inbound-idempotent-upsert.cjs',
  'tests/stage232g-r1j-google-calendar-inbound-idempotent-upsert.test.cjs',
  '_project/runs/STAGE232G_R1J_GOOGLE_CALENDAR_INBOUND_SYNC_IDEMPOTENT_UPSERT.md',
  // STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP_ALLOWLIST
  'src/pages/Settings.tsx',
  'src/server/task-route-stage124f.ts',
  'src/server/event-route-stage124f.ts',
  'scripts/check-stage232g-r3-google-calendar-user-onboarding-owner-stamp.cjs',
  'tests/stage232g-r3-google-calendar-user-onboarding-owner-stamp.test.cjs',
  '_project/runs/STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP_PRIORITY.md',
  '_project/obsidian_updates/2026-06-25_STAGE232G_R3_GOOGLE_CALENDAR_USER_ONBOARDING_AND_OWNER_STAMP.md',
  // STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT_ALLOWLIST
  'src/server/google-calendar-outbound.ts',
  'src/lib/calendar-timezone-contract.ts',
  'scripts/check-stage232g-r4-google-calendar-outbound-timezone-no-shift.cjs',
  'tests/stage232g-r4-google-calendar-outbound-timezone-no-shift.test.cjs',
  '_project/runs/STAGE232G_R4_GOOGLE_CALENDAR_OUTBOUND_TIMEZONE_NO_SHIFT_PRIORITY.md',
  '_project/obsidian_updates/2026-06-25_STAGE232G_R4_R5_GOOGLE_CALENDAR_PRODUCTION_ISSUES.md',
  // STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE_ALLOWLIST
  'src/server/google-calendar-inbound.ts',
  'scripts/check-stage232g-r6-google-delete-tombstone-and-remote-delete.cjs',
  'tests/stage232g-r6-google-delete-tombstone-and-remote-delete.test.cjs',
  '_project/runs/STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE_PRIORITY.md',
  '_project/obsidian_updates/2026-06-25_STAGE232G_R6_GOOGLE_DELETE_TOMBSTONE_AND_REMOTE_DELETE.md',
  // STAGE232G_R7A_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE_ALLOWLIST
  'src/server/google-calendar-outbound.ts',
  'src/server/google-calendar-inbound.ts',
  'scripts/check-stage232g-r7a-calendar-action-source-identity-dedupe.cjs',
  'tests/stage232g-r7a-calendar-action-source-identity-dedupe.test.cjs',
  '_project/runs/STAGE232G_R7_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE_AUDIT.md',
  '_project/obsidian_updates/2026-06-25_STAGE232G_R7A_CALENDAR_ACTION_SOURCE_IDENTITY_DEDUPE.md',
  'tests/stage232g-r1f-calendar-today-final-parity-guard-and-smoke.test.cjs',

  // STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE_ALLOWLIST
  "src/pages/Calendar.tsx",
  "src/lib/calendar-dom-normalizer-policy.ts",
  "_project/runs/STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md",
  "_project/runs/STAGE232G_R1E_DOM_NORMALIZER_PATCH_CONTEXT.txt",
  "_project/obsidian_updates/2026-06-23_STAGE232G_R1E_CALENDAR_DOM_NORMALIZERS_LIMIT_OR_RETIRE.md",
  'scripts/check-stage232g-r1e-calendar-dom-normalizers-limit-or-retire.cjs',
  "tests/stage232g-r1e-calendar-dom-normalizers-limit-or-retire.test.cjs",
  "10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md",
  "_project/04_ETAPY_ROZWOJU_APLIKACJI.md",
  "_project/CODEX_CONTEXT_INDEX.md",
  "_project/06_GUARDS_AND_TESTS.md",
  "_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md",
  "_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md",

  // STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT_ALLOWLIST
  "src/pages/Calendar.tsx",
  "src/pages/TodayStable.tsx",
  "src/lib/calendar-operational-entry-action-policy.ts",
  "_project/runs/STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md",
  "_project/runs/STAGE232G_R1D_CALENDAR_ACTION_PATCH_CONTEXT.txt",
  "_project/obsidian_updates/2026-06-23_STAGE232G_R1D_CALENDAR_ACTIONS_RESPECT_OPERATIONAL_ENTRY_CONTRACT.md",
  'scripts/check-stage232g-r1d-calendar-actions-respect-operational-entry-contract.cjs',
  "tests/stage232g-r1d-calendar-actions-respect-operational-entry-contract.test.cjs",
  "10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md",
  "_project/04_ETAPY_ROZWOJU_APLIKACJI.md",
  "_project/CODEX_CONTEXT_INDEX.md",
  "_project/06_GUARDS_AND_TESTS.md",
  "_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md",
  "_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md",

  // STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP_ALLOWLIST
  "src/lib/scheduling.ts",
  "src/lib/calendar-lead-shadow-entry-policy.ts",
  "_project/runs/STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP.md",
  "_project/obsidian_updates/2026-06-23_STAGE232G_R1C_LEAD_SHADOW_ENTRIES_POLICY_AND_DEDUP.md",
  'scripts/check-stage232g-r1c-lead-shadow-entries-policy-and-dedup.cjs',
  "tests/stage232g-r1c-lead-shadow-entries-policy-and-dedup.test.cjs",
  "10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md",
  "_project/04_ETAPY_ROZWOJU_APLIKACJI.md",
  "_project/CODEX_CONTEXT_INDEX.md",
  "_project/06_GUARDS_AND_TESTS.md",
  "_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md",
  "_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md",

  // STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT_ALLOWLIST
  "src/pages/TodayStable.tsx",
  "src/lib/calendar-operational-entry-today-adapter.ts",
  "_project/runs/STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT.md",
  "_project/obsidian_updates/2026-06-23_STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT.md",
  'scripts/check-stage232g-r1b-today-uses-operational-entry-contract.cjs',
  "tests/stage232g-r1b-today-uses-operational-entry-contract.test.cjs",
  "10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md",
  "_project/04_ETAPY_ROZWOJU_APLIKACJI.md",
  "_project/CODEX_CONTEXT_INDEX.md",
  "_project/06_GUARDS_AND_TESTS.md",
  "_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md",
  "_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md",

  'scripts/check-stage232g-r1a-work-items-ts-build-hotfix.cjs',
  '_project/runs/STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX_REMAINING_EXISTING_CONTEXT.txt',
  '_project/runs/STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX.md',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1A_WORK_ITEMS_TS_BUILD_HOTFIX.md',
  'api/work-items.ts',
  // STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT_ALLOWLIST
  'src/lib/calendar-operational-entry-contract.ts',
  'src/lib/scheduling.ts',
  '_project/runs/STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT.md',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT.md',
  'scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs',
  'tests/stage232g-r1a-calendar-today-operational-entry-contract.test.cjs',
  '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/CODEX_CONTEXT_INDEX.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  'src/pages/SalesFunnel.tsx',
  'src/pages/LeadDetail.tsx',

  'tests/stage115-case-detail-render-runtime-contract.test.cjs',

  '_project/00_PROJECT_STATUS.md',
  '_project/03_CURRENT_STAGE.md',
  '_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/07_NEXT_STEPS.md',
  '_project/08_CHANGELOG_AI.md',
  '_project/10_PROJECT_TIMELINE.md',
  '_project/12_IMPLEMENTATION_LEDGER.md',
  '_project/13_TEST_HISTORY.md',
  '_project/runs/2026-06-15_CF_RUNTIME_00_SHARED_SOURCE_TRUTH.md',
  'docs/release/FAZA3_ETAP31_PLAN_SOURCE_OF_TRUTH_2026-05-03.md',
  'docs/release/FAZA3_ETAP32_PLAN_FEATURE_ACCESS_GATE_2026-05-03.md',
  'docs/technical/PLAN_FEATURE_MATRIX_STAGE32_2026-05-03.md',
  'docs/technical/PLAN_SOURCE_OF_TRUTH_STAGE31_2026-05-03.md',
  'package.json',
  'scripts/check-cf-runtime-00-source-truth.cjs',
  'scripts/check-closeflow-case-detail-loading-reference.cjs',
  'scripts/check-faza3-etap31-plan-source-of-truth.cjs',
  'scripts/check-faza3-etap32-plan-feature-access-gate.cjs',
  'scripts/check-p0-plan-access-gating.cjs',
  'scripts/check-stage230d0-text-input-contrast-sweep.cjs',
  'scripts/check-stage231b0-r15-r2-client-detail-shared-canvas-width.cjs',
  'scripts/check-stage231b0-r15-r3-client-detail-width-source-truth.cjs',
  'scripts/check-stage231e2-account-trial-bootstrap.cjs',
  'scripts/check-stage231e2-r2-trial-14d-lock.cjs',
  'scripts/check-stage231h-r1d-finance-correction-modal-compact.cjs',
  'scripts/check-stage231h-r1d2-r12g-case-quick-note-scope-client-dedupe-finish.cjs',
  'scripts/check-stage231h-r1f-payment-and-cost-full-correction.cjs',
  'scripts/check-stage231h-r1f4-payment-save-and-guard-repair.cjs',
  'scripts/check-stage231h-r1g-cost-other-name-and-reimbursable-flag.cjs',
  'scripts/check-stage231h-r1g4-newline-syntax-repair.cjs',
  'scripts/check-stage72-access-billing-plan-truth-guard.cjs',
  'scripts/check-stage75-source-of-truth-guard.cjs',
  'scripts/closeflow-release-check-quiet.cjs',
  'src/lib/closeflow-runtime-source-truth.ts',
  'src/lib/plans.ts',
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  '_project/obsidian_updates/2026-06-18_STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST.md',
  '_project/runs/STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST.md',
  'scripts/check-stage232i4-client-missing-top-tile-vst.cjs',
  'tests/stage232i4-client-missing-top-tile-vst.test.cjs',
  'src/styles/visual-stage12-client-detail-vnext.css',
  'src/styles/closeflow-unified-page-canvas-stage211c.css',
  'src/styles/operator-rail-tasks-pattern-stage228r1.css',
  'src/styles/visual-stage9-ai-drafts-vnext.css',
  'tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs',
  'tests/case-detail-history-visual-p1-repair4-2026-05-13.test.cjs',
  'tests/cases-v1-lifecycle-command-board.test.cjs',
  'tests/cf-runtime-00-source-truth.test.cjs',
  'tests/faza3-etap31-plan-source-of-truth.test.cjs',
  'tests/p1-case-detail-history-quick-actions-visual-2026-05-13.test.cjs',
  'tests/stage119-calendar-release-gate-trust.test.cjs',
  'tests/stage230d0-text-input-contrast-sweep.test.cjs',
  'tests/stage231b0-r15-r2-client-detail-shared-canvas-width.test.cjs',
  'tests/stage231b0-r15-r3-client-detail-width-source-truth.test.cjs',
  'tests/stage231h-r1d-finance-correction-modal-compact.test.cjs',
  'tests/stage231h-r1d2-r12g-case-quick-note-scope-client-dedupe-finish.test.cjs',
  'tests/stage231h-r1f-payment-and-cost-full-correction.test.cjs',
  'tests/stage231h-r1f4-payment-save-and-guard-repair.test.cjs',
  'tests/stage231h-r1g-cost-other-name-and-reimbursable-flag.test.cjs',
  'tests/stage231h-r1g4-newline-syntax-repair.test.cjs',
  'tests/stage98-polish-mojibake-calendar-guard.test.cjs',
  // STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT_ALLOWLIST
  'tests/client-detail-v1-operational-center.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r5-client-operational-center-test-compat.cjs',
  'tests/stage232i4-r16z-r5-r5-client-operational-center-test-compat.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R5_CLIENT_OPERATIONAL_CENTER_TEST_COMPAT.md',
  // STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE_ALLOWLIST
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'scripts/check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs',
  'tests/stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE.md',
  // STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX_ALLOWLIST
  'scripts/check-stage232i4-r16z-r8-lead-missing-blocker-toggle-priority-fix.cjs',
  'tests/stage232i4-r16z-r8-lead-missing-blocker-toggle-priority-fix.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX.md',
  // STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL_ALLOWLIST
  'tests/polish-mojibake-audit.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r7-polish-mojibake-audit-scope-final.cjs',
  'tests/stage232i4-r16z-r5-r7-polish-mojibake-audit-scope-final.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R7_POLISH_MOJIBAKE_AUDIT_SCOPE_FINAL.md',
  // STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL_ALLOWLIST
  'scripts/check-stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final.cjs',
  'tests/stage232i4-r16z-r5-r6-cf-runtime-r5-allowlist-final.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R6_CF_RUNTIME_R5_ALLOWLIST_FINAL.md',
  // STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR_ALLOWLIST
  'scripts/check-stage232i4-r16z-r5-r4-close-guard-allowlist-repair.cjs',
  'tests/stage232i4-r16z-r5-r4-close-guard-allowlist-repair.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R4_CLOSE_GUARD_ALLOWLIST_REPAIR.md',
  // STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS_ALLOWLIST
  'src/components/detail/MissingItemsManagerDialog.tsx',
  'scripts/check-stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.cjs',
  'tests/stage232i4-r16o-client-shared-missing-manager-no-marker-anchor-final.test.cjs',
  'scripts/check-stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.cjs',
  'tests/stage232i4-r16z-r4-missing-manager-final-visual-fit-no-zip.test.cjs',
  'scripts/check-stage232i4-r16z-r5-missing-manager-close-guard-consolidation.cjs',
  'tests/stage232i4-r16z-r5-missing-manager-close-guard-consolidation.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r2-bom-repair-continue.cjs',
  'tests/stage232i4-r16z-r5-r2-bom-repair-continue.test.cjs',
  'scripts/check-stage232i4-r16z-r5-r3-cf-runtime-scope-and-local-artifacts.cjs',
  'tests/stage232i4-r16z-r5-r3-cf-runtime-scope-and-local-artifacts.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_MISSING_MANAGER_CLOSE_GUARD_CONSOLIDATION_AND_SMOKE.md',
  '_project/runs/STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R2_BOM_REPAIR_CONTINUE.md',
  '_project/runs/STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R5_R3_CF_RUNTIME_SCOPE_AND_LOCAL_ARTIFACTS.md',
  '_project/04_ETAPY_ROZWOJU_APLIKACJI.md',
  '_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  '_project/obsidian_updates/2026-06-16_STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH.md',
  '_project/runs/STAGE232A_R6_LEAD_MISSING_BLOCKER_ACTIVE_LIST_AND_TOP_CARD_SOURCE_TRUTH.md',
  'src/components/ContextActionDialogs.tsx',
  'scripts/check-stage232a-r6-lead-missing-active-source.cjs',
  'tests/stage232a-r6-lead-missing-active-source.test.cjs',
  '_project/obsidian_updates/2026-06-16_STAGE232A_R7_CASE_ITEMS_ITEM_ORDER_SCHEMA_COMPAT.md',
  '_project/runs/STAGE232A_R7_CASE_ITEMS_ITEM_ORDER_SCHEMA_COMPAT.md',
  'api/case-items.ts',
  'scripts/check-stage232a-r7-case-items-item-order-schema-compat.cjs',
  'tests/stage232a-r7-case-items-item-order-schema-compat.test.cjs',
  '_project/obsidian_updates/2026-06-16_STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH.md',
  '_project/runs/STAGE232A_R8_LEAD_MISSING_BLOCKER_UI_SOURCE_TRUTH.md',
  'src/lib/data-contract.ts',
  'src/server/task-route-stage124f.ts',
  'scripts/check-stage232a-r8-lead-missing-blocker-ui-source-truth.cjs',
  'tests/stage232a-r8-lead-missing-blocker-ui-source-truth.test.cjs',
  '_project/obsidian_updates/2026-06-16_STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING.md',
  '_project/runs/STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY_AND_ALL_MISSING.md',
  'scripts/check-stage232a-r9-blocker-top-card-summary.cjs',
  'tests/stage232a-r9-blocker-top-card-summary.test.cjs',
  '_project/obsidian_updates/2026-06-16_STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH.md',
  '_project/runs/STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH.md',
  'src/components/detail/MissingItemQuickActionModal.tsx',
  'src/styles/stage232a-missing-item-visual-source.css',
  'src/styles/visual-stage14-lead-detail-vnext.css',
  'scripts/check-stage232a-r10-lead-detail-visual-source-truth.cjs',
  'tests/stage232a-r10-lead-detail-visual-source-truth.test.cjs',
  '_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md',
  '_project/obsidian_updates/2026-06-16_STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE.md',
  '_project/runs/STAGE232A_R10_R1_MISSING_GROUP_INNER_TONE.md',
  'scripts/check-stage232a-r10-r1-missing-group-inner-tone.cjs',
  'tests/stage232a-r10-r1-missing-group-inner-tone.test.cjs',
  'src/index.css',
  'src/styles/stage232a-r10-r2-lead-action-groups-visual-polish.css',
  'scripts/check-stage232a-r10-r2-lead-action-groups-visual-polish.cjs',
  'tests/stage232a-r10-r2-lead-action-groups-visual-polish.test.cjs',
  '_project/obsidian_updates/2026-06-17_STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH.md',
  '_project/runs/STAGE232A_R10_R2_LEAD_ACTION_GROUPS_VISUAL_POLISH.md',
  '_project/runs/STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX.md',
  '_project/obsidian_updates/2026-06-17_STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX.md',
  'src/components/Layout.tsx',
  'scripts/check-stage232j-leads-scroll-top-cut.cjs',
  'tests/stage232j-leads-scroll-top-cut.test.cjs',
  '_project/runs/STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR.md',
  '_project/obsidian_updates/2026-06-17_STAGE232A_R11_MISSING_ITEM_MODAL_QUICK_LEAD_VISUAL_SOURCE_REPAIR.md',
  'scripts/check-stage232a-r11-missing-modal-quick-lead-visual-source.cjs',
  'tests/stage232a-r11-missing-modal-quick-lead-visual-source.test.cjs',
  '_project/runs/STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE.md',
  '_project/obsidian_updates/2026-06-17_STAGE232A_R12_MISSING_MODAL_MATCH_PLUS_LEAD_DARK_SOURCE.md',
  'scripts/check-stage232a-r12-missing-modal-match-plus-lead-dark-source.cjs',
  'tests/stage232a-r12-missing-modal-match-plus-lead-dark-source.test.cjs',
  '_project/runs/STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE.md',
  '_project/obsidian_updates/2026-06-17_STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE.md',
  'scripts/check-stage232a-r13-r2-header-css-source-override.cjs',
  'tests/stage232a-r13-r2-header-css-source-override.test.cjs',
  '_project/runs/STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX.md',
  '_project/runs/STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX_SCAN.md',
  '_project/obsidian_updates/2026-06-17_STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX.md',
  'scripts/check-stage232d-owner-contact-done-runtime-fix.cjs',
  '_project/contracts/STAGE232I0_MISSING_BLOCKER_CROSS_ENTITY_CONTRACT.md',
  '_project/obsidian_updates/2026-06-17_STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT.md',
  '_project/runs/STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT.md',
  'scripts/check-stage232i0-missing-blocker-cross-entity-contract.cjs',
  'scripts/check-stage232i1-case-detail-missing-blocker-runtime.cjs',
  'scripts/check-stage232i1-r8-missing-modal-readable-style.cjs',
  'tests/stage232i1-r8-missing-modal-readable-style.test.cjs',
  'scripts/check-stage232i2-client-detail-missing-blocker-runtime.cjs',
  'scripts/check-stage232i2-r3-client-missing-delete-soft-delete.cjs',
  'tests/stage232i2-r3-client-missing-delete-soft-delete.test.cjs',
  '_project/runs/STAGE232I2_R3_CLIENT_MISSING_DELETE_SOFT_DELETE.md',
  'tests/stage232i2-client-detail-missing-blocker-runtime.test.cjs',
  'scripts/check-stage220a8-work-row-delete-visual.cjs',
  'tests/stage232k-case-detail-legacy-case-item-delete-no-method-allowed.test.cjs',
  'tests/stage232l-delete-linked-note-reference-sweep.test.cjs',
  'tests/stage232m-case-detail-missing-item-filter-delete-closure.test.cjs',
  'tests/stage232n-missing-item-visual-kind-classification.test.cjs',
  'tests/stage232o-missing-item-activity-bridge-and-case-append.test.cjs',
  'tests/stage232p-case-detail-buildworkitems-scope-hotfix.test.cjs',
  'tests/stage232q-case-detail-missing-payload-row-render.test.cjs',
  'tests/stage232r-missing-item-render-freeze-guard.test.cjs',
  'scripts/check-stage232r-missing-item-render-freeze-guard.cjs',
  '_project/obsidian_updates/2026-06-18_STAGE232R_MISSING_ITEM_RENDER_FREEZE_GUARD.md',
  '_project/runs/STAGE232R_MISSING_ITEM_RENDER_FREEZE_GUARD.md',
  'scripts/check-stage232q-case-detail-missing-payload-row-render.cjs',
  '_project/obsidian_updates/2026-06-18_STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER.md',
  '_project/runs/STAGE232Q_CASE_DETAIL_MISSING_PAYLOAD_ROW_RENDER.md',
  'scripts/check-stage232p-case-detail-buildworkitems-scope-hotfix.cjs',
  '_project/obsidian_updates/2026-06-18_STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX.md',
  '_project/runs/STAGE232P_CASE_DETAIL_BUILDWORKITEMS_SCOPE_HOTFIX.md',
  'scripts/check-stage232o-missing-item-activity-bridge-and-case-append.cjs',
  '_project/obsidian_updates/2026-06-18_STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND.md',
  '_project/runs/STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND.md',
  'scripts/check-stage232n-missing-item-visual-kind-classification.cjs',
  '_project/obsidian_updates/2026-06-18_STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION.md',
  '_project/runs/STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION.md',
  'scripts/check-stage232m-case-detail-missing-item-filter-delete-closure.cjs',
  '_project/obsidian_updates/2026-06-18_STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE.md',
  '_project/runs/STAGE232M_CASE_DETAIL_MISSING_ITEM_ACTIVE_FILTER_DELETE_CLOSURE.md',
  'scripts/check-stage232l-delete-linked-note-reference-sweep.cjs',
  '_project/obsidian_updates/2026-06-18_STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP.md',
  '_project/runs/STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP.md',
  'scripts/check-stage232k-case-detail-legacy-case-item-delete-no-method-allowed.cjs',
  '_project/runs/STAGE232K_CASE_DETAIL_LEGACY_CASE_ITEM_DELETE_NO_METHOD_ALLOWED.md',
  '_project/runs/STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.md',
  '_project/obsidian_updates/2026-06-17_STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME.md',
  'tests/stage232i1-case-detail-missing-blocker-runtime.test.cjs',
  '_project/runs/STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME.md',
  '_project/obsidian_updates/2026-06-17_STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME.md',
  'tests/stage232i0-missing-blocker-cross-entity-contract.test.cjs',
  '_project/CODEX_CONTEXT_INDEX.md',
  '10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md',
  'tests/stage232d-owner-contact-done-runtime-fix.test.cjs',
  'src/lib/owner-control/activity-truth.ts',
  'src/lib/supabase-fallback.ts',
  'src/lib/owner-control/owner-control-baseline.ts',
  'src/lib/owner-control/owner-control-missing-blockers.ts',
  'scripts/check-stage232i3-owner-control-missing-blocker-cross-entity-integration.cjs',
  'tests/stage232i3-owner-control-missing-blocker-cross-entity-integration.test.cjs',
  '_project/runs/STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.md',
  '_project/obsidian_updates/2026-06-18_STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION.md',  'tests/stage107-templates-delete-and-visual-contract.test.cjs',
  // STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX_ALLOWLIST
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  '_project/runs/STAGE232I4_R16Z_R10_LEAD_MISSING_CHECKBOX_ACTIVITY_SOURCE_FIX.md',
  'scripts/check-stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.cjs',
  'tests/stage232i4-r16z-r10-lead-missing-checkbox-activity-source-fix.test.cjs',
  // STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE active scope
  'scripts/check-stage232i4-r16z-r10-r3-guard-scope-status-sync.cjs',
  'tests/stage232i4-r16z-r10-r3-guard-scope-status-sync.test.cjs',
  '_project/runs/STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md',
  '_project/obsidian_updates/2026-06-21_STAGE232I4_R16Z_R10_R3_GUARD_SCOPE_STATUS_SYNC_AND_OWNER_SMOKE_CLOSE.md',

  // STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH_ALLOWLIST
  'src/pages/Clients.tsx',
  'scripts/check-stage231d0b-client-list-card-freeze.cjs',
  'scripts/check-visual-stage05-clients.cjs',
  'scripts/check-stage232c-clients-relation-tile-source-of-truth.cjs',
  'tests/stage232c-clients-relation-tile-source-of-truth.test.cjs',
  'tests/stage91-clients-top-value-runtime-contract.test.cjs',
  '_project/runs/STAGE232C_CLIENTS_RELATION_TILE_SOURCE_OF_TRUTH.md',

  // STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR
  'src/lib/finance/case-finance-source.ts',
  'src/components/finance/CaseFinanceEditorDialog.tsx',
  'src/components/finance/CaseSettlementPanel.tsx',
  'src/components/finance/PaymentList.tsx',
  'scripts/check-stage232k-r1-case-commission-status-derived-from-payments.cjs',
  'tests/stage232k-r1-case-commission-status-derived-from-payments.test.cjs',
  'scripts/check-stage232k-r1d-cf-runtime-allowlist-repair.cjs',
  'tests/stage232k-r1d-cf-runtime-allowlist-repair.test.cjs',
  '_project/runs/STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS.md',
  '_project/obsidian_updates/2026-06-22_STAGE232K_R1_CASE_COMMISSION_STATUS_DERIVED_FROM_PAYMENTS.md',
  '_project/runs/STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR.md',
  '_project/obsidian_updates/2026-06-22_STAGE232K_R1D_CF_RUNTIME_ALLOWLIST_REPAIR.md',
  // STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH
  'scripts/check-stage232k-r2-commission-payment-write-and-client-refresh.cjs',
  'tests/stage232k-r2-commission-payment-write-and-client-refresh.test.cjs',
  '_project/runs/STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH.md',
  '_project/obsidian_updates/2026-06-22_STAGE232K_R2_COMMISSION_PAYMENT_WRITE_AND_CLIENT_REFRESH.md',
  // STAGE232K_R3C_PAYMENT_API_STATUS_DB_SAFE_PAID_FIX
  'src/server/payments.ts',
  'scripts/check-stage232k-r3c-payment-api-status-db-safe-paid.cjs',
  'tests/stage232k-r3c-payment-api-status-db-safe-paid.test.cjs',
  '_project/runs/STAGE232K_R3C_PAYMENT_API_STATUS_DB_SAFE_PAID_FIX.md',
  '_project/obsidian_updates/2026-06-22_STAGE232K_R3C_PAYMENT_API_STATUS_DB_SAFE_PAID_FIX.md',
  '_project/06_GUARDS_AND_TESTS.md',
  '_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md',
  '_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md',
  // STAGE232G_R0_CALENDAR_AUDIT_SCOPE_ALLOWLIST
  '_project/runs/STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md',
  '_project/obsidian_updates/2026-06-22_STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT.md',
  'scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs',
  'tests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs',
];

function gitList(args) {
  const result = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8', shell: false });
  if (result.status !== 0) return [];
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

if (exists('.git')) {
  const changed = new Set([
  // STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME_ALLOWLIST
  'api/work-items.ts',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX.md',
  '_project/obsidian_updates/2026-06-23_STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX.md',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_RESUME.md',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_CONTEXT.txt',
  '_project/runs/STAGE232G_R1E1_WORK_ITEMS_VERCEL_TSC_HOTFIX_R2_CONTEXT.txt',
  'scripts/check-stage232g-r1e1-work-items-vercel-tsc-hotfix.cjs',
  'scripts/check-stage232g-r1e1-work-items-vercel-tsc-hotfix-r2-resume.cjs',
  'tests/stage232g-r1e1-work-items-vercel-tsc-hotfix.test.cjs',
  'tests/stage232g-r1e1-work-items-vercel-tsc-hotfix-r2-resume.test.cjs',

    ...gitList(['diff', '--name-only']),
    ...gitList(['diff', '--name-only', '--cached']),
    ...gitList(['ls-files', '--others', '--exclude-standard']),
  ]);
  const outOfScope = [...changed].filter((file) => !allowedChangePrefixes.includes(file.replace(/\\/g, '/')));
  expect(outOfScope.length === 0, `Out-of-scope changed files detected for CF-RUNTIME-00: ${outOfScope.join(', ')}`);
}



if (exists('scripts/check-closeflow-case-detail-loading-reference.cjs')) {
  const caseDetailLoadingGuard = read('scripts/check-closeflow-case-detail-loading-reference.cjs');
  expect(
    caseDetailLoadingGuard.includes('CLOSEFLOW_CASE_DETAIL_LOADING_REFERENCE_GUARD_R3_RAIL_MARKER_COMPAT'),
    'case detail loading reference guard compat file must keep R3 rail marker compat marker',
  );
  expect(
    caseDetailLoadingGuard.includes('data-case-settlement-rail-card="true"'),
    'case detail loading reference guard must accept current data-case-settlement-rail-card source truth marker',
  );
}

if (errors.length) {
  console.error('CF-RUNTIME-00 source truth guard FAILED');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('CF-RUNTIME-00 source truth guard PASS');

// CF_RUNTIME_00_QUICK_ACTIONS_MARKER_BATCH_SCOPE_COMPAT_R15
