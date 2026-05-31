const fs = require('fs');
const path = require('path');

const repo = process.argv[2];
if (!repo) throw new Error('Usage: node apply-stage177-leads-clients-list-layout-source-truth.cjs <repo>');

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
}

function addClassTokenToClassNameAttr(tag, token) {
  if (!/className=/.test(tag)) return tag;
  return tag.replace(/className=(["'])([^"']*)\1/, (_m, q, value) => {
    const tokens = value.split(/\s+/).filter(Boolean);
    if (!tokens.includes(token)) tokens.push(token);
    return `className=${q}${tokens.join(' ')}${q}`;
  });
}

function addDataAttr(tag, name, value = 'true') {
  if (tag.includes(`${name}=`)) return tag;
  return tag.replace(/>$/, ` ${name}="${value}">`);
}

function insertStyleImport() {
  const appPath = 'src/App.tsx';
  let app = read(appPath);
  const importLine = "import './styles/closeflow-leads-clients-list-layout-source-truth-stage177.css';";
  if (app.includes(importLine)) {
    console.log('SKIPPED src/App.tsx: Stage177 import already present');
    return;
  }

  const lines = app.split(/\r?\n/);
  let insertAfter = -1;
  for (const marker of [
    'closeflow-extend-main-search-source-truth-secondary-pages-stage175.css',
    'closeflow-main-search-surface-and-text-normalization-stage174.css',
    'closeflow-main-search-source-truth-stage173.css',
    'closeflow-record-list-source-truth.css',
    'closeflow-right-rail-source-truth.css',
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
  console.log('UPDATED src/App.tsx: added Stage177 CSS import');
}

function patchLeads() {
  const rel = 'src/pages/Leads.tsx';
  let source = read(rel);
  const original = source;

  source = source.replace(
    'className="layout-list"',
    'className="layout-list w-full max-w-none"'
  );

  source = source.replace(
    'className="table-card lead-table-card"',
    'className="table-card lead-table-card w-full max-w-none"'
  );

  source = source.replace(
    'className="relative group/lead-row"',
    'className="relative group/lead-row w-full" data-lead-card-wide-layout="true"'
  );

  source = source.replace(
    'className="row lead-row lead-card-value-block"',
    'className="row lead-row lead-card-value-block cf-lead-row-inline"'
  );

  // Search markers are defensive because local Stage173/174 may already add them.
  source = source.replace(/<div className="([^"]*\bsearch\b[^"]*)"([^>]*)data-leads-search="true"/, (match, className, attrs) => {
    let tag = `<div className="${className}"${attrs}data-leads-search="true"`;
    tag = addClassTokenToClassNameAttr(tag, 'cf-main-search');
    tag = addClassTokenToClassNameAttr(tag, 'cf-main-search-stage177');
    tag = addDataAttr(tag, 'data-cf-main-search-source', 'stage173');
    tag = addDataAttr(tag, 'data-cf-main-search-stage177', 'true');
    // addDataAttr closes a tag, but our partial match already has no > in the original regex path.
    // Remove accidental > before the rest of the original tag when needed.
    return tag.replace(/>$/, '');
  });

  source = source.replace(
    'data-stage117-leads-right-rail-layout="true"',
    'data-stage117-leads-right-rail-layout="true"\n          data-stage177-leads-clients-layout-source="true"'
  );

  source = source.replace(
    'data-stage117-leads-right-rail="true"',
    'data-stage117-leads-right-rail="true" data-stage177-leads-rail-source="clients-aligned"'
  );

  if (source !== original) {
    write(rel, source);
    console.log('UPDATED src/pages/Leads.tsx: aligned lead list classes/markers with clients');
  } else {
    console.log('SKIPPED src/pages/Leads.tsx: Stage177 markers already present');
  }
}

insertStyleImport();
patchLeads();
