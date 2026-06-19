const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = process.cwd();
const client = fs.readFileSync(path.join(repo, 'src/pages/ClientDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css'), 'utf8');

test('R13G removes the old ClientDetail simple inline missing row layer', () => {
  const forbidden = [
    'client-detail-missing-window-dialog-simple',
    'client-detail-missing-window-list-simple',
    'client-detail-missing-window-row-simple',
    'client-detail-missing-window-add-form-simple',
    'data-stage232i4-r13f-simple-missing-window',
    'data-stage232i4-r13f-simple-missing-list',
    'data-stage232i4-r13f-simple-missing-row',
    'STAGE232I4_R13F_SIMPLE_MISSING_MODAL_ROWS',
  ];
  for (const token of forbidden) {
    assert.equal((client + css).includes(token), false, `forbidden token still present: ${token}`);
  }
});

test('R13G ClientDetail live modal has title-first card structure', () => {
  for (const token of [
    'data-stage232i4-r13g-client-inline-missing-window',
    'data-missing-item-card',
    'data-missing-item-title-block',
    'data-missing-item-blocker-row',
    'data-missing-item-actions-row',
    'client-detail-missing-window-row-title-block',
    'client-detail-missing-window-row-actions',
  ]) {
    assert.ok(client.includes(token), `missing token: ${token}`);
  }
  const card = client.slice(client.indexOf('data-missing-item-card="true"'), client.indexOf('</article>', client.indexOf('data-missing-item-card="true"')));
  assert.ok(card.indexOf('data-missing-item-title-block="true"') < card.indexOf('data-missing-item-blocker-row="true"'));
  assert.ok(card.indexOf('data-missing-item-blocker-row="true"') < card.indexOf('data-missing-item-actions-row="true"'));
});

test('R13G CSS forces card layout instead of flat grid row', () => {
  assert.ok(css.includes('STAGE232I4_R13G_CLIENT_DETAIL_MISSING_INLINE_TO_SHARED_VISUAL_SOURCE'));
  assert.ok(css.includes('#root .client-detail-missing-window-row-r13g'));
  assert.ok(css.includes('grid-template-columns: 1fr !important'));
  assert.ok(css.includes('#root .client-detail-missing-window-row-actions'));
  assert.ok(css.includes('justify-content: flex-end !important'));
  assert.ok(css.includes('white-space: normal !important'));
});

test('R13G preserves source item actions and no backend/SQL markers', () => {
  assert.ok(client.includes('handleResolveClientMissingItemStage228R13(item)'));
  assert.ok(client.includes('handleDeleteClientMissingItemStage228R15(item)'));
  assert.ok(client.includes('handleToggleClientMissingBlockerStage232I4R13F(item, event.target.checked)'));
  assert.ok(client.includes('handleSaveClientMissingItemStage227C3B()'));
  assert.equal(fs.existsSync(path.join(repo, 'api/work-items.ts')) && fs.readFileSync(path.join(repo, 'api/work-items.ts'), 'utf8').includes('STAGE232I4_R13G'), false);
});
