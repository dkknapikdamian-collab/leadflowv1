const fs = require('fs');
const path = require('path');

function fail(message) {
  throw new Error(message);
}

function read(file) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) fail(`Missing file: ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function readExisting(files) {
  return files
    .filter((file) => fs.existsSync(path.join(process.cwd(), file)))
    .map((file) => `\n/* ${file} */\n` + fs.readFileSync(path.join(process.cwd(), file), 'utf8'))
    .join('\n');
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) fail(`Missing ${label}: ${needle}`);
}

function assertRegex(source, regex, label) {
  if (!regex.test(source)) fail(`Missing ${label}: ${regex}`);
}

function assertPackageScript() {
  const raw = read('package.json');
  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch (error) {
    fail(`package.json does not parse: ${error.message}`);
  }
  const script = pkg.scripts && pkg.scripts['check:stage14j-calendar-month-entry-ellipsis'];
  if (script !== 'node scripts/check-stage14j-calendar-month-entry-ellipsis.cjs') {
    fail('Missing package.json script check:stage14j-calendar-month-entry-ellipsis');
  }
}

const calendar = read('src/pages/Calendar.tsx');
const css = readExisting([
  'src/styles/Calendar.css',
  'src/styles/calendar.css',
  'src/styles/closeflow-calendar-skin-only-v1.css',
  'src/styles/closeflow-calendar-month-entry-ellipsis.css',
  'src/styles/closeflow-calendar-month-entry-structural-fix-v3.css',
  'src/styles/closeflow-calendar-month-light-selected-day-real-entries-repair2.css'
]);

assertPackageScript();

assertIncludes(calendar, 'STAGE14J_CALENDAR_MONTH_ENTRY_ELLIPSIS', 'Stage14J runtime marker');
assertIncludes(calendar, 'data-calendar-month-entry', 'month entry marker');
assertRegex(calendar, /setAttribute\((['"])title\1\s*,\s*label\)/, 'native title tooltip assignment');
assertRegex(calendar, /useStage14JMonthEntryEllipsis\s*\(\s*\)/, 'Stage14J hook call');

assertIncludes(css, 'STAGE14J_CALENDAR_MONTH_ENTRY_ELLIPSIS', 'Stage14J CSS marker');
assertRegex(css, /\[data-calendar-month-day="true"\][\s\S]{0,900}overflow\s*:\s*hidden/i, 'month day overflow guard');
assertRegex(css, /\[data-calendar-month-entry="true"\][\s\S]{0,900}white-space\s*:\s*nowrap/i, 'month entry nowrap');
assertRegex(css, /\[data-calendar-month-entry="true"\][\s\S]{0,900}overflow\s*:\s*hidden/i, 'month entry overflow hidden');
assertRegex(css, /\[data-calendar-month-entry="true"\][\s\S]{0,900}text-overflow\s*:\s*ellipsis/i, 'month entry text-overflow ellipsis');
assertRegex(css, /\[data-calendar-month-entry="true"\][\s\S]{0,900}max-width\s*:\s*100%/i, 'month entry max-width 100%');
assertRegex(css, /\[data-calendar-month-entry="true"\][\s\S]{0,900}min-width\s*:\s*0/i, 'month entry min-width 0');
assertRegex(css, /\[data-calendar-month-entry="true"\][\s\S]*>\s*\*[\s\S]{0,900}white-space\s*:\s*nowrap/i, 'month entry descendants nowrap');

console.log('OK: Stage14J calendar month entry ellipsis guard passed');
