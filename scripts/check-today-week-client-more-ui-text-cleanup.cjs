const fs = require('fs');
const path = require('path');

const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}

function walk(dir, result) {
  result = result || [];
  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const target = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', '.vercel'].includes(entry.name)) continue;
      walk(target, result);
      continue;
    }

    result.push(target);
  }

  return result;
}

function assert(condition, message) {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}

const today = read('src/pages/Today.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');

assert(today.includes('shouldOpenWeeklyCalendarFromShortcutText'), 'Today missing shortcut text detector');
assert(today.includes('findTodayCalendarShortcutElement'), 'Today missing calendar shortcut element detector');
assert(today.includes('data-today-week-calendar-click-capture="true"'), 'Today missing click capture marker');
assert(today.includes('/calendar?view=week'), 'Today missing weekly calendar URL');

assert(!clientDetail.includes("key: 'more'"), 'ClientDetail still contains more tab key');
assert(!clientDetail.includes('key: "more"'), 'ClientDetail still contains more tab key');
assert(!clientDetail.includes('Więcej'), 'ClientDetail still contains Więcej text');
assert(!clientDetail.includes('Wiecej'), 'ClientDetail still contains Wiecej text');
assert(!clientDetail.includes('CLIENT_DETAIL_MORE_MENU_SECONDARY'), 'ClientDetail still contains old more marker');
assert(!clientDetail.includes('CLIENT_DETAIL_TABS_KARTOTEKA_RELACJE_HISTORIA_WIECEJ'), 'ClientDetail still contains old more tabs marker');

const forbiddenTexts = [
  'Zasada tego panelu',
  'Tu nie prowadzimy pracy',
  'Nie usuwamy funkcji',
  'Przenosimy je tam, gdzie mają sens',
  'Przenosimy je tam, gdzie maja sens',
  'To będzie osobnym etapem',
  'To bedzie osobnym etapem',
  'Krótki pulpit. Tylko rzeczy',
  'Krotki pulpit. Tylko rzeczy',
  'Najważniejsze dla tego klienta',
  'Najwazniejsze dla tego klienta',
];

const files = ['src/pages', 'src/components']
  .flatMap((root) => walk(path.join(repo, root)))
  .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file));

const hits = [];

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const fragment of forbiddenTexts) {
    if (text.includes(fragment)) {
      hits.push(path.relative(repo, file) + ': ' + fragment);
    }
  }
}

if (hits.length) {
  console.error('Instruction-like UI text still detected:');
  for (const hit of hits) console.error(hit);
  process.exit(1);
}

console.log('OK: Today week shortcuts, ClientDetail more removal and UI text cleanup are guarded.');
