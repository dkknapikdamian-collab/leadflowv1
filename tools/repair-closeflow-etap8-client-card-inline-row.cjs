#!/usr/bin/env node
/* CLOSEFLOW_ETAP8_REPAIR3_CLIENT_CARD_INLINE_ROW_GUARDED */
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function abs(rel) {
  return path.join(root, rel);
}

function read(rel) {
  const file = abs(rel);
  if (!fs.existsSync(file)) throw new Error(`Missing required file: ${rel}`);
  return fs.readFileSync(file, 'utf8');
}

function write(rel, content) {
  fs.writeFileSync(abs(rel), content, 'utf8');
}

function backup(rel) {
  const file = abs(rel);
  if (!fs.existsSync(file)) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = abs(path.join('.closeflow-recovery-backups', `etap8-repair3-${stamp}`, rel));
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(file, dest);
}

function uniqClassList(value) {
  return value.split(/\s+/).filter(Boolean).filter((item, index, arr) => arr.indexOf(item) === index).join(' ');
}

function addClass(value, token) {
  return uniqClassList(`${value || ''} ${token}`);
}

function addClassToExact(src, from, token) {
  if (!src.includes(from)) return src;
  const next = from.replace(/className="([^"]*)"/, (_m, cls) => `className="${addClass(cls, token)}"`);
  return src.split(from).join(next);
}

function addClassToStaticClassName(src, predicate, token) {
  let changed = false;
  const next = src.replace(/className=(["'`])([^"'`]*?)\1/g, (match, quote, classes) => {
    if (!predicate(classes)) return match;
    changed = true;
    return `className=${quote}${addClass(classes, token)}${quote}`;
  });
  return { src: next, changed };
}

function addClassToBraceStringClassName(src, predicate, token) {
  let changed = false;
  const next = src.replace(/className=\{(["'`])([^"'`]*?)\1\}/g, (match, quote, classes) => {
    if (!predicate(classes)) return match;
    changed = true;
    return `className={${quote}${addClass(classes, token)}${quote}}`;
  });
  return { src: next, changed };
}

function addTokenEverywhereInClassNames(src, predicate, token) {
  let result = src;
  let any = false;
  for (const fn of [addClassToStaticClassName, addClassToBraceStringClassName]) {
    const out = fn(result, predicate, token);
    result = out.src;
    any = any || out.changed;
  }
  return { src: result, changed: any };
}

function ensurePackageScript() {
  const rel = 'package.json';
  backup(rel);
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:etap8-client-card-inline-row'] = 'node scripts/check-closeflow-etap8-client-card-inline-row.cjs';
  write(rel, `${JSON.stringify(pkg, null, 2)}\n`);
}

function removeEtap8Blocks(css) {
  const marker = '/* CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW */';
  let output = css;
  while (output.includes(marker)) {
    const start = output.indexOf(marker);
    const next = output.indexOf('\n/* CLOSEFLOW_', start + marker.length);
    if (next >= 0) {
      output = `${output.slice(0, start).trimEnd()}\n\n${output.slice(next + 1).trimStart()}`;
    } else {
      output = output.slice(0, start).trimEnd();
    }
  }
  return output;
}

function ensureCss() {
  const rel = 'src/styles/clients-next-action-layout.css';
  backup(rel);
  let css = read(rel);
  css = removeEtap8Blocks(css);

  const block = `
/* CLOSEFLOW_ETAP8_CLIENT_CARD_INLINE_ROW */
.main-clients-html .client-row.cf-client-row-inline {
  display: grid;
  grid-template-columns:
    minmax(2.25rem, auto)
    minmax(280px, 1.5fr)
    minmax(120px, 0.45fr)
    minmax(260px, 0.95fr)
    auto;
  align-items: center;
  gap: 0.875rem;
}

.main-clients-html .cf-client-main-cell {
  min-width: 0;
}

.main-clients-html .cf-client-cases-cell {
  min-width: 0;
}

.main-clients-html .cf-client-next-action-inline {
  min-width: 0;
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.main-clients-html .cf-client-row-actions {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.5rem;
  white-space: nowrap;
}

@media (max-width: 75rem) {
  .main-clients-html .client-row.cf-client-row-inline {
    grid-template-columns:
      minmax(2.25rem, auto)
      minmax(240px, 1fr)
      minmax(220px, 0.9fr);
  }

  .main-clients-html .cf-client-cases-cell,
  .main-clients-html .cf-client-row-actions {
    grid-column: 2 / -1;
  }
}

@media (max-width: 47.5rem) {
  .main-clients-html .client-row.cf-client-row-inline {
    grid-template-columns: auto minmax(0, 1fr);
    align-items: start;
  }

  .main-clients-html .cf-client-next-action-inline,
  .main-clients-html .cf-client-cases-cell,
  .main-clients-html .cf-client-row-actions {
    grid-column: 2 / -1;
  }

  .main-clients-html .cf-client-row-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
`.trim();

  css = `${css.trimEnd()}\n\n${block}\n`;

  // ETAP3 guard is intentionally strict and flags literal fixed desktop widths.
  // Breakpoints use rem values, so do not reintroduce forbidden px literals here.
  if (/\b(?:1100|1200)px\b/i.test(css)) {
    throw new Error('clients-next-action-layout.css still contains forbidden 1100px/1200px literal after ETAP8 repair. Remove fixed-width leftovers before continuing.');
  }

  write(rel, css);
}

function ensureClientsMarkup() {
  const rel = 'src/pages/Clients.tsx';
  backup(rel);
  let src = read(rel);

  if (!src.includes('data-client-card-wide-layout="true"')) {
    throw new Error('Clients.tsx does not contain data-client-card-wide-layout="true". Stop: wrong file state.');
  }
  if (!src.includes('className="relative group/client-card w-full"')) {
    throw new Error('Clients.tsx does not contain the expected client card wrapper class. Stop: wrong file state.');
  }
  if (!src.includes('cf-client-next-action-panel')) {
    throw new Error('Clients.tsx must keep cf-client-next-action-panel before ETAP8 repair can continue.');
  }

  // Exact current markup on dev-rollout-freeze after the failed ETAP8 commit.
  src = addClassToExact(src, '<div className="row client-row">', 'cf-client-row-inline');
  src = addClassToExact(src, '<span className="lead-main-cell min-w-0">', 'cf-client-main-cell');
  src = addClassToExact(src, '<span className="lead-value-cell">', 'cf-client-cases-cell');
  src = addClassToExact(src, '<span className="lead-action-cell client-card-next-action-block cf-client-next-action-panel">', 'cf-client-next-action-inline');
  src = addClassToExact(src, '<span className="lead-actions client-card-action-buttons">', 'cf-client-row-actions');

  // Conservative fallbacks for formatted or slightly changed markup.
  let out = addTokenEverywhereInClassNames(src, (classes) => /\brow\b/.test(classes) && /\bclient-row\b/.test(classes), 'cf-client-row-inline');
  src = out.src;
  out = addTokenEverywhereInClassNames(src, (classes) => /\blead-main-cell\b/.test(classes), 'cf-client-main-cell');
  src = out.src;
  out = addTokenEverywhereInClassNames(src, (classes) => /\blead-value-cell\b/.test(classes) || /\bclient-cases-cell\b/.test(classes) || /\bclient-case-cell\b/.test(classes), 'cf-client-cases-cell');
  src = out.src;
  out = addTokenEverywhereInClassNames(src, (classes) => /\bcf-client-next-action-panel\b/.test(classes) || /\bclient-card-next-action-block\b/.test(classes), 'cf-client-next-action-inline');
  src = out.src;
  out = addTokenEverywhereInClassNames(src, (classes) => /\blead-actions\b/.test(classes) || /\bclient-card-action-buttons\b/.test(classes) || /\bclient-row-actions\b/.test(classes), 'cf-client-row-actions');
  src = out.src;

  const required = [
    'cf-client-row-inline',
    'cf-client-main-cell',
    'cf-client-cases-cell',
    'cf-client-next-action-inline',
    'cf-client-row-actions',
  ];
  const missing = required.filter((token) => !src.includes(token));
  if (missing.length) {
    const cardAt = src.indexOf('data-client-card-wide-layout="true"');
    const snippet = cardAt >= 0 ? src.slice(Math.max(0, cardAt - 1800), Math.min(src.length, cardAt + 5200)) : src.slice(0, 5200);
    const diagPath = abs('docs/feedback/CLOSEFLOW_ETAP8_REPAIR3_MARKUP_DIAGNOSTIC.txt');
    fs.mkdirSync(path.dirname(diagPath), { recursive: true });
    fs.writeFileSync(diagPath, snippet, 'utf8');
    throw new Error(`ETAP8 repair could not add required classes: ${missing.join(', ')}. Diagnostic snippet saved to docs/feedback/CLOSEFLOW_ETAP8_REPAIR3_MARKUP_DIAGNOSTIC.txt. No commit should be made.`);
  }

  write(rel, src);
}

function main() {
  ensurePackageScript();
  ensureCss();
  ensureClientsMarkup();
  console.log('✔ Applied CLOSEFLOW_ETAP8_REPAIR3_CLIENT_CARD_INLINE_ROW_GUARDED patch.');
}

main();
