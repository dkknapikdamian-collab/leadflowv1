const fs = require('fs');

const targetFiles = [
  'src/components/Layout.tsx',
  'src/pages/Today.tsx',
  'src/pages/TasksStable.tsx'
];

const replacements = [
  ['ÔÇó', '\u2022'],
  ['–', '\u2013'],
  ['—', '\u2014'],
  ['ÔÇÖ', '\u2019'],
  ['ÔÇ£', '\u201c'],
  ['ÔÇØ', '\u201d'],
  ['”', '\u201d'],
  ['”', '\u201d'],
  ['ÔÇ', '\u2022'],

  ['Usuń', 'Usu\u0144'],
  ['Usuwanie...', 'Usuwanie...'],
  ['wydarzeń', 'wydarze\u0144'],
  ['zadań', 'zada\u0144'],
  ['zadań', 'zada\u0144'],
  ['dzi┼Ť', 'dzi\u015b'],
  ['działań', 'dzia\u0142a\u0144'],
  ['działa', 'dzia\u0142a'],
  ['tydzień', 'tydzie\u0144'],
  ['leadów', 'lead\u00f3w'],

  ['Najważniejsze', 'Najwa\u017cniejsze'],
  ['Odśwież', 'Od\u015bwie\u017c'],
  ['żeby', '\u017ceby'],

  ['ą', '\u0105'],
  ['ć', '\u0107'],
  ['ę', '\u0119'],
  ['ł', '\u0142'],
  ['ń', '\u0144'],
  ['ę', '\u011b'],
  ['ł', '\u0142'],
  ['ń', '\u0144'],
  ['ś', '\u015b'],
  ['ź', '\u017a'],
  ['ź', '\u017a'],
  ['ż', '\u017c'],
  ['ł', '\u0142'],
  ['ń', '\u0144'],
  ['ś', '\u015b'],
  ['ź', '\u017a'],
  ['ż', '\u017c'],
  ['ó', '\u00f3'],

  ['ń', '\u0144'],
  ['┼Ť', '\u015b'],
  ['ł', '\u0142'],
  ['ó', '\u00f3']
];

const mojibakeRe = /Å|\u00C4|\u0139|\u00C2|Ã|\uFFFD|Ð|¤|œ|¼|º|³|ÔÇ|┼|├/;

let changed = [];
for (const file of targetFiles) {
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  let after = before;

  for (const [bad, good] of replacements) {
    after = after.split(bad).join(good);
  }

  if (after !== before) {
    fs.writeFileSync(file, after, 'utf8');
    changed.push(file);
  }
}

const remaining = [];
for (const file of targetFiles) {
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (mojibakeRe.test(line)) {
      remaining.push(`${file}:${index + 1}: ${line.trim()}`);
    }
  });
}

console.log('STAGE212K_HARD_MOJIBAKE_SWEEP');
console.log('Changed files:');
for (const file of changed) console.log('- ' + file);

if (remaining.length) {
  console.log('');
  console.log('REMAINING_MOJIBAKE:');
  for (const hit of remaining.slice(0, 80)) console.log(hit);
  process.exit(2);
}

console.log('NO_MOJIBAKE_IN_TARGET_FILES');
