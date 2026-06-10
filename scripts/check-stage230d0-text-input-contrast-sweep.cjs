const fs = require('node:fs');

const STAGE = 'STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP';

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function fail(message) {
  console.error(`${STAGE} FAIL: ${message}`);
  process.exit(1);
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(`missing ${label}: ${needle}`);
}

const aiDraftsPath = 'src/pages/AiDrafts.tsx';
const cssPath = 'src/styles/visual-stage9-ai-drafts-vnext.css';

const aiDrafts = read(aiDraftsPath);
const css = read(cssPath);

assertIncludes(aiDrafts, 'STAGE230B_QUICK_CAPTURE_INBOX', 'Stage230B marker');
assertIncludes(aiDrafts, 'saveAiLeadDraftAsync', 'Stage230B save flow');
assertIncludes(aiDrafts, "source: 'quick_capture'", 'Stage230B quick_capture source');

assertIncludes(aiDrafts, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT', 'Stage230C marker');
if (!/VoiceInputTrace|voiceInputTrace|voice_input_event_trace|Debug dyktowania/.test(aiDrafts)) {
  fail('missing Stage230C voice trace/debug mechanism');
}

assertIncludes(css, 'STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_START', 'Stage230D0 CSS start marker');
assertIncludes(css, 'STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END', 'Stage230D0 CSS end marker');

const blockMatch = css.match(/\/\* STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_START \*\/([\s\S]*?)\/\* STAGE230D0_TEXT_INPUT_CONTRAST_SWEEP_END \*\//);
if (!blockMatch) fail('cannot isolate Stage230D0 CSS block');

const block = blockMatch[1];

for (const required of [
  '.ai-drafts-vnext-page input',
  '.ai-drafts-vnext-page textarea',
  '.ai-drafts-vnext-page select',
  '.ai-drafts-vnext-page option',
  '::placeholder',
  'caret-color',
  '-webkit-text-fill-color',
  "data-stage230c",
  '#111827',
  '#ffffff'
]) {
  assertIncludes(block, required, `contrast selector/value ${required}`);
}

if (/removeDuplicate|dedupeText|deduplicateWords|autoCorrectDuplicate/i.test(aiDrafts)) {
  fail('Stage230D0 must not introduce automatic dictation deduplication');
}

if (/\/api\/ai\/drafts\/parse|gemini|cloudflare/i.test(block)) {
  fail('Stage230D0 CSS block must not introduce AI parser/provider references');
}

const suspiciousWhiteOnWhite = /color\s*:\s*(#fff|#ffffff|white|rgb\(255,\s*255,\s*255\))[\s\S]{0,140}background(?:-color)?\s*:\s*(#fff|#ffffff|white|rgb\(255,\s*255,\s*255\))/i;
if (suspiciousWhiteOnWhite.test(block)) {
  fail('Stage230D0 block contains suspicious white text on white background');
}

console.log(`${STAGE} PASS`);
