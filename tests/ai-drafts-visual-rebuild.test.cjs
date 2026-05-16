const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const pagePath = path.join(root, 'src', 'pages', 'AiDrafts.tsx');
const cssPath = path.join(root, 'src', 'styles', 'visual-stage9-ai-drafts-vnext.css');

const page = fs.readFileSync(pagePath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

function mustInclude(source, value, label) {
  assert(source.includes(value), `Missing ${label}: ${value}`);
}

mustInclude(page, 'Szkice AI', 'header');
mustInclude(page, 'SZKICE DO SPRAWDZENIA', 'kicker');
mustInclude(page, 'Rzeczy przygotowane przez asystenta. Sprawd\u017A, popraw i dopiero wtedy zapisz.', 'description');

['Wszystkie', 'Do sprawdzenia', 'Leady', 'Zadania', 'Wydarzenia'].forEach((label) => {
  mustInclude(page, label, `filter ${label}`);
});

['getDraftTypeLabel(draft)', 'getDraftTitle(draft)', 'getDraftStatusLabel(draft)', 'getDraftSourceLabel(draft)', 'formatDraftDate(draft.createdAt)'].forEach((needle) => {
  mustInclude(page, needle, `draft row field ${needle}`);
});

['Sprawd\u017A', 'Edytuj', 'Zatwierd\u017A'].forEach((label) => {
  mustInclude(page, label, `pending action ${label}`);
});
assert(page.includes('Anuluj') || page.includes('Usu\u0144'), 'Missing pending remove/cancel action');

assert(!page.includes('JSON.stringify(draft'), 'Main list must not render draft JSON');
assert(!page.includes('<pre'), 'Main list must not render raw technical pre blocks');

['.ai-drafts-right-rail', '.ai-drafts-right-card'].forEach((selector) => {
  mustInclude(css, selector, `right rail selector ${selector}`);
});

const darkTokens = ['#000', '#020617', '#0b1220', '#101828'];
const scopedRightRailCss = css
  .split('\n')
  .filter((line) => line.includes('ai-drafts-right-rail') || line.includes('ai-drafts-right-card') || line.includes('background') || line.includes('box-shadow') || line.includes('color'))
  .join('\n');
for (const token of darkTokens) {
  assert(!scopedRightRailCss.includes(token), `Dark right rail token found: ${token}`);
}

['QsS54oCaw4TigKZk', 'T3R3xILFgnJ6', 'w4XCuXLEgsWCZMWCbw==', 'Q3lrbGljem5vxLnigLrDhOKAoQ==']
  .map((value) => Buffer.from(value, 'base64').toString('utf8'))
  .forEach((bad) => {
    assert(!page.includes(bad), `Mojibake in page: ${bad}`);
    assert(!css.includes(bad), `Mojibake in css: ${bad}`);
  });

console.log('PASS ai drafts visual rebuild');
