const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/lib/ai-drafts.ts'), 'utf8');

test('Stage13 AI drafts use Supabase sync as shared source across devices', () => {
  assert.match(source, /AI_DRAFTS_SUPABASE_SYNC_STAGE13/);
  assert.match(source, /mergeRemoteAndLocalDrafts/);
  assert.match(source, /pushAiLeadDraftToSupabase/);
  assert.match(source, /syncLocalAiDraftsToSupabase/);
  assert.match(source, /latestLocalDrafts/);
});

test('Stage13 avoids double remote draft creation in async save', () => {
  assert.doesNotMatch(source, /const localDraft = saveAiLeadDraft\(input\)/);
  assert.match(source, /export async function saveAiLeadDraftAsync/);
  assert.match(source, /return await pushAiLeadDraftToSupabase\(draft\)/);
});

test('Stage13 keeps local unsynced fallback without hiding remote drafts', () => {
  assert.match(source, /const mergedDrafts = mergeRemoteAndLocalDrafts\(remoteDrafts, latestLocalDrafts\)/);
  assert.match(source, /persistAiLeadDrafts\(mergedDrafts\)/);
  assert.match(source, /return !draft\.remoteSynced/);
});

test('Stage13 sync file keeps Polish encoding clean', () => {
  assert.doesNotMatch(source, /Ä|Ĺ|Å|Ã/u);
});
