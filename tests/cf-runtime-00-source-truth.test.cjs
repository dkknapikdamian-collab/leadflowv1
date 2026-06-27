const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

async function loadRuntimeSourceTruth() {
  const repoRoot = path.resolve(__dirname, '..');
  const sourcePath = path.join(repoRoot, 'src/lib/closeflow-runtime-source-truth.ts');
  const source = fs.readFileSync(sourcePath, 'utf8');
  const tmpPath = path.join(os.tmpdir(), `cf-runtime-00-source-truth-${process.pid}-${Date.now()}.mjs`);
  fs.writeFileSync(tmpPath, source, 'utf8');
  try {
    return await import(pathToFileURL(tmpPath).href + '?cacheBust=' + Date.now());
  } finally {
    try { fs.unlinkSync(tmpPath); } catch {}
  }
}

test('CF-RUNTIME-00 route truth keeps canonical /cases and recognizes legacy /case alias', async () => {
  const runtime = await loadRuntimeSourceTruth();
  assert.equal(runtime.buildCaseDetailPath('abc'), '/cases/abc');
  assert.equal(runtime.buildCaseDetailPath('a b/ą'), '/cases/a%20b%2F%C4%85');
  assert.equal(runtime.buildLegacyCaseDetailPath('abc'), '/case/abc');
  assert.equal(runtime.isCaseDetailPath('/case/abc'), true);
  assert.equal(runtime.isCaseDetailPath('/cases/abc'), true);
  assert.equal(runtime.isCanonicalCaseDetailPath('/cases/abc'), true);
  assert.equal(runtime.isCanonicalCaseDetailPath('/case/abc'), false);
  assert.equal(runtime.isLegacyCaseDetailPath('/case/abc?tab=history'), true);
  assert.equal(runtime.isCaseDetailPath('/clients/abc'), false);
});

test('CF-RUNTIME-00 status truth closes done/canceled/deleted statuses and fails unknown active state safely', async () => {
  const runtime = await loadRuntimeSourceTruth();
  for (const status of ['done', 'completed', 'resolved', 'ZROBIONE']) {
    assert.equal(runtime.isDoneLikeStatus(status), true, status);
    assert.equal(runtime.isActiveWorkStatus(status), false, status);
  }
  for (const status of ['canceled', 'cancelled', 'anulowane']) {
    assert.equal(runtime.isCanceledLikeStatus(status), true, status);
    assert.equal(runtime.isActiveWorkStatus(status), false, status);
  }
  for (const status of ['deleted', 'archived', 'soft deleted']) {
    assert.equal(runtime.isDeletedLikeStatus(status), true, status);
    assert.equal(runtime.isActiveWorkStatus(status), false, status);
  }
  assert.equal(runtime.isActiveWorkStatus('in_progress'), true);
  assert.equal(runtime.isActiveWorkStatus('waiting for client'), true);
  assert.equal(runtime.isActiveWorkStatus('totally_unknown_runtime_status'), false);
});

test('CF-RUNTIME-00 work item truth separates missing items from blockers', async () => {
  const runtime = await loadRuntimeSourceTruth();
  assert.equal(runtime.isMissingItemLike('missing_item'), true);
  assert.equal(runtime.isMissingItemLike('missing'), true);
  assert.equal(runtime.isMissingItemLike('brak'), true);
  assert.equal(runtime.isMissingItemLike({ type: 'missing_item', title: 'Brak dokumentu' }), true);
  assert.equal(runtime.isMissingItemLike({ type: 'blocker', title: 'Blokada klienta' }), false);

  assert.equal(runtime.isBlockerLike('blocked'), true);
  assert.equal(runtime.isBlockerLike('blocker'), true);
  assert.equal(runtime.isBlockerLike('blokada'), true);
  assert.equal(runtime.isBlockerLike({ kind: 'blocker', title: 'Blokada decyzji' }), true);
  assert.equal(runtime.isBlockerLike({ kind: 'missing_item', title: 'Brak telefonu' }), false);
});

test('CF-RUNTIME-00 access plan truth does not confirm Pro from paid_active without planId', async () => {
  const runtime = await loadRuntimeSourceTruth();
  const pending = runtime.buildRuntimeAccessPlanTruth({ subscriptionStatus: 'paid_active' });
  assert.equal(pending.subscriptionStatus, 'paid_active');
  assert.equal(pending.effectivePlanId, 'free');
  assert.equal(pending.confirmedPlanId, null);
  assert.equal(pending.legacyFallbackPlanId, 'pro');
  assert.equal(pending.planSource, 'fallback_status');
  assert.equal(pending.isPlanConfirmed, false);
  assert.equal(pending.isPaidStatusActive, true);
  assert.equal(pending.isConfirmedPaidPlan, false);
  assert.equal(pending.requiresPlanIdConfirmation, true);

  const confirmedPro = runtime.buildRuntimeAccessPlanTruth({ subscriptionStatus: 'paid_active', planId: 'closeflow_pro' });
  assert.equal(confirmedPro.effectivePlanId, 'pro');
  assert.equal(confirmedPro.confirmedPlanId, 'pro');
  assert.equal(confirmedPro.planSource, 'explicit_plan');
  assert.equal(confirmedPro.isPlanConfirmed, true);
  assert.equal(confirmedPro.isConfirmedPaidPlan, true);
  assert.equal(confirmedPro.requiresPlanIdConfirmation, false);
});

test('CF-RUNTIME-00 unknown access status falls back safely', async () => {
  const runtime = await loadRuntimeSourceTruth();
  const unknown = runtime.buildRuntimeAccessPlanTruth({ subscriptionStatus: 'mystery_paid', planId: null });
  assert.equal(unknown.subscriptionStatus, 'inactive');
  assert.equal(unknown.rawSubscriptionStatus, 'mystery_paid');
  assert.equal(unknown.effectivePlanId, 'free');
  assert.equal(unknown.confirmedPlanId, null);
  assert.equal(unknown.planSource, 'unknown_status');
  assert.equal(unknown.isPlanConfirmed, false);
  assert.equal(unknown.isConfirmedPaidPlan, false);
  assert.equal(unknown.requiresPlanIdConfirmation, false);
});
