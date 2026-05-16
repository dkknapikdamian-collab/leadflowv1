const fs = require('fs');
const assert = require('assert');

const css = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');
const clientDetail = fs.readFileSync('src/pages/ClientDetail.tsx', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8').replace(/^\uFEFF/, ''));

function mustInclude(source, needle, label) {
  assert.ok(source.includes(needle), `Missing ${label}: ${needle}`);
}

mustInclude(clientDetail, "../styles/visual-stage12-client-detail-vnext.css", 'ClientDetail CSS import');
mustInclude(css, 'CLIENT_DETAIL_STAGE49_VISIBLE_NEXT_ACTION_AND_NOTE_ACTIONS', 'stage marker');
mustInclude(css, '.client-detail-summary-card.client-detail-callout-danger', 'next action danger callout readable selector');
mustInclude(css, '.client-detail-summary-card.client-detail-callout-amber', 'next action amber callout readable selector');
mustInclude(css, '.client-detail-summary-card.client-detail-callout-blue', 'next action blue callout readable selector');
mustInclude(css, '.client-detail-summary-card.client-detail-callout-green', 'next action green callout readable selector');
mustInclude(css, '.client-detail-summary-card.client-detail-callout-muted', 'next action muted callout readable selector');
mustInclude(css, 'color: #111827 !important;', 'dark readable text override');
mustInclude(css, 'color: #475467 !important;', 'muted readable meta override');
mustInclude(css, 'color: #1d4ed8 !important;', 'visible action/link override');
mustInclude(css, '.client-detail-note-inline button', 'note inline button visibility');
mustInclude(css, '.client-detail-quick-actions-list button', 'quick action note button visibility');
mustInclude(css, '[data-client-note-action]', 'future note action data hook');
mustInclude(css, '[data-client-voice-note-action]', 'future voice note action data hook');
mustInclude(css, '[data-client-add-note-action]', 'future add note action data hook');
assert.strictEqual(
  pkg.scripts['check:stage49-client-detail-visible-actions'],
  'node scripts/check-stage49-client-detail-visible-actions.cjs',
  'package script is missing or changed',
);

console.log('PASS STAGE49_CLIENT_DETAIL_VISIBLE_ACTIONS');
