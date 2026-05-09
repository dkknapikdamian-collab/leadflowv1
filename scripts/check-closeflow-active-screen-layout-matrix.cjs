#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const marker = 'CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4';
const jsonRel = 'docs/ui/closeflow-active-screen-layout-matrix.generated.json';
const docRel = 'docs/ui/CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_2026-05-09.md';
const auditRel = 'scripts/audit-closeflow-active-screen-layout-matrix.cjs';
const checkRel = 'scripts/check-closeflow-active-screen-layout-matrix.cjs';

const requiredFields = [
  'route',
  'file',
  'PageShell',
  'PageHero',
  'MetricGrid',
  'MetricTile',
  'EntityIcon',
  'ActionIcon',
  'SurfaceCard',
  'ListRow',
  'ActionCluster',
  'FormFooter',
  'FinanceSnapshot',
  'legacyCss',
  'localOverrides',
  'status',
];

const expectedRoutes = [
  '/',
  '/today',
  '/leads',
  '/leads/:leadId',
  '/tasks',
  '/calendar',
  '/cases',
  '/cases/:caseId',
  '/clients',
  '/clients/:clientId',
  '/activity',
  '/ai-drafts',
  '/notifications',
  '/templates',
  '/response-templates',
  '/billing',
  '/settings',
];

function repoPath(rel) {
  return path.join(repo, rel);
}

function exists(rel) {
  return fs.existsSync(repoPath(rel));
}

function read(rel) {
  return fs.readFileSync(repoPath(rel), 'utf8');
}

function fail(message) {
  console.error('CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4_CHECK_FAIL: ' + message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function main() {
  for (const rel of [jsonRel, docRel, auditRel, checkRel, 'src/App.tsx', 'package.json']) {
    assert(exists(rel), 'missing file: ' + rel);
  }

  const payload = JSON.parse(read(jsonRel));
  const doc = read(docRel);
  const audit = read(auditRel);
  const pkg = JSON.parse(read('package.json'));

  assert(payload.marker === marker, 'json marker mismatch');
  assert(doc.includes(marker), 'doc marker missing');
  assert(audit.includes(marker), 'audit marker missing');
  assert(pkg.scripts && pkg.scripts['audit:closeflow-active-screen-layout-matrix'], 'package script audit missing');
  assert(pkg.scripts && pkg.scripts['check:closeflow-active-screen-layout-matrix'], 'package script check missing');
  assert(Array.isArray(payload.matrix), 'matrix is not array');
  assert(payload.matrix.length >= expectedRoutes.length, 'matrix has too few routes');
  assert(payload.source && payload.source.runtimeChanges === false, 'runtimeChanges must be false');
  assert(payload.source && payload.source.vs2c2Migration === 'deferred_not_touched', 'VS-2C-2 must remain deferred_not_touched');

  const byRoute = new Map(payload.matrix.map((row) => [row.route, row]));
  for (const route of expectedRoutes) {
    assert(byRoute.has(route), 'missing active route in matrix: ' + route);
  }

  for (const row of payload.matrix) {
    for (const field of requiredFields) {
      assert(Object.prototype.hasOwnProperty.call(row, field), 'row missing field ' + field + ' for route ' + row.route);
    }
    assert(Array.isArray(row.legacyCss), 'legacyCss must be array for route ' + row.route);
    assert(Array.isArray(row.localOverrides), 'localOverrides must be array for route ' + row.route);
    if (row.file) assert(typeof row.file === 'string' && row.file.startsWith('src/'), 'file must be src/* for route ' + row.route);
  }

  const protectedRoutes = payload.matrix.filter((row) => row.status === 'protected').length;
  const readableFiles = payload.matrix.filter((row) => row.sourceStatus === 'read').length;
  const legacyRows = payload.matrix.filter((row) => row.legacyCss.length > 0).length;
  const overrideRows = payload.matrix.filter((row) => row.localOverrides.length > 0).length;

  assert(protectedRoutes >= 10, 'too few protected routes detected');
  assert(readableFiles >= 10, 'too few readable screen files detected');

  console.log('CLOSEFLOW_ACTIVE_SCREEN_LAYOUT_MATRIX_VS4_CHECK_OK');
  console.log('route_count=' + payload.matrix.length);
  console.log('protected_route_count=' + protectedRoutes);
  console.log('readable_screen_file_rows=' + readableFiles);
  console.log('legacy_css_rows_non_blocking=' + legacyRows);
  console.log('local_override_rows_non_blocking=' + overrideRows);
}

main();
