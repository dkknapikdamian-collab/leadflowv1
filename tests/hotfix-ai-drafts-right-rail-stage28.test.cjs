const assert = require('node:assert/strict');
const fs = require('node:fs');
const test = require('node:test');

function read(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

test('AI Drafts right rail hotfix is imported globally', () => {
  const indexCss = read('src/index.css');
  assert.match(indexCss, /hotfix-ai-drafts-right-rail-stage28\.css/);
});

test('AI Drafts right rail wrapper is transparent and cards are light', () => {
  const css = read('src/styles/hotfix-ai-drafts-right-rail-stage28.css');

  assert.match(css, /STAGE28_AI_DRAFTS_RIGHT_RAIL_LIGHT_HOTFIX/);
  assert.match(css, /\.ai-drafts-right-rail/);
  assert.match(css, /background:\s*transparent\s*!important/);
  assert.match(css, /border:\s*0\s*!important/);
  assert.match(css, /box-shadow:\s*none\s*!important/);
  assert.match(css, /background:\s*#ffffff\s*!important/);
  assert.match(css, /border:\s*1px solid #e4e7ec\s*!important/);
  assert.match(css, /content:\s*none\s*!important/);
});

test('AI Drafts right rail hotfix does not target the app sidebar', () => {
  const css = read('src/styles/hotfix-ai-drafts-right-rail-stage28.css');

  assert.doesNotMatch(css, /\.sidebar/);
  assert.doesNotMatch(css, /\.app-sidebar/);
  assert.doesNotMatch(css, /\.cf-sidebar/);
});
