#!/usr/bin/env node
// CF_RUNTIME_00_R21_BRITTLE_PARSER_MASS_GUARD_SYNTAX_FIX
// CF_RUNTIME_00_STAGE232A_R6_SCOPE_COMPAT
// CF_RUNTIME_00_STAGE232A_R7_CASE_ITEMS_SCHEMA_COMPAT
// CF_RUNTIME_00_STAGE232A_R8_LEAD_MISSING_UI_SOURCE_COMPAT\n// CF_RUNTIME_00_STAGE232A_R8_R6_R6_GUARD_COMPAT
// CF_RUNTIME_00_STAGE232A_R9_BLOCKER_TOP_CARD_SUMMARY\n// CF_RUNTIME_00_STAGE232A_R9_R2_R8_GUARD_COMPAT
// CF_RUNTIME_00_STAGE232A_R10_LEAD_DETAIL_VISUAL_SOURCE_TRUTH
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
  expect(helper.includes("CASE_DETAIL_CANONICAL_ROUTE_PREFIX = '/case'"), 'helper canonical route must remain /case');
  expect(helper.includes("CASE_DETAIL_LEGACY_ROUTE_PREFIX = '/cases'"), 'helper legacy route alias must remain /cases');
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
  'tests/stage107-templates-delete-and-visual-contract.test.cjs',
];

function gitList(args) {
  const result = spawnSync('git', args, { cwd: repoRoot, encoding: 'utf8', shell: false });
  if (result.status !== 0) return [];
  return result.stdout.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

if (exists('.git')) {
  const changed = new Set([
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
