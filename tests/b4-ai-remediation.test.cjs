const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('B4 remediation keeps Quick Lead on the canonical server confirmation path', () => {
  const component = read('src/components/quick-lead/QuickLeadCaptureModal.tsx');
  assert.match(component, /confirmAiDraftInSupabase/);
  assert.doesNotMatch(component, /insertLeadToSupabase|insertTaskToSupabase/);
});

test('B4 remediation rejects caller context and untrusted draft attribution', () => {
  const assistant = read('src/server/assistant-context.ts');
  const drafts = read('src/server/ai-drafts.ts');
  const legacy = read('src/server/drafts.ts');
  assert.match(assistant, /seed: undefined/);
  assert.doesNotMatch(assistant, /x-forwarded-host.*getHeader|host.*x-forwarded-host/);
  assert.match(drafts, /assertDraftConfirmable/);
  assert.match(drafts, /verifiedUserId/);
  assert.doesNotMatch(drafts, /body\.userId|body\.user_id/);
  assert.match(legacy, /assertDraftConfirmable/);
  assert.match(legacy, /verifiedUserId/);
  assert.doesNotMatch(legacy, /body\.userId/);
});

test('B4 remediation has record idempotency keys and recoverable claims', () => {
  const confirmation = read('src/server/ai-draft-confirmation.ts');
  const migration = read('supabase/migrations/20260810150000_b4_ai_draft_confirmation_idempotency.sql');
  assert.match(confirmation, /ai_draft_id/);
  assert.match(confirmation, /findFinalRecordByDraftId/);
  assert.match(migration, /add column if not exists ai_draft_id/);
  assert.match(migration, /unique index if not exists .*ai_draft_id_uidx/);
  assert.match(migration, /expires_at/);
  assert.match(migration, /delete from public\.ai_draft_confirmation_claims/);
});

test('B4 AI access requires verified email for email/password identities', () => {
  const access = read('src/server/ai-access.ts');
  assert.match(access, /assertSupabaseEmailVerifiedForMutation/);
});
