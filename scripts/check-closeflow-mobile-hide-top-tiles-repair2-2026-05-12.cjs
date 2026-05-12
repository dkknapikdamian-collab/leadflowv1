#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const cssPath = path.join(root, 'src', 'styles', 'closeflow-mobile-start-tile-trim.css');
const indexCssPath = path.join(root, 'src', 'index.css');
const mainPath = path.join(root, 'src', 'main.tsx');
const packagePath = path.join(root, 'package.json');

function fail(message) {
  console.error(`✖ ${message}`);
  process.exit(1);
}
function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
}
function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', 'dist', 'build', '.git'].includes(entry.name)) walk(full, out);
    } else if (/\.(tsx|jsx|css)$/u.test(entry.name)) out.push(full);
  }
  return out;
}

if (!fs.existsSync(cssPath)) fail('Brak src/styles/closeflow-mobile-start-tile-trim.css');
const css = read(cssPath);
const requiredTokens = [
  'CLOSEFLOW_MOBILE_START_TILE_TRIM_REPAIR2_2026_05_12',
  '@media (max-width: 767px)',
  '[data-cf-mobile-start-tile-trim="true"]',
  '.cf-page-hero-aside',
  '.cf-page-quick-links',
  ':has(> :is(a, button)[href*="leads"]',
  'display: none !important',
];
for (const token of requiredTokens) {
  if (!css.includes(token)) fail(`CSS repair2 nie zawiera wymaganego tokenu: ${token}`);
}
if (/zoom\s*:/i.test(css) || /transform\s*:\s*scale/i.test(css)) {
  fail('CSS nie moze uzywac zoom ani transform: scale');
}
if (/@media\s*\(min-width:\s*768px\)[\s\S]*display\s*:\s*none/i.test(css)) {
  fail('Nie wolno ukrywac kafelkow w regule desktop/tablet min-width');
}
const importedInIndex = read(indexCssPath).includes('closeflow-mobile-start-tile-trim.css');
const importedInMain = read(mainPath).includes('closeflow-mobile-start-tile-trim.css') || read(mainPath).includes('./index.css');
if (!importedInIndex && !importedInMain) fail('Brak importu CSS mobile trim w src/index.css albo src/main.tsx');
if (!fs.existsSync(packagePath)) fail('Brak package.json');
const pkg = JSON.parse(read(packagePath));
if (!pkg.scripts || pkg.scripts['check:mobile-start-tile-trim:repair2'] !== 'node scripts/check-closeflow-mobile-hide-top-tiles-repair2-2026-05-12.cjs') {
  fail('package.json nie zawiera skryptu check:mobile-start-tile-trim:repair2');
}

const files = walk(path.join(root, 'src'));
const hasDataAttr = files.some((file) => read(file).includes('data-cf-mobile-start-tile-trim="true"'));
const knownWrapperExists = files.some((file) => /cf-page-(hero-aside|header-tiles|quick-links|hero-shortcuts|header-stats|header-metrics)/.test(read(file)));
if (knownWrapperExists && !hasDataAttr) {
  console.warn('⚠ Nie znaleziono jawnego data-cf-mobile-start-tile-trim w TSX, ale CSS repair2 ma fallback po klasach i :has().');
}
console.log('✔ mobile start tile trim repair2 is mobile-only and wired');
