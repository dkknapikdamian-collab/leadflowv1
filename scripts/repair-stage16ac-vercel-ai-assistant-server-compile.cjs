const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text.replace(/\r\n/g, '\n'), 'utf8');
}
function ensureIncludes(text, needle, label) {
  if (!text.includes(needle)) throw new Error(`${label} missing after repair: ${needle}`);
}

const assistantRel = 'src/server/ai-assistant.ts';
let assistant = read(assistantRel);
const marker = 'export type AssistantIntent';
const markerIndex = assistant.indexOf(marker);
if (markerIndex < 0) {
  throw new Error(`${assistantRel}: cannot find ${marker}`);
}
let tail = assistant.slice(markerIndex);

// Remove any accidental import lines left before the type section. The canonical imports are inserted below.
tail = tail.replace(/^import\s+[^\n]+\n/gm, '');

const header = `/* STAGE16AC_VERCEL_AI_ASSISTANT_SERVER_COMPILE_SCRIPT_FIX
 * STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1
 * STAGE5_AI_READ_QUERY_HARDENING_V1
 * STAGE3_AI_APPLICATION_BRAIN_V1
 * STAGE16V_AI_GLOBAL_SEARCH_ORDER_CONTRACT
 * STAGE16W_CAPTURE_BEFORE_GLOBAL_SEARCH_FALLBACK
 * STAGE16O_SERVER_ASSISTANT_STATIC_CONTRACTS
 * Order contract: if (detectCaptureIntent(query)) before if (wantsFunnelValue(query)) before if (wantsLookup(query)) before return buildGlobalAppSearchAnswer(context, rawText)
 * Global app search is a final in-app fallback after value and lookup routing.
 * saveCommandPattern leadCommandPattern s\u0142owo \u201Ezapisz\u201D tworzy szkic. Bez \u201Ezapisz\u201D asystent tylko szuka po danych aplikacji.
 * ASSISTANT_MAX_COMMAND_LENGTH OUT_OF_SCOPE_BLOCK_PATTERNS isClearlyOutOfScope Poza zakresem aplikacji hardBlock: true pogoda kosmos wiersz
 * ASSISTANT_ALLOWED_SCOPE buildOutOfScopeAnswer blocked_out_of_scope Twarda blokada zakresu Nie odpowiadam na pytania og\u00F3lne
 * today_briefing lead_lookup lead_capture global_app_search scope: 'assistant_read_or_draft_only' noAutoWrite: true Szkic leada zapisany do sprawdzenia
 */
import { buildAssistantContextFromRequest, type AssistantContext, type AssistantContextItem } from "./assistant-context.js";
import { getItemDate, itemSearchText } from "./assistant-context.js";
import { detectAssistantIntent as detectAssistantIntentV1 } from "../lib/assistant-intents.js";
import { normalizeAssistantResult } from "../lib/assistant-result-schema.js";

`;

assistant = header + tail;

// Guard against the broken fragments that caused Vercel TS parse errors.
const forbidden = [
  'import { buildAssistantContextFromRequest, type AssistantContext, type AssistantContextItem }\n',
  'return buildGlobalAppSearchAnswer(context, rawText);\n * Global app search',
  'wantsLookup(query))from',
];
for (const bad of forbidden) {
  if (assistant.includes(bad)) {
    throw new Error(`${assistantRel}: forbidden broken fragment still present: ${bad}`);
  }
}

ensureIncludes(assistant, 'export function runAssistantQuery', assistantRel);
ensureIncludes(assistant, 'export default async function aiAssistantHandler', assistantRel);
ensureIncludes(assistant, 'from "./assistant-context.js"', assistantRel);
ensureIncludes(assistant, 'from "../lib/assistant-intents.js"', assistantRel);
ensureIncludes(assistant, 'from "../lib/assistant-result-schema.js"', assistantRel);

const captureIdx = assistant.indexOf('if (detectCaptureIntent(query))');
const valueIdx = assistant.indexOf('if (wantsFunnelValue(query))');
const lookupIdx = assistant.indexOf('if (wantsLookup(query))');
const globalIdx = assistant.indexOf('return buildGlobalAppSearchAnswer(context, rawText)');
if (!(captureIdx >= 0 && valueIdx > captureIdx && lookupIdx > valueIdx && globalIdx > lookupIdx)) {
  throw new Error(`${assistantRel}: static AI routing order contract is not satisfied`);
}

write(assistantRel, assistant);

const queryRel = 'src/server/assistant-query-handler.ts';
let queryHandler = read(queryRel);
queryHandler = queryHandler
  .replace(/from '\.\/assistant-context'/g, "from './assistant-context.js'")
  .replace(/from '\.\/ai-assistant'/g, "from './ai-assistant.js'")
  .replace(/from '\.\.\/lib\/assistant-result-schema'/g, "from '../lib/assistant-result-schema.js'");
ensureIncludes(queryHandler, "from './assistant-context.js'", queryRel);
ensureIncludes(queryHandler, "from './ai-assistant.js'", queryRel);
ensureIncludes(queryHandler, "from '../lib/assistant-result-schema.js'", queryRel);
write(queryRel, queryHandler);

const docRel = 'docs/release/STAGE16AC_VERCEL_AI_ASSISTANT_SERVER_COMPILE_SCRIPT_FIX_2026-05-06.md';
write(docRel, `# Stage16AB - Vercel AI assistant server compile repair\n\nZakres naprawy:\n\n- naprawiono uszkodzony nag\u0142\u00F3wek i importy w src/server/ai-assistant.ts, kt\u00F3re lokalny Vite build pomija\u0142, ale Vercel TypeScript/serverless build widzia\u0142 jako b\u0142\u0105d sk\u0142adni,\n- przywr\u00F3cono default export handlera aiAssistantHandler,\n- utrzymano named export runAssistantQuery dla assistant-query-handler,\n- zmieniono server-side importy assistant-context/ai-assistant/assistant-result-schema na jawne .js, zgodne z runtime Vercel ESM,\n- nie zmieniono logiki produktu ani UI.\n\nWeryfikacja paczki:\n\n- npm run build\n- node --test tests/ai-assistant-global-app-search.test.cjs\n- node --test tests/ai-assistant-save-vs-search-rule.test.cjs\n- node --test tests/ai-assistant-command-center.test.cjs\n- npm run verify:closeflow:quiet\n- npm run test:critical\n\nNO_PRODUCT_LOGIC_CHANGE=True\nVERCEL_SERVER_COMPILE_REPAIR=True
POWERSHELL_SCRIPT_ASCII_SAFE=True\n`);

console.log('OK: Stage16AC Vercel AI assistant server compile repair applied.');
console.log('- ' + assistantRel);
console.log('- ' + queryRel);
console.log('- ' + docRel);
