const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const todayPath = path.join(repo, 'src', 'pages', 'TodayStable.tsx');
const pkgPath = path.join(repo, 'package.json');
const today = fs.readFileSync(todayPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const failures = [];
function expect(condition, message) {
  if (!condition) failures.push(message);
}
function count(pattern) {
  return (today.match(pattern) || []).length;
}

expect(count(/const TODAY_VIEW_STORAGE_KEY\s*=/g) === 1, 'Today view storage key must be declared exactly once');
expect(today.includes('STAGE16AN_TODAY_VIEW_CUSTOMIZER'), 'Stage16AN Today view marker missing');
expect(today.includes('localStorage.getItem(TODAY_VIEW_STORAGE_KEY)'), 'Today view must read localStorage');
expect(today.includes('localStorage.setItem(TODAY_VIEW_STORAGE_KEY'), 'Today view must persist localStorage');
expect(today.includes('Widok'), 'Today header must expose Widok control');
expect(today.includes('Pokaż wszystko') || today.includes('Pokaz wszystko'), 'Today view must expose show-all action');
expect(today.includes('type="checkbox"') || today.includes("type='checkbox'"), 'Today view must expose checkbox controls');
expect(/visibleTodaySectionKeys|visibleTodaySections|todayVisibleSections|hiddenTodaySections/.test(today), 'Today view must keep visible/hidden section state');
expect(/todayTiles\.filter|visibleTodaySectionKeys\.includes|sectionVisible\(tile\.key\)/.test(today), 'Today tiles must respect view visibility');
expect(/sectionVisible\('no_action'\)|sectionVisible\("no_action"\)/.test(today), 'Today lists must still be controlled through sectionVisible');
expect(pkg.scripts && pkg.scripts['check:today-view-customizer'] === 'node scripts/check-today-view-customizer.cjs', 'package.json missing check:today-view-customizer');
expect(pkg.scripts && pkg.scripts['test:today-view-customizer'] === 'node --test tests/today-view-customizer.test.cjs', 'package.json missing test:today-view-customizer');

if (failures.length) {
  console.error('Today view customizer guard failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: Today view customizer contract passed.');
