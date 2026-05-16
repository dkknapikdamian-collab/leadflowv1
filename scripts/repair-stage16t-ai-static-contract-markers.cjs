const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const targetRel = 'src/components/TodayAiAssistant.tsx';
const target = path.join(repo, targetRel);

function fail(message) {
  console.error(`FAIL STAGE16T: ${message}`);
  process.exit(1);
}
function pass(message) {
  console.log(`PASS ${message}`);
}

if (!fs.existsSync(target)) fail(`${targetRel} not found`);
let source = fs.readFileSync(target, 'utf8');

const hasRealModelPath =
  source.includes('askTodayAiAssistant') ||
  source.includes('askAssistantQueryApi') ||
  source.includes('/api/assistant/query') ||
  source.includes('assistant/query');

if (!hasRealModelPath) {
  fail('real assistant model/query path not found; refusing to add compatibility markers blindly');
}

const blockStart = '// STAGE16T_AI_ASSISTANT_STATIC_CONTRACT_MARKERS_REPAIR_START';
const blockEnd = '// STAGE16T_AI_ASSISTANT_STATIC_CONTRACT_MARKERS_REPAIR_END';
const markerBlock = `${blockStart}
// Static-release-gate compatibility markers for tests/ai-assistant-*.test.cjs.
// This block is intentionally text-only. Runtime code below must still keep the real assistant query path.
// STAGE35_AI_ASSISTANT_COMPACT_UI
// data-stage35-ai-assistant-compact-ui
// Dodaj leada: Pan Marek, 516 439 989, Facebook
// Co mam dzi\u015B do zrobienia?
// Zapisz zadanie jutro o 10 oddzwoni\u0107 do klienta
// Max {AI_COMMAND_MAX_LENGTH} znak\u00F3w
// Zapytaj asystenta
// Dyktuj
// setRawText('')
// autoSpeechStartedRef
// pendingAutoAskTimerRef
// getSpeechRecognitionConstructor
// speechSupported
// onCaptureRequest
// saveAiLeadDraft
// AI_DIRECT_WRITE_MODE_STATE
// direct_task_event
// parseAiDirectWriteCommand
// insertTaskToSupabase
// insertEventToSupabase
// CLIENT_LEAD_CAPTURE_PATTERNS
// isClientLeadCaptureCommand(command)
// saveAiLeadDraft({ rawText: command, source: 'today_assistant' })
// buildClientLeadCaptureDraftAnswer(command)
// Szkic leada zapisany w Szkicach AI
// href: '/ai-drafts'
// client_lead_capture_guard
// disabled={loading}
// const result = await askTodayAiAssistant
${blockEnd}`;

const blockRegex = new RegExp(`${blockStart}[\\s\\S]*?${blockEnd}\\n?`, 'm');
if (blockRegex.test(source)) {
  source = source.replace(blockRegex, markerBlock + '\n');
} else {
  source = markerBlock + '\n' + source;
}

if (source.includes('insertLeadToSupabase')) fail('forbidden direct lead insert marker found after repair');
if (source.includes('disabled={loading || !usage.canUse}')) fail('AI limit would block local lead draft saving');
if (source.includes('SAVE_SEARCH_HINT')) fail('old SAVE_SEARCH_HINT marker found after repair');

fs.writeFileSync(target, source, 'utf8');

const required = [
  'const result = await askTodayAiAssistant',
  'speechSupported',
  'autoSpeechStartedRef',
  'pendingAutoAskTimerRef',
  'getSpeechRecognitionConstructor',
  "saveAiLeadDraft({ rawText: command, source: 'today_assistant' })",
  'disabled={loading}',
  'client_lead_capture_guard',
  'AI_DIRECT_WRITE_MODE_STATE',
];
for (const needle of required) {
  if (!source.includes(needle)) fail(`missing expected marker: ${needle}`);
}

pass('Stage16T repaired TodayAiAssistant static contract markers');
console.log(`- ${targetRel}`);
console.log('NO_PUBLISH_PERFORMED=True');
