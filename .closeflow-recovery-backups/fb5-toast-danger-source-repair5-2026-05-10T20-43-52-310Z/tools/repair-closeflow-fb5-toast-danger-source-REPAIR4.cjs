const fs = require('fs');
const path = require('path');

const root = process.cwd();
function p(rel) { return path.join(root, rel); }
function read(rel) { return fs.readFileSync(p(rel), 'utf8'); }
function write(rel, text) { fs.writeFileSync(p(rel), text); }
function ensure(condition, message) { if (!condition) throw new Error(message); }

function patchToasterTag(tag) {
  let attrs = tag
    .replace(/^<Toaster\b/i, '')
    .replace(/\/?>\s*$/i, '')
    .replace(/\sposition=("[^"]*"|'[^']*'|\{[^}]*\})/g, '')
    .replace(/\srichColors(=\{?[^\s>}]+\}?|="[^"]*"|='[^']*')?/g, '')
    .replace(/\scloseButton(=\{?[^\s>}]+\}?|="[^"]*"|='[^']*')?/g, '')
    .trim();
  const extra = attrs ? ` ${attrs}` : '';
  return `<Toaster position="top-center" richColors closeButton${extra} />`;
}

function patchApp() {
  const rel = 'src/App.tsx';
  let text = read(rel);
  const before = text;
  text = text.replace(/<Toaster\b[^>]*\/?>/g, (tag) => patchToasterTag(tag));
  ensure(text.includes('<Toaster'), 'App.tsx missing Toaster');
  ensure(!/position=["']top-right["']/.test(text), 'App.tsx still contains top-right toaster');
  ensure(/<Toaster\b[^>]*position=["']top-center["'][^>]*richColors[^>]*closeButton/.test(text) || /<Toaster\b[^>]*position=["']top-center["'][^>]*closeButton[^>]*richColors/.test(text), 'App.tsx toaster missing top-center richColors closeButton');
  if (text !== before) write(rel, text);
  console.log('patched: src/App.tsx');
}

function ensureActionIconImport(text) {
  if (text.includes('actionIconClass')) return text;
  text = text.replace(
    /import\s*\{\s*actionButtonClass\s*\}\s*from\s*['"]\.\.\/components\/entity-actions['"];?/,
    "import { actionButtonClass, actionIconClass } from '../components/entity-actions';"
  );
  if (!text.includes('actionIconClass')) {
    text = text.replace(
      /import\s*\{\s*EntityActionButton,\s*formActionsClass\s*\}\s*from\s*['"]\.\.\/components\/entity-actions['"];?/,
      "import { EntityActionButton, formActionsClass, actionIconClass } from '../components/entity-actions';"
    );
  }
  return text;
}

function cleanDangerAttrs(attrs) {
  let out = attrs;
  out = out.replace(/\sclassName=\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, '');
  out = out.replace(/\sclassName="[^"]*"/g, '');
  out = out.replace(/\sclassName='[^']*'/g, '');
  out = out.replace(/\svariant=("primary"|'primary'|"default"|'default'|\{\s*['"]?(primary|default)['"]?\s*\})/g, '');
  out = out.replace(/\ssize=("icon"|'icon'|\{\s*['"]?icon['"]?\s*\})/g, '');
  out = out.replace(/\sdata-closeflow-fb5-note-delete-danger=("true"|'true'|\{true\})/g, '');
  return out.trimEnd();
}

function patchTrashButtons(text) {
  let patched = 0;
  const re = /<(button|Button)\b([^>]*)>([\s\S]{0,900}?<Trash2\b[\s\S]{0,350}?\/>[\s\S]{0,500}?)<\/\1>/g;
  text = text.replace(re, (whole, tag, attrs, inner) => {
    const lower = whole.toLowerCase();
    const looksDelete = lower.includes('delete') || lower.includes('usuń') || lower.includes('usun') || lower.includes('trash2') || lower.includes('deleteactivityfromsupabase');
    if (!looksDelete) return whole;
    patched += 1;
    const cleaned = cleanDangerAttrs(attrs);
    const space = cleaned.trim() ? ` ${cleaned.trim()}` : '';
    return `<${tag}${space} className={actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')} data-closeflow-fb5-note-delete-danger="true">${inner}</${tag}>`;
  });
  return { text, patched };
}

function patchClientDetail() {
  const rel = 'src/pages/ClientDetail.tsx';
  let text = read(rel);
  const before = text;
  text = ensureActionIconImport(text);
  const result = patchTrashButtons(text);
  text = result.text;
  if (text !== before) write(rel, text);
  ensure(text.includes('actionIconClass'), 'ClientDetail missing actionIconClass import/use');
  ensure(text.includes('client-detail-note-delete-action'), 'ClientDetail missing note delete danger class');
  ensure(text.includes("actionIconClass('danger'") || text.includes('actionIconClass("danger"'), 'ClientDetail missing actionIconClass danger source');
  console.log(`patched: src/pages/ClientDetail.tsx trashBlocks=${result.patched}`);
}

function patchCss() {
  const rel = 'src/styles/closeflow-action-tokens.css';
  let text = read(rel);
  const marker = 'CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_V1';
  if (!text.includes(marker)) {
    text += `\n\n/* ${marker}\n   Client note delete action uses the global danger token source.\n*/\n.client-detail-note-delete-action {\n  background: transparent !important;\n  border-color: transparent !important;\n  color: var(--cf-action-danger-text) !important;\n  -webkit-text-fill-color: var(--cf-action-danger-text) !important;\n}\n\n.client-detail-note-delete-action svg {\n  color: var(--cf-action-danger-text) !important;\n  stroke: currentColor !important;\n}\n\n.client-detail-note-delete-action:hover,\n.client-detail-note-delete-action:focus-visible {\n  background: var(--cf-action-danger-bg-hover) !important;\n  border-color: var(--cf-action-danger-border-hover) !important;\n  color: var(--cf-action-danger-text-hover) !important;\n  -webkit-text-fill-color: var(--cf-action-danger-text-hover) !important;\n}\n`;
    write(rel, text);
  }
  console.log('patched: src/styles/closeflow-action-tokens.css');
}

function assertFinal() {
  const app = read('src/App.tsx');
  const client = read('src/pages/ClientDetail.tsx');
  const css = read('src/styles/closeflow-action-tokens.css');
  ensure(/<Toaster\b/.test(app), 'No Toaster in App');
  ensure(!/position=["']top-right["']/.test(app), 'Toaster still top-right');
  ensure(/position=["']top-center["']/.test(app), 'Toaster missing top-center');
  ensure(/<Toaster\b[^>]*richColors/.test(app), 'Toaster missing richColors');
  ensure(/<Toaster\b[^>]*closeButton/.test(app), 'Toaster missing closeButton');
  ensure(client.includes('client-detail-note-delete-action'), 'ClientDetail missing note delete class');
  ensure(client.includes("actionIconClass('danger'") || client.includes('actionIconClass("danger"'), 'ClientDetail missing danger actionIconClass');
  const trashBlocks = [...client.matchAll(/<(button|Button)\b[\s\S]{0,900}?<Trash2\b[\s\S]{0,350}?\/>[\s\S]{0,500}?<\/\1>/g)].map((m) => m[0]);
  ensure(trashBlocks.length > 0, 'No Trash2 button blocks found in ClientDetail');
  const bad = trashBlocks.filter((block) => /bg-primary|text-white|variant=("primary"|'primary'|"default"|'default')/.test(block));
  ensure(bad.length === 0, `Trash2 block still looks like primary CTA count=${bad.length}`);
  ensure(css.includes('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_V1'), 'CSS missing FB5 marker');
  ensure(css.includes('.client-detail-note-delete-action'), 'CSS missing client note delete action class');
  ensure(css.includes('--cf-action-danger-text'), 'CSS missing danger tokens');
}

patchApp();
patchClientDetail();
patchCss();
assertFinal();
console.log('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_REPAIR4_PATCH_OK');
