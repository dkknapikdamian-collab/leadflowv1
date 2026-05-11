#!/usr/bin/env node
/*
  CLOSEFLOW_ETAP3_CLIENTS_WIDE_LAYOUT_REPAIR
  Scope: /clients only.
  Goal: restore full-width, readable client cards without fixed desktop width or scale hacks.
*/
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const stage = 'CLOSEFLOW_ETAP3_CLIENTS_WIDE_LAYOUT';
const clientsPath = path.join(repo, 'src', 'pages', 'Clients.tsx');
const cssPath = path.join(repo, 'src', 'styles', 'clients-next-action-layout.css');
const packagePath = path.join(repo, 'package.json');

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${path.relative(repo, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function writeIfChanged(file, next) {
  const before = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (before !== next) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, next, 'utf8');
    console.log(`updated ${path.relative(repo, file)}`);
  } else {
    console.log(`unchanged ${path.relative(repo, file)}`);
  }
}

function ensureClientsImport(source) {
  if (source.includes("../styles/clients-next-action-layout.css")) return source;
  const anchor = "import '../styles/visual-stage23-client-case-forms-vnext.css';";
  if (!source.includes(anchor)) fail('Clients.tsx: CSS import anchor not found.');
  return source.replace(anchor, `${anchor}\nimport '../styles/clients-next-action-layout.css';`);
}

function ensureWideLayoutMarkup(source) {
  let next = source;

  if (!next.includes('data-clients-wide-layout="true"')) {
    next = next.replace(
      /<div\s+className="layout-list">/,
      '<div className="layout-list w-full max-w-none" data-clients-wide-layout="true">',
    );
  }

  // Keep loading, empty and real-list table cards aligned with the same full-width contract.
  next = next.replace(/className="table-card"/g, 'className="table-card w-full max-w-none"');

  if (!next.includes('data-client-card-wide-layout="true"')) {
    next = next.replace(
      /<div\s+key=\{client\.id\}\s+className="([^"]*\brelative\b[^"]*\bgroup\/client-card\b[^"]*)">/,
      (_match, className) => {
        const classes = className.split(/\s+/).filter(Boolean);
        if (!classes.includes('w-full')) classes.push('w-full');
        return `<div key={client.id} className="${classes.join(' ')}" data-client-card-wide-layout="true">`;
      },
    );
  }

  if (!next.includes('data-client-card-wide-layout="true"')) {
    fail('Clients.tsx: could not mark relative group/client-card with data-client-card-wide-layout.');
  }
  if (!next.includes('data-clients-wide-layout="true"')) {
    fail('Clients.tsx: could not mark layout-list with data-clients-wide-layout.');
  }

  return next;
}

function ensureCss(source) {
  if (source.includes(stage)) return source;
  const block = `

/* ${stage}
   owner: CloseFlow UI system
   reason: /clients client card regressed into a narrow column on wide desktop screens
   scope: /clients list only
   rule: use available content width, never fixed desktop width or transform scale
*/
.main-clients-html .layout-list {
  width: 100% !important;
  max-width: none !important;
  min-width: 0;
  display: block;
}

.main-clients-html .layout-list > .stack {
  width: 100% !important;
  max-width: none !important;
  min-width: 0;
}

.main-clients-html .table-card {
  width: 100% !important;
  max-width: none !important;
  min-width: 0;
  box-sizing: border-box;
}

.main-clients-html .table-card > .relative,
.main-clients-html .group\\/client-card,
.main-clients-html [class*="group/client-card"] {
  width: 100% !important;
  max-width: none !important;
  min-width: 0;
  box-sizing: border-box;
}

.main-clients-html .table-card > .relative > a,
.main-clients-html .table-card > .relative > a.block,
.main-clients-html [data-client-card-wide-layout="true"] > a {
  display: block;
  width: 100%;
  max-width: none;
  min-width: 0;
}

.main-clients-html .client-row {
  width: 100% !important;
  max-width: none !important;
  min-width: 0;
  box-sizing: border-box;
}

.main-clients-html .client-row > .lead-main-cell,
.main-clients-html .client-row > .lead-action-cell,
.main-clients-html .client-row > .client-card-next-action-block {
  min-width: 0;
}

.main-clients-html .cf-list-row-meta,
.main-clients-html .statusline {
  max-width: 100%;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.main-clients-html .cf-list-row-meta > *,
.main-clients-html .statusline > * {
  min-width: 0;
}

.main-clients-html .cf-list-row-contact,
.main-clients-html .cf-list-row-value,
.main-clients-html .cf-chip-client-value,
.main-clients-html .cf-chip-last-contact {
  overflow-wrap: anywhere;
}

.cf-client-card-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 360px);
  gap: 1rem;
  align-items: stretch;
}

@media (min-width: 901px) {
  .main-clients-html .client-row {
    grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) minmax(260px, 360px) !important;
  }

  .main-clients-html .client-row > .lead-value-cell {
    min-width: 260px;
  }
}

@media (max-width: 900px) {
  .cf-client-card-grid {
    grid-template-columns: 1fr;
  }

  .main-clients-html .client-row {
    grid-template-columns: minmax(2.25rem, auto) minmax(0, 1fr) !important;
  }
}

@media (max-width: 520px) {
  .main-clients-html .layout-list,
  .main-clients-html .layout-list > .stack,
  .main-clients-html .table-card,
  .main-clients-html [class*="group/client-card"] {
    width: 100% !important;
    max-width: 100% !important;
  }
}
`;
  return source.replace(/\s*$/, '') + block + '\n';
}

function ensurePackageScript(source) {
  const pkg = JSON.parse(source);
  pkg.scripts = pkg.scripts || {};
  const key = 'check:etap3-clients-wide-layout';
  const value = 'node scripts/check-closeflow-etap3-clients-wide-layout.cjs';
  if (pkg.scripts[key] !== value) {
    pkg.scripts[key] = value;
  }
  return JSON.stringify(pkg, null, 2) + '\n';
}

let clients = read(clientsPath);
clients = ensureClientsImport(clients);
clients = ensureWideLayoutMarkup(clients);
writeIfChanged(clientsPath, clients);

let css = read(cssPath);
css = ensureCss(css);
writeIfChanged(cssPath, css);

let pkg = read(packagePath);
pkg = ensurePackageScript(pkg);
writeIfChanged(packagePath, pkg);

console.log(`✔ ${stage} repair applied`);
