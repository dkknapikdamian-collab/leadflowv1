const fs = require('fs');
const path = require('path');

const roots = ['src/components', 'src/pages', 'src/lib', 'src/hooks', 'src/styles'];
const allowedExt = new Set(['.ts', '.tsx', '.js', '.jsx', '.cjs', '.mjs', '.css']);
const forbidden = [
  "Ä…",
  "Ä‡",
  "Ä™",
  "Ăł",
  "Ã³",
  "Ĺ‚",
  "Å‚",
  "Ĺ„",
  "Å„",
  "Ĺ›",
  "Å›",
  "Ĺş",
  "Åº",
  "ĹĽ",
  "Å¼",
  "Ä„",
  "Ä†",
  "ÄĘ",
  "Ä˜",
  "Ă“",
  "Ã“",
  "Ĺ�",
  "Å�",
  "Ĺš",
  "Åš",
  "ĹŹ",
  "Å¹",
  "Ĺ»",
  "Å»",
  "â€™",
  "â€˜",
  "â€œ",
  "â€ť",
  "â€ž",
  "â€“",
  "â€”",
  "Â"
];

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', '.git', 'backup', 'backups', 'archive', 'archives'].includes(entry.name.toLowerCase())) continue;
      walk(full, out);
    } else if (allowedExt.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

const hits = [];
for (const file of roots.flatMap((root) => walk(root))) {
  const text = fs.readFileSync(file, 'utf8');
  for (const token of forbidden) {
    if (text.includes(token)) {
      hits.push(file.replaceAll('\\', '/') + ' :: ' + token);
    }
  }
}

if (hits.length) {
  console.error('STAGE231H_R1D2_R13B FAIL: Polish mojibake remains in active UI files');
  console.error(hits.slice(0, 80).join('\n'));
  process.exit(1);
}

console.log('STAGE231H_R1D2_R13B PASS: active UI files have no guarded Polish mojibake tokens.');
