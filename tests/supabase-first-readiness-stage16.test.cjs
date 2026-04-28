const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));

test('Stage16 keeps AI server helpers consolidated', () => {
  assert.equal(exists('api/ai-drafts.ts'), false);
  assert.equal(exists('api/assistant-context.ts'), false);
  assert.match(read('api/system.ts'), /ai-drafts|assistant-context|aiDrafts|assistantContext/);
});

test('Stage16 keeps shared AI draft Supabase helpers', () => {
  const source = read('src/lib/supabase-fallback.ts');
  assert.match(source, /fetchAiDraftsFromSupabase/);
  assert.match(source, /insertAiDraftToSupabase|createAiDraftInSupabase/);
  assert.match(source, /updateAiDraftInSupabase/);
});

test('Stage16 marks Firebase Auth migration as pending', () => {
  assert.equal(read('src/firebase.ts').includes('firebase/auth'), true);
  assert.match(read('docs/STAGE16_SUPABASE_FIRST_READINESS_GUARD_2026-04-28.md'), /PENDING_SUPABASE_AUTH_MIGRATION/);
});

test('Stage16 doc encoding is clean', () => {
  const doc = read('docs/STAGE16_SUPABASE_FIRST_READINESS_GUARD_2026-04-28.md');
  for (const token of ['\u00c4', '\u00c5', '\u00c3', '\u00c2', '\ufffd']) assert.equal(doc.includes(token), false, token);
});
