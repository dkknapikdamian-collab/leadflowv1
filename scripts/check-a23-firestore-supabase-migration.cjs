#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function read(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function expect(condition, message) {
  if (!condition) fail.push(message);
}

const requiredFiles = [
  'docs/FIRESTORE_TO_SUPABASE_MIGRATION.md',
  'docs/STAGE_A23_FIRESTORE_TO_SUPABASE_DECISION.md',
  'scripts/export-firestore-data.cjs',
  'scripts/import-supabase-data.cjs',
];

for (const file of requiredFiles) {
  expect(exists(file), file + ' is missing');
}

if (exists('docs/FIRESTORE_TO_SUPABASE_MIGRATION.md')) {
  const doc = read('docs/FIRESTORE_TO_SUPABASE_MIGRATION.md');
  expect(doc.includes('B: stare dane traktujemy jako testowe i startujemy czysto w Supabase'), 'migration doc must record clean start decision');
  expect(doc.includes('DRY_RUN'), 'migration doc must describe DRY_RUN mode');
  expect(doc.includes('IMPORT'), 'migration doc must describe IMPORT mode');
  expect(doc.includes('ownerId') && doc.includes('user_id'), 'migration doc must map ownerId -> user_id');
  expect(doc.includes('workspaceId') && doc.includes('workspace_id'), 'migration doc must map workspaceId -> workspace_id');
  expect(doc.includes('leadId') && doc.includes('lead_id'), 'migration doc must map leadId -> lead_id');
  expect(doc.includes('caseId') && doc.includes('case_id'), 'migration doc must map caseId -> case_id');
  expect(doc.includes('Nie kasujemy Firestore bez backupu'), 'migration doc must forbid deleting Firestore without backup');
  expect(doc.includes('migration-reports/a23-last-report.json'), 'migration doc must mention report output');
}

if (exists('scripts/import-supabase-data.cjs')) {
  const importer = read('scripts/import-supabase-data.cjs');
  expect(importer.includes("A23_MODE") && importer.includes("DRY_RUN") && importer.includes("IMPORT"), 'importer must support DRY_RUN and IMPORT');
  expect(importer.includes("A23_DECISION") && importer.includes("CLEAN_START") && importer.includes("MIGRATE_FIRESTORE"), 'importer must support decision lock');
  expect(importer.includes("A23_IMPORT_CONFIRM") && importer.includes("IMPORT_FIRESTORE_TO_SUPABASE"), 'IMPORT must require explicit confirmation');
  expect(importer.includes("ownerId") && importer.includes("user_id"), 'importer must map ownerId -> user_id');
  expect(importer.includes("workspaceId") && importer.includes("workspace_id"), 'importer must map workspaceId -> workspace_id');
  expect(importer.includes("leadId") && importer.includes("lead_id"), 'importer must map leadId -> lead_id');
  expect(importer.includes("caseId") && importer.includes("case_id"), 'importer must map caseId -> case_id');
  expect(importer.includes("duplicates"), 'importer must log duplicates');
  expect(importer.includes("missingRelations"), 'importer must report relation warnings');
  expect(importer.includes("migration-reports/a23-last-report.json"), 'importer must write report');
  expect(importer.includes("SUPABASE_SERVICE_ROLE_KEY"), 'importer must use server-only Supabase key for IMPORT');
}

if (exists('scripts/export-firestore-data.cjs')) {
  const exporter = read('scripts/export-firestore-data.cjs');
  expect(exporter.includes("firebase-admin"), 'exporter must use optional firebase-admin export path');
  expect(exporter.includes("FIREBASE_SERVICE_ACCOUNT_JSON_PATH"), 'exporter must require service account path for real export');
  expect(exporter.includes("deleteFirestore: false") || exporter.includes("Nothing was deleted"), 'exporter must not delete Firestore data');
}

const pkg = JSON.parse(read('package.json'));
const scripts = pkg.scripts || {};
expect(Boolean(scripts['data:firestore:export']), 'package.json missing data:firestore:export');
expect(Boolean(scripts['data:supabase:import']), 'package.json missing data:supabase:import');
expect(Boolean(scripts['data:migration:a23:dry-run']), 'package.json missing data:migration:a23:dry-run');
expect(Boolean(scripts['check:a23-firestore-supabase-migration']), 'package.json missing check:a23-firestore-supabase-migration');

if (fail.length) {
  console.error('A23 Firestore -> Supabase migration guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: A23 Firestore -> Supabase migration/clean-start guard passed.');
