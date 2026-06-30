const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = process.cwd();
const repositoryPath = path.join(ROOT, 'src/lib/source-of-truth/status-repository.ts');
const reportPath = path.join(ROOT, '_project/runs/LF-PROD-SOT-001B_STATUS_REPOSITORY.md');

function read(filePath) {
  assert.equal(fs.existsSync(filePath), true, `${path.relative(ROOT, filePath)} must exist`);
  return fs.readFileSync(filePath, 'utf8');
}

const repository = read(repositoryPath);
const report = fs.existsSync(reportPath) ? fs.readFileSync(reportPath, 'utf8') : '';

test('001B status repository exists and exports required groups', () => {
  for (const group of [
    'leadStatus',
    'clientHealthStatus',
    'clientSourceStatus',
    'clientPortalStatus',
    'caseStatus',
    'caseLifecycleStatus',
    'taskStatus',
    'eventStatus',
    'paymentStatus',
    'missingItemStatus',
    'ownerControlStatus',
    'activityStatus',
    'commissionStatus',
  ]) {
    assert.match(repository, new RegExp(`export const ${group}\\b`), `${group} export missing`);
  }
});

test('001B lead has mapped production statuses from 001A', () => {
  for (const value of ['new', 'contacted', 'qualification', 'proposal_sent', 'waiting_response', 'negotiation', 'accepted', 'won', 'lost', 'moved_to_service', 'archived']) {
    assert.match(repository, new RegExp(`['\"]${value}['\"]`), `${value} missing from lead map`);
  }
  assert.match(repository, /src\/lib\/domain-statuses\.ts/);
  assert.match(repository, /src\/lib\/source-of-truth\/lead-options\.ts/);
});

test('001B client status is not flattened', () => {
  assert.doesNotMatch(repository, /export const clientStatus\b/);
  assert.match(repository, /clientHealthStatus/);
  assert.match(repository, /clientSourceStatus/);
  assert.match(repository, /clientPortalStatus/);
  assert.match(repository, /clientHealth !== clientSource !== portalStatus/);
});

test('001B case status and lifecycle bucket are separated', () => {
  assert.match(repository, /export const caseStatus\b/);
  assert.match(repository, /export const caseLifecycleStatus\b/);
  assert.match(repository, /case\.status !== caseLifecycle\.bucket/);
  assert.match(repository, /src\/lib\/case-lifecycle-v1\.ts/);
});

test('001B task done and event done are separated', () => {
  assert.match(repository, /export const taskStatus\b/);
  assert.match(repository, /export const eventStatus\b/);
  assert.match(repository, /task\.done !== event\.done/);
  assert.match(repository, /Odbyte/);
});

test('001B payment status and paid-like compatibility are separated', () => {
  assert.match(repository, /export const paymentStatus\b/);
  assert.match(repository, /payment\.status !== payment\.paidLikeCompatibility/);
  assert.match(repository, /paidLikeCompatibilityValues/);
  assert.match(repository, /dueLikeCompatibilityValues/);
});

test('001B commission is derived and read-only', () => {
  assert.match(repository, /export const commissionStatus\b/);
  assert.match(repository, /source: 'derived'/);
  assert.match(repository, /readOnly: true/);
  assert.match(repository, /commissionStatus = derived\/read-only/);
});

test('001B missing item has active source-record contract', () => {
  assert.match(repository, /export const missingItemStatus\b/);
  assert.match(repository, /missing_item/);
  assert.match(repository, /blocking_missing_item/);
  assert.match(repository, /active missing source record is task\/work-item, not activity history/);
});

test('001B repository does not import from pages or components', () => {
  assert.doesNotMatch(repository, /from\s+['"][^'"]*pages\//);
  assert.doesNotMatch(repository, /from\s+['"][^'"]*components\//);
});

test('001B report records no SQL or migration change', () => {
  assert.match(report, /SQL\/migrations: NOT_TOUCHED/);
  assert.match(report, /Supabase\/API: NOT_TOUCHED/);
  assert.match(report, /Calendar: NOT_TOUCHED/);
  assert.match(report, /Finance \/ CaseSettlement: NOT_TOUCHED/);
});
