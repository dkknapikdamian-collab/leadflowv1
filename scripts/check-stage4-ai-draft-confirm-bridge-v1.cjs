// AI_DRAFT_CONFIRM_BRIDGE_STAGE4
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing file: ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function pass(msg) { console.log(`PASS ${msg}`); }
function mustContain(rel, text) {
  const content = read(rel);
  if (!content.includes(text)) throw new Error(`${rel} missing marker/text: ${text}`);
  pass(`${rel} contains ${text}`);
}
function mustNotContain(rel, text) {
  const content = read(rel);
  if (content.includes(text)) throw new Error(`${rel} must not contain: ${text}`);
  pass(`${rel} does not contain ${text}`);
}

mustContain('src/lib/ai-draft-assistant-bridge.ts', 'AI_DRAFT_CONFIRM_BRIDGE_STAGE4');
mustContain('src/lib/ai-drafts.ts', 'AI_DRAFT_CONFIRM_BRIDGE_STAGE4');
mustContain('src/lib/ai-drafts.ts', 'saveAiLeadDraftAsync');
mustContain('src/lib/ai-drafts.ts', 'createAiDraftInSupabase');
mustContain('src/lib/ai-drafts.ts', 'LEGACY_STAGE3_STORAGE_KEY');
mustContain('src/components/TodayAiAssistant.tsx', 'saveAiLeadDraftAsync');
mustContain('src/components/TodayAiAssistant.tsx', 'assistantDraftToAiLeadDraftInput');
mustContain('src/components/TodayAiAssistant.tsx', 'Finalny rekord nie został utworzony');
mustNotContain('src/components/TodayAiAssistant.tsx', 'saveLocalAiDraft(data.draft)');
mustContain('src/server/ai-assistant.ts', 'status: "pending_review"');
mustContain('api/assistant/query.ts', 'buildAssistantContextFromRequest');

console.log('PASS STAGE4_AI_DRAFT_CONFIRM_BRIDGE_V1');
