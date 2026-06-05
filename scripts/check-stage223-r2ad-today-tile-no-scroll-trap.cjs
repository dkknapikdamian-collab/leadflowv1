const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/pages/TodayStable.tsx'), 'utf8');

function fail(message) {
  console.error('STAGE223_R2AD_TODAY_TILE_NO_SCROLL_TRAP_FAIL: ' + message);
  process.exit(1);
}

function assertIncludes(token, message) {
  if (!source.includes(token)) fail(message || ('missing token: ' + token));
}

function extractBlockFrom(sourceText, startNeedle) {
  const start = sourceText.indexOf(startNeedle);
  if (start === -1) return '';
  const open = sourceText.indexOf('{', start);
  if (open === -1) return '';
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = open; i < sourceText.length; i += 1) {
    const ch = sourceText[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return sourceText.slice(start, i + 1);
    }
  }
  return '';
}

function extractStatement(sourceText, startNeedle) {
  const start = sourceText.indexOf(startNeedle);
  if (start === -1) return '';
  let curly = 0;
  let paren = 0;
  let square = 0;
  let quote = null;
  let escaped = false;

  for (let i = start; i < sourceText.length; i += 1) {
    const ch = sourceText[i];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      continue;
    }

    if (ch === '{') curly += 1;
    if (ch === '}') curly -= 1;
    if (ch === '(') paren += 1;
    if (ch === ')') paren -= 1;
    if (ch === '[') square += 1;
    if (ch === ']') square -= 1;

    if (ch === ';' && curly === 0 && paren === 0 && square === 0) {
      return sourceText.slice(start, i + 1);
    }
  }
  return '';
}

const marker = 'STAGE223_R2AD_TODAY_TILE_NO_SCROLL_TRAP';
assertIncludes(marker, 'missing stage marker');
assertIncludes('data-cf-today-no-scroll-trap="true"', 'top metric buttons must have no-scroll marker');
assertIncludes('event.currentTarget.blur()', 'metric click must blur active button to avoid focus-scroll trap');
assertIncludes("if (tile.closest('[data-cf-today-no-scroll-trap=\"true\"]')) return;", 'root tile bridge must ignore top metric tiles');
assertIncludes("if (clickable?.closest('[data-cf-today-no-scroll-trap=\"true\"]')) return;", 'capture click bridge must ignore top metric tiles');
assertIncludes("if (clickable?.hasAttribute('aria-expanded') && clickable.querySelector('h2')) return;", 'capture click bridge must not hijack section header toggles');

const move = extractBlockFrom(source, 'function moveTodaySectionToTop');
if (!move) fail('moveTodaySectionToTop not found');
if (/insertBefore\s*\(/.test(move)) fail('moveTodaySectionToTop must not reorder DOM');

const scroll = extractBlockFrom(source, 'function scrollToTodaySection');
if (!scroll) fail('scrollToTodaySection not found');
if (/scrollIntoView\s*\(/.test(scroll)) fail('scrollToTodaySection must not call scrollIntoView');

const focus = extractStatement(source, 'const focusTodaySectionFromMetricTile =');
if (!focus) fail('focusTodaySectionFromMetricTile not found');
if (/setTimeout\s*\(/.test(focus)) fail('focus helper must not use delayed scroll/reorder');
if (/moveTodaySectionToTop\s*\(/.test(focus)) fail('focus helper must not call moveTodaySectionToTop');
if (/scrollToTodaySection\s*\(/.test(focus)) fail('focus helper must not call scrollToTodaySection');

const rootHandler = extractStatement(source, 'const handleMetricTileClick =');
if (!rootHandler) fail('handleMetricTileClick not found');
if (/setTimeout\s*\(/.test(rootHandler)) fail('root metric tile handler must not use delayed scroll/reorder');
if (!rootHandler.includes("if (tile.closest('[data-cf-today-no-scroll-trap=\"true\"]')) return;")) fail('root metric tile handler must ignore top metric buttons');

const captureHandler = extractStatement(source, 'const handleTileClick =');
if (!captureHandler) fail('handleTileClick not found');
if (/setTimeout\s*\(/.test(captureHandler)) fail('capture tile handler must not use delayed scroll/reorder');
if (!captureHandler.includes("if (clickable?.closest('[data-cf-today-no-scroll-trap=\"true\"]')) return;")) fail('capture tile handler must ignore top metric buttons');
if (!captureHandler.includes("if (clickable?.hasAttribute('aria-expanded') && clickable.querySelector('h2')) return;")) fail('capture tile handler must ignore section header buttons');

const tileButtonPattern = /<button[\s\S]*?key=\{tile\.key\}[\s\S]*?data-cf-today-no-scroll-trap="true"[\s\S]*?onClick=\{\(event\) => \{[\s\S]*?event\.preventDefault\(\);[\s\S]*?event\.stopPropagation\(\);[\s\S]*?event\.currentTarget\.blur\(\);[\s\S]*?setCollapsedSections\(\(current\) =>/;
if (!tileButtonPattern.test(source)) {
  fail('top metric tile button must expand/collapse in place with preventDefault/stopPropagation/blur');
}

assertIncludes('TODAY_SECTION_KEYS.filter((entry) => entry !== tile.key)', 'top tile click should uncollapse only selected section');
assertIncludes('setActiveTodaySection(active ? null : tile.key)', 'top tile click should update active state without scroll');

console.log('STAGE223_R2AD_TODAY_TILE_NO_SCROLL_TRAP: OK');
