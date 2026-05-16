// VISUAL_STAGE21_TODAY_FINAL_LOCK_GUARD
const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(relativePath) {
  const target = path.join(repo, relativePath);
  if (!fs.existsSync(target)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  return fs.readFileSync(target, 'utf8');
}

function expectIncludes(relativePath, needle, label) {
  const body = read(relativePath);
  if (!body.includes(needle)) {
    throw new Error(`${relativePath}: missing ${label || needle}`);
  }
  console.log(`OK: ${relativePath} contains ${label || needle}`);
}

function expectAny(relativePath, needles, label) {
  const body = read(relativePath);
  if (!needles.some((needle) => body.includes(needle))) {
    throw new Error(`${relativePath}: missing ${label || needles.join(' OR ')}`);
  }
  console.log(`OK: ${relativePath} contains ${label || needles.join(' OR ')}`);
}

function chars() {
  return String.fromCharCode.apply(String, arguments);
}

const badPatterns = [
  chars(0x0139),
  chars(0x00c4),
  chars(0x0102),
  chars(0x00e2, 0x20ac),
  chars(0x00c5, 0x00bc),
  chars(0x00c5, 0x00ba),
  chars(0x00c5, 0x201a),
  chars(0x00c5, 0x201e),
  chars(0x00c5, 0x203a),
  chars(0x00c3, 0x00b3),
];

const filesToScan = [
  'src/index.css',
  'src/styles/visual-stage21-today-final-lock.css',
  'scripts/check-visual-stage21-today-final-lock.cjs',
  'docs/VISUAL_STAGE21_TODAY_FINAL_LOCK_2026-04-29.md',
];

expectIncludes('src/index.css', 'visual-stage21-today-final-lock.css', 'Stage21 Today final CSS import');
expectIncludes('src/styles/visual-stage21-today-final-lock.css', 'VISUAL_STAGE21_TODAY_FINAL_LOCK_CSS_2026_04_29', 'Stage21 CSS marker');
expectIncludes('src/styles/visual-stage21-today-final-lock.css', '.cf-html-shell .main-today', 'Today route scope');
expectIncludes('src/styles/visual-stage21-today-final-lock.css', '--cf21-blue: #2563eb', 'HTML blue token');
expectIncludes('src/styles/visual-stage21-today-final-lock.css', '.cf-html-shell .main-today .grid-4', 'metric grid lock');
expectIncludes('src/styles/visual-stage21-today-final-lock.css', '.cf-html-shell .main-today .layout-list', 'layout-list lock');
expectIncludes('src/styles/visual-stage21-today-final-lock.css', '.cf-html-shell .main-today .right-card', 'right rail lock');
expectIncludes('src/styles/visual-stage21-today-final-lock.css', '@media (max-width: 760px)', 'mobile breakpoint');
expectAny('src/components/Layout.tsx', ['main-today', 'data-current-section={currentSection}'], 'Today scoped shell support');
expectAny('src/pages/Today.tsx', ['VISUAL_STAGE17_TODAY_HTML_HARD_1TO1', 'Dzi\u015B'], 'Today existing screen kept');
expectIncludes('docs/VISUAL_STAGE21_TODAY_FINAL_LOCK_2026-04-29.md', 'Funkcja obecna w repo', 'mapping table header');
expectIncludes('docs/VISUAL_STAGE21_TODAY_FINAL_LOCK_2026-04-29.md', 'Nie zmienia\u0107', 'do-not-change section');

for (const file of filesToScan) {
  const body = read(file);
  for (const pattern of badPatterns) {
    if (body.includes(pattern)) {
      throw new Error(`${file}: mojibake pattern detected`);
    }
  }
}

console.log('OK: Visual Stage21 Today final lock guard passed.');
