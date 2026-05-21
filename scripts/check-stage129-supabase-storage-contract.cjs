#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const fail = [];

function p(file) { return path.join(root, file); }
function exists(file) { return fs.existsSync(p(file)); }
function read(file) {
  if (!exists(file)) {
    fail.push(`Missing file: ${file}`);
    return '';
  }
  return fs.readFileSync(p(file), 'utf8');
}
function expect(condition, message) { if (!condition) fail.push(message); }

const files = {
  clientPortal: 'src/pages/ClientPortal.tsx',
  fallback: 'src/lib/supabase-fallback.ts',
  storageUpload: 'api/storage-upload.ts',
  storageHealth: 'api/storage-upload-health.ts',
  portalStorage: 'src/server/_portal-storage.ts',
  caseItems: 'api/case-items.ts',
  migration: 'supabase/migrations/20260502_portal_uploads_storage_bucket.sql',
  p15Docs: 'docs/P15_PORTAL_STORAGE_BUCKET.md',
  envExample: '.env.example',
  readme: 'README.md',
  stage129Report: '_project/runs/2026-05-21_stage129_supabase_storage_buckets_policies_after_migration.md',
  obsidianUpdate: 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_Lead_App/2026-05-21 - CloseFlow Stage129 Supabase Storage buckets policies after migration.md',
};

const clientPortal = read(files.clientPortal);
const fallback = read(files.fallback);
const storageUpload = read(files.storageUpload);
const storageHealth = read(files.storageHealth);
const portalStorage = read(files.portalStorage);
const caseItems = read(files.caseItems);
const migration = read(files.migration);
const p15Docs = read(files.p15Docs);
const envExample = read(files.envExample);
const readme = read(files.readme);
const pkgRaw = read('package.json');
let pkg = {};
try { pkg = JSON.parse(pkgRaw); } catch { fail.push('package.json must be valid JSON'); }

expect(clientPortal.includes('uploadPortalFileInSupabase'), 'ClientPortal must use uploadPortalFileInSupabase for portal file upload');
expect(clientPortal.includes('PORTAL_FILE_SIZE_LIMIT'), 'ClientPortal must keep a file size limit UX guard');
expect(fallback.includes("'/api/storage-upload'"), 'supabase-fallback must call /api/storage-upload');
expect(fallback.includes('submitPortalCaseItemInSupabase'), 'supabase-fallback must patch case item after upload');

expect(storageUpload.includes('requirePortalSessionContext'), 'api/storage-upload must validate portal session before upload');
expect(storageUpload.includes('requirePortalStorageServerConfig'), 'api/storage-upload must use shared storage config');
expect(storageUpload.includes('isAllowedPortalUploadFileType'), 'api/storage-upload must validate MIME type using shared helper');
expect(storageUpload.includes('sanitizePortalUploadFileName'), 'api/storage-upload must sanitize file name using shared helper');
expect(storageUpload.includes('config.maxBytes'), 'api/storage-upload must enforce configured maxBytes');
expect(storageUpload.includes('config.serviceRoleKey'), 'api/storage-upload must use backend service role key');
expect(storageUpload.includes('/storage/v1/object/'), 'api/storage-upload must call Supabase Storage object API');
expect(storageUpload.includes('encodeStorageObjectPath'), 'api/storage-upload must encode path segments, not raw user file names');
expect(!storageUpload.includes('VITE_SUPABASE_ANON_KEY'), 'api/storage-upload must not use public VITE_SUPABASE_ANON_KEY');
expect(!storageUpload.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), 'api/storage-upload must not use public NEXT_PUBLIC_SUPABASE_ANON_KEY');

expect(storageHealth.includes('x-closeflow-storage-check-secret'), 'storage health endpoint must require the secret header');
expect(storageHealth.includes('PORTAL_STORAGE_BUCKET_MUST_NOT_BE_PUBLIC'), 'storage health endpoint must fail when bucket is public');
expect(storageHealth.includes('/storage/v1/bucket/'), 'storage health endpoint must inspect Supabase bucket metadata');
expect(storageHealth.includes('config.serviceRoleKey'), 'storage health endpoint must use backend service role key');

expect(portalStorage.includes("DEFAULT_PORTAL_UPLOAD_BUCKET = 'portal-uploads'"), 'portal storage default bucket must be portal-uploads');
expect(portalStorage.includes('PORTAL_UPLOAD_MAX_BYTES'), 'portal storage config must support PORTAL_UPLOAD_MAX_BYTES');
expect(portalStorage.includes('PORTAL_UPLOAD_ALLOWED_MIME_TYPES'), 'portal storage config must support allowed MIME types');
expect(portalStorage.includes('PORTAL_STORAGE_HEALTH_SECRET'), 'portal storage config must support health secret');

expect(migration.includes("'portal-uploads'"), 'migration must target portal-uploads');
expect(/public\s*=\s*false/.test(migration) || /false,\s*10485760/.test(migration), 'migration must force public=false');
expect(migration.includes('file_size_limit'), 'migration must configure file_size_limit');
expect(migration.includes('allowed_mime_types'), 'migration must configure allowed_mime_types');
expect(migration.includes('Do not create public'), 'migration must document no public storage policies');

expect(p15Docs.includes('brak publicznego listowania'), 'P15 docs must state no public listing');
expect(p15Docs.includes('SUPABASE_SERVICE_ROLE_KEY'), 'P15 docs must state service role upload model');
expect(envExample.includes('SUPABASE_PORTAL_BUCKET=portal-uploads'), '.env.example must document SUPABASE_PORTAL_BUCKET');
expect(envExample.includes('PORTAL_UPLOAD_MAX_BYTES=10485760'), '.env.example must document upload max bytes');
expect(envExample.includes('PORTAL_STORAGE_HEALTH_SECRET='), '.env.example must document storage health secret');
expect(readme.includes('Portal upload: Supabase Storage'), 'README must document portal upload storage setup');

expect(caseItems.includes('uploadPortalFile'), 'api/case-items currently contains legacy inline portal upload code that must be recorded in Stage129 report');
expect(exists(files.stage129Report), 'Stage129 run report must exist');
expect(exists(files.obsidianUpdate), 'Stage129 Obsidian update file must exist under OBSIDIAN_UPDATE');
expect(pkg.scripts && pkg.scripts['check:p15-portal-storage-bucket'], 'package.json must keep check:p15-portal-storage-bucket');
expect(pkg.scripts && pkg.scripts['check:stage129-supabase-storage-contract'], 'package.json must include check:stage129-supabase-storage-contract');

if (fail.length) {
  console.error('Stage129 Supabase storage contract failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: Stage129 Supabase storage contract passed.');
