const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE71_AI_DRAFT_ONLY_SAFETY_GUARD", "src/components/TodayAiAssistant.tsx", ["noAutoWrite", "Szkic", "saveAiLeadDraftAsync", "AI przygotowuje szkic. Ty zatwierdzasz zapis"]);
requireIncludes("STAGE71_AI_DRAFT_ONLY_SAFETY_GUARD", "src/pages/AiDrafts.tsx", ["handleApproveDraftToRecord", "status: 'converted'", "rawText: ''"]);
requireScript("STAGE71_AI_DRAFT_ONLY_SAFETY_GUARD", "check:stage71-ai-draft-only-safety-guard", "node scripts/check-stage71-ai-draft-only-safety-guard.cjs");
console.log('PASS STAGE71_AI_DRAFT_ONLY_SAFETY_GUARD');
