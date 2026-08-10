const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('B6 consolidates portal upload paths behind one scoped policy service', () => {
  const storage = read('api/storage-upload.ts');
  const caseItems = read('api/case-items.ts');
  const service = read('src/server/portal-upload.ts');
  assert.match(storage, /uploadPortalFileWithPolicy/);
  assert.match(caseItems, /uploadPortalFileWithPolicy/);
  assert.match(service, /requirePortalSessionContext/);
  assert.match(service, /requireCaseItemInCase/);
  assert.match(service, /closeflow_portal_upload_admit/);
  assert.match(service, /closeflow_portal_upload_finalize/);
  assert.doesNotMatch(caseItems, /x-upsert.*true/);
  assert.doesNotMatch(caseItems, /Date\.now\(\)/);
});

test('B6 has explicit server-side type, size, quota and rate boundaries', () => {
  const service = read('src/server/portal-upload.ts');
  const storage = read('src/server/_portal-storage.ts');
  const migration = read('supabase/migrations/20260810170000_b6_portal_upload_admission_scope_quota.sql');
  assert.match(service, /PORTAL_FILE_TYPE_NOT_ALLOWED/);
  assert.match(service, /PORTAL_FILE_SIZE_MISMATCH/);
  assert.match(storage, /dailyQuotaBytes/);
  assert.match(storage, /windowUploadCount/);
  assert.match(migration, /PORTAL_PARENT_SCOPE_REQUIRED/);
  assert.match(migration, /PORTAL_UPLOAD_IDEMPOTENCY_CONFLICT/);
  assert.match(migration, /PORTAL_UPLOAD_QUOTA_EXCEEDED/);
  assert.match(migration, /PORTAL_UPLOAD_RATE_LIMIT/);
  assert.match(migration, /unique index if not exists portal_upload_admissions_workspace_key_uidx/);
});

test('B6 storage admission tables are service-only and RLS protected', () => {
  const migration = read('supabase/migrations/20260810170000_b6_portal_upload_admission_scope_quota.sql');
  assert.match(migration, /alter table public\.portal_upload_usage enable row level security/);
  assert.match(migration, /alter table public\.portal_upload_admissions enable row level security/);
  assert.match(migration, /revoke all on table public\.portal_upload_usage, public\.portal_upload_admissions from public, anon, authenticated/);
  assert.match(migration, /grant execute on function public\.closeflow_portal_upload_admit/);
  assert.match(migration, /grant execute on function public\.closeflow_portal_upload_finalize/);
});
