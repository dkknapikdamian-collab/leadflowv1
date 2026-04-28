const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const assert = require('node:assert/strict');

const root = process.cwd();
const markers = [0x00c4, 0x00c5, 0x00c3, 0x00c2, 0x0139, 0xfffd].map((code) => String.fromCharCode(code));

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(full));
    if (entry.isFile() && entry.name.endsWith('.cjs')) result.push(full);
  }
  return result;
}

test('Stage23 keeps test files free of literal mojibake markers', () => {
  for (const file of walk(path.join(root, 'tests'))) {
    const source = fs.readFileSync(file, 'utf8');
    for (const marker of markers) {
      assert.equal(source.includes(marker), false, path.relative(root, file) + ' contains a literal encoding marker');
    }
  }
});
