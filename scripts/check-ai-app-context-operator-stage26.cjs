const fs = require('node:fs');
const path = require('node:path');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function assertIncludes(file, needle) {
  const content = read(file);
  if (!content.includes(needle)) {
    throw new Error(`${file} missing required marker/text: ${needle}`);
  }
}

assertIncludes('src/server/ai-application-operator.ts', 'AI_APP_CONTEXT_OPERATOR_STAGE26');
assertIncludes('src/server/ai-application-operator.ts', 'Nie znalazłem tego w danych aplikacji.');
assertIncludes('src/server/ai-application-operator.ts', 'buildAiApplicationOperatorAnswer');
assertIncludes('src/server/ai-application-operator.ts', 'dedupeIncrementalTranscript');
assertIncludes('api/assistant.ts', "from '../src/server/ai-application-operator.js'");
assertIncludes('api/assistant-context.ts', "from '../src/server/assistant-context.js'");
assertIncludes('src/lib/ai-assistant.ts', '/api/assistant');
assertIncludes('src/lib/ai-assistant.ts', 'mode?:');
assertIncludes('src/lib/ai-assistant.ts', 'draft?:');
assertIncludes('src/components/TodayAiAssistant.tsx', "useState<AiDirectWriteMode>('draft_only')");
assertIncludes('src/components/GlobalAiAssistant.tsx', 'workspaceId: (appContext as any).workspaceId || workspace.id');
console.log('PASS check-ai-app-context-operator-stage26');
