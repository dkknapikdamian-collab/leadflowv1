#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const results = [];

const allowedStatuses = new Set([
  'fallback_allowed_pending_migration_evidence',
  'migration_evidence_required_before_required',
  'ready_to_remove_fallback',
]);

function pass(scope, message) { results.push({ level: 'PASS', scope, message }); }
function fail(scope, message) { results.push({ level: 'FAIL', scope, message }); }

function readRequired(relativePath) {
  const fullPath = path.join(root, relativePath);
  if (!fs.existsSync(fullPath)) {
    fail(relativePath, 'Missing required file: ' + relativePath);
    return '';
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function assertIncludes(scope, content, needle, message) {
  if (content.includes(needle)) pass(scope, message || 'Found: ' + needle);
  else fail(scope, (message || 'Missing: ' + needle) + ' [needle=' + JSON.stringify(needle) + ']');
}

function extractSetColumns(source, constName) {
  const regex = new RegExp('const\\s+' + constName + '\\s*=\\s*new\\s+Set\\s*\\(\\s*\\[([\\s\\S]*?)\\]\\s*\\)', 'm');
  const match = source.match(regex);
  if (!match) {
    fail('api/leads.ts', 'Could not parse ' + constName);
    return [];
  }
  return [...match[1].matchAll(/'([^']+)'/g)].map((item) => item[1]);
}

function parseEvidenceRows(doc) {
  const map = new Map();
  const lines = doc.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed.includes('| table |') || trimmed.includes('|---')) continue;

    const cells = trimmed
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 4) continue;
    const [table, rawColumn, status, reason] = cells;
    const column = rawColumn.replace(/^`|`$/g, '');
    if (!table || !column) continue;
    map.set(table + '.' + column, { table, column, status, reason });
  }
  return map;
}

function checkEvidence(table, columns, evidence) {
  for (const column of columns) {
    const key = table + '.' + column;
    const row = evidence.get(key);
    if (!row) {
      fail('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', 'Missing evidence row for ' + key);
      continue;
    }
    pass('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', 'Evidence row exists for ' + key);

    if (allowedStatuses.has(row.status)) {
      pass('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', 'Allowed status for ' + key + ': ' + row.status);
    } else {
      fail('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', 'Invalid status for ' + key + ': ' + row.status);
    }

    if (row.reason && row.reason.length >= 20) {
      pass('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', 'Reason present for ' + key);
    } else {
      fail('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', 'Reason too short for ' + key);
    }
  }
}

function section(title) {
  console.log('\n== ' + title + ' ==');
}

const leadsApi = readRequired('api/leads.ts');
const doc = readRequired('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md');
const pkgRaw = readRequired('package.json');
const quiet = readRequired('scripts/closeflow-release-check-quiet.cjs');

section('Extract optional fallback columns');
const leadColumns = extractSetColumns(leadsApi, 'OPTIONAL_LEAD_COLUMNS');
const caseColumns = extractSetColumns(leadsApi, 'OPTIONAL_CASE_COLUMNS');
const activityColumns = extractSetColumns(leadsApi, 'OPTIONAL_ACTIVITY_COLUMNS');

if (leadColumns.length) pass('api/leads.ts', 'Parsed OPTIONAL_LEAD_COLUMNS: ' + leadColumns.length);
if (caseColumns.length) pass('api/leads.ts', 'Parsed OPTIONAL_CASE_COLUMNS: ' + caseColumns.length);
if (activityColumns.length) pass('api/leads.ts', 'Parsed OPTIONAL_ACTIVITY_COLUMNS: ' + activityColumns.length);

section('Evidence document contract');
assertIncludes('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', doc, 'DO NOT PROMOTE WITHOUT EVIDENCE', 'Doc blocks promotion without evidence');
assertIncludes('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', doc, 'fallback_allowed_pending_migration_evidence', 'Doc contains fallback pending status');
assertIncludes('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', doc, 'ready_to_remove_fallback', 'Doc contains remove-ready status');
assertIncludes('docs/architecture/OPTIONAL_COLUMNS_EVIDENCE_STAGE03D.md', doc, 'Next Stage03E candidate', 'Doc gives next target');

const evidence = parseEvidenceRows(doc);
checkEvidence('leads', leadColumns, evidence);
checkEvidence('cases', caseColumns, evidence);
checkEvidence('activities', activityColumns, evidence);

section('Package and quiet gate');
let pkg = {};
try {
  pkg = JSON.parse(pkgRaw);
  pass('package.json', 'package.json parses');
} catch (error) {
  fail('package.json', 'package.json parse failed: ' + (error instanceof Error ? error.message : String(error)));
}

if (pkg.scripts && pkg.scripts['check:stage03d-optional-columns-evidence'] === 'node scripts/check-stage03d-optional-columns-evidence.cjs') {
  pass('package.json', 'check:stage03d-optional-columns-evidence is wired');
} else {
  fail('package.json', 'Missing check:stage03d-optional-columns-evidence script');
}

if (pkg.scripts && pkg.scripts['test:stage03d-optional-columns-evidence'] === 'node --test tests/stage03d-optional-columns-evidence.test.cjs') {
  pass('package.json', 'test:stage03d-optional-columns-evidence is wired');
} else {
  fail('package.json', 'Missing test:stage03d-optional-columns-evidence script');
}

assertIncludes('scripts/closeflow-release-check-quiet.cjs', quiet, 'tests/stage03d-optional-columns-evidence.test.cjs', 'Quiet release gate includes Stage03D test');

section('Report');
for (const item of results) console.log(item.level + ' ' + item.scope + ': ' + item.message);
const failed = results.filter((item) => item.level === 'FAIL');
console.log('\nSummary: ' + (results.length - failed.length) + ' pass, ' + failed.length + ' fail.');
if (failed.length) {
  console.error('\nFAIL Stage03D optional columns evidence guard failed.');
  process.exit(1);
}
console.log('\nPASS Stage03D optional columns evidence guard');
