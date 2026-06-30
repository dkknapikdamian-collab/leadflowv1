const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const repository = fs.readFileSync(path.join(ROOT, 'src/lib/source-of-truth/status-repository.ts'), 'utf8');
const reportPath = path.join(ROOT, '_project/runs/LF-PROD-SOT-001B_STATUS_REPOSITORY.md');
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf8') : '';

test('001B status repository exports required groups', () => {
  for (const group of ['leadStatus','clientHealthStatus','clientSourceStatus','clientPortalStatus','caseStatus','caseLifecycleStatus','taskStatus','eventStatus','paymentStatus','missingItemStatus','ownerControlStatus','activityStatus','commissionStatus']) {
    assert.ok(repository.includes(`export const ${group}`), `${group} missing`);
  }
});

test('001B repository adapts existing source files and avoids pages/components imports', () => {
  for (const marker of ['src/lib/domain-statuses.ts','src/lib/source-of-truth/lead-options.ts','src/lib/source-of-truth/client-options.ts','src/lib/source-of-truth/case-options.ts','src/lib/source-of-truth/schedule-options.ts','src/lib/finance/finance-types.ts','src/lib/finance/finance-normalize.ts','src/lib/owner-control/owner-control-missing-blockers.ts']) {
    assert.ok(repository.includes(marker), `${marker} missing`);
  }
  assert.doesNotMatch(repository, /from\s+['"][^'"]*pages\//);
  assert.doesNotMatch(repository, /from\s+['"][^'"]*components\//);
});

test('001B client status is not flattened', () => {
  assert.doesNotMatch(repository, /export const clientStatus\b/);
  assert.ok(repository.includes('clientHealthStatus'));
  assert.ok(repository.includes('clientSourceStatus'));
  assert.ok(repository.includes('clientPortalStatus'));
  assert.ok(repository.includes('clientHealth !== clientSource !== portalStatus'));
});

test('001B separates source, derived, ui-only and legacy contracts', () => {
  for (const marker of ["'source'", "'derived'", "'ui-only'", "'legacy'", 'legacyAliases', 'closedValues', 'labels', 'tones']) assert.ok(repository.includes(marker), `${marker} missing`);
});

test('001B separates critical status meanings', () => {
  assert.ok(repository.includes('case.status !== caseLifecycle.bucket'));
  assert.ok(repository.includes('task.done !== event.done'));
  assert.ok(repository.includes('Odbyte'));
  assert.ok(repository.includes('payment.status !== payment.paidLikeCompatibility'));
  assert.ok(repository.includes('paidLikeCompatibilityValues'));
  assert.ok(repository.includes('dueLikeCompatibilityValues'));
  assert.ok(repository.includes('commissionStatus = derived/read-only'));
  assert.match(repository, /readOnly:true|readOnly: true/);
  assert.ok(repository.includes('active missing source record is task/work-item, not activity history'));
});

test('001B report records forbidden areas as untouched', () => {
  for (const marker of ['SQL/migrations: NOT_TOUCHED', 'Supabase/API: NOT_TOUCHED', 'Calendar: NOT_TOUCHED', 'Finance / CaseSettlement: NOT_TOUCHED']) assert.ok(report.includes(marker), `${marker} missing`);
});
