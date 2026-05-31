const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage173-main-search-source-truth.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function insertStyleImport() {
  const appPath = 'src/App.tsx';
  let app = read(appPath);
  const importLine = "import './styles/closeflow-main-search-source-truth-stage173.css';";
  if (app.includes(importLine)) {
    console.log('SKIPPED src/App.tsx: Stage173 import already present');
    return false;
  }

  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    'closeflow-global-client-create-dialog-stage172.css',
    'closeflow-remove-modal-helper-copy-stage171.css',
    'closeflow-task-dialog-relation-and-field-readability-stage170.css',
    'closeflow-topic-contact-picker-readable-stage169.css',
    'closeflow-record-list-source-truth.css',
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
  console.log('UPDATED src/App.tsx: added Stage173 CSS import');
  return true;
}

function addClassToken(classValue, token) {
  const tokens = String(classValue || '').split(/\s+/).filter(Boolean);
  if (!tokens.includes(token)) tokens.push(token);
  return tokens.join(' ');
}

function patchMainSearchTags(source) {
  return source.replace(/<div\b([^>]*className=(["'])([^"']*\bsearch\b[^"']*)\2[^>]*)>/g, (match, attrs, quote, className) => {
    // Only patch search containers that are real main-section search bars.
    const nearby = source.slice(Math.max(0, source.indexOf(match) - 500), Math.min(source.length, source.indexOf(match) + match.length + 900));
    if (!/Szukaj|searchQuery|setSearch|setSearchQuery|lead-search-suggestions/i.test(nearby)) return match;

    let nextAttrs = attrs.replace(/className=(["'])([^"']*)\1/, (_m, q, value) => {
      return `className=${q}${addClassToken(value, 'cf-main-search')}${q}`;
    });

    if (!/data-cf-main-search-source=/.test(nextAttrs)) {
      nextAttrs += ' data-cf-main-search-source="stage173"';
    }

    return `<div${nextAttrs}>`;
  });
}

function patchPages() {
  const pagesDir = path.join(repo, 'src', 'pages');
  const candidates = fs.existsSync(pagesDir)
    ? fs.readdirSync(pagesDir).filter((name) => /\.(tsx|jsx)$/.test(name)).map((name) => path.join('src', 'pages', name))
    : [];

  const touched = [];

  for (const rel of candidates) {
    const abs = path.join(repo, rel);
    let source = fs.readFileSync(abs, 'utf8');
    if (!/className=(["'])[^"']*\bsearch\b[^"']*\1/.test(source)) continue;
    if (!/Szukaj|searchQuery|setSearch|setSearchQuery|lead-search-suggestions/i.test(source)) continue;

    const next = patchMainSearchTags(source);
    if (next !== source) {
      fs.writeFileSync(abs, next, 'utf8');
      touched.push(rel);
    }
  }

  fs.mkdirSync(path.join(repo, '_project'), { recursive: true });
  fs.writeFileSync(path.join(repo, '_project', 'STAGE173_MAIN_SEARCH_TOUCHED_FILES.txt'), touched.join('\n') + '\n', 'utf8');

  console.log('UPDATED search pages:');
  for (const rel of touched) console.log(' - ' + rel);

  if (!touched.some((rel) => rel.endsWith('Clients.tsx'))) {
    throw new Error('Stage173 expected to patch src/pages/Clients.tsx search bar.');
  }
  if (!touched.some((rel) => rel.endsWith('Leads.tsx'))) {
    throw new Error('Stage173 expected to patch src/pages/Leads.tsx search bar.');
  }
}

insertStyleImport();
patchPages();
