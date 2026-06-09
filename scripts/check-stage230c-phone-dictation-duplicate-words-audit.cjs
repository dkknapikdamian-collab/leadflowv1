const fs = require('fs');

const STAGE = 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT';

function fail(message) {
  console.error('[STAGE230C][FAIL] ' + message);
  process.exit(1);
}

function mustInclude(source, needle, message) {
  if (!source.includes(needle)) fail(message || ('Missing: ' + needle));
}

function extractRegion(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  if (start === -1) fail('Missing region start: ' + startMarker);
  const end = source.indexOf(endMarker, start);
  if (end === -1) fail('Missing region end: ' + endMarker);
  return source.slice(start, end + endMarker.length);
}

function extractConstAsyncFunction(source, functionName) {
  const anchor = 'const ' + functionName + ' = async () =>';
  const start = source.indexOf(anchor);
  if (start === -1) fail(functionName + ' handler not found');
  const open = source.indexOf('{', start);
  if (open === -1) fail(functionName + ' open brace not found');
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  fail(functionName + ' close brace not found');
}

const pagePath = 'src/pages/AiDrafts.tsx';
const cssPath = 'src/styles/visual-stage9-ai-drafts-vnext.css';
const guardPath = 'scripts/check-stage230c-phone-dictation-duplicate-words-audit.cjs';

if (!fs.existsSync(pagePath)) fail('AiDrafts.tsx missing');
if (!fs.existsSync(cssPath)) fail('AiDrafts CSS missing');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

mustInclude(page, STAGE, 'Stage230C marker missing');
mustInclude(page, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_HELPERS_START', 'Stage230C helpers marker missing');
mustInclude(page, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_HANDLERS_START', 'Stage230C handlers marker missing');
mustInclude(page, 'type VoiceInputTraceEntry', 'VoiceInputTraceEntry type missing');
mustInclude(page, 'voiceDebugEnabled', 'voiceDebugEnabled state missing');
mustInclude(page, 'voiceInputTrace', 'voiceInputTrace state missing');
mustInclude(page, 'voiceInputBeforeValue', 'voiceInputBeforeValue state missing');
mustInclude(page, 'getVoiceInputTailTokens', 'tail tokens helper missing');
mustInclude(page, 'detectVoiceInputDuplicateSignal', 'duplicate signal helper missing');
mustInclude(page, 'appendVoiceInputTrace', 'append trace helper missing');
mustInclude(page, 'copyVoiceInputTrace', 'copy trace helper missing');
mustInclude(page, 'clearVoiceInputTrace', 'clear trace helper missing');
mustInclude(page, '.slice(0, 80)', 'trace limit to last 80 events missing');

for (const eventName of [
  'onBeforeInput',
  'onInput',
  'onChange',
  'onCompositionStart',
  'onCompositionUpdate',
  'onCompositionEnd',
  'onPaste',
]) {
  mustInclude(page, eventName, 'Textarea diagnostic event missing: ' + eventName);
}

for (const marker of [
  'data-stage230c-phone-dictation-debug="true"',
  'data-stage230c-phone-dictation-toggle="true"',
  'data-stage230c-phone-dictation-trace="true"',
  'data-stage230c-phone-dictation-copy="true"',
  'data-stage230c-phone-dictation-clear="true"',
]) {
  mustInclude(page, marker, 'Stage230C data marker missing: ' + marker);
}

for (const signal of [
  'repeated_last_word_x2',
  'repeated_last_word_x3_plus',
  'repeated_tail_phrase',
  'same_value_reapplied',
  'large_append',
  'composition_duplicate_suspected',
]) {
  mustInclude(page, signal, 'Duplicate signal missing: ' + signal);
}

for (const needle of [
  'saveAiLeadDraftAsync',
  "source: 'quick_capture'",
  "type: 'note'",
  'STAGE230B_QUICK_CAPTURE_INBOX',
  "setQuickCaptureText('');",
  'await reloadDrafts();',
  'data-stage230b-quick-capture="true"',
  'data-stage230b-quick-capture-save="true"',
]) {
  mustInclude(page, needle, 'Stage230B regression missing: ' + needle);
}

const saveHandler = extractConstAsyncFunction(page, 'handleSaveQuickCaptureDraft');
const saveIndex = saveHandler.indexOf('await saveAiLeadDraftAsync');
const clearIndex = saveHandler.indexOf("setQuickCaptureText('');");
const reloadIndex = saveHandler.indexOf('await reloadDrafts();');
if (saveIndex === -1) fail('saveAiLeadDraftAsync await missing');
if (clearIndex === -1 || clearIndex < saveIndex) fail('quickCaptureText clear must stay after save');
if (reloadIndex === -1 || reloadIndex < saveIndex) fail('reloadDrafts must stay after save');

const helpersRegion = extractRegion(page, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_HELPERS_START', 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_HELPERS_END');
const handlersRegion = extractRegion(page, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_HANDLERS_START', 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_HANDLERS_END');
const stage230cRegion = helpersRegion + '\n' + handlersRegion;
const lowerStage230c = stage230cRegion.toLowerCase();

for (const forbidden of [
  'gemini',
  'cloudflare',
  '/api/ai/drafts/parse',
  'localstorage',
  'alter table',
  'create table',
  'delete from',
]) {
  if (lowerStage230c.includes(forbidden)) fail('Stage230C diagnostic region must not contain forbidden content: ' + forbidden);
}

for (const forbidden of [
  'removeDuplicate',
  'dedupeText',
  'deduplicateWords',
  'autoCorrectDuplicate',
]) {
  if (page.includes(forbidden)) fail('Stage230C must not auto-dedupe or auto-correct text: ' + forbidden);
}

mustInclude(css, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_START', 'Stage230C CSS start marker missing');
mustInclude(css, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT_END', 'Stage230C CSS end marker missing');
mustInclude(css, '.ai-drafts-voice-debug-panel', 'voice debug panel CSS missing');
mustInclude(css, '.ai-drafts-voice-trace-list', 'voice trace list CSS missing');
mustInclude(css, '.ai-drafts-voice-trace-row', 'voice trace row CSS missing');

if (!fs.readFileSync(guardPath, 'utf8').includes(STAGE)) {
  fail('Guard self marker missing');
}

console.log('STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT PASS');
