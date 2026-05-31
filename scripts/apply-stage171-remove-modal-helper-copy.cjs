const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage171-remove-modal-helper-copy.cjs <repo>');

const targets = [
  'Ustaw termin, powiązanie, przypomnienia i cykliczność wydarzenia w kalendarzu.',
  'Od do',
  'Najpierw ustaw start i koniec. Koniec pilnuje się automatycznie przy zmianie startu.',
  'Możesz zostawić brak albo ustawić powtarzanie, np. co miesiąc.',
  'Na końcu ustaw sposób przypominania i jego cykliczność.',
  'Wpisz minimum danych i zapisz kontakt. Szczegóły możesz uzupełnić później.',
  'Najważniejsze pola do szybkiego zapisania kontaktu.',
];

const srcRoot = path.join(repo, 'src');
const touchedFile = path.join(repo, '_project', 'STAGE171_TOUCHED_FILES.txt');
const exts = new Set(['.tsx', '.jsx', '.ts', '.js']);

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}
function escapeRe(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
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

function getOpenTagEnd(source, start) {
  const end = source.indexOf('>', start);
  return end < 0 ? -1 : end + 1;
}

function parseBalancedBlock(source, start) {
  const open = source.slice(start, start + 260).match(/^<([A-Za-z][A-Za-z0-9.]*)\b/);
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
        return { tag, start, end: token.lastIndex, openEnd, openingText, text: source.slice(start, token.lastIndex) };
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
function removeFullLineForBlock(source, start, end) {
  const s = lineStart(source, start);
  let e = lineEnd(source, end);
  if (source[e] === '\n') e += 1;
  return source.slice(0, s) + source.slice(e);
}

function findContainingTag(source, idx, allowedTags) {
  const windowStart = Math.max(0, idx - 2500);
  const before = source.slice(windowStart, idx);
  const starts = [];
  const tagRe = new RegExp(`<(${allowedTags.map(escapeRe).join('|')})\\b[^>]*>`, 'gi');
  let m;
  while ((m = tagRe.exec(before))) {
    starts.push(windowStart + m.index);
  }

  for (const start of starts.reverse()) {
    const block = parseBalancedBlock(source, start);
    if (!block) continue;
    if (block.start <= idx && block.end >= idx) return block;
  }
  return null;
}

function addDataHiddenAttr(openingText) {
  if (openingText.includes('data-stage171-hidden-copy=')) return openingText;
  return openingText.replace(/>$/, ' data-stage171-hidden-copy="true">');
}

function patchDialogDescription(source, idx, replacementText) {
  const block = findContainingTag(source, idx, ['DialogDescription']);
  if (!block) return null;

  const newOpening = addDataHiddenAttr(block.openingText);
  const close = `</${block.tag}>`;
  const newBlock = newOpening + replacementText + close;
  return source.slice(0, block.start) + newBlock + source.slice(block.end);
}

function removeSmallVisibleTag(source, idx) {
  const block = findContainingTag(source, idx, ['p', 'span', 'small', 'strong', 'h1', 'h2', 'h3', 'h4', 'div']);
  if (!block) return null;

  const len = block.end - block.start;
  const strippedText = block.text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Never remove a large form container accidentally. If the matching div is big, remove phrase only.
  if (block.tag === 'div' && len > 900) return null;
  if (len > 1400) return null;

  return removeFullLineForBlock(source, block.start, block.end);
}

function removePhraseOnly(source, target) {
  return source
    .replace(new RegExp(escapeRe(target), 'g'), '')
    .replace(/\n{4,}/g, '\n\n\n');
}

function cleanup(source) {
  // Remove empty paragraph/text tags left behind by exact text removal.
  source = source.replace(/<p\b([^>]*)>\s*<\/p>/g, '');
  source = source.replace(/<span\b([^>]*)>\s*<\/span>/g, '');
  source = source.replace(/<small\b([^>]*)>\s*<\/small>/g, '');
  source = source.replace(/<strong\b([^>]*)>\s*<\/strong>/g, '');

  // Remove empty wrapper divs that only held helper copy.
  source = source.replace(/<div>\s*<\/div>/g, '');

  // Collapse extra blank lines.
  source = source.replace(/[ \t]+\n/g, '\n').replace(/\n{4,}/g, '\n\n\n');
  return source;
}

function insertStyleImport() {
  const appPath = 'src/App.tsx';
  let app = read(appPath);
  const importLine = "import './styles/closeflow-remove-modal-helper-copy-stage171.css';";
  if (app.includes(importLine)) {
    console.log('SKIPPED src/App.tsx: Stage171 import already present');
    return false;
  }

  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    "closeflow-task-dialog-relation-and-field-readability-stage170.css",
    "closeflow-topic-contact-picker-readable-stage169.css",
    "closeflow-modal-footer-in-flow-no-overlay-stage166.css",
    "closeflow-modal-unified-event-motif-source-truth-stage165.css"
  ]) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes(marker)) { insertAfter = i; break; }
    }
  }
  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i++) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
    }
  }
  if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found.');

  lines.splice(insertAfter + 1, 0, importLine);
  write(appPath, lines.join('\n'));
  console.log('UPDATED src/App.tsx: added Stage171 CSS import');
  return true;
}

const touched = [];
if (insertStyleImport()) touched.push('src/App.tsx');

const candidates = walk(srcRoot).filter((file) => {
  const text = fs.readFileSync(file, 'utf8');
  return targets.some((target) => text.includes(target));
});

for (const file of candidates) {
  let source = fs.readFileSync(file, 'utf8');
  const original = source;

  for (const target of targets) {
    let guard = 0;
    let idx = source.indexOf(target);

    while (idx >= 0 && guard < 80) {
      guard += 1;

      // Preserve DialogDescription for Radix accessibility, but hide it visually.
      const dialogPatched = patchDialogDescription(source, idx, 'Opis formularza.');
      if (dialogPatched) {
        source = dialogPatched;
      } else {
        const tagRemoved = removeSmallVisibleTag(source, idx);
        if (tagRemoved) {
          source = tagRemoved;
        } else {
          source = removePhraseOnly(source, target);
        }
      }

      source = cleanup(source);
      idx = source.indexOf(target);
    }
  }

  source = cleanup(source);

  if (source !== original) {
    fs.writeFileSync(file, source, 'utf8');
    touched.push(path.relative(repo, file));
  }
}

fs.mkdirSync(path.dirname(touchedFile), { recursive: true });
fs.writeFileSync(touchedFile, [...new Set(touched)].join('\n') + '\n', 'utf8');

console.log('UPDATED files:');
for (const file of [...new Set(touched)]) console.log(' - ' + file);

if (!touched.length) {
  throw new Error('Stage171: no files changed. Expected at least App.tsx import or modal helper copy removal.');
}
