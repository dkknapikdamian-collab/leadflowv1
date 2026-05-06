const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

function has(rel, needle) {
  const text = read(rel);
  assert.ok(text.includes(needle), `${rel} missing ${needle}`);
}

has('src/server/assistant-context.ts', 'buildAssistantContextFromRequest');
has('src/server/assistant-context.ts', 'Array.isArray(value) && value.length > 0');
has('src/server/assistant-context.ts', 'export default async function assistantContextHandler');
has('src/server/assistant-query-handler.ts', 'buildAssistantContextFromRequest');
has('src/server/assistant-query-handler.ts', 'runAssistantQuery');
has('src/server/assistant-query-handler.ts', 'normalizeAssistantResult');
has('src/server/ai-assistant.ts', 'dataPolicy: "app_data_only"');
has('src/server/ai-assistant.ts', 'Nie znalazłem tego w danych aplikacji.');
has('src/components/GlobalAiAssistant.tsx', '/api/system?kind=assistant-context');
has('src/components/TodayAiAssistant.tsx', 'snapshotItemsCount > 0 ? snapshot : undefined');
has('src/lib/assistant-intents.ts', 'detectAssistantIntent');
has('src/lib/assistant-result-schema.ts', 'normalizeAssistantResult');

console.log('PASS check-assistant-operator-v1');
