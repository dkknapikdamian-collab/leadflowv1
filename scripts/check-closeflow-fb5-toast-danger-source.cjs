const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const fail = [];
function read(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    fail.push(`missing ${rel}`);
    return '';
  }
  return fs.readFileSync(p, 'utf8');
}
function assert(cond, msg) { if (!cond) fail.push(msg); }
function tags(source, name) {
  return [...source.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'g'))].map((m) => m[0]);
}
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\n)\s*\/\/.*(?=\n|$)/g, '$1');
}
function extractRule(css, selector) {
  const idx = css.indexOf(selector);
  if (idx < 0) return '';
  const open = css.indexOf('{', idx);
  const close = css.indexOf('}', open);
  if (open < 0 || close < 0) return '';
  return css.slice(open + 1, close);
}
function findOpeningElementContaining(source, needle) {
  const index = source.indexOf(needle);
  if (index < 0) return '';
  const start = source.lastIndexOf('<', index);
  const end = source.indexOf('>', index);
  if (start < 0 || end < 0) return '';
  return source.slice(start, end + 1);
}

const app = read('src/App.tsx');
const toasterTags = tags(app, 'Toaster');
assert(toasterTags.length > 0, 'src/App.tsx must contain at least one <Toaster>');
for (const [i, tag] of toasterTags.entries()) {
  assert(/\bposition\s*=\s*['"]top-center['"]/.test(tag), `Toaster #${i + 1} must use position="top-center": ${tag}`);
  assert(/\brichColors\b/.test(tag), `Toaster #${i + 1} must include richColors: ${tag}`);
  assert(/\bcloseButton\b/.test(tag), `Toaster #${i + 1} must include closeButton: ${tag}`);
  assert(!/\bposition\s*=\s*['"]top-right['"]/.test(tag), `Toaster #${i + 1} still uses top-right: ${tag}`);
}
assert(!/position\s*=\s*['"]top-right['"]/.test(app), 'src/App.tsx still contains position="top-right"');

const dialog = read('src/components/EntityConflictDialog.tsx');
const deleteButton = findOpeningElementContaining(dialog, 'onDeleteCandidate(candidate)');
assert(deleteButton, 'EntityConflictDialog delete action not found');
assert(/actionButtonClass\(\s*['"]danger['"]/.test(deleteButton) || /tone\s*=\s*['"]danger['"]/.test(deleteButton), `EntityConflictDialog delete action must use danger source: ${deleteButton}`);
assert(!/text-(rose|red)-|bg-(rose|red)-|border-(rose|red)-|bg-primary|text-white/.test(deleteButton), `EntityConflictDialog delete action uses local/primary styling: ${deleteButton}`);
assert(/from\s+['"]\.\/entity-actions['"]/.test(dialog) && /\bactionButtonClass\b/.test(dialog), 'EntityConflictDialog must import/use actionButtonClass from ./entity-actions');

const css = read('src/styles/closeflow-action-tokens.css');
assert(css.includes('FB5_TOAST_DANGER_SOURCE_OF_TRUTH'), 'closeflow-action-tokens.css missing FB5 marker');
assert(css.includes('.client-detail-note-delete-action'), 'closeflow-action-tokens.css missing client-detail-note-delete-action');
const baseRule = stripComments(extractRule(css, '.client-detail-note-delete-action'));
const hoverRule = stripComments(extractRule(css, '.client-detail-note-delete-action:hover'));
assert(baseRule.includes('var(--cf-action-danger-text)'), 'client-detail-note-delete-action must use cf danger text token');
assert(baseRule.includes('background: transparent'), 'client-detail-note-delete-action must have transparent background');
assert(baseRule.includes('var(--cf-action-danger-border)'), 'client-detail-note-delete-action must use cf danger border token');
assert(hoverRule.includes('var(--cf-action-danger-bg-hover)'), 'client-detail-note-delete-action hover must use cf danger hover token');
for (const [label, block] of [['base', baseRule], ['hover', hoverRule]]) {
  assert(!/#|rgb\(|rgba\(|\bred\b|\brose\b|bg-primary|text-white/.test(block), `FB5 ${label} CSS rule contains raw/local color styling: ${block}`);
}

const doc = read('docs/feedback/CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_2026-05-09.md');
for (const phrase of ['FB-5', 'Toast top-center', 'richColors', 'closeButton', 'danger source of truth', 'brak lokalnych czerwonych klas', 'nie zmieniamy delete logic', 'nie usuwamy toastów', 'nie zmieniamy Google Calendar sync']) {
  assert(doc.includes(phrase), `doc missing phrase: ${phrase}`);
}

if (fail.length) {
  console.error('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_FAILED');
  for (const item of fail) console.error(`- ${item}`);
  process.exit(1);
}
console.log('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_OK toaster_count=' + toasterTags.length);
