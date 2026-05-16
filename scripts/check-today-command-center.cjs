const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const has = (rel, needle) => assert.ok(read(rel).includes(needle), `${rel} missing ${needle}`);

has('src/pages/Today.tsx', 'Do sprawdzenia');
has('src/pages/Today.tsx', 'Zaleg\u0142e');
has('src/pages/Today.tsx', 'Do ruchu dzi\u015B');
has('src/pages/Today.tsx', 'Bez zaplanowanej akcji');
has('src/pages/Today.tsx', 'Waiting za d\u0142ugo');
has('src/pages/Today.tsx', 'Najbli\u017Csze dni');
has('src/pages/Today.tsx', 'Wysoka warto\u015B\u0107 / ryzyko');
has('src/pages/Today.tsx', 'Dzisiaj zako\u0144czone');
has('src/pages/Today.tsx', 'buildTodaySections');
has('src/pages/Today.tsx', 'dedupeTodaySectionEntries');
has('src/lib/today-sections.ts', 'export function buildTodaySections');
has('src/lib/today-sections.ts', 'export function dedupeTodaySectionEntries');

console.log('PASS check-today-command-center');
