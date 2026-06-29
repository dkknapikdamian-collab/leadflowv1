const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const ROOT = process.cwd();
const read = (file) => fs.readFileSync(path.join(ROOT, file), 'utf8');

const canonical = 'src/lib/source-of-truth/case-options.ts';
const config = 'src/lib/config/case-status.ts';
const cases = 'src/lib/cases.ts';
const casesPage = 'src/pages/Cases.tsx';
const caseDetail = 'src/pages/CaseDetail.tsx';

test('CZ2-003 canonical case status options use domain status values', () => {
  const source = read(canonical);
  assert.match(source, /CASE_STATUS_VALUES\.map/);
  assert.match(source, /normalizeCaseStatus/);
  for (const value of [
    'new',
    'waiting_on_client',
    'blocked',
    'to_approve',
    'ready_to_start',
    'in_progress',
    'on_hold',
    'completed',
    'canceled',
    'archived',
  ]) {
    assert.match(source, new RegExp('\\b' + value + '\\b'));
  }
});

test('CZ2-003 status labels and closed statuses preserve existing behavior', () => {
  const source = read(canonical);
  assert.match(source, /waiting_on_client:\s*'Czeka na klienta'/);
  assert.match(source, /blocked:\s*'Zablokowana'/);
  assert.match(source, /completed:\s*'Zamknieta'/);
  for (const value of ['completed', 'archived', 'canceled', 'cancelled', 'done', 'closed']) {
    assert.match(source, new RegExp("'" + value + "'"));
  }
  assert.match(source, /function\s+isClosedCaseStatus\s*\(/);
});

test('CZ2-003 case item labels preserve current labels', () => {
  const source = read(canonical);
  assert.match(source, /missing:\s*'Brak'/);
  assert.match(source, /uploaded:\s*'Do akceptacji'/);
  assert.match(source, /submitted:\s*'Dostarczone'/);
  assert.match(source, /approved:\s*'Zaakceptowane'/);
  assert.match(source, /function\s+normalizeCaseItemStatus\s*\(/);
});

test('CZ2-003 compatibility wrappers keep old public names', () => {
  const configSource = read(config);
  assert.match(configSource, /CASE_STATUS_META_BY_VALUE as CASE_STATUS_CONFIG/);
  assert.match(configSource, /CASE_ITEM_STATUS_LABELS/);
  assert.match(configSource, /getCaseStatusMeta as getCaseStatusConfig/);
  assert.match(configSource, /isClosedCaseStatus as isClosedCaseStatusValue/);

  const casesSource = read(cases);
  assert.match(casesSource, /export function isClosedCaseStatus/);
  assert.match(casesSource, /export function getCaseStatusLabel/);
});

test('CZ2-003 blocks local case status helpers and mojibake in CZ2 files', () => {
  for (const file of [canonical, config, cases, casesPage, caseDetail]) {
    const source = read(file);
    assert.doesNotMatch(source, /CASE_CASE_STATUS_OPTIONS/);
    assert.doesNotMatch(source, /CASE_CASE_CASE_STATUS_OPTIONS/);
    assert.doesNotMatch(source, /CASE_ITEM_ITEM_STATUS_OPTIONS/);
    assert.doesNotMatch(source, /CASE_CASE_ITEM_STATUS_OPTIONS/);
    assert.doesNotMatch(source, /caseStatusLabelLocal/);
    assert.doesNotMatch(source, /caseBadgeVariantLocal/);
    assert.doesNotMatch(source, /Ä|Ă|Ĺ|â€|�/);
  }
  assert.doesNotMatch(read(casesPage), /function\s+caseStatusLabel\s*\(/);
  assert.doesNotMatch(read(casesPage), /function\s+caseBadgeVariant\s*\(/);
  assert.doesNotMatch(read(caseDetail), /function\s+caseStatusLabel\s*\(/);
  assert.doesNotMatch(read(caseDetail), /function\s+caseBadgeVariant\s*\(/);
});
