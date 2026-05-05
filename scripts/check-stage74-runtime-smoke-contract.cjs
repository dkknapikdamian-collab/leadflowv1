const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE74_RUNTIME_SMOKE_CONTRACT", "src/App.tsx", ["TodayStable", "TasksStable", "AiDrafts", "Billing", "NotificationRuntime", "PwaInstallPrompt"]);
requireIncludes("STAGE74_RUNTIME_SMOKE_CONTRACT", "src/pages/TodayStable.tsx", ["fetchLeadsFromSupabase", "subscribeCloseflowDataMutations"]);
requireIncludes("STAGE74_RUNTIME_SMOKE_CONTRACT", "src/pages/TasksStable.tsx", ["insertTaskToSupabase", "updateTaskInSupabase", "deleteTaskFromSupabase"]);
requireIncludes("STAGE74_RUNTIME_SMOKE_CONTRACT", "public/manifest.webmanifest", ["Close Flow", "/tasks", "/calendar"]);
requireScript("STAGE74_RUNTIME_SMOKE_CONTRACT", "check:stage74-runtime-smoke-contract", "node scripts/check-stage74-runtime-smoke-contract.cjs");
console.log('PASS STAGE74_RUNTIME_SMOKE_CONTRACT');
