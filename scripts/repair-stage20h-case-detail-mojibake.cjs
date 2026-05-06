const fs = require('fs');
const path = require('path');
const root = process.argv[2] || process.cwd();
const targetRel = 'src/pages/CaseDetail.tsx';
const target = path.join(root, targetRel);
if (!fs.existsSync(target)) throw new Error(targetRel + ' missing');
let text = fs.readFileSync(target, 'utf8');
const before = text;
const replacements = [
  ['Ă„â€¦','Ä…'], ['Ă„â€ˇ','Ä‡'], ['Ă„â„˘','Ä™'], ['Ă„Ĺ‚','Ĺ‚'], ['Ă„â€ž','Ä„'], ['Ă„â€ ','Ä†'], ['Ă„Ä','Ä'],
  ['Äąâ€š','Ĺ‚'], ['Äąâ€ž','Ĺ„'], ['Äąâ€ş','Ĺ›'], ['ÄąĹź','Ĺş'], ['ÄąÄ˝','ĹĽ'], ['ÄąÂ»','Ĺ»'], ['ÄąĹˇ','Ĺš'], ['ÄąÄ…','Ĺš'],
  ['Ă…â€š','Ĺ‚'], ['Ă…â€ž','Ĺ„'], ['Ă…â€ş','Ĺ›'], ['Ă…Âş','Ĺş'], ['Ă…ÂĽ','ĹĽ'], ['Ă…Â»','Ĺ»'], ['Ă…Ĺˇ','Ĺš'],
  ['Ä‚Ĺ‚','Ăł'], ['Ä‚â€ś','Ă“'],
  ['\u0139\u0081','Ĺ'], ['\u00c5\u0081','Ĺ'],
  ['Ă˘â‚¬Ĺľ','â€ž'], ['Ă˘â‚¬ĹĄ','â€ť'], ['Ă˘â‚¬Ĺ“','â€ś'], ['Ă˘â‚¬Ĺ›','â€ť'], ['Ă˘â‚¬â„˘','â€™'], ['Ă˘â‚¬â€ś','â€“'], ['Ă˘â‚¬â€ť','â€”'],
  ['Ă‚Â·','Â·'], ['Ă‚ ', ' '], ['Ă‚', '']
];
for (const [from, to] of replacements) {
  text = text.split(from).join(to);
}
// Drugi przebieg pomaga, gdy plik miaĹ‚ mieszane warianty po wczeĹ›niejszych czÄ™Ĺ›ciowych naprawach.
for (const [from, to] of replacements) {
  text = text.split(from).join(to);
}
fs.writeFileSync(target, text, 'utf8');
const forbidden = ['Äą', 'Ă„', 'Ä‚', 'Ă…ÂĽ', 'ĂÂł', 'Ă˘â‚¬', 'Ă‚Â·'];
const leftovers = [];
const lines = text.split(/\r?\n/);
for (const token of forbidden) {
  if (text.includes(token)) {
    const found = [];
    lines.forEach((line, index) => {
      if (line.includes(token) && found.length < 5) found.push(`${index + 1}: ${line.slice(0, 220)}`);
    });
    leftovers.push({ token, found });
  }
}
if (leftovers.length) {
  console.error('FAIL CaseDetail mojibake leftovers after repair:');
  for (const item of leftovers) {
    console.error('TOKEN ' + item.token);
    for (const line of item.found) console.error(line);
  }
  process.exit(1);
}
if (before === text) {
  console.log('PASS CaseDetail mojibake repair: no changes needed');
} else {
  console.log('PASS CaseDetail mojibake repair applied');
}