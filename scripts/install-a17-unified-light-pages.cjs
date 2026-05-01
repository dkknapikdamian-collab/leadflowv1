const fs = require('node:fs');

function read(path) {
  return fs.readFileSync(path, 'utf8').replace(/^\uFEFF/, '');
}

function write(path, content) {
  fs.writeFileSync(path, content.replace(/^\uFEFF/, ''), 'utf8');
}

const indexPath = 'src/index.css';
const importLine = "@import './styles/stage36-unified-light-pages.css';";
let indexCss = read(indexPath);
if (!indexCss.includes('stage36-unified-light-pages.css')) {
  indexCss = indexCss.trimEnd() + `\n${importLine}\n`;
  write(indexPath, indexCss);
  console.log('patched src/index.css');
} else {
  console.log('ok src/index.css already imports stage36 unified light pages');
}

const guardPath = 'scripts/check-a13-critical-regressions.cjs';
let guard = read(guardPath);
const guardBlock = `
check('unified light pages visual lock', () => {
  grep('src/index.css', /stage36-unified-light-pages\\.css/);
  grep('src/styles/stage36-unified-light-pages.css', /STAGE36_UNIFIED_LIGHT_PAGES/);
  grep('src/styles/stage36-unified-light-pages.css', /\\[data-a16-template-light-ui\\]/);
  grep('src/styles/stage36-unified-light-pages.css', /\\.ai-drafts-vnext-page/);
  grep('src/styles/stage36-unified-light-pages.css', /html\\[data-skin\\] \\[data-a16-template-light-ui\\]/);
  grep('src/styles/stage36-unified-light-pages.css', /ai-drafts-toolbar-card/);
});
`;

if (!guard.includes('unified light pages visual lock')) {
  guard = guard.replace(/\nif \(failures\.length\) \{/, `${guardBlock}\nif (failures.length) {`);
  write(guardPath, guard);
  console.log('patched scripts/check-a13-critical-regressions.cjs');
} else {
  console.log('ok A13 guard already contains unified light pages visual lock');
}
