const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

function read(rel) {
  return fs.readFileSync(path.join(process.cwd(), rel), 'utf8');
}

function stripCssComments(value) {
  return value.replace(/\/\*[\s\S]*?\*\//g, '');
}

function assertIncludes(content, needle, label) {
  assert.ok(content.includes(needle), `${label} missing: ${needle}`);
}

function assertNotIncludes(content, needle, label) {
  assert.ok(!content.includes(needle), `${label} must not include: ${needle}`);
}

test('Lead and Client detail right rail hotfix is imported globally after visual imports', () => {
  const indexCss = read('src/index.css');
  assertIncludes(
    indexCss,
    '@import "./styles/hotfix-lead-client-right-rail-dark-wrappers.css";',
    'src/index.css',
  );
  assert.ok(
    indexCss.lastIndexOf('hotfix-lead-client-right-rail-dark-wrappers.css') >
      indexCss.lastIndexOf('closeflow-vnext-ui-contract.css'),
    'detail right rail hotfix must be imported after closeflow-vnext-ui-contract.css so it wins the cascade',
  );
});

test('Lead detail side rail wrapper is transparent and cards are light', () => {
  const css = read('src/styles/hotfix-lead-client-right-rail-dark-wrappers.css');
  const cssNoComments = stripCssComments(css);

  assertIncludes(css, 'HOTFIX_LEAD_CLIENT_RIGHT_RAIL_DARK_WRAPPERS', 'hotfix css');
  assertIncludes(css, '.lead-detail-vnext-page .lead-detail-right-rail', 'LeadDetail rail selector');
  assertIncludes(css, '.main-lead-detail .lead-detail-right-rail', 'LeadDetail scoped shell selector');
  assertIncludes(css, 'background: transparent !important;', 'LeadDetail rail background');
  assertIncludes(css, 'background-color: transparent !important;', 'LeadDetail rail background-color');
  assertIncludes(css, 'border: 0 !important;', 'LeadDetail rail border');
  assertIncludes(css, 'box-shadow: none !important;', 'LeadDetail rail shadow');
  assertIncludes(css, 'outline: 0 !important;', 'LeadDetail rail outline');
  assertIncludes(css, '.lead-detail-right-card', 'LeadDetail card selector');
  assertIncludes(css, 'background: var(--cf-detail-hotfix-card) !important;', 'LeadDetail card background');
  assertIncludes(css, 'border: 1px solid var(--cf-detail-hotfix-border) !important;', 'LeadDetail card border');

  for (const token of ['background: #000', 'background-color: #000', 'background: #020617', 'background-color: #020617', 'background: #0b1220', 'background-color: #0b1220', 'background: #101828', 'background-color: #101828']) {
    assertNotIncludes(cssNoComments, token, 'LeadDetail hotfix CSS');
  }
});

test('Client detail side rail wrappers are transparent and cards are light', () => {
  const css = read('src/styles/hotfix-lead-client-right-rail-dark-wrappers.css');
  const cssNoComments = stripCssComments(css);

  assertIncludes(css, '.client-detail-vnext-page .client-detail-left-rail', 'ClientDetail left rail selector');
  assertIncludes(css, '.client-detail-vnext-page .client-detail-right-rail', 'ClientDetail right rail selector');
  assertIncludes(css, '.main-client-detail .client-detail-left-rail', 'ClientDetail scoped left rail selector');
  assertIncludes(css, '.main-client-detail .client-detail-right-rail', 'ClientDetail scoped right rail selector');
  assertIncludes(css, 'background: transparent !important;', 'ClientDetail rail background');
  assertIncludes(css, 'background-color: transparent !important;', 'ClientDetail rail background-color');
  assertIncludes(css, 'border: 0 !important;', 'ClientDetail rail border');
  assertIncludes(css, 'box-shadow: none !important;', 'ClientDetail rail shadow');
  assertIncludes(css, '.client-detail-profile-card', 'ClientDetail profile card selector');
  assertIncludes(css, '.client-detail-actions-card', 'ClientDetail actions card selector');
  assertIncludes(css, '.client-detail-right-card', 'ClientDetail right card selector');
  assertIncludes(css, 'background: var(--cf-detail-hotfix-card) !important;', 'ClientDetail card background');
  assertIncludes(css, 'border: 1px solid var(--cf-detail-hotfix-border) !important;', 'ClientDetail card border');

  for (const token of ['background: #000', 'background-color: #000', 'background: #020617', 'background-color: #020617', 'background: #0b1220', 'background-color: #0b1220', 'background: #101828', 'background-color: #101828']) {
    assertNotIncludes(cssNoComments, token, 'ClientDetail hotfix CSS');
  }
});

test('hotfix does not touch app sidebar selectors', () => {
  const css = read('src/styles/hotfix-lead-client-right-rail-dark-wrappers.css');
  assertNotIncludes(css, '.sidebar', 'hotfix CSS');
  assertNotIncludes(css, '.cf-sidebar', 'hotfix CSS');
  assertNotIncludes(css, '.app-sidebar', 'hotfix CSS');
});
