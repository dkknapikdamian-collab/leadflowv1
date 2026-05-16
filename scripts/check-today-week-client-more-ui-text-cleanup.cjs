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

function stripJsComments(text) {
  let output = '';
  let index = 0;
  let mode = 'code';
  let quote = '';

  while (index < text.length) {
    const current = text[index];
    const next = text[index + 1] || '';

    if (mode === 'code') {
      if (current === '/' && next === '*') {
        index += 2;
        while (index < text.length && !(text[index] === '*' && text[index + 1] === '/')) {
          if (text[index] === '\n') output += '\n';
          index += 1;
        }
        index += 2;
        continue;
      }

      if (current === '/' && next === '/') {
        index += 2;
        while (index < text.length && text[index] !== '\n') index += 1;
        if (text[index] === '\n') output += '\n';
        index += 1;
        continue;
      }

      if (current === "'" || current === '"' || current === '`') {
        mode = 'string';
        quote = current;
        output += current;
        index += 1;
        continue;
      }

      output += current;
      index += 1;
      continue;
    }

    output += current;

    if (current === '\\') {
      if (index + 1 < text.length) {
        output += text[index + 1];
        index += 2;
      } else {
        index += 1;
      }
      continue;
    }

    if (current === quote) {
      mode = 'code';
      quote = '';
    }

    index += 1;
  }

  return output;
}

const today = read('src/pages/Today.tsx');
const clientDetail = read('src/pages/ClientDetail.tsx');
const clientDetailUi = stripJsComments(clientDetail);

assert(today.includes('shouldOpenWeeklyCalendarFromShortcutText'), 'Today missing shortcut text detector');
assert(today.includes('findTodayCalendarShortcutElement'), 'Today missing calendar shortcut element detector');
assert(today.includes('data-today-week-calendar-click-capture="true"'), 'Today missing click capture marker');
assert(today.includes('/calendar?view=week'), 'Today missing weekly calendar URL');

assert(!clientDetailUi.includes("key: 'more'"), 'ClientDetail still contains more tab key');
assert(!clientDetailUi.includes('key: "more"'), 'ClientDetail still contains more tab key');
assert(!clientDetailUi.includes('Wi\u0119cej'), 'ClientDetail still contains Wi\u0119cej text');
assert(!clientDetailUi.includes('Wiecej'), 'ClientDetail still contains Wiecej text');
assert(!clientDetailUi.includes('CLIENT_DETAIL_MORE_MENU_SECONDARY'), 'ClientDetail still contains old more marker');
assert(!clientDetailUi.includes('CLIENT_DETAIL_TABS_KARTOTEKA_RELACJE_HISTORIA_WIECEJ'), 'ClientDetail still contains old more tabs marker');

const forbiddenTexts = [
  'Zasada tego panelu',
  'Tu nie prowadzimy pracy',
  'Nie usuwamy funkcji',
  'Przenosimy je tam, gdzie maj\u0105 sens',
  'Przenosimy je tam, gdzie maja sens',
  'To b\u0119dzie osobnym etapem',
  'To bedzie osobnym etapem',
  'Kr\u00F3tki pulpit. Tylko rzeczy',
  'Krotki pulpit. Tylko rzeczy',
  'Najwa\u017Cniejsze dla tego klienta',
  'Najwazniejsze dla tego klienta',
];

const files = ['src/pages', 'src/components']
  .flatMap((root) => walk(path.join(repo, root)))
  .filter((file) => /\.(ts|tsx|js|jsx)$/.test(file));

const hits = [];

for (const file of files) {
  const text = stripJsComments(fs.readFileSync(file, 'utf8'));
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
