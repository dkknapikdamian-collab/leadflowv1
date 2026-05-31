const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage174-main-search-surface-and-text-normalization.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function insertStyleImport() {
  const appPath = 'src/App.tsx';
  let app = read(appPath);
  const importLine = "import './styles/closeflow-main-search-surface-and-text-normalization-stage174.css';";
  if (app.includes(importLine)) {
    console.log('SKIPPED src/App.tsx: Stage174 import already present');
    return false;
  }

  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    'closeflow-main-search-source-truth-stage173.css',
    'closeflow-global-client-create-dialog-stage172.css',
    'closeflow-remove-modal-helper-copy-stage171.css',
    'closeflow-task-dialog-relation-and-field-readability-stage170.css',
  ]) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes(marker)) { insertAfter = i; break; }
    }
  }

  if (insertAfter < 0) {
    for (let i = 0; i < lines.length; i += 1) {
      if (/^import ['"]\.\/styles\//.test(lines[i])) insertAfter = i;
    }
  }
  if (insertAfter < 0) throw new Error('App.tsx: no ./styles imports found.');

  lines.splice(insertAfter + 1, 0, importLine);
  write(appPath, lines.join('\n'));
  console.log('UPDATED src/App.tsx: added Stage174 CSS import');
  return true;
}

function patchCasesPlaceholder() {
  const rel = 'src/pages/Cases.tsx';
  let source = read(rel);
  const original = source;

  const standard = 'Szukaj po nazwie, telefonie, e-mailu, firmie albo sprawie...';
  const variants = [
    'Szukaj sprawy, klienta, telefonu, maila albo statusu...',
    'Szukaj sprawy, klienta, telefonu, e-maila albo statusu...',
    'Szukaj sprawy, klienta, telefonu, e-mailu albo statusu...',
  ];

  for (const variant of variants) {
    source = source.replaceAll(variant, standard);
  }

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/pages/Cases.tsx: normalized cases search placeholder');
    return true;
  }

  console.log('SKIPPED src/pages/Cases.tsx: cases placeholder already normalized or variant not found');
  return false;
}

function ensureSearchMarkersInTasks() {
  // Stage173 may not catch Tasks when its search markup has a different class.
  // Stage174 is defensive: if a page has a search-looking input wrapper, mark it.
  const rels = ['src/pages/Tasks.tsx'];
  const touched = [];
  for (const rel of rels) {
    if (!fs.existsSync(path.join(repo, rel))) continue;
    let source = read(rel);
    const original = source;

    source = source.replace(/<div\b([^>]*className=(["'])([^"']*\bsearch\b[^"']*)\2[^>]*)>/g, (match, attrs, quote, className) => {
      const index = source.indexOf(match);
      const nearby = source.slice(Math.max(0, index - 500), Math.min(source.length, index + match.length + 900));
      if (!/Szukaj|searchQuery|setSearch|setSearchQuery/i.test(nearby)) return match;

      let nextAttrs = attrs.replace(/className=(["'])([^"']*)\1/, (_m, q, value) => {
        const tokens = value.split(/\s+/).filter(Boolean);
        if (!tokens.includes('cf-main-search')) tokens.push('cf-main-search');
        return `className=${q}${tokens.join(' ')}${q}`;
      });

      if (!/data-cf-main-search-source=/.test(nextAttrs)) {
        nextAttrs += ' data-cf-main-search-source="stage173"';
      }
      if (!/data-cf-main-search-stage174=/.test(nextAttrs)) {
        nextAttrs += ' data-cf-main-search-stage174="true"';
      }

      return `<div${nextAttrs}>`;
    });

    if (source !== original) {
      write(rel, source);
      touched.push(rel);
    }
  }

  if (touched.length) {
    console.log('UPDATED additional search marker pages:');
    for (const rel of touched) console.log(' - ' + rel);
  }
}

insertStyleImport();
patchCasesPlaceholder();
ensureSearchMarkersInTasks();
