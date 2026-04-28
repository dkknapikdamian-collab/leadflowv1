const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

test('AI operator stage 06 keeps local app answers out of daily AI usage limit', () => {
  const front = read('src/components/TodayAiAssistant.tsx');
  const types = read('src/lib/ai-assistant.ts');
  const server = read('src/server/ai-assistant.ts');

  assert.match(front, /AI_OPERATOR_QUALITY_STAGE06_COST_GUARD/);
  assert.match(front, /function shouldRegisterAiUsage/);
  assert.match(types, /AI_OPERATOR_QUALITY_STAGE06_TYPES/);
  assert.match(types, /operatorSnapshot\?: Record<string, unknown>/);
  assert.match(types, /costGuard\?:/);
  assert.match(server, /AI_OPERATOR_QUALITY_STAGE06_DRAFT_BRIEFING/);
  assert.match(server, /wantsDraftReview/);
  assert.match(server, /return buildDraftReviewAnswer\(context, rawText\)/);
  assert.match(server, /costGuard: 'local_rules'/);
});
