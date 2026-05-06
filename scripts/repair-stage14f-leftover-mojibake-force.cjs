#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

const TARGETS = [
  'src/pages/AiDrafts.tsx',
  'src/pages/Templates.tsx',
];

const REPLACEMENTS = [
  ['Ĺaduję dane z bazy...', 'Ładuję dane z bazy...'],
  ['Ĺadowanie szkiców...', 'Ładowanie szkiców...'],
  ['Ĺadowanie dostępu...', 'Ładowanie dostępu...'],
  ['Ĺaduję', 'Ładuję'],
  ['Ĺadowanie', 'Ładowanie'],
  ['Ĺąródło', 'Źródło'],
  ['Ĺródło', 'Źródło'],
  ['Nie udaBo si pobra szablonów', 'Nie udało się pobrać szablonów'],
  ['Nie udaBo si zapisa szablonu', 'Nie udało się zapisać szablonu'],
  ['Nie udaBo si skopiowa szablonu', 'Nie udało się skopiować szablonu'],
  ['Nie udaBo si usun szablonu', 'Nie udało się usunąć szablonu'],
  ['Nie udaBo si pobra', 'Nie udało się pobrać'],
  ['Nie udaBo si zapisa', 'Nie udało się zapisać'],
  ['Nie udaBo si skopiowa', 'Nie udało się skopiować'],
  ['Nie udaBo si usun', 'Nie udało się usunąć'],
  ['Aadowanie szablonów', 'Ładowanie szablonów'],
  ['Aadowanie szablon�w', 'Ładowanie szablonów'],
  ['Tryb podgldu', 'Tryb podglądu'],
  ['szablon�w', 'szablonów'],
  ['kr�tkie', 'krótkie'],
  ['wyja[nienie', 'wyjaśnienie'],
  ['Utw�rz szablon', 'Utwórz szablon'],
];

const BLOCKERS = [
  'Ĺaduję',
  'Ĺadowanie',
  'Ĺąródło',
  'Nie udaBo si pobra',
  'Nie udaBo si zapisa',
  'Nie udaBo si skopiowa',
  'Nie udaBo si usun',
  'Aadowanie szablon',
  'Tryb podgldu',
  'szablon�w',
  'kr�tkie',
  'wyja[nienie',
  'Utw�rz',
];

function replaceAll(text, from, to) {
  return text.split(from).join(to);
}

const touched = [];
let totalReplacements = 0;

for (const rel of TARGETS) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error(`Missing target file: ${rel}`);
    process.exit(1);
  }

  let text = fs.readFileSync(full, 'utf8');
  const before = text;

  for (const [from, to] of REPLACEMENTS) {
    if (text.includes(from)) {
      const count = text.split(from).length - 1;
      totalReplacements += count;
      text = replaceAll(text, from, to);
    }
  }

  if (text !== before) {
    fs.writeFileSync(full, text, 'utf8');
    touched.push(rel);
  }
}

const leftovers = [];
for (const rel of TARGETS) {
  const full = path.join(root, rel);
  const text = fs.readFileSync(full, 'utf8');
  const lines = text.split(/\r?\n/);
  for (const blocker of BLOCKERS) {
    lines.forEach((line, index) => {
      if (line.includes(blocker)) {
        leftovers.push(`${rel}:${index + 1}: leftover ${blocker}: ${line.trim().slice(0, 180)}`);
      }
    });
  }
}

if (leftovers.length) {
  console.error('Stage14F did not clear exact leftovers.');
  for (const item of leftovers) console.error('- ' + item);
  process.exit(1);
}

console.log('OK: Stage14F exact leftover mojibake repair completed.');
console.log(`Replacements: ${totalReplacements}`);
console.log(`Touched files: ${touched.length}`);
for (const rel of touched) console.log('- ' + rel);
