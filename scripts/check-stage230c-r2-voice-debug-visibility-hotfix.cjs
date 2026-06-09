const fs = require('fs');

function fail(message) {
  console.error('[STAGE230C_R2][FAIL] ' + message);
  process.exit(1);
}

function mustInclude(source, needle, message) {
  if (!source.includes(needle)) fail(message || ('Missing: ' + needle));
}

function extractQuickCaptureRegion(page) {
  const start = page.indexOf('        <section className="ai-drafts-quick-capture"');
  if (start === -1) fail('quick capture section start missing');
  const end = page.indexOf('        <section className="ai-drafts-stats-grid"', start);
  if (end === -1) fail('stats section anchor missing after quick capture');
  return page.slice(start, end);
}

const pagePath = 'src/pages/AiDrafts.tsx';
const cssPath = 'src/styles/visual-stage9-ai-drafts-vnext.css';
const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const quick = extractQuickCaptureRegion(page);

mustInclude(page, 'STAGE230C_PHONE_DICTATION_DUPLICATE_WORDS_AUDIT', 'base Stage230C marker missing');
mustInclude(quick, 'data-stage230c-r8-panel-rewrite="true"', 'R8 clean panel rewrite marker missing');
mustInclude(quick, 'data-stage230c-r8-visible-trace-actions="true"', 'visible trace actions marker missing');
mustInclude(quick, 'data-stage230c-r8-readable-textarea="true"', 'readable textarea marker missing');
mustInclude(quick, 'data-stage230c-r8-trace-limit="true"', 'trace limit marker missing');
mustInclude(quick, 'Debug dyktowania', 'debug toggle label missing');
mustInclude(quick, 'Kopiuj trace', 'copy trace button missing');
mustInclude(quick, 'Wyczyść trace', 'clear trace button missing');
mustInclude(quick, 'Trace wyłączony', 'trace disabled state missing');
mustInclude(quick, 'Limit trace: ostatnie 80 eventów', 'trace limit copy missing');
mustInclude(quick, 'disabled={!voiceDebugEnabled || voiceInputTrace.length === 0}', 'copy/clear disabled guard missing');
mustInclude(quick, 'voiceInputTrace.slice(0, 40).map', 'visible trace list limit missing');
mustInclude(quick, 'onBeforeInput', 'beforeinput handler missing');
mustInclude(quick, 'onInput', 'input handler missing');
mustInclude(quick, 'onChange={handleQuickCaptureChange}', 'change handler missing');
mustInclude(quick, 'onCompositionStart', 'compositionstart handler missing');
mustInclude(quick, 'onCompositionUpdate', 'compositionupdate handler missing');
mustInclude(quick, 'onCompositionEnd', 'compositionend handler missing');
mustInclude(quick, 'onPaste', 'paste handler missing');
mustInclude(quick, 'data-stage230b-quick-capture-save="true"', 'Stage230B save button marker missing');

for (const forbidden of [') : null}', 'removeDuplicate', 'dedupeText', 'deduplicateWords', 'autoCorrectDuplicate', '/api/ai/drafts/parse', 'localStorage', 'ALTER TABLE', 'CREATE TABLE', 'DELETE FROM']) {
  if (quick.includes(forbidden)) fail('Forbidden content found in quick capture region: ' + forbidden);
}

mustInclude(css, 'STAGE230C_R8_MASS_PANEL_REGION_REWRITE_START', 'R8 CSS marker missing');
mustInclude(css, '-webkit-text-fill-color: #111827', 'textarea forced dark text missing');
mustInclude(css, 'caret-color: #1d4ed8', 'textarea caret color missing');
mustInclude(css, 'ai-drafts-voice-trace-actions-visible button:disabled', 'disabled button readability CSS missing');
mustInclude(css, 'STAGE230C_R8_MASS_PANEL_REGION_REWRITE_END', 'R8 CSS end marker missing');

console.log('STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX PASS');
