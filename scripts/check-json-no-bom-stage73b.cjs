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

function fail(message) {
  console.error('JSON_NO_BOM_STAGE73B_FAIL:', message);
  process.exit(1);
}

for (const relative of files) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) continue;
  const buffer = fs.readFileSync(file);
  if (buffer.length >= 3 && buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf) {
    fail(relative + ' starts with UTF-8 BOM');
  }
  const text = buffer.toString('utf8');
  try {
    JSON.parse(text);
  } catch (error) {
    fail(relative + ' is not valid JSON: ' + error.message);
  }
}

console.log('OK json no BOM stage73b');
