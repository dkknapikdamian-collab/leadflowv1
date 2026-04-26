const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repoRoot = path.resolve(__dirname, '..');
function read(relativePath) {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

const uiFiles = [
  'src/pages/Today.tsx',
  'src/pages/Calendar.tsx',
  'src/pages/Tasks.tsx',
  'src/pages/Cases.tsx',
  'src/pages/CaseDetail.tsx',
  'src/pages/Dashboard.tsx',
];

test('completed action/status wording is consistent in main UI screens', () => {
  for (const file of uiFiles) {
    const source = read(file);
    assert.doesNotMatch(source, /Zakończ/u, file + ' must use Zrobione instead of Zakończ labels');
    assert.doesNotMatch(source, /zakończ/u, file + ' must use zrobione instead of zakończ copy');
    assert.doesNotMatch(source, /Do akceptu/u, file + ' must use Do akceptacji');
  }

  assert.match(read('src/pages/Today.tsx'), /Zrobione/);
  assert.match(read('src/pages/Calendar.tsx'), /Zrobione/);
  assert.match(read('src/pages/Tasks.tsx'), /Zrobione/);
  assert.match(read('src/pages/CaseDetail.tsx'), /Zrobione/);
});
