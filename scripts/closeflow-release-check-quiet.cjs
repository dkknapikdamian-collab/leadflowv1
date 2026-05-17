// STAGE98B_MOJIBAKE_PREFLIGHT_V22_START
{
  const { spawnSync } = require('node:child_process');
  const result = spawnSync(process.execPath, ['--test', 'tests/stage98-polish-mojibake-calendar-guard.test.cjs'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
// STAGE98B_MOJIBAKE_PREFLIGHT_V22_END
/* STAGE98B_MOJIBAKE_PREFLIGHT_V20_START */
{
  const { spawnSync } = require('node:child_process');
  const stage98bResult = spawnSync(process.execPath, ['--test', 'tests/stage98-polish-mojibake-calendar-guard.test.cjs'], { stdio: 'inherit' });
  if (stage98bResult.status !== 0) process.exit(stage98bResult.status || 1);
}
/* STAGE98B_MOJIBAKE_PREFLIGHT_V20_END */
/* CLOSEFLOW_CASES_LOADER2_IMPORT_GUARD_START */
{
  const { spawnSync } = require('node:child_process');
  const result = spawnSync(process.execPath, ['scripts/check-closeflow-cases-loader2-import.cjs'], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
/* CLOSEFLOW_CASES_LOADER2_IMPORT_GUARD_END */
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

/* STAGE98B_MOJIBAKE_PREFLIGHT_QUIET_GATE */
{
  const result = spawnSync(process.execPath, ['--test', 'tests/stage98-polish-mojibake-calendar-guard.test.cjs'], {
    cwd: repoRoot,
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status || 1);
}
/* STAGE98B_MOJIBAKE_PREFLIGHT_QUIET_GATE_END */


const requiredTests = [
  'tests/stage79-release-gate-mass-guard.test.cjs',
  'tests/stage79-today-task-done-action.test.cjs',
  'tests/right-rail-card-source-of-truth.test.cjs',
  'tests/closeflow-release-gate.test.cjs',
  'tests/closeflow-release-gate-quiet.test.cjs',
  'tests/lead-next-action-title-not-null.test.cjs',
  'tests/lead-client-path-contract.test.cjs',
  'tests/client-relation-command-center.test.cjs',
  'tests/calendar-completed-event-behavior.test.cjs',
  'tests/calendar-restore-completed-entries.test.cjs',
  'tests/calendar-entry-relation-links.test.cjs',
  'tests/today-completed-entries-behavior.test.cjs',
  'tests/today-restore-completed-label.test.cjs',
  'tests/today-entry-relation-links.test.cjs',
  'tests/today-calendar-activity-logging.test.cjs',
  'tests/activity-command-center.test.cjs',
  'tests/lead-service-mode-v1.test.cjs',
  'tests/panel-delete-actions-v1.test.cjs',
  'tests/case-lifecycle-v1-foundation.test.cjs',
  'tests/today-v1-final-action-board.test.cjs',
  'tests/today-priority-reasons-runtime.test.cjs',
  'tests/cases-v1-lifecycle-command-board.test.cjs',
  'tests/cases-filetext-runtime.test.cjs',
  'tests/case-detail-v1-command-center.test.cjs',
  'tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs',
  'tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs',
  'tests/case-detail-no-activity-notes-final-2026-05-13.test.cjs',
  'tests/case-detail-no-activity-notes-workitems-2026-05-13.test.cjs',
  'tests/p1-case-detail-history-quick-actions-visual-2026-05-13.test.cjs',
  'tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs',
  'tests/case-detail-history-visual-p1-repair4-2026-05-13.test.cjs',
  'tests/case-detail-history-visual-p1-repair5-2026-05-13.test.cjs',
  'tests/client-detail-v1-operational-center.test.cjs',
  'tests/client-detail-simplified-card-view.test.cjs',
  'tests/client-detail-final-operating-model.test.cjs',
  'tests/today-quick-snooze-options.test.cjs',
  'tests/today-quick-snooze-click-edit-polish.test.cjs',
  'tests/today-quick-snooze-hard-click-fix.test.cjs',
  'tests/pwa-foundation.test.cjs',
  'tests/daily-digest-email-runtime.test.cjs',
  'tests/email-digest-domain-gate.test.cjs',
  'tests/billing-stripe-blik-foundation.test.cjs',
  'tests/billing-foundation-test-polish-label-regression.test.cjs',
  'tests/billing-stripe-blik-multi-plan-pricing.test.cjs',
  'tests/billing-checkout-vercel-api-type-guard.test.cjs',
  'tests/billing-ui-polish-and-diagnostics.test.cjs',
  'tests/ui-copy-and-billing-cleanup.test.cjs',
  'tests/ai-config-admin-foundation.test.cjs',
  'tests/ai-config-no-secret-leak.test.cjs',
  'tests/cases-page-helper-copy-cleanup.test.cjs',
  'tests/stat-shortcut-cards-standard.test.cjs',
  'tests/ui-completed-label-consistency.test.cjs',
  'tests/leads-history-copy-cleanup.test.cjs',
  'tests/ai-quick-capture-foundation.test.cjs',
  'tests/ai-quick-capture-voice-and-today.test.cjs',
  'tests/ai-followup-draft.test.cjs',
  'tests/ai-next-action-suggestion.test.cjs',
  'tests/ai-next-action-create-task.test.cjs',
  'tests/p1a-no-global-focus-refresh-2026-05-13.test.cjs',
  'tests/ai-assistant-command-center.test.cjs',
  'tests/ai-capture-speech-parser.test.cjs',
  'tests/ai-assistant-scope-budget-guard.test.cjs',
  'tests/ai-assistant-capture-handoff.test.cjs',
  'tests/billing-stripe-diagnostics-dry-run.test.cjs',
  'tests/billing-dry-run-test-order-regression.test.cjs',
  'tests/stripe-checkout-app-url-normalization.test.cjs',
  'tests/daily-digest-diagnostics.test.cjs',
  'tests/daily-digest-cron-auth.test.cjs',
  'tests/today-action-layout-not-column-cramped.test.cjs',
  'tests/vercel-hobby-function-budget.test.cjs',
  'tests/request-scope-server-helper.test.cjs',
  'tests/request-identity-vercel-api-signature.test.cjs',
  'tests/polish-mojibake-audit.test.cjs',
  'tests/repo-backup-folders-not-tracked.test.cjs',
  'tests/stage30-leads-clients-trash-contract.test.cjs',
  'tests/stage31-leads-thin-list-search.test.cjs',
  'tests/stage32-leads-value-right-rail.test.cjs',
  'tests/stage32e-relation-rail-copy-compat.test.cjs',
  'tests/stage32g-relation-funnel-full-gate-contract.test.cjs',
  'tests/stage32f-relation-funnel-contract.test.cjs',
  'tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs',
  'tests/stage35-ai-assistant-compact-ui.test.cjs',
  'tests/layout-brand-label.test.cjs',
  'tests/lead-start-service-case-redirect.test.cjs',
  'tests/billing-checkout-no-prefilled-personal-email.test.cjs',
  'tests/stage02-access-billing-release-evidence.test.cjs',
  'tests/stage03a-api-schema-contract.test.cjs',
  'tests/stage03b-system-fallback-boundary.test.cjs',
  'tests/stage03c-leads-fallback-boundary.test.cjs',
  'tests/stage03d-optional-columns-evidence.test.cjs',
  'tests/faza2-etap21-workspace-isolation.test.cjs',
  'tests/faza2-etap22-rls-backend-security-proof.test.cjs',
  'tests/faza3-etap31-plan-source-of-truth.test.cjs',
  'tests/faza3-etap32-plan-feature-access-gate.test.cjs',
  'tests/faza3-etap32b-plan-visibility-contract.test.cjs',
  'tests/faza3-etap32c-access-gate-runtime-hotfix-v3.test.cjs',
  'tests/faza3-etap32d-plan-based-ui-visibility.test.cjs',
  'tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs',
  'tests/faza3-etap32g-ai-draft-cancel-smoke.test.cjs',
  'tests/faza3-etap32h-lead-limit-placement-hotfix.test.cjs',
  'tests/faza4-etap41-data-contract-map.test.cjs',
  'tests/faza4-etap42-task-event-contract-normalization.test.cjs',
  'tests/faza4-etap43-critical-crud-smoke.test.cjs',
  'tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs',
  'tests/faza4-etap44b-today-live-refresh-listener.test.cjs',
  'tests/faza4-etap44b-today-live-refresh-import-hotfix.test.cjs',
  'tests/faza4-etap44c-mutation-bus-coverage-smoke.test.cjs',
  'tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs',
  'tests/hotfix-global-task-action-modal-no-route.test.cjs',
  'tests/faza3-etap32f-backend-entity-limits-smoke.test.cjs',
  'tests/ui-developer-copy-paid-readiness.test.cjs',
  'tests/case-detail-write-access-gate-stage02b.test.cjs',
  'tests/lead-write-access-gate.test.cjs',
  'tests/billing-access-plan-normalization.test.cjs',
  'tests/today-quick-snooze-real-button-click.test.cjs',
  'tests/google-mobile-login-webview-guard.test.cjs',
  'tests/relation-funnel-value.test.cjs',
  'tests/global-quick-actions-open-modals.test.cjs',
  'tests/ai-draft-inbox-flow.test.cjs',
  'tests/ai-draft-inbox-command-center.test.cjs',
  'tests/global-quick-actions-sticky-single-source.test.cjs',
  'tests/global-quick-actions-no-duplicates.test.cjs',
  'tests/global-quick-actions-toolbar-a11y.test.cjs',
  'tests/ai-usage-limit-guard.test.cjs',
  'tests/ai-real-provider-wiring.test.cjs',
  'tests/ai-cloudflare-provider-wiring.test.cjs',
  'tests/ai-assistant-global-app-search.test.cjs',
  'tests/ai-assistant-autospeech-and-clear-input.test.cjs',
  'tests/ai-assistant-save-vs-search-rule.test.cjs',
  'tests/ai-assistant-admin-and-app-scope.test.cjs',
  'tests/ai-safety-gates-direct-write.test.cjs',
  'tests/ai-direct-write-respects-mode-stage28.test.cjs',
  'tests/today-ai-drafts-tile-stage29.test.cjs',
  'tests/stage29d-today-ai-drafts-compact-tile.test.cjs',
  'tests/supabase-first-readiness-stage16.test.cjs',
  'tests/stage93-calendar-week-rail-cleanup.test.cjs',
  'tests/stage94-ai-layer-separation-copy.test.cjs',
  'tests/stage94-calendar-week-plan-full-entry-text.test.cjs',
  'tests/stage95-destructive-action-visual-source.test.cjs',
  'tests/stage76-today-event-done-action.test.cjs',
  'tests/stage77-lead-detail-single-status-pill.test.cjs',
  'tests/stage78-lead-detail-no-static-ai-followup-card.test.cjs',
  'tests/stage88-lazy-page-export-contract.test.cjs',
  'tests/stage89-todaystable-named-export-contract.test.cjs',
  'tests/stage90-react-namespace-runtime-import.test.cjs',
  'tests/stage91-clients-top-value-runtime-contract.test.cjs',
  'tests/stage94-calendar-consolidated-cleanup.test.cjs',
  'tests/stage92-calendar-selected-day-readable-actions.test.cjs',
  'tests/stage96-leads-right-rail-width-position.test.cjs',
  'tests/stage97-today-overdue-task-done-button.test.cjs',
  'tests/stage98-polish-mojibake-calendar-guard.test.cjs',
  'tests/stage99-calendar-active-class-contract.test.cjs',
  'tests/stage100-calendar-week-plan-entry-visible.test.cjs',
  'tests/stage104-calendar-rendered-week-plan-smoke.test.cjs',
  'tests/stage104d-calendar-week-plan-compact-one-row.test.cjs',
  'tests/stage102-calendar-edit-modal-form-source.test.cjs',
  'tests/stage103-calendar-month-grid-day-states.test.cjs',
];

function runQuiet(label, command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    shell: false,
  });

  if (result.status !== 0) {
    console.error('');
    console.error('FAILED: ' + label);
    if (result.stdout) console.error(result.stdout);
    if (result.stderr) console.error(result.stderr);
    process.exit(result.status || 1);
  }

  console.log('OK ' + label);
}

function runNpmScript(label, scriptName) {
  if (process.platform === 'win32') {
    runQuiet(label, 'cmd.exe', ['/d', '/s', '/c', 'npm.cmd', 'run', scriptName]);
    return;
  }

  runQuiet(label, 'npm', ['run', scriptName]);
}

for (const relativePath of requiredTests) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error('Missing required test: ' + relativePath);
    process.exit(1);
  }
}


// CLOSEFLOW_CASE_DETAIL_NO_PARTIAL_LOADING_QUIET_GATE_REPAIR
runQuiet('case detail no partial loading', process.execPath, [
  'scripts/check-closeflow-case-detail-no-partial-loading.cjs',
]);

runQuiet('case detail no partial loading', process.execPath, ['scripts/check-closeflow-case-detail-no-partial-loading.cjs']);
runQuiet('case detail loading reference', process.execPath, ['scripts/check-closeflow-case-detail-loading-reference.cjs']);

runQuiet('today header actions stack', process.execPath, ['scripts/check-closeflow-today-header-actions-stack.cjs']);
runQuiet('today mobile tile focus', process.execPath, ['scripts/check-closeflow-today-mobile-tile-focus.cjs']);

runQuiet('case trash actions', process.execPath, ['scripts/check-closeflow-case-trash-actions.cjs']);


// CLOSEFLOW_STAGE98B_MOJIBAKE_PREFLIGHT
runQuiet('stage98 mojibake hard gate preflight', process.execPath, ['--test', 'tests/stage98-polish-mojibake-calendar-guard.test.cjs']);

// CLOSEFLOW_QUIET_GATE_VITE_BUILD_RUNNER_2026_05_13
runQuiet('production build', process.execPath, ['scripts/closeflow-vite-build-runner.mjs']);

for (const relativePath of requiredTests) {
  runQuiet(relativePath, process.execPath, ['--test', relativePath]);
}

console.log('');
console.log('CloseFlow quiet release gate passed.');
