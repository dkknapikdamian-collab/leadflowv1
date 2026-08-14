const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('B4 has one server AI access boundary before consolidated AI handlers', () => {
  const system = read('api/system.ts');
  const access = read('src/server/ai-access.ts');
  for (const operation of ['assistant_query', 'assistant_context', 'assistant', 'next_action', 'followup_draft', 'capture_draft']) {
    assert.match(system, new RegExp(`enforceAiRouteAccess\\([\\s\\S]{0,260}'${operation}'`));
  }
  assert.match(access, /requireRequestIdentity/);
  assert.match(access, /resolveRequestWorkspaceId/);
  assert.match(access, /assertWorkspaceAiAllowed/);
  assert.match(access, /consume_ai_usage/);
  assert.match(access, /AI_RATE_LIMIT_PER_MINUTE/);
  assert.doesNotMatch(access, /localStorage|window\.localStorage/);
});

test('B4 provider paths use server-side atomic usage and fail closed', () => {
  const access = read('src/server/ai-access.ts');
  const migration = read('supabase/migrations/20260810140000_b4_ai_usage_authority.sql');
  const capture = read('src/server/ai-capture.ts');
  assert.match(access, /AI_USAGE_STORE_UNAVAILABLE/);
  assert.match(access, /AI_USAGE_LIMIT_REACHED/);
  assert.match(access, /AI_RATE_LIMIT_REACHED/);
  assert.match(migration, /create table if not exists public\.ai_usage_events/);
  assert.match(migration, /pg_advisory_xact_lock/);
  assert.match(migration, /create or replace function public\.consume_ai_usage/);
  assert.match(migration, /create table if not exists public\.ai_draft_confirmation_claims/);
  assert.match(migration, /create or replace function public\.claim_ai_draft_confirmation/);
  assert.match(migration, /on conflict \(draft_id\) do nothing/);
  assert.match(capture, /tryGenerateJsonWithAiProvider/);
  assert.doesNotMatch(capture, /generativelanguage\.googleapis\.com/);
});

test('B4 draft confirmation has one server-side record writer and relation scope checks', () => {
  const system = read('api/system.ts');
  const page = read('src/pages/AiDrafts.tsx');
  const confirmation = read('src/server/ai-draft-confirmation.ts');
  assert.match(system, /kind === 'ai-drafts'[\s\S]*enforceAiRouteAccess/);
  assert.match(page, /confirmAiDraftInSupabase/);
  assert.doesNotMatch(page, /createLeadFromAiDraftApprovalInSupabase|insertTaskToSupabase|insertEventToSupabase|insertActivityToSupabase/);
  assert.match(confirmation, /assertRelation\('leads'/);
  assert.match(confirmation, /assertRelation\('cases'/);
  assert.match(confirmation, /assertRelation\('clients'/);
  assert.match(confirmation, /createFinalRecordFromAiDraft/);
  assert.match(read('src/server/ai-drafts.ts'), /claimAiDraftConfirmation/);
  assert.match(read('src/server/ai-drafts.ts'), /AI_DRAFT_CONFIRMATION_IN_PROGRESS/);
});

test('B4 ignores caller-provided assistant snapshots at the server boundary', () => {
  const assistant = read('src/server/ai-assistant.ts');
  const query = read('src/server/assistant-query-handler.ts');
  assert.match(assistant, /seed: undefined/);
  assert.match(query, /seed: undefined/);
  assert.match(query, /MAX_ASSISTANT_QUERY_BODY_BYTES = 64 \* 1024/);
});

test('B4 runtime tests are included in both release gates', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  const full = read('scripts/closeflow-release-check.cjs');
  assert.match(quiet, /tests\/b4-ai-access\.test\.cjs/);
  assert.match(quiet, /tests\/b4-ai-access-runtime\.test\.ts/);
  assert.match(full, /tests\/b4-ai-access\.test\.cjs/);
  assert.match(full, /tests\/b4-ai-access-runtime\.test\.ts/);
});
