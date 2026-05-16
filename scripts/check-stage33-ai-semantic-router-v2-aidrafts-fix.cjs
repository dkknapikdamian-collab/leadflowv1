const fs = require('fs');

function read(file) {
  return fs.readFileSync(file, 'utf8');
}

function expect(file, text, label = text) {
  const body = read(file);
  if (!body.includes(text)) {
    throw new Error(`${file}: missing ${label}`);
  }
  console.log(`OK: ${file} contains ${label}`);
}

function expectOrder(file, first, second, label) {
  const body = read(file);
  const a = body.indexOf(first);
  const b = body.indexOf(second);
  if (a === -1 || b === -1 || a >= b) {
    throw new Error(`${file}: invalid order for ${label}`);
  }
  console.log(`OK: ${file} order ${label}`);
}

expect('src/lib/ai-assistant.ts', 'AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_CLIENT', 'Stage33 client marker');
expect('src/lib/ai-assistant.ts', 'semanticRouter: true', 'semantic router request flag');
expect('src/lib/ai-assistant.ts', 'const stage32LocalFallback = buildStage32LocalQueryBrainAnswer(input);', 'Stage32 as fallback only');
expect('src/lib/ai-assistant.ts', 'Fallback lokalny: modelowy router semantyczny nie odpowiedzia\u0142', 'local fallback warning');
expectOrder('src/lib/ai-assistant.ts', "fetch('/api/system?kind=ai-assistant'", 'if (stage32LocalFallback)', 'server semantic router before local fallback return');

expect('src/server/ai-assistant.ts', "import { tryGenerateJsonWithAiProvider } from './ai-provider.js';", 'AI provider import');
expect('src/server/ai-assistant.ts', 'AI_ASSISTANT_SEMANTIC_ROUTER_STAGE33_SERVER', 'Stage33 server marker');
expect('src/server/ai-assistant.ts', 'Nie jeste\u015B s\u0142ownikiem fraz', 'semantic prompt not phrase dictionary');
expect('src/server/ai-assistant.ts', 'stage33BuildCompactSnapshot', 'compact app snapshot builder');
expect('src/server/ai-assistant.ts', 'tryStage33SemanticAssistantFromRequest(req)', 'semantic router early handler');
expect('src/server/ai-assistant.ts', "provider: 'semantic_ai:' + generated.provider", 'semantic provider label');

expect('src/index.css', '@import "./styles/stage33a-ai-drafts-generated-text-contrast.css";', 'AI drafts contrast import');
expect('src/styles/stage33a-ai-drafts-generated-text-contrast.css', 'AI_DRAFTS_GENERATED_TEXT_CONTRAST_STAGE33A', 'AI drafts contrast marker');
expect('src/styles/stage33a-ai-drafts-generated-text-contrast.css', '.ai-drafts-vnext-page .ai-drafts-source-text', 'generated draft source text selector');
expect('src/styles/stage33a-ai-drafts-generated-text-contrast.css', 'color: #111827 !important;', 'readable dark text');
expect('src/styles/stage33a-ai-drafts-generated-text-contrast.css', 'background: #ffffff !important;', 'white input/source background with dark text');

console.log('stage33-v2-semantic-router-aidrafts-fix: PASS');
