const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage175-extend-main-search-source-truth-secondary-pages.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(repo, rel));
}

function addClassToken(value, token) {
  const tokens = String(value || '').split(/\s+/).filter(Boolean);
  if (!tokens.includes(token)) tokens.push(token);
  return tokens.join(' ');
}

function addSearchAttrsToTag(tag) {
  let out = tag;

  if (!/className=/.test(out)) {
    out = out.replace(/^<([A-Za-z][A-Za-z0-9.]*)\b/, '<$1 className="cf-main-search"');
  } else {
    out = out.replace(/className=(["'])([^"']*)\1/, (_m, q, value) => {
      return `className=${q}${addClassToken(addClassToken(value, 'cf-main-search'), 'cf-main-search-stage175')}${q}`;
    });
  }

  if (!/data-cf-main-search-source=/.test(out)) {
    out = out.replace(/>$/, ' data-cf-main-search-source="stage173">');
  }
  if (!/data-cf-main-search-stage175=/.test(out)) {
    out = out.replace(/>$/, ' data-cf-main-search-stage175="true">');
  }
  return out;
}

function insertStyleImport() {
  const appPath = 'src/App.tsx';
  let app = read(appPath);
  const importLine = "import './styles/closeflow-extend-main-search-source-truth-secondary-pages-stage175.css';";
  if (app.includes(importLine)) {
    console.log('SKIPPED src/App.tsx: Stage175 import already present');
    return;
  }

  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    'closeflow-main-search-surface-and-text-normalization-stage174.css',
    'closeflow-main-search-source-truth-stage173.css',
    'closeflow-global-client-create-dialog-stage172.css',
  ]) {
    if (insertAfter >= 0) break;
    for (let i = 0; i < lines.length; i += 1) {
      if (lines[i].includes(marker)) {
        insertAfter = i;
        break;
      }
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
  console.log('UPDATED src/App.tsx: added Stage175 CSS import');
}

function patchTagByClass(rel, classToken) {
  if (!exists(rel)) return false;
  let source = read(rel);
  const original = source;

  const re = new RegExp(`<(?:label|div)\\b[^>]*className=(["'])[^"']*\\b${classToken.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b[^"']*\\1[^>]*>`, 'g');
  source = source.replace(re, (tag) => addSearchAttrsToTag(tag));

  if (source !== original) {
    write(rel, source);
    return true;
  }
  return false;
}

function patchTasksStable() {
  const rel = 'src/pages/TasksStable.tsx';
  if (!exists(rel)) return false;
  let source = read(rel);
  const original = source;

  source = source.replace(
    '<div className="relative w-full sm:max-w-md">',
    '<div className="relative w-full sm:max-w-md cf-main-search cf-main-search-stage175" data-cf-main-search-source="stage173" data-cf-main-search-stage175="true">'
  );

  source = source.replace(
    '<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />\n                <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Szukaj zadania, sprawy albo priorytetu..." className="pl-9" />',
    '<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />\n                <Input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Szukaj zadania, sprawy albo priorytetu..." />'
  );

  if (source !== original) {
    write(rel, source);
    return true;
  }
  return false;
}

function patchTemplateLike(rel) {
  if (!exists(rel)) return false;
  let source = read(rel);
  const original = source;

  source = source.replace(/<div className="relative flex-1">/g, '<div className="relative flex-1 cf-main-search cf-main-search-stage175" data-cf-main-search-source="stage173" data-cf-main-search-stage175="true">');

  // Remove old icon padding utilities on inputs inside search sections. Stage175 CSS supplies padding.
  source = source.replace(/className="([^"]*)\bpl-10\b([^"]*)"/g, (_m, a, b) => {
    return `className="${`${a} ${b}`.replace(/\s+/g, ' ').trim()}"`;
  });
  source = source.replace(/className="([^"]*)\bpl-9\b([^"]*)"/g, (_m, a, b) => {
    return `className="${`${a} ${b}`.replace(/\s+/g, ' ').trim()}"`;
  });

  if (source !== original) {
    write(rel, source);
    return true;
  }
  return false;
}

function patchAll() {
  const touched = [];
  if (patchTasksStable()) touched.push('src/pages/TasksStable.tsx');
  if (patchTemplateLike('src/pages/Templates.tsx')) touched.push('src/pages/Templates.tsx');
  if (patchTemplateLike('src/pages/ResponseTemplates.tsx')) touched.push('src/pages/ResponseTemplates.tsx');

  for (const [rel, token] of [
    ['src/pages/Activity.tsx', 'activity-search-box'],
    ['src/pages/AiDrafts.tsx', 'ai-drafts-search-box'],
    ['src/pages/NotificationsCenter.tsx', 'notifications-search-box'],
    ['src/pages/SupportCenter.tsx', 'support-search-field'],
  ]) {
    if (patchTagByClass(rel, token)) touched.push(rel);
  }

  fs.mkdirSync(path.join(repo, '_project'), { recursive: true });
  fs.writeFileSync(path.join(repo, '_project', 'STAGE175_SEARCH_SOURCE_TOUCHED_FILES.txt'), touched.join('\n') + '\n', 'utf8');

  console.log('UPDATED Stage175 search pages:');
  for (const rel of touched) console.log(' - ' + rel);

  const required = [
    'src/pages/TasksStable.tsx',
    'src/pages/Templates.tsx',
    'src/pages/ResponseTemplates.tsx',
    'src/pages/Activity.tsx',
    'src/pages/AiDrafts.tsx',
    'src/pages/NotificationsCenter.tsx',
    'src/pages/SupportCenter.tsx',
  ];
  const missing = required.filter((rel) => !touched.includes(rel));
  if (missing.length) {
    throw new Error('Stage175 did not patch expected pages: ' + missing.join(', '));
  }
}

insertStyleImport();
patchAll();
