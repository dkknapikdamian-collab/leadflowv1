const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const rel = (p) => path.join(ROOT, p);
const read = (p) => fs.readFileSync(rel(p), 'utf8');
const write = (p, text) => fs.writeFileSync(rel(p), text, 'utf8');
function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function patchToasterTag(tag) {
  let next = tag;
  next = next.replace(/\sposition=\{[^}]+\}/g, '');
  next = next.replace(/\sposition="[^"]*"/g, '');
  next = next.replace(/\srichColors(?:=\{true\}|="true")?/g, '');
  next = next.replace(/\scloseButton(?:=\{true\}|="true")?/g, '');
  next = next.replace(/\s+\/?>$/, ' position="top-center" richColors closeButton />');
  return next;
}

function patchApp() {
  const file = 'src/App.tsx';
  let text = read(file);
  let count = 0;
  text = text.replace(/<Toaster\b[^>]*\/?>/g, (tag) => {
    count += 1;
    return patchToasterTag(tag);
  });
  ensure(count > 0, 'App.tsx: no Toaster tags found');
  ensure(!text.includes('position="top-right"'), 'App.tsx: top-right toaster still present');
  write(file, text);
  console.log(`patched: ${file} toasterTags=${count}`);
}

function ensureActionIconImport(text) {
  if (text.includes('actionIconClass')) return text;
  return text.replace(
    /import \{\s*actionButtonClass\s*\} from '\.\.\/components\/entity-actions';/,
    "import { actionButtonClass, actionIconClass } from '../components/entity-actions';"
  );
}

function patchOpeningTag(openingTag) {
  let tag = openingTag;
  tag = tag.replace(/\svariant="(?:default|primary)"/g, '');
  tag = tag.replace(/\svariant=\{['"](?:default|primary)['"]\}/g, '');
  tag = tag.replace(/\sclassName="[^"]*"/, " className={actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')}");
  tag = tag.replace(/\sclassName=\{[^}]*\}/, " className={actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')}");
  if (!/\sclassName=/.test(tag)) {
    tag = tag.replace(/^(\s*<(?:button|EntityActionButton)\b)/, "$1 className={actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')}");
  }
  if (!/data-fb5-danger-source=/.test(tag)) {
    tag = tag.replace(/>\s*$/, ' data-fb5-danger-source="note-trash">');
  }
  return tag;
}

function patchTrashParentOpenings(text) {
  const trashIndexes = [];
  let searchAt = 0;
  while (true) {
    const idx = text.indexOf('<Trash2', searchAt);
    if (idx === -1) break;
    trashIndexes.push(idx);
    searchAt = idx + 7;
  }

  const replacements = [];
  for (const trashIdx of trashIndexes) {
    const buttonIdx = text.lastIndexOf('<button', trashIdx);
    const entityIdx = text.lastIndexOf('<EntityActionButton', trashIdx);
    const tagStart = Math.max(buttonIdx, entityIdx);
    if (tagStart < 0 || trashIdx - tagStart > 1800) continue;
    const tagEnd = text.indexOf('>', tagStart);
    if (tagEnd < 0 || tagEnd > trashIdx) continue;
    const block = text.slice(tagStart, Math.min(text.length, trashIdx + 600));
    const looksDestructive = /Trash2|Usuń|usun|delete|Delete|handleDelete|danger|Usuń notatkę|Usuń sprawę/.test(block);
    if (!looksDestructive) continue;
    const opening = text.slice(tagStart, tagEnd + 1);
    const patched = patchOpeningTag(opening);
    if (patched !== opening) replacements.push({ start: tagStart, end: tagEnd + 1, patched });
  }

  // Deduplicate by range and apply from end to start.
  const seen = new Set();
  const unique = replacements.filter((r) => {
    const key = `${r.start}:${r.end}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).sort((a, b) => b.start - a.start);

  let next = text;
  for (const r of unique) {
    next = next.slice(0, r.start) + r.patched + next.slice(r.end);
  }
  return { text: next, patchedCount: unique.length, trashCount: trashIndexes.length };
}

function patchClientDetail() {
  const file = 'src/pages/ClientDetail.tsx';
  let text = read(file);
  text = ensureActionIconImport(text);
  const result = patchTrashParentOpenings(text);
  text = result.text;
  ensure(result.trashCount > 0, 'ClientDetail.tsx: no Trash2 icons found');
  ensure(result.patchedCount > 0 || text.includes("actionIconClass('danger'"), 'ClientDetail.tsx: no destructive Trash2 parent was patched');
  ensure(text.includes("actionIconClass('danger'"), 'ClientDetail.tsx: missing actionIconClass danger use');
  ensure(text.includes('client-detail-note-delete-action'), 'ClientDetail.tsx: missing client-detail-note-delete-action class');
  ensure(!/<article`}\s*>/.test(text), 'ClientDetail.tsx: broken <article`}> fragment present');
  ensure(!/<span`}\s*>/.test(text), 'ClientDetail.tsx: broken <span`}> fragment present');
  ensure(!/<section`}\s*>/.test(text), 'ClientDetail.tsx: broken <section`}> fragment present');
  write(file, text);
  console.log(`patched: ${file} trashIcons=${result.trashCount} parentTagsPatched=${result.patchedCount}`);
}

function patchCss() {
  const file = 'src/styles/closeflow-action-tokens.css';
  let text = read(file);
  const marker = 'CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_V1';
  if (!text.includes(marker)) {
    text += `\n\n/* ${marker}\n   Client note trash/delete action uses the global danger action tokens.\n   Keep this local selector token-based only.\n*/\n.client-detail-note-delete-action {\n  border-color: var(--cf-action-danger-border) !important;\n  background: transparent !important;\n  color: var(--cf-action-danger-text) !important;\n  -webkit-text-fill-color: var(--cf-action-danger-text) !important;\n}\n\n.client-detail-note-delete-action svg {\n  color: var(--cf-action-danger-text) !important;\n  stroke: currentColor !important;\n}\n\n.client-detail-note-delete-action:hover,\n.client-detail-note-delete-action:focus-visible {\n  border-color: var(--cf-action-danger-border-hover) !important;\n  background: var(--cf-action-danger-bg-hover) !important;\n  color: var(--cf-action-danger-text-hover) !important;\n  -webkit-text-fill-color: var(--cf-action-danger-text-hover) !important;\n}\n`;
  }
  write(file, text);
  console.log(`patched: ${file}`);
}

patchApp();
patchClientDetail();
patchCss();
console.log('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_REPAIR9_PATCH_OK');
