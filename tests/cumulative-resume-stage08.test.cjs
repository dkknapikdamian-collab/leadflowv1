const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const root = path.resolve(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
test('Stage08 keeps AI draft inbox safe while allowing approved lead creation through alias', () => {
  const page = read('src/pages/AiDrafts.tsx');
  const api = read('src/lib/supabase-fallback.ts');
  assert.ok(!page.includes('insertLeadToSupabase'));
  assert.match(page, /createLeadFromAiDraftApprovalInSupabase/);
  assert.match(api, /createLeadFromAiDraftApprovalInSupabase/);
});
