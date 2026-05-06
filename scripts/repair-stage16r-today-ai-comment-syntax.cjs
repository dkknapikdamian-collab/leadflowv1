const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] || process.cwd();
const rel = path.join('src', 'components', 'TodayAiAssistant.tsx');
const file = path.join(repo, rel);

if (!fs.existsSync(file)) {
  throw new Error(rel + ' not found');
}

let source = fs.readFileSync(file, 'utf8');
const original = source;

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

source = normalizeNewlines(source).replace(/^\uFEFF/, '');

// Stage16M/16O could leave a JSDoc-like marker body at the top of the file without
// the opening /* token, which breaks esbuild on lines like: "  * Szkic leada...".
// Convert any leading orphan-star marker block before the first import into a real comment.
{
  const lines = source.split('\n');
  const firstImportIndex = lines.findIndex((line) => /^import\s/.test(line));
  if (firstImportIndex > 0) {
    const prefix = lines.slice(0, firstImportIndex);
    const rest = lines.slice(firstImportIndex);
    const meaningful = prefix.filter((line) => line.trim().length > 0);
    const hasOrphanStars = meaningful.length > 0 && meaningful.every((line) => /^\s*\*\s?/.test(line));
    if (hasOrphanStars) {
      const body = meaningful.map((line) => line.replace(/^\s*\*\s?/, ' * '));
      source = ['/* STAGE16R_AI_MARKER_COMMENT_SYNTAX_REPAIRED', ...body, ' */', '', ...rest].join('\n');
    }
  }
}

// Also repair orphan star-runs that were injected after imports/constants. We keep this
// conservative: only runs containing known AI marker/copy snippets are comment-wrapped.
{
  const lines = source.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!/^\s*\*\s?/.test(line)) {
      out.push(line);
      continue;
    }

    const run = [];
    let j = i;
    while (j < lines.length && /^\s*\*\s?/.test(lines[j])) {
      run.push(lines[j]);
      j += 1;
    }

    const runText = run.join('\n');
    const looksLikeAiMarker = /saveAiLeadDraft|askTodayAiAssistant|Szkic leada|Zapisz w szkicach AI|Otwórz w Szybkim szkicu|SpeechRecognition|AI_DIRECT_WRITE|direct_task_event|STAGE35_AI_ASSISTANT_COMPACT_UI/.test(runText);
    const previous = out.slice().reverse().find((entry) => entry.trim().length > 0) || '';
    const alreadyInComment = /\/\*|\*/.test(previous.trim());

    if (looksLikeAiMarker && !alreadyInComment) {
      out.push('/* STAGE16R_AI_ORPHAN_MARKERS_COMMENTED');
      for (const markerLine of run) out.push(markerLine.replace(/^\s*\*\s?/, ' * '));
      out.push(' */');
    } else {
      out.push(...run);
    }
    i = j - 1;
  }
  source = out.join('\n');
}

// If an earlier comment block is accidentally double-opened without closing before imports,
// add a defensive close before the first import. This is intentionally narrow.
{
  const firstImport = source.search(/^import\s/m);
  if (firstImport > 0) {
    const beforeImport = source.slice(0, firstImport);
    const opens = (beforeImport.match(/\/\*/g) || []).length;
    const closes = (beforeImport.match(/\*\//g) || []).length;
    if (opens > closes) {
      source = beforeImport + ' */\n' + source.slice(firstImport);
    }
  }
}

if (!source.includes('STAGE16R_AI_MARKER_COMMENT_SYNTAX_REPAIRED') && !source.includes('STAGE16R_AI_ORPHAN_MARKERS_COMMENTED')) {
  // Leave a harmless marker so later audits know this repair ran.
  source = source.replace(/^(import\s)/m, '// STAGE16R_AI_COMMENT_SYNTAX_CHECKED\n$1');
}

source = source.replace(/\n{4,}/g, '\n\n\n');

fs.writeFileSync(file, source, 'utf8');

console.log('OK: Stage16R TodayAiAssistant marker/comment syntax repaired.');
console.log('- ' + rel);
if (source === original) {
  console.log('No byte-level change required after normalization check.');
}
