const fs = require('fs');

function read(path) {
  return fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
}
function write(path, text) {
  fs.writeFileSync(path, text, 'utf8');
}
function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function patchToasterTag(tag) {
  let inner = tag
    .replace(/^<Toaster\b/, '')
    .replace(/\/>$/, '')
    .trim();

  inner = inner
    .replace(/\s*position=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, '')
    .replace(/\s*richColors\b(?:=\{?true\}?|=(?:"true"|'true'))?/g, '')
    .replace(/\s*closeButton\b(?:=\{?true\}?|=(?:"true"|'true'))?/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  const preserved = inner ? ` ${inner}` : '';
  return `<Toaster${preserved} position="top-center" richColors closeButton />`;
}

function patchApp() {
  const path = 'src/App.tsx';
  let text = read(path);
  let count = 0;
  text = text.replace(/<Toaster\b[\s\S]*?\/>/g, (tag) => {
    count += 1;
    return patchToasterTag(tag);
  });
  ensure(count > 0, 'No Toaster tag found in App.tsx');
  ensure(!/<Toaster\b[^>]*position=["']top-right["']/.test(text), 'Toaster still uses top-right');
  write(path, text);
  console.log(`patched: ${path} toasterTags=${count}`);
}

function addSymbolToNamedImport(text, modulePath, symbol, preferredExistingSymbol) {
  if (new RegExp(`\\b${symbol}\\b`).test(text)) return text;
  const importRe = new RegExp(`import\\s*\\{([\\s\\S]*?)\\}\\s*from\\s*['"]${modulePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"];`, 'g');
  let match;
  let fallback = null;
  while ((match = importRe.exec(text))) {
    const block = match[0];
    const names = match[1];
    if (!fallback) fallback = { block, names };
    if (!preferredExistingSymbol || new RegExp(`\\b${preferredExistingSymbol}\\b`).test(names)) {
      const nextNames = names.trim().endsWith(',') ? `${names}\n  ${symbol}` : `${names.trimEnd()},\n  ${symbol}`;
      return text.replace(block, `import {${nextNames}\n} from '${modulePath}';`);
    }
  }
  if (fallback) {
    const nextNames = fallback.names.trim().endsWith(',') ? `${fallback.names}\n  ${symbol}` : `${fallback.names.trimEnd()},\n  ${symbol}`;
    return text.replace(fallback.block, `import {${nextNames}\n} from '${modulePath}';`);
  }
  throw new Error(`Cannot find named import from ${modulePath}`);
}

function findTagEnd(text, start) {
  let quote = null;
  let braceDepth = 0;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    const prev = text[i - 1];

    if (quote) {
      if (ch === quote && prev !== '\\') quote = null;
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === '{') {
      braceDepth += 1;
      continue;
    }
    if (ch === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
      continue;
    }
    if (ch === '>' && braceDepth === 0) return i;
  }
  return -1;
}

function patchOpenTag(openTag, tagName) {
  let tag = openTag;

  tag = tag
    .replace(/\svariant=(?:"(?:default|primary)"|'(?:default|primary)'|\{["'](?:default|primary)["']\})/g, '')
    .replace(/\sclassName=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, '')
    .replace(/\sdata-fb5-danger-source=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, '');

  if (tagName === 'EntityActionButton') {
    tag = tag.replace(/\stone=(?:"[^"]*"|'[^']*'|\{[^}]*\})/g, '');
    tag = tag.replace(/\siconOnly(?:=\{?true\}?|=(?:"true"|'true'))?/g, '');
  }

  const insert = ` className={actionIconClass('danger', 'client-detail-icon-button client-detail-note-delete-action')} data-fb5-danger-source="trash"`;
  const entityInsert = ` tone="danger" iconOnly${insert}`;
  const finalInsert = tagName === 'EntityActionButton' ? entityInsert : insert;

  if (tag.endsWith('/>')) return tag.replace(/\s*\/>$/, `${finalInsert} />`);
  return tag.replace(/\s*>$/, `${finalInsert}>`);
}

function patchTrashButtonTags(text) {
  const trashNeedle = '<Trash2';
  let cursor = 0;
  let patched = 0;
  const patches = [];

  while (true) {
    const idx = text.indexOf(trashNeedle, cursor);
    if (idx === -1) break;

    const buttonStart = text.lastIndexOf('<button', idx);
    const entityStart = text.lastIndexOf('<EntityActionButton', idx);
    const start = Math.max(buttonStart, entityStart);
    const tagName = entityStart > buttonStart ? 'EntityActionButton' : 'button';

    if (start >= 0) {
      const tagEnd = findTagEnd(text, start);
      const trashWithinSameElement = tagEnd >= 0 && tagEnd < idx;
      if (trashWithinSameElement) {
        const openTag = text.slice(start, tagEnd + 1);
        const nextOpenTag = patchOpenTag(openTag, tagName);
        if (nextOpenTag !== openTag) {
          patches.push({ start, end: tagEnd + 1, value: nextOpenTag });
          patched += 1;
        }
      }
    }
    cursor = idx + trashNeedle.length;
  }

  for (let i = patches.length - 1; i >= 0; i -= 1) {
    const patch = patches[i];
    text = text.slice(0, patch.start) + patch.value + text.slice(patch.end);
  }

  return { text, patched };
}

function patchClientDetail() {
  const path = 'src/pages/ClientDetail.tsx';
  let text = read(path);

  text = addSymbolToNamedImport(text, '../components/entity-actions', 'actionIconClass', 'actionButtonClass');

  const result = patchTrashButtonTags(text);
  text = result.text;

  ensure(text.includes("actionIconClass('danger'"), 'ClientDetail missing actionIconClass danger usage after patch');
  ensure(text.includes('client-detail-note-delete-action'), 'ClientDetail missing note delete danger class after patch');
  ensure(!/<(button|EntityActionButton)\b[^>]*(?:bg-primary|text-white|variant=["'](?:default|primary)["'])[^>]*>[\s\S]*?<Trash2\b/.test(text), 'Trash2 block still looks like primary CTA');

  write(path, text);
  console.log(`patched: ${path} trashBlocks=${result.patched}`);
}

function patchActionTokensCss() {
  const path = 'src/styles/closeflow-action-tokens.css';
  let text = read(path);
  const marker = 'FB5_TOAST_DANGER_SOURCE_V1';
  const block = `
/* ${marker}
   Client note delete/trash actions use the global danger action token set.
   Toast placement is handled in App.tsx; this block only normalizes the icon button surface.
*/
.client-detail-note-delete-action,
.client-detail-note-delete-action svg {
  color: var(--cf-action-danger-text) !important;
  stroke: currentColor !important;
  -webkit-text-fill-color: var(--cf-action-danger-text) !important;
}

.client-detail-note-delete-action {
  border-color: transparent !important;
  background: transparent !important;
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
  if (!text.includes(marker)) {
    text = text.trimEnd() + '\n\n' + block.trim() + '\n';
  }
  write(path, text);
  console.log(`patched: ${path}`);
}

patchApp();
patchClientDetail();
patchActionTokensCss();

console.log('CLOSEFLOW_FB5_TOAST_DANGER_SOURCE_REPAIR6_PATCH_OK');
