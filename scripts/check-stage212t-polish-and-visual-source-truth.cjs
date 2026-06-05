const fs = require('fs');
const path = require('path');

function fail(message) {
  console.error('STAGE212T_GUARD_FAIL: ' + message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail('missing file: ' + file);
  return fs.readFileSync(file, 'utf8');
}

const filesToScanForMojibake = [
  'src/components/Layout.tsx',
  'src/pages/TasksStable.tsx',
  'src/pages/Today.tsx'
];

const mojibakePattern = /Å|\u00C4|\u0139|\u00C2|Ã|\uFFFD|Ð|¤|œ|¼|º|³|ÔÇ|┼|├|\u0102/;

for (const file of filesToScanForMojibake) {
  const lines = read(file).replaceAll('\r', '').split('\n');
  for (let i = 0; i < lines.length; i += 1) {
    if (mojibakePattern.test(lines[i])) {
      fail(`mojibake remains in ${file} line ${i + 1}: ${lines[i].trim().slice(0, 160)}`);
    }
  }
}

const layout = read('src/components/Layout.tsx');
const tasks = read('src/pages/TasksStable.tsx');
const runtime = read('src/components/VisualFoundationRuntimeStage212M.tsx');
const foundation = read('src/styles/closeflow-visual-foundation-stage212m.css');
const index = read('src/index.css');

if (layout.includes('LayoutDashboard')) {
  fail('LayoutDashboard remains in Layout.tsx; Dziś icon should use Home');
}

if (!layout.includes('Home')) {
  fail('Layout.tsx does not include Home icon');
}

if (!layout.includes("label: 'Dziś'")) {
  fail('Layout.tsx missing proper Dziś label');
}

for (const text of ['Odśwież', 'żeby', 'Dziś', 'Zaległe']) {
  if (!tasks.includes(text)) {
    fail(`TasksStable.tsx missing expected Polish text: ${text}`);
  }
}

for (const forbidden of ['Odśwież', 'żeby', 'Dziś', 'Zaległe']) {
  if (tasks.includes(forbidden)) {
    fail(`TasksStable.tsx still contains broken text: ${forbidden}`);
  }
}

for (const marker of [
  'tasks-stage178-filter-button',
  'tasks-stage178-filter-label',
  'tasks-stage178-filter-count'
]) {
  if (!tasks.includes(marker)) {
    fail(`TasksStable.tsx missing filter marker: ${marker}`);
  }
}

for (const marker of [
  'STAGE212T_POLISH_AND_VISUAL_GUARDS',
  'tasks-stage178-filter-label',
  'tasks-stage178-filter-count',
  'a[data-nav-path="/"] .nav-ico'
]) {
  if (!foundation.includes(marker) && !runtime.includes(marker)) {
    fail(`visual source truth missing marker: ${marker}`);
  }
}

if (!index.includes('closeflow-visual-foundation-stage212m.css')) {
  fail('index.css missing closeflow visual foundation stage212m import');
}

const realLines = index
  .replaceAll('\r', '')
  .split('\n')
  .map((line, index) => ({ line, trim: line.trim(), number: index + 1 }))
  .filter((entry) => entry.trim && !entry.trim.startsWith('/*') && !entry.trim.startsWith('*') && !entry.trim.startsWith('//'));

if (!realLines.length || realLines[0].trim !== '@import "tailwindcss";') {
  fail('index.css first real line is not @import "tailwindcss";');
}

let seenNonImport = false;
for (const entry of realLines) {
  if (entry.trim.startsWith('@import ')) {
    if (seenNonImport) {
      fail(`index.css has @import after CSS block at line ${entry.number}: ${entry.trim}`);
    }
  } else {
    seenNonImport = true;
  }
}

console.log('STAGE212T_POLISH_AND_VISUAL_SOURCE_TRUTH_GUARD_PASS');
