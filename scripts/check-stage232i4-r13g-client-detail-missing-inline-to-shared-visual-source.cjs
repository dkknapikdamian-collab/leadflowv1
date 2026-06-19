const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const clientPath = path.join(repo, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css');
const runPath = path.join(repo, '_project/runs/STAGE232I4_R13G_CLIENT_DETAIL_MISSING_INLINE_TO_SHARED_VISUAL_SOURCE.md');
const obsidianPath = path.join(repo, '_project/obsidian_updates/2026-06-19_STAGE232I4_R13G_CLIENT_DETAIL_MISSING_INLINE_TO_SHARED_VISUAL_SOURCE.md');

function fail(message) {
  console.error(`STAGE232I4_R13G guard FAIL: ${message}`);
  process.exit(1);
}
function read(file) {
  if (!fs.existsSync(file)) fail(`missing file: ${path.relative(repo, file)}`);
  return fs.readFileSync(file, 'utf8');
}
function mustInclude(text, token, file) {
  if (!text.includes(token)) fail(`${file} missing token: ${token}`);
}
function mustNotInclude(text, token, file) {
  if (text.includes(token)) fail(`${file} still contains forbidden token: ${token}`);
}

const client = read(clientPath);
const css = read(cssPath);
read(runPath);
read(obsidianPath);

for (const token of [
  'STAGE232I4_R13G_CLIENT_DETAIL_MISSING_INLINE_TO_SHARED_VISUAL_SOURCE',
  'data-stage232i4-r13g-client-inline-missing-window',
  'data-closeflow-dialog-shell',
  'data-closeflow-dialog-card',
  'data-closeflow-dialog-body',
  'data-closeflow-dialog-footer',
  'data-missing-item-card',
  'data-missing-item-title-block',
  'data-missing-item-blocker-row',
  'data-missing-item-actions-row',
  'client-detail-missing-window-row-title-block',
  'client-detail-missing-window-row-actions',
]) {
  mustInclude(client + '\n' + css + '\n' + read(runPath) + '\n' + read(obsidianPath), token, 'R13G touched files');
}

for (const token of [
  'client-detail-missing-window-dialog-simple',
  'client-detail-missing-window-list-simple',
  'client-detail-missing-window-row-simple',
  'client-detail-missing-window-add-form-simple',
  'data-stage232i4-r13f-simple-missing-window',
  'data-stage232i4-r13f-simple-missing-list',
  'data-stage232i4-r13f-simple-missing-row',
  'data-stage232i4-r13f-simple-missing-add-form',
  'data-stage232i4-r13f-row-blocker-checkbox',
  'STAGE232I4_R13F_SIMPLE_MISSING_MODAL_ROWS',
]) {
  mustNotInclude(client + '\n' + css, token, 'ClientDetail runtime/CSS');
}

const articleStart = client.indexOf('data-missing-item-card="true"');
const titleBlock = client.indexOf('data-missing-item-title-block="true"');
const blockerRow = client.indexOf('data-missing-item-blocker-row="true"');
const actionsRow = client.indexOf('data-missing-item-actions-row="true"');
if (!(articleStart !== -1 && titleBlock > articleStart && blockerRow > titleBlock && actionsRow > blockerRow)) {
  fail('missing item card order is not title block -> blocker row -> actions row');
}

const rowSlice = client.slice(articleStart, client.indexOf('</article>', articleStart));
if (/client-detail-missing-window-row-title"[^>]*>[^<]*<\/strong>\s*<label[\s\S]*?<Button[\s\S]*?<Button/.test(rowSlice)) {
  fail('flat row returned: title, checkbox and action buttons are direct siblings without action/title blocks');
}
if (!rowSlice.includes('<div className="client-detail-missing-window-row-actions"')) {
  fail('row buttons are not wrapped in row-actions');
}
if (!rowSlice.includes('<div className="client-detail-missing-window-row-title-block"')) {
  fail('row title is not wrapped in title block');
}

// Guard against unrelated backend/SQL scope creep by checking this stage's marker is absent from backend entry points.
for (const backendRel of ['api/work-items.ts', 'supabase', 'migrations']) {
  const backendPath = path.join(repo, backendRel);
  if (!fs.existsSync(backendPath)) continue;
  const stat = fs.statSync(backendPath);
  if (stat.isFile()) {
    const text = fs.readFileSync(backendPath, 'utf8');
    if (text.includes('STAGE232I4_R13G')) fail(`R13G marker should not be in backend file ${backendRel}`);
  }
}

console.log('STAGE232I4_R13G client inline missing visual source guard PASS');
