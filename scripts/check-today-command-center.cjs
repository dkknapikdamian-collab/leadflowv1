const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const has = (rel, needle) => assert.ok(read(rel).includes(needle), `${rel} missing ${needle}`);

const today = read('src/pages/TodayStable.tsx');
[
  'Leady do ruchu dziś',
  'Sprawy czekające na klienta',
  'Sprawy zablokowane',
  'Gotowe do startu',
  'Sprzedaż wymaga ruchu',
  'Realizacja stoi przez klienta',
  'Najważniejsze ruchy dziś',
  'const todayPrimaryTiles',
  'const todaySectionCards',
  'const priorityRows',
].forEach((needle) => assert.ok(today.includes(needle), `src/pages/TodayStable.tsx missing ${needle}`));

assert.ok(today.includes('ownerControlBaseline'), 'TodayStable must use the real owner-control data baseline');
assert.ok(today.includes('data-stage232t-r1c-today-section-grid="true"'), 'TodayStable must expose the command-center section grid');

console.log('PASS check-today-command-center');
