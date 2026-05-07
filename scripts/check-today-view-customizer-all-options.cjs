const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const repo = process.cwd();
const todayPath = path.join(repo, 'src/pages/TodayStable.tsx');
const pkgPath = path.join(repo, 'package.json');
const src = fs.readFileSync(todayPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const errors = [];

function need(condition, message) {
  if (!condition) errors.push(message);
}

need(src.includes('STAGE16AR_TODAY_VIEW_ALL_OPTIONS_FIXED'), 'missing Stage16AR marker');
need(src.includes('{todayTiles.map((tile) => {'), 'view checkbox panel must be sourced from all todayTiles');
need(src.includes('const checked = visibleTodaySectionSet.has(tile.key);'), 'checkbox state must use visibleTodaySectionSet, not filtered option source');
need(src.includes('checked={checked}'), 'checkbox input must be controlled');
need(src.includes('setVisibleTodaySections((current) => {'), 'checkbox must update visible sections by callback');
need(src.includes('writeTodayVisibleSections(next);'), 'visibility changes must persist to localStorage');
need(src.includes('Pokaż wszystko'), 'view panel must allow restoring all options');
need(src.includes("setExpandedSection('all')"), 'restore all must reset expanded section to all');
need(!/visibleTodaySections\.map\s*\(/.test(src), 'panel cannot source options from visibleTodaySections.map');
need(!/todayTiles\.filter\s*\([^\)]*visibleTodaySectionSet\.has[\s\S]{0,120}?\.map\s*\(/.test(src), 'panel cannot filter todayTiles by visible set before options map');
need(pkg.scripts && pkg.scripts['check:today-view-customizer-all-options'], 'package.json missing check script');
need(pkg.scripts && pkg.scripts['test:today-view-customizer-all-options'], 'package.json missing test script');

if (errors.length) {
  console.error('Today view customizer all-options guard failed.');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK: Today view customizer keeps all options available after hiding sections.');
