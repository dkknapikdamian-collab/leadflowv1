#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

const TARGETS = [
  'src/pages/AiDrafts.tsx',
  'src/pages/Templates.tsx',
];

const REPLACEMENTS = [
  ['\u0139aduj\u0119 dane z bazy...', '\u0141aduj\u0119 dane z bazy...'],
  ['\u0139adowanie szkic\u00F3w...', '\u0141adowanie szkic\u00F3w...'],
  ['\u0139adowanie dost\u0119pu...', '\u0141adowanie dost\u0119pu...'],
  ['\u0139aduj\u0119', '\u0141aduj\u0119'],
  ['\u0139adowanie', '\u0141adowanie'],
  ['\u0179r\u00F3d\u0142o', '\u0179r\u00F3d\u0142o'],
  ['\u0139r\u00F3d\u0142o', '\u0179r\u00F3d\u0142o'],
  ['Nie udaBo si pobra szablon\u00F3w', 'Nie uda\u0142o si\u0119 pobra\u0107 szablon\u00F3w'],
  ['Nie udaBo si zapisa szablonu', 'Nie uda\u0142o si\u0119 zapisa\u0107 szablonu'],
  ['Nie udaBo si skopiowa szablonu', 'Nie uda\u0142o si\u0119 skopiowa\u0107 szablonu'],
  ['Nie udaBo si usun szablonu', 'Nie uda\u0142o si\u0119 usun\u0105\u0107 szablonu'],
  ['Nie udaBo si pobra', 'Nie uda\u0142o si\u0119 pobra\u0107'],
  ['Nie udaBo si zapisa', 'Nie uda\u0142o si\u0119 zapisa\u0107'],
  ['Nie udaBo si skopiowa', 'Nie uda\u0142o si\u0119 skopiowa\u0107'],
  ['Nie udaBo si usun', 'Nie uda\u0142o si\u0119 usun\u0105\u0107'],
  ['Aadowanie szablon\u00F3w', '\u0141adowanie szablon\u00F3w'],
  ['Aadowanie szablon\ufffdw', '\u0141adowanie szablon\u00F3w'],
  ['Tryb podgldu', 'Tryb podgl\u0105du'],
  ['szablon\ufffdw', 'szablon\u00F3w'],
  ['kr\ufffdtkie', 'kr\u00F3tkie'],
  ['wyja[nienie', 'wyja\u015Bnienie'],
  ['Utw\ufffdrz szablon', 'Utw\u00F3rz szablon'],
];

const BLOCKERS = [
  '\u0139aduj\u0119',
  '\u0139adowanie',
  '\u0179r\u00F3d\u0142o',
  'Nie udaBo si pobra',
  'Nie udaBo si zapisa',
  'Nie udaBo si skopiowa',
  'Nie udaBo si usun',
  'Aadowanie szablon',
  'Tryb podgldu',
  'szablon\ufffdw',
  'kr\ufffdtkie',
  'wyja[nienie',
  'Utw\ufffdrz',
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
