#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

const scanTargets = [
  path.join(root, 'src', 'pages'),
  path.join(root, 'src', 'components'),
  path.join(root, 'src', 'lib', 'options.ts'),
];

const allowedExtensions = new Set(['.ts', '.tsx', '.js', '.jsx']);

const bannedPatterns = [
  {
    id: 'timeline-faster-than-heavy-grid',
    pattern: /(?:uklad|uk\u0142ad)\s+osi\s+czasu\s+jest\s+szybsz[ay]\s+ni\u017C\s+(?:ciezka|ci\u0119\u017Cka)\s+siatka/i,
    reason: 'Do not expose internal layout rationale in paid UI.',
  },
  {
    id: 'faster-than-heavy-grid',
    pattern: /szybsz[ay]\s+ni\u017C\s+(?:ciezk|ci\u0119\u017Ck)[a-z\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C]*\s+siatk/i,
    reason: 'Do not compare implementation choices in user-facing copy.',
  },
  {
    id: 'heavy-grid-rationale',
    pattern: /(?:ciezka|ci\u0119\u017Cka)\s+siatka/i,
    reason: 'Internal design comparison belongs in docs, not UI.',
  },
  {
    id: 'mvp-visible-copy',
    pattern: /\bMVP\b|\bminimum viable product\b/i,
    reason: 'Paid UI should not describe itself as MVP.',
  },
  {
    id: 'stage-visible-copy',
    pattern: /\bStage0?\d\b|\bEtap\s+\d\b|na\s+tym\s+etapie/i,
    reason: 'Implementation stage language must stay out of visible copy.',
  },
  {
    id: 'technical-visible-copy',
    pattern: /\btechnicznie\s+(?:bezpiecz|szyb|latw|\u0142atw|prost)/i,
    reason: 'Technical rationale must stay out of visible copy.',
  },
];

function normalizeForAsciiFallback(text) {
  return text
    .replace(/\u0105/g, 'a').replace(/\u0107/g, 'c').replace(/\u0119/g, 'e').replace(/\u0142/g, 'l')
    .replace(/\u0144/g, 'n').replace(/\u00F3/g, 'o').replace(/\u015B/g, 's').replace(/\u017C/g, 'z').replace(/\u017A/g, 'z')
    .replace(/\u0104/g, 'A').replace(/\u0106/g, 'C').replace(/\u0118/g, 'E').replace(/\u0141/g, 'L')
    .replace(/\u0143/g, 'N').replace(/\u00D3/g, 'O').replace(/\u015A/g, 'S').replace(/\u017B/g, 'Z').replace(/\u0179/g, 'Z');
}

function listFiles(target) {
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return allowedExtensions.has(path.extname(target)) ? [target] : [];

  const result = [];
  for (const entry of fs.readdirSync(target, { withFileTypes: true })) {
    const fullPath = path.join(target, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
      result.push(...listFiles(fullPath));
    } else if (entry.isFile() && allowedExtensions.has(path.extname(entry.name))) {
      result.push(fullPath);
    }
  }
  return result;
}

function stripBlockComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '');
}

function stripLineComment(line) {
  const index = line.indexOf('//');
  return index >= 0 ? line.slice(0, index) : line;
}

function isTechnicalOnlyLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith('import ')) return true;
  if (trimmed.startsWith('export type ')) return true;
  if (trimmed.startsWith('type ')) return true;
  if (trimmed.startsWith('interface ')) return true;
  if (trimmed.includes('data-')) return true;
  if (trimmed.includes('className=')) return true;
  if (trimmed.includes('aria-')) return true;
  if (trimmed.includes('htmlFor=')) return true;
  return false;
}

function extractQuotedText(line) {
  const result = [];
  const regex = /(['"`])((?:\\.|(?!\1)[\s\S])*)\1/g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const value = match[2]
      .replace(/\\n/g, ' ')
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\`/g, '`');
    if (/[A-Za-z\u0104\u0106\u0118\u0141\u0143\u00D3\u015A\u0179\u017B\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C]/.test(value)) result.push(value);
  }
  return result;
}

function extractJsxText(line) {
  const result = [];
  const regex = />\s*([^<>{}][^<>{}]*)\s*</g;
  let match;
  while ((match = regex.exec(line)) !== null) {
    const value = match[1].trim();
    if (/[A-Za-z\u0104\u0106\u0118\u0141\u0143\u00D3\u015A\u0179\u017B\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C]/.test(value)) result.push(value);
  }
  return result;
}

function addHit(hits, hit) {
  const key = hit.file + ':' + hit.line + ':' + hit.id;
  if (hits.some((item) => item.key === key)) return;
  hits.push({ ...hit, key });
}

function scanCandidate(candidate, file, lineNumber) {
  const hits = [];
  const ascii = normalizeForAsciiFallback(candidate);

  for (const item of bannedPatterns) {
    if (item.pattern.test(candidate) || item.pattern.test(ascii)) {
      addHit(hits, {
        file: path.relative(root, file).replace(/\\/g, '/'),
        line: lineNumber,
        id: item.id,
        reason: item.reason,
        text: candidate.trim().slice(0, 240),
      });
    }
  }

  return hits;
}

function scanFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const noBlockComments = stripBlockComments(raw);
  const lines = noBlockComments.split(/\r?\n/);
  const hits = [];

  lines.forEach((originalLine, index) => {
    const line = stripLineComment(originalLine);
    if (isTechnicalOnlyLine(line)) return;

    for (const item of bannedPatterns.slice(0, 3)) {
      const asciiLine = normalizeForAsciiFallback(line);
      if (item.pattern.test(line) || item.pattern.test(asciiLine)) {
        addHit(hits, {
          file: path.relative(root, file).replace(/\\/g, '/'),
          line: index + 1,
          id: item.id,
          reason: item.reason,
          text: line.trim().slice(0, 240),
        });
      }
    }

    const candidates = [...extractQuotedText(line), ...extractJsxText(line)];
    for (const candidate of candidates) {
      for (const hit of scanCandidate(candidate, file, index + 1)) addHit(hits, hit);
    }
  });

  return hits;
}

const files = scanTargets.flatMap(listFiles);
const hits = files.flatMap(scanFile).map(({ key, ...hit }) => hit);

console.log('== UI developer copy paid-readiness guard v4 ==');
console.log('Scanned files: ' + files.length);

if (hits.length) {
  console.error('');
  console.error('FAIL Found likely visible developer/internal copy:');
  for (const hit of hits) {
    console.error('- ' + hit.file + ':' + hit.line + ' [' + hit.id + '] ' + hit.reason);
    console.error('  ' + hit.text);
  }
  console.error('');
  console.error('Replace with product copy or remove the sentence entirely.');
  process.exit(1);
}

console.log('PASS No likely visible developer/internal copy found.');
