const fs = require('fs');

const STAGE = 'STAGE230C_R2_VOICE_DEBUG_VISIBILITY_HOTFIX';

function fail(message) {
  console.error('[STAGE230C_R2][FAIL] ' + message);
  process.exit(1);
}

function mustInclude(source, needle, message) {
  if (!source.includes(needle)) fail(message || ('Missing: ' + needle));
}

const pagePath = 'src/pages/AiDrafts.tsx';
const cssPath = 'src/styles/visual-stage9-ai-drafts-vnext.css';

if (!fs.existsSync(pagePath)) fail('AiDrafts.tsx missing');
if (!fs.existsSync(cssPath)) fail('AiDrafts CSS missing');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

mustInclude(page, 'data-stage230b-quick-capture="true"', 'Stage230B quick capture marker missing');
mustInclude(page, 'data-stage230b-quick-capture-textarea="true"', 'quick capture textarea marker missing');
mustInclude(page, 'ai-drafts-quick-capture-textarea', 'quick capture textarea class missing');
mustInclude(page, 'data-stage230c-phone-dictation-debug="true"', 'Stage230C diagnostic panel marker missing');
mustInclude(page, 'data-stage230c-phone-dictation-copy="true"', 'copy diagnostics/trace button marker missing');
mustInclude(page, 'data-stage230c-phone-dictation-clear="true"', 'clear diagnostics/trace button marker missing');

if (!page.includes('Kopiuj trace') && !page.includes('Kopiuj diagnostykę dyktowania')) {
  fail('copy diagnostics/trace button label missing');
}

mustInclude(css, 'data-stage230b-quick-capture-textarea="true"', 'textarea visual selector missing');
mustInclude(css, '-webkit-text-fill-color: #111827', 'forced readable text color missing');
mustInclude(css, 'caret-color: #111827', 'forced caret color missing');
mustInclude(css, 'data-stage230b-quick-capture-save="true"', 'save button visual selector missing');
mustInclude(css, 'data-stage230c-phone-dictation-copy="true"', 'copy button visual selector missing');

console.log(STAGE + ' PASS');
