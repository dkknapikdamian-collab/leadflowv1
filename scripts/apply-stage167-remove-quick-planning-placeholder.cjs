const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage167-remove-quick-planning-placeholder.cjs <repo>');

const roots = [
  path.join(repo, 'src'),
];

const targetPhrases = [
  'Szybkie planowanie',
  'Dodanie zadania albo wydarzenia bezpośrednio z formularza',
  'Ten etap nie udaje tej funkcji',
];

const extensions = new Set(['.tsx', '.jsx', '.ts', '.js']);

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      walk(p, out);
    } else if (extensions.has(path.extname(entry.name))) {
      out.push(p);
    }
  }
  return out;
}

function getOpenTagEnd(source, start) {
  const end = source.indexOf('>', start);
  if (end < 0) return -1;
  return end + 1;
}

function parseBalancedBlock(source, start) {
  const open = source.slice(start, start + 180).match(/^<([A-Za-z][A-Za-z0-9.]*)\b/);
  if (!open) return null;
  const tag = open[1];
  const openEnd = getOpenTagEnd(source, start);
  if (openEnd < 0) return null;
  const openingText = source.slice(start, openEnd);
  if (/\/\s*>$/.test(openingText)) return null;

  const token = new RegExp(`<(/?)${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^>]*(/?)>`, 'g');
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
        return { tag, start, end: token.lastIndex, text: source.slice(start, token.lastIndex), openingText };
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

function removeExtraBlankLines(value) {
  return value.replace(/\n{4,}/g, '\n\n\n');
}

function findBestRemoval(source, phraseIndex) {
  const tagRegex = /<(div|section|article|aside|fieldset)\b[^>]*>/g;
  const candidates = [];
  let m;
  while ((m = tagRegex.exec(source))) {
    if (m.index > phraseIndex) break;
    const distance = phraseIndex - m.index;
    if (distance > 6500) continue;
    const block = parseBalancedBlock(source, m.index);
    if (!block) continue;
    if (block.start <= phraseIndex && block.end > phraseIndex) {
      const hasAnchor = targetPhrases.some((phrase) => block.text.includes(phrase));
      if (!hasAnchor) continue;
      const allKnown = targetPhrases.filter((phrase) => block.text.includes(phrase)).length;
      const openingScore =
        /rounded|border|bg-|amber|yellow|clock|quick|planning|items-center|gap|p-\d|px-|py-/i.test(block.openingText) ? 1 : 0;
      const iconScore = /Clock|lucide|clock|amber|yellow/i.test(block.text) ? 1 : 0;
      candidates.push({
        ...block,
        len: block.end - block.start,
        allKnown,
        openingScore,
        iconScore,
      });
    }
  }

  if (!candidates.length) return null;

  const strong = candidates
    .filter((c) => c.len < 4500)
    .sort((a, b) =>
      (b.allKnown - a.allKnown) ||
      (b.openingScore - a.openingScore) ||
      (b.iconScore - a.iconScore) ||
      (b.len - a.len)
    );

  const selected = strong[0] || candidates.sort((a, b) => a.len - b.len)[0];

  let start = selected.start;
  let end = selected.end;

  // Expand to full line to avoid dangling whitespace/commas in JSX layout.
  start = lineStart(source, start);
  end = lineEnd(source, end);
  if (source[end] === '\n') end += 1;

  return { start, end, removed: source.slice(start, end), selected };
}

const candidates = [];
for (const root of roots) {
  for (const file of walk(root)) {
    const source = fs.readFileSync(file, 'utf8');
    if (targetPhrases.some((phrase) => source.includes(phrase))) {
      candidates.push(file);
    }
  }
}

if (!candidates.length) {
  throw new Error('Stage167: nie znaleziono tekstu "Szybkie planowanie" ani znanych fraz placeholdera w src. Nic nie zmieniono.');
}

const touched = [];
for (const file of candidates) {
  let source = fs.readFileSync(file, 'utf8');
  let changed = false;

  let guard = 0;
  while (guard < 10) {
    guard += 1;
    const indexes = targetPhrases
      .map((phrase) => source.indexOf(phrase))
      .filter((idx) => idx >= 0)
      .sort((a, b) => a - b);

    if (!indexes.length) break;

    const removal = findBestRemoval(source, indexes[0]);
    if (!removal) {
      throw new Error(`Stage167: znaleziono frazę, ale nie udało się bezpiecznie wyciąć bloku JSX w pliku: ${path.relative(repo, file)}`);
    }

    source = source.slice(0, removal.start) + source.slice(removal.end);
    source = removeExtraBlankLines(source);
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, source, 'utf8');
    touched.push(path.relative(repo, file));
  }
}

if (!touched.length) {
  throw new Error('Stage167: nie wykonano żadnej zmiany mimo znalezionych fraz.');
}

console.log('UPDATED files:');
for (const file of touched) console.log(' - ' + file);
