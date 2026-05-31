const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage168-remove-sales-list-label-from-cards.cjs <repo>');

const srcRoot = path.join(repo, 'src');
const touchedFile = path.join(repo, '_project', 'STAGE168_TOUCHED_FILES.txt');

const phrases = [
  'LISTA SPRZEDAŻOWA',
  'Lista sprzedażowa',
  'lista sprzedażowa',
  'LISTA SPRZEDAZOWA',
  'Lista sprzedazowa',
  'lista sprzedazowa',
  'LISTA SPRZEDAÅ»OWA',
  'Lista sprzedaÅ¼owa',
  'lista sprzedaÅ¼owa',
];

const exts = new Set(['.tsx', '.jsx', '.ts', '.js']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(p, out);
    } else if (exts.has(path.extname(entry.name))) {
      out.push(p);
    }
  }
  return out;
}

function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const phraseGroup = phrases.map(escapeRe).join('|');

function getOpenTagEnd(source, start) {
  const end = source.indexOf('>', start);
  return end < 0 ? -1 : end + 1;
}

function parseBalancedBlock(source, start) {
  const open = source.slice(start, start + 220).match(/^<([A-Za-z][A-Za-z0-9.]*)\b/);
  if (!open) return null;

  const tag = open[1];
  const openEnd = getOpenTagEnd(source, start);
  if (openEnd < 0) return null;

  const openingText = source.slice(start, openEnd);
  if (/\/\s*>$/.test(openingText)) return null;

  const token = new RegExp(`<(/?)${escapeRe(tag)}\\b[^>]*(/?)>`, 'g');
  token.lastIndex = start;

  let depth = 0;
  let m;
  while ((m = token.exec(source))) {
    const isClose = m[1] === '/';
    const isSelfClosing = m[2] === '/' || /\/\s*>$/.test(m[0]);

    if (!isClose && !isSelfClosing) depth += 1;
    if (isClose) {
      depth -= 1;
      if (depth === 0) {
        return {
          tag,
          start,
          end: token.lastIndex,
          text: source.slice(start, token.lastIndex),
          openingText,
        };
      }
    }
  }

  return null;
}

function lineStart(source, idx) {
  const p = source.lastIndexOf('\n', idx);
  return p < 0 ? 0 : p + 1;
}

function lineEnd(source, idx) {
  const p = source.indexOf('\n', idx);
  return p < 0 ? source.length : p;
}

function removeFullLine(source, start, end) {
  const s = lineStart(source, start);
  let e = lineEnd(source, end);
  if (source[e] === '\n') e += 1;
  return source.slice(0, s) + source.slice(e);
}

function removeLabelTags(source) {
  let changed = false;

  for (const phrase of phrases) {
    let idx = source.indexOf(phrase);
    let guard = 0;

    while (idx >= 0 && guard < 80) {
      guard += 1;

      const before = source.slice(Math.max(0, idx - 850), idx);
      const starts = [];
      const tagRe = /<(span|small|p|strong|div)\b[^>]*>/gi;
      let m;
      while ((m = tagRe.exec(before))) {
        starts.push(Math.max(0, idx - 850) + m.index);
      }

      let removed = false;

      for (const start of starts.reverse()) {
        const block = parseBalancedBlock(source, start);
        if (!block) continue;
        if (!(block.start <= idx && block.end >= idx + phrase.length)) continue;

        const length = block.end - block.start;
        const classLooksLikeLabel =
          /(uppercase|tracking|eyebrow|kicker|overline|badge|chip|tag|label|text-xs|text-\[|font-semibold|font-bold|meta|source)/i.test(block.openingText);
        const blockOnlyLooksLikeLabel =
          length < 900 && block.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length < 120;

        if (classLooksLikeLabel || blockOnlyLooksLikeLabel) {
          source = source.slice(0, block.start) + source.slice(block.end);
          changed = true;
          removed = true;
          break;
        }
      }

      if (!removed) {
        // Fallback: remove only visible phrase, preserving the rest of the card.
        source = source.slice(0, idx) + source.slice(idx + phrase.length);
        changed = true;
      }

      idx = source.indexOf(phrase);
    }
  }

  return { source, changed };
}

function removeStringProps(source) {
  let changed = false;
  const before = source;

  // Remove JSX props that only provide the sales-list label.
  source = source.replace(
    new RegExp(`\\s+(?:eyebrow|kicker|overline|sectionLabel|badgeLabel|sourceLabel|metaLabel|aria-label|title)=["'](?:${phraseGroup})["']`, 'g'),
    ''
  );

  // Remove object fields that only provide the sales-list label.
  source = source.replace(
    new RegExp(`\\n\\s*(?:eyebrow|kicker|overline|sectionLabel|badgeLabel|sourceLabel|metaLabel|label|title)\\s*:\\s*["'](?:${phraseGroup})["']\\s*,?`, 'g'),
    ''
  );

  if (source !== before) changed = true;
  return { source, changed };
}

function cleanupEmptyTextTags(source) {
  const before = source;

  // Collapse empty label-ish tags left after removal.
  source = source.replace(
    /<((?:span|small|p|strong))\b([^>]*)>\s*<\/\1>/g,
    (match, tag, attrs) => /(uppercase|tracking|eyebrow|kicker|overline|badge|chip|tag|label|text-xs|text-\[|font-semibold|font-bold|meta|source)/i.test(attrs) ? '' : match
  );

  source = source.replace(/\n{4,}/g, '\n\n\n');
  return { source, changed: source !== before };
}

const candidates = walk(srcRoot).filter((file) => {
  const text = fs.readFileSync(file, 'utf8');
  return phrases.some((phrase) => text.includes(phrase));
});

if (!candidates.length) {
  throw new Error('Stage168: nie znaleziono w src tekstu "LISTA SPRZEDAŻOWA" ani wariantów. Jeśli tekst pochodzi z danych runtime/DB, trzeba go usunąć w danych albo dodać runtime filtr.');
}

const touched = [];

for (const file of candidates) {
  let source = fs.readFileSync(file, 'utf8');
  const original = source;

  let r = removeStringProps(source);
  source = r.source;

  r = removeLabelTags(source);
  source = r.source;

  r = cleanupEmptyTextTags(source);
  source = r.source;

  if (source !== original) {
    fs.writeFileSync(file, source, 'utf8');
    touched.push(path.relative(repo, file));
  }
}

if (!touched.length) {
  throw new Error('Stage168: wykryto frazę, ale nie wykonano bezpiecznej zmiany.');
}

fs.mkdirSync(path.dirname(touchedFile), { recursive: true });
fs.writeFileSync(touchedFile, touched.join('\n') + '\n', 'utf8');

console.log('UPDATED files:');
for (const file of touched) console.log(' - ' + file);
console.log('Saved touched files list:', path.relative(repo, touchedFile));
