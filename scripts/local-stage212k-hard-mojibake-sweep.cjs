const fs = require('fs');

const targetFiles = [
  'src/components/Layout.tsx',
  'src/pages/Today.tsx',
  'src/pages/TasksStable.tsx'
];

const replacements = [
  ['ÔÇó', '\u2022'],
  ['ÔÇô', '\u2013'],
  ['ÔÇö', '\u2014'],
  ['ÔÇÖ', '\u2019'],
  ['ÔÇ£', '\u201c'],
  ['ÔÇØ', '\u201d'],
  ['ÔÇť', '\u201d'],
  ['ÔÇť', '\u201d'],
  ['ÔÇ', '\u2022'],

  ['Usu┼ä', 'Usu\u0144'],
  ['Usuwanie...', 'Usuwanie...'],
  ['wydarze┼ä', 'wydarze\u0144'],
  ['zada┼ä', 'zada\u0144'],
  ['zada┼ä', 'zada\u0144'],
  ['dzi┼Ť', 'dzi\u015b'],
  ['dzia┼éa┼ä', 'dzia\u0142a\u0144'],
  ['dzia┼éa', 'dzia\u0142a'],
  ['tydzie┼ä', 'tydzie\u0144'],
  ['lead├│w', 'lead\u00f3w'],

  ['NajwaĹĽniejsze', 'Najwa\u017cniejsze'],
  ['OdświeĹĽ', 'Od\u015bwie\u017c'],
  ['ĹĽeby', '\u017ceby'],

  ['Ä…', '\u0105'],
  ['Ä‡', '\u0107'],
  ['Ä™', '\u0119'],
  ['Äł', '\u0142'],
  ['Äń', '\u0144'],
  ['Ä›', '\u011b'],
  ['Ĺ‚', '\u0142'],
  ['Ĺ„', '\u0144'],
  ['Ĺ›', '\u015b'],
  ['Ĺş', '\u017a'],
  ['Ĺº', '\u017a'],
  ['ĹĽ', '\u017c'],
  ['Å‚', '\u0142'],
  ['Å„', '\u0144'],
  ['Å›', '\u015b'],
  ['Åº', '\u017a'],
  ['Å¼', '\u017c'],
  ['Ã³', '\u00f3'],

  ['┼ä', '\u0144'],
  ['┼Ť', '\u015b'],
  ['┼é', '\u0142'],
  ['├│', '\u00f3']
];

const mojibakeRe = /Å|Ä|Ĺ|Â|Ã|�|Ð|¤|œ|¼|º|³|ÔÇ|┼|├/;

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
