// VISUAL_STAGE17_TODAY_HTML_HARD_1TO1_GUARD
const fs = require('fs');
const path = require('path');

function read(file) {
  return fs.readFileSync(path.join(process.cwd(), file), 'utf8');
}

function expect(file, needle, label) {
  const body = read(file);
  if (!body.includes(needle)) {
    throw new Error(`${file}: missing ${label || needle}`);
  }
  console.log(`OK: ${file} contains ${label || needle}`);
}

function expectAny(file, needles, label) {
  const body = read(file);
  if (!needles.some((needle) => body.includes(needle))) {
    throw new Error(`${file}: missing ${label || needles.join(' OR ')}`);
  }
  console.log(`OK: ${file} contains ${label || needles.join(' OR ')}`);
}

const indexCss = read('src/index.css');
if (indexCss.includes('visual-stage17-today-hard-1to1.css')) {
  throw new Error('src/index.css: Stage17 CSS import is disabled because it breaks the live UI. Keep the CSS file as reference only.');
}
console.log('OK: src/index.css keeps Stage17 broad CSS unimported.');
expect('src/styles/visual-stage17-today-hard-1to1.css', 'VISUAL_STAGE17_TODAY_HTML_HARD_1TO1_CSS', 'Stage17 CSS marker');
expect('src/styles/visual-stage17-today-hard-1to1.css', '--cf17-sidebar: #101828', 'HTML sidebar color token');
expect('src/styles/visual-stage17-today-hard-1to1.css', '.main-today .grid-4', 'Today metric grid selector');
expect('src/styles/visual-stage17-today-hard-1to1.css', '.main-today .layout-list', 'Today layout-list selector');
expect('src/styles/visual-stage17-today-hard-1to1.css', '.main-today .right-card', 'Today right rail selector');
expect('src/styles/visual-stage17-today-hard-1to1.css', '@media (max-width: 760px)', 'mobile breakpoint');
expectAny('src/components/Layout.tsx', ['cf-html-shell', 'VISUAL_STAGE17_CF_HTML_SHELL_COMPAT'], 'HTML shell class/compat marker');
expectAny('src/components/Layout.tsx', ['closeflow-visual-stage01', 'VISUAL_STAGE17_STAGE01_COMPAT'], 'Stage01 visual shell compatibility');
expect('src/pages/Today.tsx', 'VISUAL_STAGE17_TODAY_HTML_HARD_1TO1', 'Today stage marker');
expect('docs/VISUAL_STAGE17_TODAY_HARD_1TO1_2026-04-29.md', 'Funkcja obecna w repo', 'mapping table header');
expect('package.json', 'check:visual-stage17-today-hard-1to1', 'package guard script');
console.log('OK: Visual Stage17 Today hard 1:1 guard passed.');
