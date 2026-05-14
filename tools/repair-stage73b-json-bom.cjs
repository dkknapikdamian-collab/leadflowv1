const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = [
  'package.json',
  'package-lock.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'components.json',
  'vercel.json'
];

let changed = 0;
for (const relative of files) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const buffer = fs.readFileSync(file);
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    fs.writeFileSync(file, buffer.subarray(3));
    changed += 1;
    console.log(`Removed UTF-8 BOM: ${relative}`);
  }
}
console.log(`OK Stage73B JSON BOM repair complete. Changed files: ${changed}`);
