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
  assert.match(client, /<small>Braki \/ Blokady<\/small>/);
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
  assert.match(client, /client-detail-missing-details-stage232i4/);
  assert.match(client, /data-stage232i4-client-missing-detail-panel="collapsed"/);
});

test('I4 tile actions use shared source actions and LeadDetail-like button layout', () => {
  assert.match(client, /onAddMissing/);
  assert.match(client, /openClientContextAction\('blocker'\)/);
  assert.match(client, /details\.open = true/);
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
  assert.match(css, /client-detail-top-tile-missing-lead-vst\.client-detail-callout-muted/);
  assert.match(css, /data-stage232i4-r2-lead-action-layout/);
});

test('I4 files stay UTF-8 clean', () => {
  const forbiddenMojibake = /[ĂĹÄ][^\n]{0,80}/;
  assert.doesNotMatch(client, forbiddenMojibake);
  assert.doesNotMatch(css, forbiddenMojibake);
});
