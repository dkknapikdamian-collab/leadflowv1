const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE75_SOURCE_OF_TRUTH_GUARD", "src/lib/plans.ts", ["TRIAL_DAYS = 21", "PLAN_FEATURE_MINIMUM_PLANS", "googleCalendar: PLAN_IDS.pro", "fullAi: PLAN_IDS.ai"]);
requireIncludes("STAGE75_SOURCE_OF_TRUTH_GUARD", "src/components/TodayAiAssistant.tsx", ["AI_WRITE_COMMAND_WORDS", "buildClientLeadCaptureDraftAnswer", "noAutoWrite"]);
requireIncludes("STAGE75_SOURCE_OF_TRUTH_GUARD", "src/pages/AiDrafts.tsx", ["handleApproveDraftToRecord", "markAiLeadDraftConvertedAsync"]);
requireScript("STAGE75_SOURCE_OF_TRUTH_GUARD", "check:stage75-source-of-truth-guard", "node scripts/check-stage75-source-of-truth-guard.cjs");
console.log('PASS STAGE75_SOURCE_OF_TRUTH_GUARD');
