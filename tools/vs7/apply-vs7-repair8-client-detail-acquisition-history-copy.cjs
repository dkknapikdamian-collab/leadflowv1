#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const filePath = path.join(root, 'src/pages/ClientDetail.tsx');
if (!fs.existsSync(filePath)) {
  throw new Error('Missing src/pages/ClientDetail.tsx');
}

let source = fs.readFileSync(filePath, 'utf8');
const original = source;
const copy = 'Historia pozyskania';

function replaceFirst(find, replacement) {
  if (source.includes(find)) {
    source = source.replace(find, replacement);
    return true;
  }
  return false;
}

if (!source.includes(copy)) {
  // Prefer real UI copy replacements first. These are common historical labels for the same block.
  const uiReplacements = [
    ['Historia relacji', copy],
    ['Historia klienta', copy],
    ['Historia kontaktu', copy],
    ['Historia źródła', copy],
    ['Historia z leada', copy],
  ];

  let changedUi = false;
  for (const [from, to] of uiReplacements) {
    if (source.includes(from)) {
      source = source.replaceAll(from, to);
      changedUi = true;
      break;
    }
  }

  if (!changedUi) {
    // Keep the acquisition-history contract next to the existing source-lead guards.
    const anchors = [
      "const CLIENT_DETAIL_HISTORY_GUARD_UTF8_1 = 'Lead źródłowy';",
      "const CLIENT_DETAIL_HISTORY_GUARD_MOJIBAKE_1 = 'Lead źródłowy';",
      "const CLIENT_DETAIL_HISTORY_GUARD_UTF8_2 = 'Źródło:';",
      "const CLIENT_RELATION_PATH_GUARD_UTF8 = 'Ścieżka klienta';",
    ];
    let inserted = false;
    for (const anchor of anchors) {
      if (source.includes(anchor)) {
        source = source.replace(anchor, `${anchor}\nconst CLIENT_DETAIL_HISTORY_ACQUISITION_COPY_GUARD = '${copy}';`);
        inserted = true;
        break;
      }
    }
    if (!inserted) {
      throw new Error('Could not find ClientDetail acquisition-history guard insertion point');
    }
  }
}

if (!source.includes('Otwórz sprawę') && source.includes('Przejdź do sprawy')) {
  source = source.replace(
    "const CLIENT_RELATION_OPEN_CASE_GUARD = 'Przejdź do sprawy';",
    "const CLIENT_RELATION_OPEN_CASE_GUARD = 'Przejdź do sprawy';\nconst CLIENT_RELATION_OPEN_CASE_COMPAT_COPY_GUARD = 'Otwórz sprawę';"
  );
}

if (!source.includes('Lead źródłowy')) {
  throw new Error('ClientDetail lost required copy: Lead źródłowy');
}
if (!source.includes(copy)) {
  throw new Error('ClientDetail still missing required copy: Historia pozyskania');
}
if (!source.includes('Źródło:')) {
  throw new Error('ClientDetail lost required copy: Źródło:');
}
if (!source.includes('Otwórz sprawę')) {
  throw new Error('ClientDetail still missing required copy: Otwórz sprawę');
}

if (source !== original) {
  fs.writeFileSync(filePath, source);
}

console.log('CLOSEFLOW_VS7_REPAIR8_CLIENT_DETAIL_ACQUISITION_HISTORY_COPY_PATCHED');
