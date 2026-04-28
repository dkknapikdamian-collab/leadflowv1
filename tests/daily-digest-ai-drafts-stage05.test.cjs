const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('daily digest includes AI drafts without adding Vercel API functions', () => {
  const digest = read('src/server/_digest.ts');
  const api = read('api/daily-digest.ts');
  const apiFiles = fs.readdirSync(path.join(root, 'api')).filter((name) => name.endsWith('.ts'));

  assert.match(digest, /DAILY_DIGEST_AI_DRAFTS_STAGE05/);
  assert.match(digest, /pendingAiDrafts/);
  assert.match(digest, /aiDraftCount/);
  assert.match(digest, /Szkice AI do sprawdzenia/);
  assert.match(api, /AI_DRAFTS_DAILY_DIGEST_STAGE05_API/);
  assert.match(api, /ai_drafts\?select=\*/);
  assert.ok(!apiFiles.includes('daily-digest-ai-drafts.ts'), 'Stage 05 must not add another api/*.ts file');
});
