const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

const darkTokens = ['#000', '#020617', '#030712', '#0b1220', '#0f172a', '#101828', '#111827', 'rgb(2, 6, 23)', 'rgb(15, 23, 42)', 'bg-slate-950', 'bg-gray-950', 'bg-neutral-950'];

test('Stage28 AI Drafts right rail hotfix is imported globally after vnext CSS', () => {
  const indexCss = read('src/index.css');
  assert.match(indexCss, /hotfix-ai-drafts-right-rail-dark-wrapper-stage28\.css/);
  assert.ok(indexCss.lastIndexOf('hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css') > indexCss.lastIndexOf('hotfix-lead-client-right-rail-dark-wrappers.css'));
});

test('Stage28 AI Drafts right rail wrapper is transparent and has no dark backplate', () => {
  const css = read('src/styles/hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css');
  assert.match(css, /HOTFIX_AI_DRAFTS_RIGHT_RAIL_DARK_WRAPPER_STAGE28/);
  assert.match(css, /\.ai-drafts-vnext-page \.ai-drafts-right-rail/);
  assert.match(css, /background:\s*transparent !important/);
  assert.match(css, /background-image:\s*none !important/);
  assert.match(css, /border:\s*0 !important/);
  assert.match(css, /box-shadow:\s*none !important/);
  const railBlock = css.slice(css.indexOf('.ai-drafts-vnext-page .ai-drafts-right-rail'), css.indexOf('.ai-drafts-vnext-page .ai-drafts-right-card'));
  for (const token of darkTokens.filter((token) => token !== '#111827')) {
    assert.equal(railBlock.includes(token), false, `Right rail wrapper contains dark token: ${token}`);
  }
});

test('Stage28 AI Drafts right cards are light and pseudo-elements are disabled', () => {
  const css = read('src/styles/hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css');
  assert.match(css, /\.ai-drafts-vnext-page \.ai-drafts-right-card/);
  assert.match(css, /background:\s*#ffffff !important/);
  assert.match(css, /border:\s*1px solid #e4e7ec !important/);
  assert.match(css, /color:\s*#111827 !important/);
  assert.match(css, /content:\s*none !important/);
  assert.match(css, /display:\s*none !important/);
});

test('Stage28 AI Drafts hotfix does not target the app sidebar', () => {
  const css = read('src/styles/hotfix-ai-drafts-right-rail-dark-wrapper-stage28.css');
  assert.equal(/\.sidebar|\.app-sidebar|\.cf-sidebar|nav\[/.test(css), false);
});
