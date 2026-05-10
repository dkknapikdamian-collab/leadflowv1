const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const fail = [];
const warn = [];

function read(rel) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) {
    fail.push(`missing ${rel}`);
    return '';
  }
  return fs.readFileSync(filePath, 'utf8');
}

function assert(condition, message) {
  if (!condition) fail.push(message);
}

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/.*(?=\n|$)/g, '$1');
}

function openingTagContaining(source, needle, tagNamePattern = '[A-Za-z][A-Za-z0-9.:-]*') {
  const index = source.indexOf(needle);
  if (index < 0) return '';
  const before = source.slice(0, index);
  const matches = [...before.matchAll(new RegExp(`<${tagNamePattern}\\b`, 'g'))];
  const tagStartMatch = matches[matches.length - 1];
  if (!tagStartMatch) return '';
  const start = tagStartMatch.index;
  const end = source.indexOf('>', index);
  if (start < 0 || end < 0) return '';
  return source.slice(start, end + 1);
}

function linesContaining(source, needle) {
  return source
    .split(/\r?\n/)
    .map((text, index) => ({ line: index + 1, text }))
    .filter((row) => row.text.includes(needle));
}

function hasBadPrimaryOrLocalDanger(text) {
  return /\bbg-primary\b|\btext-white\b|variant\s*=\s*["'](?:primary|default)["']|\btext-(?:rose|red)-|\bbg-(?:rose|red)-|\bborder-(?:rose|red)-/.test(text);
}

function hasDangerSource(text) {
  return /action(?:Button|Icon)Class\(\s*["']danger["']/.test(text) || /tone\s*=\s*["']danger["']/.test(text);
}

const client = read('src/pages/ClientDetail.tsx');
assert(!/onClick=\{\(\)\s*=(?!>)/.test(client), 'ClientDetail contains broken onClick={() = fragment');
assert(!client.includes('data-fb5-danger-source'), 'ClientDetail must not contain data-fb5-danger-source');
assert(!client.includes('Expected "=>" but found "="'), 'ClientDetail contains build-error text');

const noteDeleteActionRows = linesContaining(client, 'client-detail-note-delete-action');
const noteDeleteButtonRows = linesContaining(client, 'client-detail-note-delete-button');
if (noteDeleteActionRows.length === 0 && noteDeleteButtonRows.length === 0) {
  warn.push('ClientDetail has no explicit note-delete class marker after HEAD reset. This is allowed when delete uses EntityActionButton tone="danger".');
}

for (const row of [...noteDeleteActionRows, ...noteDeleteButtonRows]) {
  assert(!hasBadPrimaryOrLocalDanger(row.text), `ClientDetail note delete line ${row.line} uses primary/local danger styling: ${row.text.trim()}`);
  assert(hasDangerSource(row.text), `ClientDetail note delete line ${row.line} must use danger source of truth: ${row.text.trim()}`);
}

const clientLines = client.split(/\r?\n/);
const trashRows = clientLines.map((text, index) => ({ line: index + 1, text })).filter((row) => /<Trash2\b/.test(row.text));
for (const row of trashRows) {
  const windowText = clientLines.slice(Math.max(0, row.line - 5), Math.min(clientLines.length, row.line + 4)).join('\n');
  assert(!/\bbg-primary\b|\btext-white\b|variant\s*=\s*["'](?:primary|default)["']/.test(windowText), `Trash2 area near ClientDetail line ${row.line} looks like primary/default CTA`);
}

const dialog = read('src/components/EntityConflictDialog.tsx');
const deleteButton = openingTagContaining(dialog, 'onDeleteCandidate(candidate)', 'Button|button');
assert(deleteButton, 'EntityConflictDialog delete candidate action not found');
assert(hasDangerSource(deleteButton), `EntityConflictDialog delete action must use danger source of truth: ${deleteButton}`);
assert(!hasBadPrimaryOrLocalDanger(deleteButton), `EntityConflictDialog delete action contains local/primary danger styling: ${deleteButton}`);
assert(/import\s+\{[^}]*\bactionButtonClass\b[^}]*\}\s+from\s+["']\.\/entity-actions["'];?/.test(dialog), 'EntityConflictDialog must import actionButtonClass from ./entity-actions');

const css = read('src/styles/closeflow-action-tokens.css');
const marker = 'FB5_TOAST_DANGER_SOURCE_OF_TRUTH';
assert(css.includes(marker), 'closeflow-action-tokens.css missing FB5 marker');
assert(/\.client-detail-note-delete-action\s*\{/.test(css), 'closeflow-action-tokens.css missing base client-detail-note-delete-action rule');
assert(/\.client-detail-note-delete-action:hover[\s\S]*?\{[\s\S]*?var\(--cf-action-danger-bg-hover\)/.test(css), 'client-detail-note-delete-action hover must use cf danger hover token');
const fb5Css = css.includes(marker) ? stripComments(css.slice(css.indexOf(marker))) : '';
assert(fb5Css.includes('color: var(--cf-action-danger-text)'), 'client-detail-note-delete-action must use cf danger text token');
assert(fb5Css.includes('background: transparent'), 'client-detail-note-delete-action must use transparent neutral background');
assert(fb5Css.includes('border-color: var(--cf-action-danger-border)'), 'client-detail-note-delete-action must use cf danger border token');
assert(!/#|rgb\(|rgba\(|\bbg-primary\b|\btext-white\b|\btext-(?:rose|red)-|\bbg-(?:rose|red)-|\bborder-(?:rose|red)-/.test(fb5Css), 'FB5 note-delete CSS block must not use raw colors or Tailwind color classes');

if (fail.length) {
  console.error('CLOSEFLOW_FB5_HEAVY_UI_GUARDS_FAILED');
  for (const item of fail) console.error(`- ${item}`);
  for (const item of warn) console.error(`warning: ${item}`);
  process.exit(1);
}

for (const item of warn) console.log(`warning: ${item}`);
console.log('CLOSEFLOW_FB5_HEAVY_UI_GUARDS_OK');
