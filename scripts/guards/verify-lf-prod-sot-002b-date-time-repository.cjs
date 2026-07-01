#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const stage = 'LF-PROD-SOT-002B';
const guard = 'verify:lf-prod-sot-002b-date-time-repository';
const repositoryPath = path.join(ROOT, 'src/lib/source-of-truth/date-time-repository.ts');
const reportPath = path.join(ROOT, '_project/runs/LF-PROD-SOT-002B_DATE_TIME_REPOSITORY.md');

const requiredExports = [
  'dateTimeSourceMap',
  'leadDateContract',
  'clientDateContract',
  'caseDateContract',
  'taskDateContract',
  'eventDateContract',
  'financeDateContract',
  'paymentDateContract',
  'commissionDateContract',
  'activityDateContract',
  'operationalTodayClockContract',
  'ownerControlDateContract',
  'calendarGoogleBoundaryContract',
  'dateTimeRepository',
];

const requiredContractKeys = [
  'sourceFields',
  'derivedFields',
  'uiOnlyFields',
  'legacyFields',
  'fallbackOrder',
  'sourceFiles',
  'consumers',
  'timezonePolicy',
  'localDatePolicy',
  'instantPolicy',
  'dateOnlyPolicy',
  'sortPolicy',
  'filterPolicy',
  'formatPolicy',
  'riskMarkers',
];

const sourceMarkers = [
  'data-contract.ts',
  'work-items/normalize.ts',
  'task-event-contract.ts',
  'scheduling.ts',
  'calendar-items.ts',
  'calendar-operational-entry-contract.ts',
  'activity-truth.ts',
  'activity-timeline.ts',
  'last-contact-intake.ts',
  'contact-cadence-grid.ts',
  'lost-lead-rescue.ts',
  'next-move-contract.ts',
  'planned-actions.ts',
  'case-lifecycle-v1.ts',
  'owner-control/owner-control-baseline.ts',
  'finance/finance-types.ts',
  'finance/finance-normalize.ts',
  'finance/case-finance-source.ts',
  'supabase-fallback.ts',
];

const reportMarkers = [
  'DATE_TIME_REPOSITORY_ADDED',
  'ADOPTION_DEFERRED_TO_NEXT_STAGE',
  'runtime: NOT_TOUCHED',
  'Today: NOT_TOUCHED',
  'Calendar: NOT_TOUCHED',
  'Google Calendar sync: NOT_TOUCHED',
  'Finance runtime: NOT_TOUCHED',
  'Owner Control runtime: NOT_TOUCHED',
  'Supabase/API: NOT_TOUCHED',
  'SQL/migrations: NOT_TOUCHED',
  'CSS: NOT_TOUCHED',
  'layout: NOT_TOUCHED',
  'UI redesign: NOT_TOUCHED',
];

function fail(message, details = {}) {
  console.error(JSON.stringify({ ok: false, guard, stage, message, ...details }, null, 2));
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

function stripStringsAndComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/`(?:\\.|[^`])*`/g, '``')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
}

const repository = read(repositoryPath);
const report = read(reportPath);
const executableRepository = stripStringsAndComments(repository);

includesAll(repository, requiredExports.map((name) => `export const ${name}`), 'repository exports');
includesAll(repository, requiredContractKeys, 'date-time contract keys');
includesAll(repository, sourceMarkers, '002A source markers');
includesAll(report, reportMarkers, 'report closeout markers');

if (/from\s+['"][^'"]*pages\//.test(repository)) fail('date-time-repository.ts must not import from pages');
if (/from\s+['"][^'"]*components\//.test(repository)) fail('date-time-repository.ts must not import from components');
if (/\bnew\s+Date\s*\(/.test(executableRepository)) fail('date-time-repository.ts contains active new Date call');
if (/\bDate\.now\s*\(/.test(executableRepository)) fail('date-time-repository.ts contains active Date.now call');
if (/Ã|Ä|Å|�|\uFFFD/.test(repository + report)) fail('mojibake marker detected');

includesAll(repository, [
  'T09:00 for task/event date-only defaults',
  'T23:59:59 for finance date-only deadlines',
  'Google Calendar sync must remain untouched in 002B',
  'Activity Timeline is UI-only date renderer. Activity Truth decides operational truth.',
  'local day key is not ISO UTC day key',
  'nextActionAt',
  'followUpAt',
  'date+time',
  'createdAt',
], 'critical date policy markers');

console.log(JSON.stringify({
  ok: true,
  guard,
  stage,
  exportsChecked: requiredExports.length,
  sourceMarkersChecked: sourceMarkers.length,
  runtimeAdoption: 'NOT_TOUCHED',
}, null, 2));
