#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const errors = [];

function read(rel) {
  return fs.readFileSync(path.join(repoRoot, rel), 'utf8');
}
function exists(rel) {
  return fs.existsSync(path.join(repoRoot, rel));
}
function expect(condition, message) {
  if (!condition) errors.push(message);
}

const stage = 'STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST';
const stageR2 = 'STAGE232I4_R2_CLIENT_MISSING_TILE_LEAD_VST_ROW_FIT';
const stageR6 = 'STAGE232I4_R6_CLIENT_MISSING_LEAD_SOURCE_TRUTH';
const client = read('src/pages/ClientDetail.tsx');
const css = read('src/styles/visual-stage12-client-detail-vnext.css');
const cfGuard = read('scripts/check-cf-runtime-00-source-truth.cjs');

expect(client.includes(stage), 'ClientDetail missing STAGE232I4 marker');
expect(client.includes(stageR2), 'ClientDetail missing STAGE232I4_R2 marker');
expect(client.includes(stageR6), 'ClientDetail missing STAGE232I4_R6 marker');
expect(client.includes('data-stage232i4-client-missing-top-tile="true"'), 'ClientDetail missing fourth Braki/Blokady top tile marker');
expect(client.includes('data-stage232a-r9-blocker-top-card-summary="true"'), 'ClientDetail missing LeadDetail blocker-card source marker');
expect(client.includes('missingItems={stage232i2AllActiveMissingItems}'), 'ClientTopTiles must receive STAGE232I2 source truth missing items');
expect(client.includes('data-stage232i2-client-detail-missing-blocker-runtime="true"'), 'ClientDetail must keep STAGE232I2 runtime marker');
expect(client.includes('stage232i2AllActiveMissingItems'), 'ClientDetail must keep stage232i2AllActiveMissingItems aggregation');
expect(client.includes('stage232i2SourceType') && client.includes('stage232i2SourceLabel'), 'ClientDetail missing source type/label display contract');
expect(!client.includes('client-detail-missing-details-summary'), 'Old missing details summary must be removed');
expect(!client.includes('details.open = true'), 'Zobacz braki must not use old details.open path');
expect(client.includes('data-stage232i4-r6-client-missing-detail-panel="lead-vst"'), 'ClientDetail missing new lead-like missing detail panel');
expect(client.includes('setClientMissingListOpenStage232I6(true)'), 'Zobacz braki must open the new lead-like missing panel');
expect(client.includes('savedRecord') && client.includes('normalizedSavedRecord'), 'ClientDetail must no-flicker append saved missing record after ContextActionDialogs save');
expect(client.includes("openClientContextAction('blocker')"), 'Dodaj brak must use shared ContextActionDialogs blocker source');
expect(!client.includes('case_items'), 'ClientDetail I4 must not add case_items active source');
expect(!client.includes('from(') || !client.includes('case_items'), 'ClientDetail I4 must not query case_items');

expect(css.includes(stage), 'ClientDetail CSS missing STAGE232I4 marker');
expect(css.includes('grid-template-columns: repeat(4, minmax(0, 1fr));'), 'ClientDetail top grid must support four cards');
expect(css.includes('.client-detail-top-tile-missing.client-detail-callout-danger'), 'ClientDetail missing tile must have red blocker tone');
expect(css.includes('STAGE232I4_R6_CLIENT_MISSING_LEAD_SOURCE_TRUTH'), 'ClientDetail CSS missing I4R6 marker');
expect(css.includes('lead-detail-callout-red'), 'ClientDetail missing tile must use LeadDetail red blocker tone');
expect(css.includes('client-detail-missing-items-section-lead-vst'), 'ClientDetail CSS missing new lead-like missing panel style');
expect(client.includes('data-stage232i4-r2-client-missing-tile-lead-vst-row-fit="true"'), 'ClientDetail missing I4R2 lead VST row-fit marker');
expect(client.includes('data-stage232i4-r2-lead-action-layout="true"'), 'ClientDetail missing I4R2 lead action layout marker');
expect(client.includes('data-stage232i4-r6-lead-inline-actions="true"'), 'ClientDetail missing I4R6 lead inline actions marker');
expect(client.includes('lead-detail-inline-action'), 'ClientDetail missing LeadDetail inline action button source class');
expect(client.includes('Zobacz wszystkie braki'), 'ClientDetail missing LeadDetail-like all-missing button copy');
expect(!client.includes('client-detail-top-tile-source-line'), 'ClientDetail top tile must not render the old extra source-count line');
expect(!client.includes('firstMissingItem ?'), 'ClientDetail top tile must not render first missing chip in the summary card');
expect(client.includes("const missingTileTone = 'client-detail-callout-red';"), 'ClientDetail missing tile must always use red LeadDetail blocker tone');
expect(css.includes('STAGE232I4_R2_CLIENT_MISSING_TILE_LEAD_VST_ROW_FIT'), 'ClientDetail CSS missing I4R2 marker');
expect(css.includes('grid-template-columns: repeat(4, minmax(0, 1fr)) !important;'), 'ClientDetail desktop top tile grid must force one row of four tiles');
expect(css.includes('data-stage232i4-r2-lead-action-layout="true"') || css.includes('data-stage232i4-r2-lead-action-layout'), 'ClientDetail CSS missing I4R2 action layout selector');

expect(cfGuard.includes('CF_RUNTIME_00_STAGE232I4_CLIENT_MISSING_TOP_TILE_SCOPE_COMPAT'), 'CF runtime guard missing I4 scope marker');
expect(cfGuard.includes('scripts/check-stage232i4-client-missing-top-tile-vst.cjs'), 'CF runtime guard missing I4 guard allowlist');
expect(exists('_project/runs/STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST.md'), 'Missing I4 run report');
expect(exists('_project/obsidian_updates/2026-06-18_STAGE232I4_CLIENT_DETAIL_MISSING_BLOCKER_TOP_TILE_VST.md'), 'Missing I4 Obsidian payload');

const forbiddenMojibake = /[ĂĹÄ][^\n]{0,80}/;
expect(!forbiddenMojibake.test(client), 'ClientDetail contains mojibake-like characters after I4');
expect(!forbiddenMojibake.test(css), 'ClientDetail CSS contains mojibake-like characters after I4');

if (errors.length) {
  console.error(`${stage} guard FAILED`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, stage, guard: 'check-stage232i4-client-missing-top-tile-vst' }, null, 2));
