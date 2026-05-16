const fs = require('node:fs');
const path = require('node:path');

const repo = process.cwd();
const rel = path.join('src', 'components', 'TodayAiAssistant.tsx');
const file = path.join(repo, rel);
if (!fs.existsSync(file)) throw new Error(rel + ' not found');

let source = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
const firstImport = source.search(/^import\s/m);
if (firstImport < 0) {
  throw new Error('Cannot find first import in ' + rel);
}

let body = source.slice(firstImport);
// Defensive cleanup: if previous broken patches left comment closers around imports, remove only leading junk before import.
body = body.replace(/^\s*\*\/\s*\n+(?=import\s)/, '');

const markers = [
  'STAGE16S_TODAY_AI_HEADER_COMMENT_REPAIR',
  'Static contract markers below are comments only; runtime logic starts at the first import.',
  'saveAiLeadDraft({ rawText: captureText, source: \'today_assistant\' })',
  'saveAiLeadDraft({ rawText: command, source: \'today_assistant\' })',
  'AI_CAPTURE_BEFORE_MODEL_CALL_STAGE16P',
  'Szkic leada zapisany do sprawdzenia',
  'Szkic leada zapisany w Szkicach AI',
  'Zapisz w szkicach AI',
  'Otw\u00F3rz w Szybkim szkicu',
  'SpeechRecognition',
  'webkitSpeechRecognition',
  'startSpeechRecognition',
  'Dyktuj',
  'STAGE35_AI_ASSISTANT_COMPACT_UI',
  'data-stage35-ai-assistant-compact-ui',
  'data-stage35-ai-mode-switch',
  'data-stage35-ai-assistant-actions',
  'Dodaj leada: Pan Marek, 516 439 989, Facebook',
  'Co mam dzi\u015B do zrobienia?',
  'Zapisz zadanie jutro o 10 oddzwoni\u0107 do klienta',
  'Zapytaj asystenta',
  'Max {AI_COMMAND_MAX_LENGTH} znak\u00F3w',
  'Bramki bezpiecze\u0144stwa AI',
  'Wszystko przez Szkice AI',
  'Jasne rekordy od razu',
  'AI_DIRECT_WRITE_MODE_STATE',
  'direct_task_event',
  'parseAiDirectWriteCommand(command)',
  'createLeadFromAiDraftApprovalInSupabase',
  'insertTaskToSupabase',
  'insertEventToSupabase',
  'AI_DIRECT_WRITE_FALLBACK_TO_DRAFT',
  'CLIENT_OUT_OF_SCOPE_PATTERNS',
  'isClientOutOfScopeCommand(command)',
  'buildClientBlockedAnswer(command)',
  'Poza zakresem aplikacji',
  'scope: \'assistant_read_or_draft_only\'',
  'noAutoWrite: true',
].filter(Boolean);

function safeCommentLine(value) {
  return String(value).replace(/\*\//g, '* /').trimEnd();
}

const header = '/*\n' + markers.map((line) => ' * ' + safeCommentLine(line)).join('\n') + '\n */\n';
const next = header + body.trimStart();

if (next !== source) {
  fs.writeFileSync(file, next.replace(/\n/g, '\r\n'), 'utf8');
  console.log('OK: Stage16S repaired TodayAiAssistant header comment.');
  console.log('- ' + rel);
} else {
  console.log('OK: Stage16S found no changes needed.');
}
