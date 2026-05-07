const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const todayRel = path.join('src', 'pages', 'TodayStable.tsx');
const pkgRel = 'package.json';

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function write(rel, content) {
  fs.writeFileSync(path.join(repo, rel), content, 'utf8');
}

function patchPackageJson() {
  const file = path.join(repo, pkgRel);
  const pkg = JSON.parse(fs.readFileSync(file, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:today-view-customizer'] = 'node scripts/check-today-view-customizer.cjs';
  pkg.scripts['test:today-view-customizer'] = 'node --test tests/today-view-customizer.test.cjs';
  fs.writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

function removeConst(text, name) {
  const pattern = new RegExp(`\\r?\\n?\\s*const\\s+${name}\\s*=\\s*['\"][^'\"]*['\"];`, 'g');
  return text.replace(pattern, '');
}

function removeVoid(text, name) {
  const pattern = new RegExp(`\\r?\\n?\\s*void\\s+${name};`, 'g');
  return text.replace(pattern, '');
}

function insertAfter(text, pattern, insert, label) {
  if (text.includes(insert.trim())) return text;
  const match = text.match(pattern);
  if (!match) throw new Error(`Could not find insertion anchor: ${label}`);
  return text.replace(match[0], match[0] + insert);
}

function patchTodayStable() {
  let text = read(todayRel);

  // Clean failed Stage16AM/AN duplicate constants left by interrupted patch runs.
  for (const name of [
    'TODAY_VIEW_STORAGE_KEY',
    'STAGE16AM_TODAY_VIEW_CUSTOMIZER',
    'STAGE16AN_TODAY_VIEW_CUSTOMIZER',
  ]) {
    text = removeConst(text, name);
  }
  for (const name of ['STAGE16AM_TODAY_VIEW_CUSTOMIZER', 'STAGE16AN_TODAY_VIEW_CUSTOMIZER']) {
    text = removeVoid(text, name);
  }

  const constBlock = "const STAGE16AN_TODAY_VIEW_CUSTOMIZER = 'STAGE16AN_TODAY_VIEW_CUSTOMIZER';\n" +
    "const TODAY_VIEW_STORAGE_KEY = 'closeflow:today:view-sections:v1';\n";

  text = insertAfter(
    text,
    /const STAGE16AI_TODAY_TILES_MATCH_LISTS = 'STAGE16AI_TODAY_TILES_MATCH_LISTS';\r?\n/,
    constBlock,
    'Stage16AI tile marker',
  );

  text = insertAfter(
    text,
    /void STAGE16AI_TODAY_TILES_MATCH_LISTS;\r?\n/,
    'void STAGE16AN_TODAY_VIEW_CUSTOMIZER;\n',
    'Stage16AI tile void marker',
  );

  const storageKeyCount = (text.match(/const TODAY_VIEW_STORAGE_KEY\s*=/g) || []).length;
  if (storageKeyCount !== 1) {
    throw new Error(`TODAY_VIEW_STORAGE_KEY count must be 1, got ${storageKeyCount}`);
  }

  const stageMarkerCount = (text.match(/STAGE16AN_TODAY_VIEW_CUSTOMIZER/g) || []).length;
  if (stageMarkerCount < 2) {
    throw new Error('Stage16AN Today view marker missing after repair');
  }

  write(todayRel, text);
}

function main() {
  patchPackageJson();
  patchTodayStable();
  console.log('OK: Stage16AO Today view duplicate const repair applied.');
  console.log('- src/pages/TodayStable.tsx');
  console.log('- package.json');
}

main();
