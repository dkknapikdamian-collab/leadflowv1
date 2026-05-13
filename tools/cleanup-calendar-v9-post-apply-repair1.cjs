const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const pkgPath = path.join(root, 'package.json');
const calendarPath = path.join(root, 'src/pages/Calendar.tsx');
const v9CssPath = path.join(root, 'src/styles/closeflow-calendar-selected-day-new-tile-v9.css');
const v9CheckPath = path.join(root, 'scripts/check-calendar-selected-day-new-tile-v9-massfix.cjs');

function fail(message) {
  throw new Error(message);
}

if (!fs.existsSync(pkgPath)) fail('Missing package.json');
if (!fs.existsSync(calendarPath)) fail('Missing src/pages/Calendar.tsx');
if (!fs.existsSync(v9CssPath)) fail('Missing V9 CSS: src/styles/closeflow-calendar-selected-day-new-tile-v9.css');
if (!fs.existsSync(v9CheckPath)) fail('Missing V9 guard: scripts/check-calendar-selected-day-new-tile-v9-massfix.cjs');

const calendar = fs.readFileSync(calendarPath, 'utf8');
if (!calendar.includes('data-cf-calendar-selected-day-new-tile-v9="true"')) {
  fail('Calendar.tsx does not contain V9 selected-day tile marker. Refusing cleanup.');
}
if (!calendar.includes("import '../styles/closeflow-calendar-selected-day-new-tile-v9.css';")) {
  fail('Calendar.tsx does not import selected-day V9 CSS. Refusing cleanup.');
}
if (calendar.includes("import '../styles/closeflow-calendar-selected-day-new-tile-v4.css';")) {
  fail('Calendar.tsx still imports obsolete V4 CSS. Fix Calendar.tsx before cleanup.');
}
if (calendar.includes("import '../styles/closeflow-calendar-selected-day-agenda-actions-v2.css';")) {
  fail('Calendar.tsx still imports obsolete selected-day agenda V2 CSS. Fix Calendar.tsx before cleanup.');
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts = pkg.scripts || {};
for (const key of Object.keys(pkg.scripts)) {
  const value = String(pkg.scripts[key] || '');
  if (
    key.includes('selected-day-new-tile-v4') ||
    key.includes('safe-entry-dates-runtime-v2') ||
    value.includes('check-calendar-selected-day-new-tile-v4') ||
    value.includes('check-calendar-safe-entry-dates-runtime-v2')
  ) {
    delete pkg.scripts[key];
  }
}
pkg.scripts['check:calendar:selected-day-new-tile-v9-massfix'] = 'node scripts/check-calendar-selected-day-new-tile-v9-massfix.cjs';

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log('OK: package scripts normalized after selected-day V9 cleanup');
