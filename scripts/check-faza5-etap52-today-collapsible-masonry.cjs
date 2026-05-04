const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const todayPath = path.join(root, 'src/pages/Today.tsx');
const cssPath = path.join(root, 'src/styles/today-collapsible-masonry.css');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function assertIncludes(content, needle, label) {
  if (!content.includes(needle)) {
    throw new Error(`${label}: missing ${needle}`);
  }
}

const today = read(todayPath);
const css = read(cssPath);

[
  'FAZA5_ETAP52_TODAY_COLLAPSIBLE_MASONRY',
  "import '../styles/today-collapsible-masonry.css';",
  'data-today-tile-card="true"',
  'data-today-collapsible-section="true"',
  'aria-expanded={!collapsed}',
  'onClick={handleHeaderClick}',
  'today-independent-section',
  'self-start',
  'h-fit',
  'data-today-tile-body="true"',
].forEach((needle) => assertIncludes(today, needle, 'Today.tsx'));

[
  'FAZA5_ETAP52_TODAY_COLLAPSIBLE_MASONRY',
  'align-self: start',
  'height: fit-content',
  'min-height: 0',
  'align-items: start',
  '[data-today-tile-card="true"]',
  '[data-today-collapsible-section="true"]',
].forEach((needle) => assertIncludes(css, needle, 'today-collapsible-masonry.css'));

const tileClassMatch = today.match(/className=\{`([^`]*today-independent-section[^`]*)`\}/);
if (!tileClassMatch) {
  throw new Error('Today.tsx: TileCard root class does not contain today-independent-section');
}
if (/items-stretch|min-h-screen/.test(tileClassMatch[1])) {
  throw new Error('Today.tsx: TileCard root contains a stretch/min-height class that can force equal-height columns');
}

console.log('PASS FAZA5_ETAP52_TODAY_COLLAPSIBLE_MASONRY');
