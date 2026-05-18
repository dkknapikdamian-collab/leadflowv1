const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const targets = [
  'src/pages/Calendar.tsx',
  'src/styles/visual-stage22-event-form-vnext.css',
  'tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs',
  'tests/stage114-calendar-shift-persistence-contract.test.cjs',
  'tests/stage114-calendar-modal-viewport-contract.test.cjs',
  'tests/stage116-dialog-description-accessibility-contract.test.cjs',
];
const forbiddenCodepoints = [0x0139, 0x00c4, 0x0102, 0x00c2, 0x00e2, 0xfffd];
const forbidden = new Set(forbiddenCodepoints);

function near(text, index) {
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + 90);
  return text.slice(start, end).replace(/\r/g, '\\r').replace(/\n/g, '\\n');
}

const hits = [];
for (const relative of targets) {
  const full = path.join(root, relative);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  for (let i = 0; i < text.length; i += 1) {
    const code = text.codePointAt(i);
    if (code > 0xffff) i += 1;
    if (forbidden.has(code)) {
      hits.push(relative + ': U+' + code.toString(16).toUpperCase().padStart(4, '0') + ' near "' + near(text, i) + '"');
    }
  }
}

if (hits.length) {
  console.error('Stage114 Calendar mojibake guard failed:');
  for (const hit of hits) console.error('- ' + hit);
  process.exit(1);
}

console.log('OK Stage114 Calendar mojibake guard passed');
