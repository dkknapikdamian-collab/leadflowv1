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

const storageUpload = read('api/storage-upload.ts');
const storageHealth = read('api/storage-upload-health.ts');
const portalStorage = read('src/server/_portal-storage.ts');
const envExample = read('.env.example');
const readme = read('README.md');
const migrationPath = 'supabase/migrations/20260502_portal_uploads_storage_bucket.sql';
const docsPath = 'docs/P15_PORTAL_STORAGE_BUCKET.md';
const migration = read(migrationPath);
const docs = read(docsPath);
const pkg = JSON.parse(read('package.json'));

expect(exists(migrationPath), 'Supabase storage migration must exist');
expect(exists(docsPath), 'P15 storage documentation must exist');
expect(storageUpload.includes("requirePortalStorageServerConfig"), 'storage-upload must use shared portal storage config');
expect(storageUpload.includes("isAllowedPortalUploadFileType"), 'storage-upload must validate MIME types through shared helper');
expect(storageUpload.includes("config.maxBytes"), 'storage-upload must enforce configured max bytes');
expect(storageUpload.includes("config.serviceRoleKey"), 'storage-upload must use service role only on backend');
expect(!storageUpload.includes('VITE_SUPABASE_ANON_KEY'), 'storage-upload must not use public anon key for upload');
expect(!storageUpload.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY'), 'storage-upload must not use public anon key for upload');
expect(portalStorage.includes("DEFAULT_PORTAL_UPLOAD_BUCKET = 'portal-uploads'"), 'portal storage helper must default to portal-uploads');
expect(portalStorage.includes('PORTAL_UPLOAD_MAX_BYTES'), 'portal storage helper must support max size env');
expect(portalStorage.includes('PORTAL_UPLOAD_ALLOWED_MIME_TYPES'), 'portal storage helper must support MIME type env');
expect(portalStorage.includes('PORTAL_STORAGE_HEALTH_SECRET'), 'portal storage helper must support health endpoint secret');
expect(storageHealth.includes('x-closeflow-storage-check-secret'), 'storage health endpoint must require secret header');
expect(storageHealth.includes('PORTAL_STORAGE_BUCKET_MUST_NOT_BE_PUBLIC'), 'storage health endpoint must fail when bucket is public');
expect(storageHealth.includes('/storage/v1/bucket/'), 'storage health endpoint must check Supabase bucket metadata');
expect(envExample.includes('SUPABASE_PORTAL_BUCKET=portal-uploads'), '.env.example must document SUPABASE_PORTAL_BUCKET');
expect(envExample.includes('PORTAL_UPLOAD_MAX_BYTES=10485760'), '.env.example must document PORTAL_UPLOAD_MAX_BYTES');
expect(envExample.includes('PORTAL_UPLOAD_ALLOWED_MIME_TYPES='), '.env.example must document allowed MIME types');
expect(envExample.includes('PORTAL_STORAGE_HEALTH_SECRET='), '.env.example must document health secret');
expect(readme.includes('Portal upload: Supabase Storage'), 'README must document portal upload storage setup');
expect(readme.includes('/api/storage-upload-health'), 'README must document storage health endpoint');
expect(migration.includes("'portal-uploads'"), 'migration must target portal-uploads bucket');
expect(/public\s*=\s*false/.test(migration), 'migration must force private bucket');
expect(migration.includes('file_size_limit'), 'migration must set bucket file size limit');
expect(migration.includes('allowed_mime_types'), 'migration must set allowed MIME types');
expect(docs.includes('brak publicznego listowania'), 'docs must state no public listing');
expect(docs.includes('SUPABASE_SERVICE_ROLE_KEY'), 'docs must state backend/service role access');
expect(pkg.scripts && pkg.scripts['check:p15-portal-storage-bucket'], 'package.json missing check:p15-portal-storage-bucket');

if (fail.length) {
  console.error('P15 portal storage bucket guard failed.');
  for (const item of fail) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: P15 portal storage bucket guard passed.');
