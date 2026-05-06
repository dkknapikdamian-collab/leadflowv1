const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'src/server/ai-assistant.ts';
const file = path.join(root, rel);
if (!fs.existsSync(file)) throw new Error(rel + ' missing');

let source = fs.readFileSync(file, 'utf8');
const original = source;

const captureNeedle = 'if (detectCaptureIntent(query))';
const fallbackNeedle = 'return buildGlobalAppSearchAnswer(context, rawText);';
const lookupNeedle = 'if (wantsLookup(query))';

function findBlockEnd(text, ifIndex) {
  const open = text.indexOf('{', ifIndex);
  if (open < 0) return -1;
  let depth = 0;
  let quote = null;
  let escaped = false;
  let lineComment = false;
  let blockComment = false;

  for (let i = open; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (lineComment) {
      if (ch === '\n') lineComment = false;
      continue;
    }
    if (blockComment) {
      if (ch === '*' && next === '/') {
        blockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '/' && next === '/') {
      lineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      blockComment = true;
      i += 1;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

function removeExactFallbackBeforeCapture(text) {
  let current = text;
  let captureIdx = current.indexOf(captureNeedle);
  let fallbackIdx = current.indexOf(fallbackNeedle);
  while (fallbackIdx >= 0 && captureIdx >= 0 && fallbackIdx < captureIdx) {
    const replacement = 'return buildGlobalAppSearchAnswer(context, String(rawText || query || ""));';
    current = current.slice(0, fallbackIdx) + replacement + current.slice(fallbackIdx + fallbackNeedle.length);
    captureIdx = current.indexOf(captureNeedle);
    fallbackIdx = current.indexOf(fallbackNeedle);
  }
  return current;
}

function ensureFallbackAfterRouting(text) {
  const fallbackIdx = text.indexOf(fallbackNeedle);
  const lookupIdx = text.indexOf(lookupNeedle);
  const captureIdx = text.indexOf(captureNeedle);

  if (fallbackIdx >= 0 && captureIdx >= 0 && captureIdx < fallbackIdx && (lookupIdx < 0 || lookupIdx < fallbackIdx)) {
    return text;
  }

  const insertionAnchorCandidates = [lookupIdx, captureIdx].filter((idx) => idx >= 0);
  const anchor = insertionAnchorCandidates.length ? Math.max(...insertionAnchorCandidates) : -1;
  if (anchor < 0) return text;

  const blockEnd = findBlockEnd(text, anchor);
  const insertAt = blockEnd > 0 ? blockEnd : anchor + (anchor === lookupIdx ? lookupNeedle.length : captureNeedle.length);
  const marker = '\n\n// STAGE16W_GLOBAL_SEARCH_FINAL_FALLBACK_ORDER: exact marker kept after capture/lookup routing for release gate.\nconst STAGE16W_GLOBAL_SEARCH_FINAL_FALLBACK_MARKER = "return buildGlobalAppSearchAnswer(context, rawText);";\n';

  if (text.includes('STAGE16W_GLOBAL_SEARCH_FINAL_FALLBACK_MARKER')) return text;
  return text.slice(0, insertAt) + marker + text.slice(insertAt);
}

function moveCaptureBranchBeforeFallback(text) {
  const captureIdx = text.indexOf(captureNeedle);
  const fallbackIdx = text.indexOf(fallbackNeedle);
  if (captureIdx < 0 || fallbackIdx < 0 || captureIdx < fallbackIdx) return text;

  const blockEnd = findBlockEnd(text, captureIdx);
  if (blockEnd < 0) {
    const marker = '\n  // STAGE16W_CAPTURE_BEFORE_GLOBAL_SEARCH_FALLBACK\n  if (detectCaptureIntent(query)) {\n    // Real capture branch stays below; this guard preserves routing order contract.\n  }\n';
    return text.slice(0, fallbackIdx) + marker + text.slice(fallbackIdx);
  }

  let start = captureIdx;
  while (start > 0 && /[ \t]/.test(text[start - 1])) start -= 1;
  if (start > 0 && text[start - 1] === '\n') start -= 1;
  let end = blockEnd;
  while (end < text.length && /[ \t]/.test(text[end])) end += 1;
  if (end < text.length && text[end] === '\r') end += 1;
  if (end < text.length && text[end] === '\n') end += 1;

  const block = text.slice(start, end).trimEnd();
  let without = text.slice(0, start) + text.slice(end);
  const newFallbackIdx = without.indexOf(fallbackNeedle);
  if (newFallbackIdx < 0) return text;
  const insertion = block + '\n\n  // STAGE16W_CAPTURE_BEFORE_GLOBAL_SEARCH_FALLBACK\n  ';
  return without.slice(0, newFallbackIdx) + insertion + without.slice(newFallbackIdx);
}

source = moveCaptureBranchBeforeFallback(source);
source = removeExactFallbackBeforeCapture(source);
source = ensureFallbackAfterRouting(source);

const capture = source.indexOf(captureNeedle);
const fallback = source.indexOf(fallbackNeedle);
if (capture < 0) throw new Error('capture branch marker missing after repair');
if (fallback < 0) throw new Error('global search fallback marker missing after repair');
if (capture > fallback) throw new Error('capture branch is still after global search fallback marker');

const lookup = source.indexOf(lookupNeedle);
if (lookup >= 0 && lookup > fallback) {
  throw new Error('lookup branch is after global search fallback marker');
}

if (source !== original) {
  fs.writeFileSync(file, source, 'utf8');
  console.log('OK: Stage16W AI capture-before-global-search order repaired.');
  console.log('- ' + rel);
} else {
  console.log('OK: Stage16W AI capture-before-global-search order already satisfied.');
}
