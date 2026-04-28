const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');

const requiredTests = [
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
  'tests/client-detail-v1-operational-center.test.cjs',
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
  'tests/stage30-leads-clients-trash-contract.test.cjs',
  'tests/stage31-leads-thin-list-search.test.cjs',
  'tests/stage32-leads-value-right-rail.test.cjs',
  'tests/stage32e-relation-rail-copy-compat.test.cjs',
  'tests/relation-funnel-value.test.cjs',
  'tests/stage32g-relation-funnel-full-gate-contract.test.cjs',
  'tests/stage32f-relation-funnel-contract.test.cjs',
  'tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs',
  'tests/stage35-ai-assistant-compact-ui.test.cjs',
  'tests/stage29d-today-ai-drafts-compact-tile.test.cjs',
  'tests/layout-brand-label.test.cjs',
  'tests/lead-start-service-case-redirect.test.cjs',
  'tests/billing-checkout-no-prefilled-personal-email.test.cjs',
  'tests/lead-write-access-gate.test.cjs',
  'tests/billing-access-plan-normalization.test.cjs',
  'tests/today-quick-snooze-real-button-click.test.cjs',
];

function run(label, command, args) {
  console.log('');
  console.log('==> ' + label);

  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: 'inherit',
    shell: false,
  });

  if (result.error) {
    console.error('');
    console.error('FAILED: ' + label);
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error('');
    console.error('FAILED: ' + label);
    process.exit(result.status || 1);
  }
}

function runNpmScript(label, scriptName) {
  if (process.platform === 'win32') {
    const cmd = process.env.ComSpec || 'cmd.exe';
    run(label, cmd, ['/d', '/s', '/c', 'npm.cmd', 'run', scriptName]);
    return;
  }

  run(label, 'npm', ['run', scriptName]);
}

for (const relativePath of requiredTests) {
  const fullPath = path.join(repoRoot, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.error('Missing required test: ' + relativePath);
    process.exit(1);
  }
}

runNpmScript('production build', 'build');

for (const relativePath of requiredTests) {
  run(relativePath, process.execPath, ['--test', relativePath]);
}

console.log('');
console.log('CloseFlow release gate passed.');


