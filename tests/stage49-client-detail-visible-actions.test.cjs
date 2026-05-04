const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('Stage49 keeps ClientDetail next action and note actions readable', () => {
  const css = fs.readFileSync('src/styles/visual-stage12-client-detail-vnext.css', 'utf8');
  assert.match(css, /CLIENT_DETAIL_STAGE49_VISIBLE_NEXT_ACTION_AND_NOTE_ACTIONS/);
  assert.match(css, /\.client-detail-summary-card\.client-detail-callout-danger[\s\S]*color:\s*#111827\s*!important/);
  assert.match(css, /\.client-detail-summary-card\.client-detail-callout-amber[\s\S]*color:\s*#111827\s*!important/);
  assert.match(css, /\.client-detail-summary-card\.client-detail-callout-blue[\s\S]*color:\s*#111827\s*!important/);
  assert.match(css, /\.client-detail-summary-card\.client-detail-callout-green[\s\S]*color:\s*#111827\s*!important/);
  assert.match(css, /\.client-detail-summary-card\.client-detail-callout-muted[\s\S]*color:\s*#111827\s*!important/);
  assert.match(css, /\.client-detail-note-inline button[\s\S]*color:\s*#111827\s*!important/);
  assert.match(css, /\.client-detail-quick-actions-list button[\s\S]*background:\s*#ffffff\s*!important/);
  assert.match(css, /\[data-client-voice-note-action\]/);
  assert.match(css, /\[data-client-add-note-action\]/);
});
