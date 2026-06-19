const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const client = fs.readFileSync(path.join(repoRoot, 'src/pages/ClientDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/visual-stage12-client-detail-vnext.css'), 'utf8');

test('I4 renders Braki/Blokady as the fourth ClientDetail top tile', () => {
  assert.match(client, /data-stage232i4-client-missing-top-tile="true"/);
  assert.match(client, /data-stage232i4-r2-client-missing-tile-lead-vst-row-fit="true"/);
  assert.match(client, /data-stage232i4-r6-client-missing-lead-source-truth="true"/);
  assert.match(client, /lead-detail-top-card/);
  assert.match(client, /lead-detail-callout-red/);
  assert.match(client, /<h2>Braki \/ Blokady<\/h2>/);
  assert.match(client, /data-client-top-tile="missing-blockers"/);
  assert.match(client, /data-stage232a-r9-blocker-top-card-summary="true"/);
});

test('I4 keeps the same STAGE232I2 missing_item source truth', () => {
  assert.match(client, /missingItems=\{stage232i2AllActiveMissingItems\}/);
  assert.match(client, /stage232i2SourceType/);
  assert.match(client, /stage232i2SourceLabel/);
  assert.match(client, /stage232i2SourceTitle/);
  assert.match(client, /stage232i2IsBlocker/);
  assert.doesNotMatch(client, /case_items/);
});

test('I4 tile shows correct client-scoped summary data and not a duplicated full-width top panel', () => {
  assert.match(client, /missingHeadline/);
  assert.match(client, /missingSourceSummary/);
  assert.match(client, /clientMissingTotal/);
  assert.match(client, /leadMissingTotal/);
  assert.match(client, /caseMissingTotal/);
  assert.match(client, /data-stage232i4-client-scope-counts=\{missingSourceSummary\}/);
  assert.doesNotMatch(client, /client-detail-top-tile-source-line/);
  assert.doesNotMatch(client, /firstMissingItem \?/);
  assert.doesNotMatch(client, /client-detail-missing-details-summary/);
  assert.doesNotMatch(client, /<details id="client-missing-items-stage232i2"/);
  assert.match(client, /data-stage232i4-r6-client-missing-detail-panel="lead-vst"/);
  assert.match(client, /clientMissingListOpenStage232I6/);
});

test('I4 tile actions use shared source actions and LeadDetail-like button layout', () => {
  assert.match(client, /onAddMissing/);
  assert.doesNotMatch(client, /onAddMissing=\{\(\) => openClientContextAction\('blocker'\)\}/);
  assert.match(client, /setClientMissingListOpenStage232I6\(true\)/);
  assert.match(client, /savedRecord/);
  assert.match(client, /normalizedSavedRecord/);
  assert.match(client, /data-stage232i4-client-missing-top-tile-actions="true"/);
  assert.match(client, /data-stage232i4-r2-lead-action-layout="true"/);
  assert.match(client, /Dodaj brak/);
  assert.match(client, /Zobacz wszystkie braki/);
});

test('I4 CSS has forced one-row desktop layout and LeadDetail-like blocker tones', () => {
  assert.match(css, /STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST/);
  assert.match(css, /STAGE232I4_R2_CLIENT_MISSING_TILE_LEAD_VST_ROW_FIT/);
  assert.match(css, /grid-template-columns: repeat\(4, minmax\(0, 1fr\)\) !important;/);
  assert.match(css, /client-detail-top-tile-missing\.client-detail-callout-danger/);
  assert.match(css, /STAGE232I4_R6_CLIENT_MISSING_LEAD_SOURCE_TRUTH/);
  assert.match(css, /lead-detail-callout-red/);
  assert.match(css, /client-detail-missing-items-section-lead-vst/);
  assert.match(css, /data-stage232i4-r6-lead-inline-actions/);
});

test('I4 files stay UTF-8 clean', () => {
  const forbiddenMojibake = /[ĂĹÄ][^\n]{0,80}/;
  assert.doesNotMatch(client, forbiddenMojibake);
  assert.doesNotMatch(css, forbiddenMojibake);
});

test('I4 R11 opens missing panel without auto-scroll and keeps stronger red visual source', () => {
  assert.doesNotMatch(client, /document\.getElementById\('client-missing-items-stage232i2'\)\?\.scrollIntoView/);
  assert.match(client, /setClientMissingListOpenStage232I6\(true\)/);
  assert.match(css, /STAGE232I4_R11_NO_SCROLL_VISUAL_SOURCE_TRUTH/);
  assert.match(css, /#fff1f2/);
  assert.match(css, /#fca5a5/);
  assert.match(css, /#be123c/);
});


test('I4 R12 opens all missing items in a modal window with add/delete controls', () => {
  assert.match(client, /data-stage232i4-r12-missing-window="true"/);
  assert.match(client, /id="client-missing-window-title"/);
  assert.match(client, /Nazwa braku/);
  assert.match(client, /data-stage232i4-r12-missing-window-add-action="true"/);
  assert.match(client, /handleDeleteClientMissingItemStage228R15\(item\)/);
  assert.match(client, /handleResolveClientMissingItemStage228R13\(item\)/);
  assert.match(client, /\{false && clientMissingListOpenStage232I6 \? \(/);
  assert.match(css, /STAGE232I4_R12_MISSING_WINDOW_MODAL/);
});


test('I4 R13F keeps the missing modal simple and updates blocker state', () => {
  assert.match(client, /data-stage232i4-r13f-simple-missing-window="true"/);
  assert.match(client, /data-stage232i4-r13f-add-blocker-checkbox="true"/);
  assert.match(client, /data-stage232i4-r13f-row-blocker-checkbox="true"/);
  assert.match(client, /stage232i2AllActiveMissingItems.map/);
  assert.match(client, /handleToggleClientMissingBlockerStage232I4R13F/);
  assert.match(client, /missingItem: true/);
  assert.match(client, /blocksProgress: clientMissingBlocksProgress/);
  assert.doesNotMatch(client, /id="client-missing-window-note"/);
  assert.doesNotMatch(client, /data-stage232i4-r12-missing-window-filters="true"/);
  assert.match(css, /STAGE232I4_R13F_SIMPLE_MISSING_MODAL_ROWS/);
});
