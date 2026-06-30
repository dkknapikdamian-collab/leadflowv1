#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const stage = 'LF-PROD-SOT-001B';
const statusRepositoryPath = path.join(ROOT, 'src/lib/source-of-truth/status-repository.ts');
const reportPath = path.join(ROOT, '_project/runs/LF-PROD-SOT-001B_STATUS_REPOSITORY.md');
const packagePath = path.join(ROOT, 'package.json');

const requiredGroups = [
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
];

const requiredSourceMarkers = [
  'src/lib/domain-statuses.ts',
  'src/lib/source-of-truth/lead-options.ts',
  'src/lib/source-of-truth/client-options.ts',
  'src/lib/source-of-truth/case-options.ts',
  'src/lib/source-of-truth/schedule-options.ts',
  'src/lib/finance/finance-types.ts',
  'src/lib/finance/finance-normalize.ts',
  'src/lib/finance/case-finance-source.ts',
  'src/lib/owner-control/owner-control-missing-blockers.ts',
];

function fail(message, details = {}) {
  console.error(JSON.stringify({ ok: false, guard: 'verify:lf-prod-sot-001b-status-repository', stage, message, ...details }, null, 2));
  process.exit(1);
}

function read(filePath) {
  if (!fs.existsSync(filePath)) fail(`Missing required file: ${path.relative(ROOT, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}

function includesAll(content, values, label) {
  const missing = values.filter((value) => !content.includes(value));
  if (missing.length) fail(`Missing ${label}`, { missing });
}

const repository = read(statusRepositoryPath);
const report = read(reportPath);
const packageJson = fs.existsSync(packagePath) ? read(packagePath) : '';

includesAll(repository, requiredGroups.map((name) => `export const ${name}`), 'status repository group exports');
includesAll(repository, requiredSourceMarkers, 'source map markers');
includesAll(repository, [
  "'source'",
  "'derived'",
  "'ui-only'",
  "'legacy'",
  'legacyAliases',
  'closedValues',
  'labels',
  'tones',
  'STATUS_REPOSITORY_SOURCE_MAP',
], 'source/derived/ui-only/legacy contract');

if (/from\s+['"][^'"]*pages\//.test(repository)) fail('status-repository.ts must not import from pages');
if (/from\s+['"][^'"]*components\//.test(repository)) fail('status-repository.ts must not import from components');
if (/\bTODO\b|\bFIXME\b|CZASOWE/i.test(repository)) fail('status-repository.ts contains unresolved work marker');
if (/Ã|Ä|Å|�|\uFFFD/.test(repository + report)) fail('mojibake marker detected');
if (/export const clientStatus\b/.test(repository)) fail('Client status must not be flattened into one clientStatus export');
if (!/clientHealthStatus[\s\S]*clientSourceStatus[\s\S]*clientPortalStatus/.test(repository)) fail('Client health/source/portal sections must remain separated');
if (!/case\.status !== caseLifecycle\.bucket/.test(repository)) fail('case status and case lifecycle contract missing');
if (!/task\.done !== event\.done/.test(repository)) fail('Task done and Event done separation missing');
if (!/payment\.status !== payment\.paidLikeCompatibility/.test(repository)) fail('Payment status and paid-like compatibility separation missing');
if (!/commissionStatus = derived\/read-only/.test(repository)) fail('Commission derived/read-only contract missing');
if (!/active missing source record is task\/work-item, not activity history/.test(repository)) fail('Missing item active source-record contract missing');

includesAll(report, [
  'STATUS_REPOSITORY_SOURCE_MAP',
  'ADOPTION_DEFERRED_TO_NEXT_STAGE',
  'Calendar: NOT_TOUCHED',
  'Finance / CaseSettlement: NOT_TOUCHED',
  'Owner Control: NOT_TOUCHED',
  'ClientDetail: NOT_TOUCHED',
  'MissingItemsManager: NOT_TOUCHED',
  'Supabase/API: NOT_TOUCHED',
  'SQL/migrations: NOT_TOUCHED',
], 'report closeout markers');

const aliasPresent = packageJson.includes('"verify:lf-prod-sot-001b-status-repository"')
  && packageJson.includes('scripts/guards/verify-lf-prod-sot-001b-status-repository.cjs');

if (!aliasPresent) fail('package.json alias missing', { expectedAlias: 'verify:lf-prod-sot-001b-status-repository' });

console.log(JSON.stringify({
  ok: true,
  guard: 'verify:lf-prod-sot-001b-status-repository',
  stage,
  groupsChecked: requiredGroups.length,
  sourceMarkersChecked: requiredSourceMarkers.length,
  packageAlias: 'PRESENT',
}, null, 2));
