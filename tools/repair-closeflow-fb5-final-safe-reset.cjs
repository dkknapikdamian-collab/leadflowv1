const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
function file(rel) { return path.join(ROOT, rel); }
function read(rel) {
  const p = file(rel);
  if (!fs.existsSync(p)) throw new Error(`Missing file: ${rel}`);
  return fs.readFileSync(p, 'utf8');
}
function writeIfChanged(rel, next) {
  const p = file(rel);
  const prev = fs.readFileSync(p, 'utf8');
  if (prev !== next) {
    fs.writeFileSync(p, next, 'utf8');
    console.log(`patched: ${rel}`);
  } else {
    console.log(`unchanged: ${rel}`);
  }
}

function patchToasterTags(source) {
  let count = 0;
  const next = source.replace(/<Toaster\b([\s\S]*?)(\/?)>/g, (match, attrsRaw, slash) => {
    count += 1;
    let attrs = String(attrsRaw || '');
    const selfClosing = Boolean(slash) || /\/\s*$/.test(attrs);
    attrs = attrs
      .replace(/\/\s*$/g, '')
      .replace(/\sposition\s*=\s*("[^"]*"|'[^']*'|\{[^}]*\})/g, '')
      .replace(/\srichColors(?:\s*=\s*(\{[^}]*\}|"[^"]*"|'[^']*'))?/g, '')
      .replace(/\scloseButton(?:\s*=\s*(\{[^}]*\}|"[^"]*"|'[^']*'))?/g, '')
      .replace(/\s+/g, ' ')
      .trim();
    const rest = attrs ? ` ${attrs}` : '';
    return `<Toaster${rest} position="top-center" richColors closeButton${selfClosing ? ' /' : ''}>`;
  });
  if (count === 0) throw new Error('FB-5 expected at least one <Toaster> in src/App.tsx');
  return next;
}

function ensureNamedImport(source, importPath, name) {
  const escaped = importPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const importRe = new RegExp(`import\\s+\\{([^}]*)\\}\\s+from\\s+['"]${escaped}['"];?`);
  if (importRe.test(source)) {
    return source.replace(importRe, (match, names) => {
      const parts = names.split(',').map((part) => part.trim()).filter(Boolean);
      if (!parts.includes(name)) parts.push(name);
      return `import { ${parts.join(', ')} } from '${importPath}';`;
    });
  }
  const lines = source.split(/\r?\n/);
  let insertAt = 0;
  for (let i = 0; i < lines.length; i += 1) {
    if (/^import\s/.test(lines[i])) insertAt = i + 1;
  }
  lines.splice(insertAt, 0, `import { ${name} } from '${importPath}';`);
  return lines.join('\n');
}

function patchEntityConflictDialog(source) {
  let next = source;
  next = ensureNamedImport(next, './entity-actions', 'actionButtonClass');

  const lines = next.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].includes('onDeleteCandidate(candidate)')) continue;
    let line = lines[i];
    line = line.replace(/\sclassName=\{[^}]*\}/g, '');
    line = line.replace(/\sclassName="[^"]*"/g, '');
    line = line.replace(/\sclassName='[^']*'/g, '');
    line = line.replace(/\sdisabled=\{busy\}/, " disabled={busy} className={actionButtonClass('danger')}");
    if (!line.includes("className={actionButtonClass('danger')}")) {
      line = line.replace(/>\s*$/, " className={actionButtonClass('danger')}>");
    }
    lines[i] = line;
  }
  next = lines.join('\n');

  if (!/actionButtonClass\(\s*['"]danger['"]/.test(next)) {
    throw new Error('EntityConflictDialog delete action was not routed through actionButtonClass danger');
  }
  if (/text-rose-700|text-rose-600|text-red-700|text-red-600|bg-rose-|bg-red-|border-rose-|border-red-/.test(next)) {
    throw new Error('EntityConflictDialog still contains local red/rose Tailwind danger styling');
  }
  return next;
}

function patchClientDetail(source) {
  let next = source;
  next = next.replace(/onClick=\{\(\)\s*=\s*data-fb5-danger-source="note-trash"\s*>\s*toast\.info\(([^)]*)\)\}/g, 'onClick={() => toast.info($1)}');
  next = next.replace(/\s*data-fb5-danger-source="note-trash"/g, '');
  next = next.replace(/className="client-detail-icon-button client-detail-note-delete-action"/g, "className={actionButtonClass('danger', 'client-detail-icon-button client-detail-note-delete-action')}");
  next = next.replace(/actionButtonClass\((['"])neutral\1,\s*(['"])client-detail-icon-button client-detail-note-delete-action\2\)/g, "actionButtonClass('danger', 'client-detail-icon-button client-detail-note-delete-action')");
  return next;
}

function patchActionTokens(source) {
  const marker = 'FB5_TOAST_DANGER_SOURCE_OF_TRUTH';
  const block = `

/* ${marker}
   Toasts stay top-center. Delete/trash/destructive UI uses entity action danger tokens.
*/
.client-detail-note-delete-action {
  color: var(--cf-action-danger-text) !important;
  background: transparent !important;
  border-color: var(--cf-action-danger-border) !important;
}

.client-detail-note-delete-action:hover,
.client-detail-note-delete-action:focus-visible {
  color: var(--cf-action-danger-text-hover) !important;
  background: var(--cf-action-danger-bg-hover) !important;
  border-color: var(--cf-action-danger-border-hover) !important;
}

.client-detail-note-delete-action svg {
  color: var(--cf-action-danger-text) !important;
  stroke: currentColor !important;
}
`;
  if (!source.includes(marker)) return source.trimEnd() + block;
  const start = source.indexOf(`/* ${marker}`);
  return source.slice(0, start).trimEnd() + block;
}

writeIfChanged('src/App.tsx', patchToasterTags(read('src/App.tsx')));
writeIfChanged('src/components/EntityConflictDialog.tsx', patchEntityConflictDialog(read('src/components/EntityConflictDialog.tsx')));
writeIfChanged('src/pages/ClientDetail.tsx', patchClientDetail(read('src/pages/ClientDetail.tsx')));
writeIfChanged('src/styles/closeflow-action-tokens.css', patchActionTokens(read('src/styles/closeflow-action-tokens.css')));
console.log('CLOSEFLOW_FB5_FINAL_SAFE_RESET_REPAIR_FIX4_OK');
