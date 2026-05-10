#!/usr/bin/env node
const fs = require('fs');

const SYMBOL = 'fetchCalendarBundleFromSupabase';
const TARGET_MODULE = '../lib/calendar-items';
const FILES = ['src/pages/Calendar.tsx', 'src/pages/NotificationsCenter.tsx'];

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '') : '';
}
function parseSpecifiers(body) {
  return String(body || '').split(',').map((part) => part.trim()).filter(Boolean);
}
function importedName(spec) {
  return String(spec || '').trim().replace(/^type\s+/, '').trim().split(/\s+as\s+/i)[0].trim();
}
function namedImports(text) {
  const imports = [];
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    for (const spec of parseSpecifiers(match[1])) {
      imports.push({ moduleName: match[2], spec, imported: importedName(spec) });
    }
  }
  return imports;
}

let failed = 0;
function pass(message) { console.log(`PASS ${message}`); }
function fail(message) { failed += 1; console.log(`FAIL ${message}`); }

for (const file of FILES) {
  const text = read(file);
  if (!text) {
    fail(`${file}: file exists`);
    continue;
  }
  const imports = namedImports(text).filter((entry) => entry.imported === SYMBOL);
  const target = imports.filter((entry) => entry.moduleName === TARGET_MODULE);
  const wrong = imports.filter((entry) => entry.moduleName !== TARGET_MODULE);

  target.length === 1
    ? pass(`${file}: exactly one ${SYMBOL} import from ${TARGET_MODULE}`)
    : fail(`${file}: expected one ${SYMBOL} import from ${TARGET_MODULE}, got ${target.length}`);

  wrong.length === 0
    ? pass(`${file}: no ${SYMBOL} import from wrong module`)
    : fail(`${file}: wrong ${SYMBOL} import modules=${wrong.map((entry) => entry.moduleName).join(', ')}`);

  text.includes(`${SYMBOL}()`)
    ? pass(`${file}: ${SYMBOL} usage remains`)
    : fail(`${file}: ${SYMBOL} usage missing`);
}

if (failed) {
  console.error(`FAIL CLOSEFLOW_CALENDAR_BUNDLE_IMPORT_SOURCE_FAILED problem_count=${failed}`);
  process.exit(1);
}
console.log('CLOSEFLOW_CALENDAR_BUNDLE_IMPORT_SOURCE_OK');
