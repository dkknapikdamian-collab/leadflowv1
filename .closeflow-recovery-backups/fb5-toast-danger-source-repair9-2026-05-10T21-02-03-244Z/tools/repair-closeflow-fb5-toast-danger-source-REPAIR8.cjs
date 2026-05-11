const fs = require('fs');
const path = require('path');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8').replace(/^\uFEFF/, '');
}

function write(rel, text) {
  fs.writeFileSync(path.join(process.cwd(), rel), text, 'utf8');
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function ensureImport(text) {
  const marker = "../components/entity-actions";
  ensure(text.includes(marker), 'ClientDetail missing entity-actions import');

  text = text.replace(
    /import\s*\{\s*actionButtonClass\s*\}\s*from\s*'..\/components\/entity-actions';/,
    "import { actionButtonClass, actionIconClass } from '../components/entity-actions';"
  );

  text = text.replace(
    /import\s*\{\s*([^}]*?)\s*\}\s*from\s*'..\/components\/entity-actions';/g,
    (full, names) => {
      if (full.includes('actionIconClass')) return full;
      if (full.includes('actionButtonClass')) return full.replace('actionButtonClass', 'actionButtonClass, actionIconClass');
      return full;
    }
  );

  if (!text.includes('actionIconClass')) {
    text = text.replace(
      "import { EntityActionButton, formActionsClass } from '../components/entity-actions';",
      "import { EntityActionButton, formActionsClass, actionIconClass } from '../components/entity-actions';"
    );
  }

  ensure(text.includes('actionIconClass'), 'ClientDetail still missing actionIconClass import');
  return text;
}

function patchApp() {
  let text = read('src/App.tsx');
  let count = 0;

  text = text.replace(/<Toaster\b([^>]*)\/>/g, (full, attrs) => {
    count += 1;
    let nextAttrs = String(attrs || '')
      .replace(/\sposition=\{?["'][^"'}]+["']\}?/g, '')
      .replace(/\srichColors\b/g, '')
      .replace(/\scloseButton\b/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    nextAttrs = nextAttrs ? `${nextAttrs} position="top-center" richColors closeButton` : 'position="top-center" richColors closeButton';
    return `<Toaster ${nextAttrs} />`;
  });

  ensure(count >= 1, 'App.tsx: no Toaster tags found');
  ensure(!/<Toaster\b[^>]*position=["']top-right["'][^>]*\/>/.test(text), 'App.tsx: top-right Toaster remains');
  ensure((text.match(/<Toaster\b[^>]*position=["']top-center["'][^>]*richColors[^>]*closeButton[^>]*\/>/g) || []).length === count, 'App.tsx: not all Toasters are top-center richColors closeButton');

  if (!text.includes('CLOSEFLOW_FB5_TOAST_TOP_CENTER_CONTRACT')) {
    text += "\n/* CLOSEFLOW_FB5_TOAST_TOP_CENTER_CONTRACT: toast position top-center richColors closeButton. */\n";
  }

  write('src/App.tsx', text);
  console.log(`patched: src/App.tsx toasterTags=${count}`);
}

function patchTrashBlocks(text) {
  let count = 0;
  const dangerClass = "className={actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')}";
  const dangerData = 'data-fb5-danger-source="client-detail-trash"';

  function patchOpeningTag(opening) {
    let next = opening
      .replace(/\sclassName=\{[^}]*\}/g, '')
      .replace(/\sclassName="[^"]*"/g, '')
      .replace(/\sclassName='[^']*'/g, '')
      .replace(/\svariant=\{?["'](?:default|primary)["']\}?/g, '')
      .replace(/\sdata-fb5-danger-source=["'][^"']*["']/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s>$/, '>')
      .trim();

    const close = next.endsWith('>') ? '>' : '';
    if (close) next = next.slice(0, -1).trim();
    if (!next.includes('type=') && /^<button\b/.test(next)) next += ' type="button"';
    next += ` ${dangerClass} ${dangerData}${close || '>'}`;
    return next;
  }

  text = text.replace(/<(button|Button|EntityActionButton)\b[^>]*>[\s\S]*?<Trash2\b[\s\S]*?<\/\1>/g, (block) => {
    count += 1;
    return block.replace(/^<[^>]+>/, (opening) => patchOpeningTag(opening));
  });

  return { text, count };
}

function patchClientDetail() {
  let text = read('src/pages/ClientDetail.tsx');

  const knownBroken = ['<article`', '<span`', '`}>', 'article`}'];
  for (const needle of knownBroken) {
    ensure(!text.includes(needle), `ClientDetail has pre-existing broken JSX fragment: ${needle}`);
  }

  text = ensureImport(text);

  const result = patchTrashBlocks(text);
  text = result.text;

  ensure(result.count >= 1, 'ClientDetail: no Trash2 action blocks found to patch');

  if (!text.includes('CLOSEFLOW_FB5_CLIENT_DETAIL_DANGER_SOURCE')) {
    text = text.replace(
      /const CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CLIENT =/,
      "const CLOSEFLOW_FB5_CLIENT_DETAIL_DANGER_SOURCE = 'client detail trash uses global actionIconClass danger source of truth';\nvoid CLOSEFLOW_FB5_CLIENT_DETAIL_DANGER_SOURCE;\nconst CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CLIENT ="
    );
  }

  ensure(text.includes("actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')"), 'ClientDetail missing note delete danger class');
  ensure(!/bg-primary|text-white/.test(text), 'ClientDetail still contains forbidden primary visual token');
  ensure(!/variant=\{?["'](?:default|primary)["']\}?[\s\S]{0,240}<Trash2\b/.test(text), 'ClientDetail Trash2 block still looks like primary/default CTA');

  write('src/pages/ClientDetail.tsx', text);
  console.log(`patched: src/pages/ClientDetail.tsx trashBlocks=${result.count}`);
}

function patchCss() {
  let text = read('src/styles/closeflow-action-tokens.css');

  if (!text.includes('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_STYLE')) {
    text += `

/* CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_STYLE
   Client detail note trash uses the same danger source of truth as global destructive actions.
*/
.client-detail-note-delete-action {
  border-color: var(--cf-action-danger-border) !important;
  background: transparent !important;
  color: var(--cf-action-danger-text) !important;
  -webkit-text-fill-color: var(--cf-action-danger-text) !important;
}

.client-detail-note-delete-action svg {
  color: var(--cf-action-danger-text) !important;
  stroke: currentColor !important;
}

.client-detail-note-delete-action:hover,
.client-detail-note-delete-action:focus-visible {
  border-color: var(--cf-action-danger-border-hover) !important;
  background: var(--cf-action-danger-bg-hover) !important;
  color: var(--cf-action-danger-text-hover) !important;
  -webkit-text-fill-color: var(--cf-action-danger-text-hover) !important;
}

.client-detail-note-delete-action:focus-visible {
  box-shadow: 0 0 0 3px var(--cf-action-danger-focus) !important;
}
`;
  }

  write('src/styles/closeflow-action-tokens.css', text);
  console.log('patched: src/styles/closeflow-action-tokens.css');
}

patchApp();
patchClientDetail();
patchCss();

console.log('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_REPAIR8_PATCH_OK');
