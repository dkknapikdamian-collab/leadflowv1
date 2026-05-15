#!/usr/bin/env node
/*
  CloseFlow Stage 1 patch:
  /clients cleanup - remove stale "Leady do spięcia" operator side card.

  Scope:
  - touches only src/pages/Clients.tsx
  - adds/updates tests/stage79-clients-no-lead-attention-rail.test.cjs from APPLY script
  - no changes to client list, client form, archive/trash, page header, or operator rail components
*/

const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const clientsFile = path.join(repoRoot, 'src', 'pages', 'Clients.tsx');

const FORBIDDEN = [
  'Leady do spięcia',
  'Leady do spi\u0119cia',
  'Brak klienta albo sprawy przy aktywnym temacie',
  'data-clients-lead-attention-rail',
  'clients-lead-attention-card',
  'data-right-rail-list="lead-attention"',
  "data-right-rail-list='lead-attention'",
  'lead-attention',
  'leadsNeedingClientOrCaseLink',
];

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${path.relative(repoRoot, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function write(file, content) {
  fs.writeFileSync(file, content, 'utf8');
}

function isQuote(ch) {
  return ch === '"' || ch === "'" || ch === '`';
}

function findTagEnd(source, start) {
  let quote = null;
  let braceDepth = 0;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const prev = source[i - 1];
    if (quote) {
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }
    if (isQuote(ch)) {
      quote = ch;
      continue;
    }
    if (ch === '{') braceDepth += 1;
    if (ch === '}') braceDepth = Math.max(0, braceDepth - 1);
    if (ch === '>' && braceDepth === 0) return i;
  }
  return -1;
}

function isSelfClosingTag(tagText) {
  return /\/\s*>\s*$/.test(tagText);
}

function findMatchingJsxClose(source, start, tagName) {
  const openingEnd = findTagEnd(source, start);
  if (openingEnd < 0) return -1;

  const openingTag = source.slice(start, openingEnd + 1);
  if (isSelfClosingTag(openingTag)) return openingEnd + 1;

  let depth = 1;
  let cursor = openingEnd + 1;
  const openNeedle = `<${tagName}`;
  const closeNeedle = `</${tagName}>`;

  while (cursor < source.length) {
    const nextOpen = source.indexOf(openNeedle, cursor);
    const nextClose = source.indexOf(closeNeedle, cursor);

    if (nextClose < 0) return -1;

    if (nextOpen >= 0 && nextOpen < nextClose) {
      const nestedEnd = findTagEnd(source, nextOpen);
      if (nestedEnd < 0) return -1;
      const nestedTag = source.slice(nextOpen, nestedEnd + 1);
      if (!isSelfClosingTag(nestedTag)) depth += 1;
      cursor = nestedEnd + 1;
      continue;
    }

    depth -= 1;
    cursor = nextClose + closeNeedle.length;
    if (depth === 0) return cursor;
  }

  return -1;
}

function expandToWholeLines(source, start, end) {
  let lineStart = start;
  while (lineStart > 0 && source[lineStart - 1] !== '\n') lineStart -= 1;

  let lineEnd = end;
  while (lineEnd < source.length && source[lineEnd] !== '\n') lineEnd += 1;
  if (lineEnd < source.length) lineEnd += 1;

  // Also remove immediately following blank line, but only one. This avoids visual holes.
  if (/^[ \t]*\r?\n/.test(source.slice(lineEnd, lineEnd + 3))) {
    const extra = source.indexOf('\n', lineEnd);
    if (extra >= 0) lineEnd = extra + 1;
  }

  return [lineStart, lineEnd];
}

function removeOperatorSideCardByTitle(source, titleLiteral) {
  let out = source;
  let removed = 0;

  while (true) {
    const titleIndex = out.indexOf(titleLiteral);
    if (titleIndex < 0) break;

    const tagStart = out.lastIndexOf('<OperatorSideCard', titleIndex);
    if (tagStart < 0) {
      fail(`Found title "${titleLiteral}" but could not locate parent <OperatorSideCard>. Manual inspection needed.`);
    }

    const tagEnd = findTagEnd(out, tagStart);
    if (tagEnd < 0 || titleIndex > tagEnd + 2) {
      fail(`Found title "${titleLiteral}" outside the opening <OperatorSideCard> tag. Manual inspection needed.`);
    }

    const removeEnd = findMatchingJsxClose(out, tagStart, 'OperatorSideCard');
    if (removeEnd < 0) {
      fail('Could not find matching </OperatorSideCard> for the stale clients lead-attention card.');
    }

    const [lineStart, lineEnd] = expandToWholeLines(out, tagStart, removeEnd);
    out = out.slice(0, lineStart) + out.slice(lineEnd);
    removed += 1;
  }

  return { source: out, removed };
}

function findStatementEnd(source, start) {
  let quote = null;
  let paren = 0;
  let brace = 0;
  let bracket = 0;

  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const prev = source[i - 1];

    if (quote) {
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }

    if (isQuote(ch)) {
      quote = ch;
      continue;
    }

    if (ch === '(') paren += 1;
    else if (ch === ')') paren = Math.max(0, paren - 1);
    else if (ch === '{') brace += 1;
    else if (ch === '}') brace = Math.max(0, brace - 1);
    else if (ch === '[') bracket += 1;
    else if (ch === ']') bracket = Math.max(0, bracket - 1);
    else if (ch === ';' && paren === 0 && brace === 0 && bracket === 0) return i + 1;
  }

  return -1;
}

function removeConstDeclaration(source, name) {
  let out = source;
  let removed = 0;
  const re = new RegExp(`(^|\\n)([ \\t]*(?:const|let|var)\\s+${name}\\s*=)`, 'm');

  while (true) {
    const match = out.match(re);
    if (!match) break;
    const declStart = match.index + match[1].length;
    const stmtEnd = findStatementEnd(out, declStart);
    if (stmtEnd < 0) {
      fail(`Could not safely remove declaration: ${name}. Missing statement semicolon or unusual syntax.`);
    }
    const [lineStart, lineEnd] = expandToWholeLines(out, declStart, stmtEnd);
    out = out.slice(0, lineStart) + out.slice(lineEnd);
    removed += 1;
  }

  return { source: out, removed };
}

function removeImportSpecifierIfUnused(source, specifier) {
  const bodyWithoutImports = source.replace(/^import[\s\S]*?;\s*$/gm, '');
  const usageRe = new RegExp(`\\b${specifier}\\b`);
  if (usageRe.test(bodyWithoutImports)) return source;

  return source.replace(/^import\s*\{([^}]+)\}\s*from\s*(['"][^'"]+['"]);?\s*$/gm, (full, specs, fromPart) => {
    const parts = specs
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .filter((p) => {
        const importedName = p.split(/\s+as\s+/i)[0].trim();
        return importedName !== specifier;
      });

    if (parts.length === 0) return '';
    return `import { ${parts.join(', ')} } from ${fromPart};`;
  });
}


function removeNamedImportSpecifierIfUnused(source, specifier) {
  const bodyWithoutImports = source.replace(/^import[\s\S]*?;\s*$/gm, '');
  const usageRe = new RegExp(`\\b${specifier}\\b`);
  if (usageRe.test(bodyWithoutImports)) return source;

  return source.replace(/^import\s+([^;]*?)\s+from\s+(['"][^'"]+['"]);?\s*$/gm, (full, importPart, fromPart) => {
    const braceStart = importPart.indexOf('{');
    const braceEnd = importPart.indexOf('}');
    if (braceStart < 0 || braceEnd < braceStart) return full;

    const before = importPart.slice(0, braceStart).replace(/,\s*$/, '').trim();
    const specs = importPart.slice(braceStart + 1, braceEnd);
    const after = importPart.slice(braceEnd + 1).trim();

    const parts = specs
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean)
      .filter((p) => {
        const importedName = p.split(/\s+as\s+/i)[0].trim();
        return importedName !== specifier;
      });

    const rebuilt = [];
    if (before) rebuilt.push(before);
    if (parts.length > 0) rebuilt.push(`{ ${parts.join(', ')} }`);
    if (after) rebuilt.push(after);

    if (rebuilt.length === 0) return '';
    return `import ${rebuilt.join(', ')} from ${fromPart};`;
  });
}

function normalizeBlankLines(source) {
  return source.replace(/\n{4,}/g, '\n\n\n');
}

let source = read(clientsFile);
const original = source;

const byPlain = removeOperatorSideCardByTitle(source, 'Leady do spięcia');
source = byPlain.source;
let removedCards = byPlain.removed;

// Fallback for escaped text in JSX source, if used.
const byEscaped = removeOperatorSideCardByTitle(source, 'Leady do spi\\u0119cia');
source = byEscaped.source;
removedCards += byEscaped.removed;

const leadConst = removeConstDeclaration(source, 'leadsNeedingClientOrCaseLink');
source = leadConst.source;

// Defensive cleanup for possible helper rails introduced in prior iterations.
for (const name of [
  'clientsLeadAttentionRail',
  'leadAttentionRailItems',
  'clientLeadAttentionItems',
  'leadAttentionItems',
]) {
  const result = removeConstDeclaration(source, name);
  source = result.source;
}

source = removeImportSpecifierIfUnused(source, 'OperatorSideCard');
source = removeNamedImportSpecifierIfUnused(source, 'useMemo');
source = normalizeBlankLines(source);

const originalHasForbidden = FORBIDDEN.some((marker) => original.includes(marker));
if (source === original && !originalHasForbidden) {
  console.log('OK: /clients was already clean. No stale lead-attention rail markers found.');
  process.exit(0);
}
if (source === original && originalHasForbidden) {
  fail('No change made to src/pages/Clients.tsx, but stale markers still exist. The rail may have a different shape. Inspect manually before continuing.');
}

for (const forbidden of FORBIDDEN) {
  if (source.includes(forbidden)) {
    fail(`Forbidden marker still exists in src/pages/Clients.tsx: ${forbidden}`);
  }
}

write(clientsFile, source);

console.log('OK: /clients stale lead-attention rail removed.');
console.log(`Removed OperatorSideCard blocks: ${removedCards}`);
console.log(`Removed leadsNeedingClientOrCaseLink declarations: ${leadConst.removed}`);
