const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const css = fs.readFileSync('src/styles/stage232a-missing-item-visual-source.css', 'utf8');

test('R13-R2 locks screenshot-driven header source', () => {
  assert.match(css, /STAGE232A_R13_R2_HEADER_CSS_SOURCE_OVERRIDE/);
  assert.match(css, /Brak modal top-left must match Nowy lead \/ Nowy klient header/);
});

test('R13-R2 hides old extra top-left text nodes', () => {
  assert.match(css, /\.lead-form-vnext-header > span/);
  assert.match(css, /\.lead-form-vnext-header > p/);
  assert.match(css, /display: none !important/);
  assert.match(css, /visibility: hidden !important/);
  assert.match(css, /height: 0 !important/);
});

test('R13-R2 keeps one title styled like Nowy lead top-left', () => {
  assert.match(css, /font-size: 14px !important/);
  assert.match(css, /font-weight: 900 !important/);
  assert.match(css, /background: #0b1220 !important/);
});
