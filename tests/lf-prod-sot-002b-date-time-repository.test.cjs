const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const ROOT = process.cwd();
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

function read(filePath) {
  assert.equal(fs.existsSync(filePath), true, `${path.relative(ROOT, filePath)} must exist`);
  return fs.readFileSync(filePath, 'utf8');
}

function stripStringsAndComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/.*$/gm, '$1')
    .replace(/`(?:\\.|[^`])*`/g, '``')
    .replace(/"(?:\\.|[^"\\])*"/g, '""')
    .replace(/'(?:\\.|[^'\\])*'/g, "''");
}

test('LF-PROD-SOT-002B date-time repository exports required contracts', () => {
  const repository = read(repositoryPath);
  for (const name of requiredExports) {
    assert.match(repository, new RegExp(`export const ${name}\\b`), `missing export ${name}`);
  }
});

test('lead next action fallback and last contact truth are documented', () => {
  const repository = read(repositoryPath);
  assert.match(repository, /fallbackOrder:[\s\S]*'nextActionAt'[\s\S]*'followUpAt'[\s\S]*'date\+time'[\s\S]*'createdAt'/);
  assert.match(repository, /lastContactAt is explicit field first/);
  assert.match(repository, /SILENCE_7_14_BUCKET_RISK/);
});

test('task and finance date-only policies stay separated', () => {
  const repository = read(repositoryPath);
  assert.match(repository, /T09:00 for task\/event date-only defaults/);
  assert.match(repository, /T23:59:59 for finance date-only deadlines/);
});

test('event contract separates local event from Google Calendar boundary', () => {
  const repository = read(repositoryPath);
  assert.match(repository, /local UI event from Google Calendar boundary/);
  assert.match(repository, /calendarGoogleBoundaryContract/);
  assert.match(repository, /Google Calendar sync must remain untouched in 002B/);
});

test('activity timeline and today clock remain consumer contracts only', () => {
  const repository = read(repositoryPath);
  assert.match(repository, /Activity Timeline is UI-only date renderer\. Activity Truth decides operational truth\./);
  assert.match(repository, /Clock\/now provider is a documented dependency only/);
  assert.match(repository, /Centralize contract for now provider and day-key logic, but do not change Today behavior in 002B/);
});

test('repository has no page/component imports and no active clock calls', () => {
  const repository = read(repositoryPath);
  const executableRepository = stripStringsAndComments(repository);
  assert.doesNotMatch(repository, /from\s+['"][^'"]*pages\//);
  assert.doesNotMatch(repository, /from\s+['"][^'"]*components\//);
  assert.doesNotMatch(executableRepository, /\bnew\s+Date\s*\(/);
  assert.doesNotMatch(executableRepository, /\bDate\.now\s*\(/);
});

test('report contains adoption-deferred and untouched markers', () => {
  const report = read(reportPath);
  for (const marker of [
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
  ]) {
    assert.match(report, new RegExp(marker.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `missing report marker ${marker}`);
  }
});
