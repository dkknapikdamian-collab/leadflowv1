// AI_DRAFT_CONFIRM_BRIDGE_STAGE4
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

test('assistant write intent is persisted through shared AI Drafts pipeline', () => {
  const assistant = read('src/components/TodayAiAssistant.tsx');
  assert.match(assistant, /saveAiLeadDraftAsync/);
  assert.match(assistant, /assistantDraftToAiLeadDraftInput/);
  assert.doesNotMatch(assistant, /saveLocalAiDraft\(data\.draft\)/);
});

test('ai-drafts keeps Supabase as source of truth and dev-only local fallback', () => {
  const drafts = read('src/lib/ai-drafts.ts');
  assert.match(drafts, /createAiDraftInSupabase/);
  assert.match(drafts, /fetchAiDraftsFromSupabase/);
  assert.match(drafts, /updateAiDraftInSupabase/);
  assert.match(drafts, /canUseDevLocalDraftFallback/);
  assert.match(drafts, /clearProductionLocalDrafts/);
});

test('legacy stage3 local drafts can be migrated instead of disappearing', () => {
  const drafts = read('src/lib/ai-drafts.ts');
  assert.match(drafts, /LEGACY_STAGE3_STORAGE_KEY/);
  assert.match(drafts, /readLegacyStage3DraftsUnsafe/);
  assert.match(drafts, /migratedFrom/);
});
