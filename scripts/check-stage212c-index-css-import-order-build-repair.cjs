#!/usr/bin/env node
/* STAGE212C_INDEX_CSS_IMPORT_ORDER_BUILD_REPAIR_GUARD */
const fs = require('fs');
const path = require('path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const indexPath = path.join(repo, 'src', 'index.css');
const layoutPath = path.join(repo, 'src', 'components', 'Layout.tsx');
const foundationPath = path.join(repo, 'src', 'styles', 'closeflow-visual-foundation-stage212b.css');

function fail(message) {
  console.error('STAGE212C_INDEX_CSS_IMPORT_ORDER_BUILD_REPAIR_GUARD_FAIL: ' + message);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) fail('missing src/index.css');
if (!fs.existsSync(foundationPath)) fail('missing visual foundation css from Stage212B');
if (!fs.existsSync(layoutPath)) fail('missing Layout.tsx');

const css = fs.readFileSync(indexPath, 'utf8').replace(/^\uFEFF/, '');
const layout = fs.readFileSync(layoutPath, 'utf8').replace(/^\uFEFF/, '');

if (!css.includes('STAGE212C_INDEX_CSS_IMPORT_ORDER_BUILD_REPAIR')) fail('missing Stage212C marker');
if (!css.includes('@import "tailwindcss";')) fail('missing tailwind import');
if (!css.includes("@import './styles/closeflow-visual-foundation-stage212b.css';")) fail('missing Stage212B foundation import');

const noComments = css.replace(/\/\*[\s\S]*?\*\//g, '').trimStart();
if (!noComments.startsWith('@import "tailwindcss";')) {
  fail('tailwind import is not first executable CSS statement');
}

const themeIndex = css.indexOf('@theme');
const layerIndex = css.indexOf('@layer');
let firstBlockIndex = -1;
if (themeIndex >= 0 && layerIndex >= 0) firstBlockIndex = Math.min(themeIndex, layerIndex);
else if (themeIndex >= 0) firstBlockIndex = themeIndex;
else if (layerIndex >= 0) firstBlockIndex = layerIndex;
if (firstBlockIndex < 0) fail('missing @theme/@layer block');

const afterFirstBlock = css.slice(firstBlockIndex);
if (/@import\s+/.test(afterFirstBlock)) {
  fail('found @import after @theme/@layer block');
}

const tailwindCount = (css.match(/@import\s+"tailwindcss";/g) || []).length;
if (tailwindCount !== 1) fail('tailwind import count is not exactly 1: ' + tailwindCount);

const foundationCount = (css.match(/closeflow-visual-foundation-stage212b\.css/g) || []).length;
if (foundationCount !== 1) fail('visual foundation import count is not exactly 1: ' + foundationCount);

const badMojibake = /DziÅ|AktywnoÅ|ZgÅ|RozliczeniaÅ|PowiadomieniaÅ|KlienciÅ|SprawyÅ|Å›|Ä‡|Ĺ|Â|�/;
if (badMojibake.test(layout)) fail('mojibake marker detected in Layout.tsx');

for (const label of ['Dziś', 'Aktywność', 'Zgłoszenia', 'Rozliczenia', 'Powiadomienia', 'Klienci', 'Sprawy']) {
  if (!layout.includes(label)) fail('missing Polish sidebar label: ' + label);
}

console.log('STAGE212C_INDEX_CSS_IMPORT_ORDER_BUILD_REPAIR_GUARD_PASS');
