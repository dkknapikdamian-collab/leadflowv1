const fs = require('node:fs');
const path = require('node:path');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function exists(rel) {
  return fs.existsSync(path.join(process.cwd(), rel));
}

function assertIncludes(file, needle) {
  const content = read(file);
  if (!content.includes(needle)) {
    throw new Error(`${file} missing required marker/text: ${needle}`);
  }
}

function assertMissing(file) {
  if (exists(file)) {
    throw new Error(`${file} must not exist (API consolidation keeps Vercel function count low)`);
  }
}

// Stage 26: AI app context operator is present on the server side.
assertIncludes('src/server/ai-application-operator.ts', 'AI_APP_CONTEXT_OPERATOR_STAGE26');
assertIncludes('src/server/ai-application-operator.ts', 'Nie znalaz\u0142em tego w danych aplikacji.');
assertIncludes('src/server/ai-application-operator.ts', 'buildAiApplicationOperatorAnswer');
assertIncludes('src/server/ai-application-operator.ts', 'dedupeIncrementalTranscript');

// Consolidation: do not keep separate /api/assistant*.ts functions (Vercel Hobby limit).
assertMissing('api/assistant.ts');
assertMissing('api/assistant-context.ts');
assertIncludes('api/system.ts', "kind === 'assistant-context'");
assertIncludes('api/system.ts', "kind === 'ai-assistant'");
assertIncludes('vercel.json', '"source":  "/api/assistant"');
assertIncludes('vercel.json', '"destination":  "/api/system?kind=ai-assistant"');
assertIncludes('vercel.json', '"source":  "/api/assistant-context"');
assertIncludes('vercel.json', '"destination":  "/api/system?kind=assistant-context"');

// Client contract: AI assistant goes through the consolidated system API.
assertIncludes('src/lib/ai-assistant.ts', '/api/system?kind=ai-assistant');
assertIncludes('src/lib/ai-assistant.ts', 'mode?:');
assertIncludes('src/lib/ai-assistant.ts', 'draft?:');
assertIncludes('src/lib/supabase-fallback.ts', '/api/system?kind=assistant-context');

// UI wiring stays in place.
assertIncludes('src/components/TodayAiAssistant.tsx', "useState<AiDirectWriteMode>('draft_only')");
assertIncludes('src/components/GlobalAiAssistant.tsx', 'workspaceId: (appContext as any).workspaceId || workspace.id');

console.log('PASS check-ai-app-context-operator-stage26');
