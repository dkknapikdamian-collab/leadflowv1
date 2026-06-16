const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const index = fs.readFileSync('src/index.css', 'utf8');
const css = fs.readFileSync('src/styles/stage232a-r10-r2-lead-action-groups-visual-polish.css', 'utf8');

test('STAGE232A R10-R2 imports global visual polish after emergency overrides', () => {
  assert.match(index, /stage232a-r10-r2-lead-action-groups-visual-polish\.css/);
});

test('STAGE232A R10-R2 gives action groups stronger visual identity', () => {
  assert.match(css, /lead-detail-action-accordion-group::before/);
  assert.match(css, /lead-detail-action-accordion-group--next/);
  assert.match(css, /lead-detail-action-accordion-group--blockers/);
  assert.match(css, /lead-detail-action-accordion-group--active/);
});

test('STAGE232A R10-R2 makes Braki inner cards amber and keeps notes neutral', () => {
  assert.match(css, /\[data-stage232a-r10-r1-empty-tone="missing"\]/);
  assert.match(css, /\[data-stage232a-r10-r1-missing-tone-row="true"\]/);
  assert.match(css, /#fff3c4/);
  assert.match(css, /#f59e0b/);
  assert.match(css, /lead-detail-notes-section \.lead-detail-light-empty/);
});
