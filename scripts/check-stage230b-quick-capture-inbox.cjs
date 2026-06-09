const fs = require('fs');

function fail(message) {
  console.error('[STAGE230B][FAIL] ' + message);
  process.exit(1);
}
function mustInclude(source, needle, message) {
  if (!source.includes(needle)) fail(message || ('Missing: ' + needle));
}
function extractFunctionBlock(source, functionName) {
  const anchor = 'function ' + functionName;
  const start = source.indexOf(anchor);
  if (start === -1) fail(functionName + ' function not found');
  const open = source.indexOf('{', start);
  if (open === -1) fail(functionName + ' function open brace not found');
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  fail(functionName + ' function close brace not found');
}
function extractConstAsyncFunction(source, functionName) {
  const anchor = 'const ' + functionName + ' = async () =>';
  const start = source.indexOf(anchor);
  if (start === -1) fail(functionName + ' handler not found');
  const open = source.indexOf('{', start);
  if (open === -1) fail(functionName + ' handler open brace not found');
  let depth = 0;
  for (let index = open; index < source.length; index += 1) {
    const char = source[index];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, index + 1);
    }
  }
  fail(functionName + ' handler close brace not found');
}

const pagePath = 'src/pages/AiDrafts.tsx';
const cssPath = 'src/styles/visual-stage9-ai-drafts-vnext.css';
if (!fs.existsSync(pagePath)) fail('AiDrafts.tsx missing');
if (!fs.existsSync(cssPath)) fail('AiDrafts CSS missing');
const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

mustInclude(page, 'saveAiLeadDraftAsync', 'AiDrafts.tsx must import/use saveAiLeadDraftAsync');
mustInclude(page, 'quickCaptureText', 'quickCaptureText state missing');
mustInclude(page, 'quickCaptureSaving', 'quickCaptureSaving state missing');
mustInclude(page, 'handleSaveQuickCaptureDraft', 'quick capture save handler missing');
mustInclude(page, 'data-stage230b-quick-capture="true"', 'quick capture section marker missing');
mustInclude(page, 'data-stage230b-quick-capture-textarea="true"', 'quick capture textarea marker missing');
mustInclude(page, 'data-stage230b-quick-capture-save="true"', 'quick capture save marker missing');
mustInclude(page, 'STAGE230B_QUICK_CAPTURE_INBOX', 'parsedDraft.stage marker missing');
mustInclude(page, "captureMode: 'quick_capture_raw'", 'captureMode quick_capture_raw missing');
mustInclude(page, "inputMode: 'manual_or_system_dictation'", 'inputMode marker missing');
mustInclude(page, 'rawTextPreserved: true', 'rawTextPreserved missing');
mustInclude(page, "source: 'quick_capture'", 'source quick_capture missing');
mustInclude(page, "type: 'note'", 'type note missing');
mustInclude(page, 'await reloadDrafts();', 'reloadDrafts after save missing');
mustInclude(page, "setQuickCaptureText('');", 'quickCaptureText clear missing');
mustInclude(page, 'function isStage230BQuickCaptureDraft', 'quick capture helper missing');
mustInclude(page, "return 'Szybki szkic'", 'getDraftTypeLabel must show Szybki szkic');
mustInclude(page, 'STAGE230B_GET_DRAFT_TITLE_PREVIEW', 'getDraftTitle quick capture preview marker missing');
mustInclude(page, "return 'Szybki szkic: ' + shortPreview(draft.rawText);", 'getDraftTitle must show Szybki szkic preview');

const labelBlock = extractFunctionBlock(page, 'getDraftTypeLabel');
if (!labelBlock.includes('isStage230BQuickCaptureDraft(draft)') || !labelBlock.includes("'Szybki szkic'")) {
  fail('getDraftTypeLabel quick capture branch missing');
}
const titleBlock = extractFunctionBlock(page, 'getDraftTitle');
if (!titleBlock.includes('STAGE230B_GET_DRAFT_TITLE_PREVIEW') || !titleBlock.includes('isStage230BQuickCaptureDraft(draft)') || !titleBlock.includes("return 'Szybki szkic: ' + shortPreview(draft.rawText);")) {
  fail('getDraftTitle quick capture preview branch missing');
}

const handler = extractConstAsyncFunction(page, 'handleSaveQuickCaptureDraft');
mustInclude(handler, 'saveAiLeadDraftAsync', 'handler must call saveAiLeadDraftAsync');
mustInclude(handler, "source: 'quick_capture'", 'handler must save source quick_capture');
mustInclude(handler, "type: 'note'", 'handler must save type note');
mustInclude(handler, 'STAGE230B_QUICK_CAPTURE_INBOX', 'handler must write stage marker');
mustInclude(handler, 'await reloadDrafts();', 'handler must reload drafts after save');
if (handler.includes('localStorage')) fail('handler must not use localStorage');
const lowerHandler = handler.toLowerCase();
for (const forbidden of ['gemini', 'cloudflare', '/api/ai/drafts/parse', 'parseai', 'aiprovider']) {
  if (lowerHandler.includes(forbidden)) fail('Stage230B handler must not call AI provider or parse endpoint: ' + forbidden);
}
const saveIndex = handler.indexOf('await saveAiLeadDraftAsync');
const clearIndex = handler.indexOf("setQuickCaptureText('');");
const reloadIndex = handler.indexOf('await reloadDrafts();');
if (saveIndex === -1) fail('saveAiLeadDraftAsync await missing');
if (clearIndex === -1 || clearIndex < saveIndex) fail('quickCaptureText must be cleared only after saveAiLeadDraftAsync');
if (reloadIndex === -1 || reloadIndex < saveIndex) fail('reloadDrafts must run after saveAiLeadDraftAsync');

mustInclude(css, '.ai-drafts-quick-capture', 'quick capture CSS block missing');
mustInclude(css, '.ai-drafts-quick-capture-head', 'quick capture head CSS missing');
mustInclude(css, '.ai-drafts-quick-capture-textarea', 'quick capture textarea CSS missing');
mustInclude(css, '.ai-drafts-quick-capture-actions', 'quick capture actions CSS missing');

for (const forbidden of ['STAGE230B_SQL', 'ALTER TABLE ai_drafts', 'CREATE TABLE ai_drafts']) {
  if (page.includes(forbidden)) fail('Stage230B must not add SQL marker/content: ' + forbidden);
}
console.log('STAGE230B_QUICK_CAPTURE_INBOX PASS');
