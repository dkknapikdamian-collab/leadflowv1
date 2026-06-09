const fs = require('fs');

const STAGE = 'STAGE230C_R10_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH';

function fail(message) {
  console.error('[STAGE230C_R10][FAIL] ' + message);
  process.exit(1);
}

function mustInclude(source, needle, message) {
  if (!source.includes(needle)) fail(message || ('Missing: ' + needle));
}

const pagePath = 'src/pages/AiDrafts.tsx';
const cssPath = 'src/styles/visual-stage9-ai-drafts-vnext.css';
const sourceTruthPath = 'src/styles/visual-stage20-lead-form-vnext.css';

if (!fs.existsSync(pagePath)) fail('AiDrafts.tsx missing');
if (!fs.existsSync(cssPath)) fail('AiDrafts CSS missing');
if (!fs.existsSync(sourceTruthPath)) fail('lead form visual source truth CSS missing');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');
const sourceTruth = fs.readFileSync(sourceTruthPath, 'utf8');

mustInclude(page, "import '../styles/visual-stage20-lead-form-vnext.css';", 'AiDrafts does not import lead/client form visual source truth');
mustInclude(page, 'lead-form-section', 'quick capture does not use lead-form-section visual source class');
mustInclude(page, 'lead-form-textarea', 'quick capture textarea does not use lead-form-textarea visual source class');
mustInclude(page, 'data-stage230c-r10-visual-source-truth="true"', 'R10 visual source truth marker missing');
mustInclude(page, 'data-stage230c-r10-visual-source-truth-textarea="true"', 'R10 visual textarea marker missing');

mustInclude(sourceTruth, '.lead-form-section', 'source truth lead-form-section missing');
mustInclude(sourceTruth, '.lead-form-textarea', 'source truth lead-form-textarea missing');
mustInclude(sourceTruth, 'color: #111827', 'source truth dark text color missing');

mustInclude(css, 'STAGE230C_R15_QUICK_CAPTURE_VISUAL_SOURCE_TRUTH', 'R15 quick capture source truth CSS block missing');
mustInclude(css, '-webkit-text-fill-color: #111827', 'quick capture forced dark text missing');
mustInclude(css, 'data-stage230b-quick-capture-save="true"', 'quick capture save button visual selector missing');

console.log(STAGE + ' PASS');
