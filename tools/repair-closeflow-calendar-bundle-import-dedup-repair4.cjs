#!/usr/bin/env node
const fs = require('fs');

const SYMBOL = 'fetchCalendarBundleFromSupabase';
const TARGET_MODULE = '../lib/calendar-items';
const FILES = ['src/pages/Calendar.tsx', 'src/pages/NotificationsCenter.tsx'];

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
}

function write(file, text) {
  fs.writeFileSync(file, text, 'utf8');
}

function importedName(spec) {
  const clean = String(spec || '').trim().replace(/^type\s+/, '').trim();
  return clean.split(/\s+as\s+/i)[0].trim();
}

function parseSpecifiers(body) {
  return String(body || '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
}

function uniq(items) {
  const seen = new Set();
  const out = [];
  for (const item of items) {
    const key = item.replace(/\s+/g, ' ').trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(item.trim());
  }
  return out;
}

function formatImport(moduleName, specs) {
  const unique = uniq(specs);
  if (!unique.length) return '';
  if (unique.length <= 3) {
    return `import { ${unique.join(', ')} } from '${moduleName}';\n`;
  }
  return `import {\n  ${unique.join(',\n  ')}\n} from '${moduleName}';\n`;
}

function canonicalizeCalendarBundleImport(file) {
  if (!fs.existsSync(file)) throw new Error(`${file}: missing`);
  let text = read(file);

  const targetSpecs = [];
  const namedImportRe = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  let output = '';
  let cursor = 0;
  let match;

  while ((match = namedImportRe.exec(text)) !== null) {
    output += text.slice(cursor, match.index);
    cursor = namedImportRe.lastIndex;

    const body = match[1];
    const moduleName = match[2];
    const specs = parseSpecifiers(body);
    const filtered = specs.filter((spec) => importedName(spec) !== SYMBOL);

    if (moduleName === TARGET_MODULE) {
      targetSpecs.push(...filtered);
      continue;
    }

    if (!filtered.length) {
      continue;
    }
    output += formatImport(moduleName, filtered);
  }

  output += text.slice(cursor);

  const finalSpecs = [SYMBOL, ...targetSpecs];
  const canonicalImport = formatImport(TARGET_MODULE, finalSpecs);
  output = canonicalImport + output.replace(/^\s+/, '');

  // Collapse accidental triple blank lines around imports without touching JSX bodies aggressively.
  output = output.replace(/\n{4,}/g, '\n\n\n');

  write(file, output);
  assertClean(file);
  console.log(`canonicalized calendar bundle import: ${file}`);
}

function findNamedImports(text) {
  const imports = [];
  const re = /import\s*\{([\s\S]*?)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g;
  let match;
  while ((match = re.exec(text)) !== null) {
    const specs = parseSpecifiers(match[1]);
    for (const spec of specs) {
      imports.push({ moduleName: match[2], spec, imported: importedName(spec) });
    }
  }
  return imports;
}

function assertClean(file) {
  const text = read(file);
  const imports = findNamedImports(text).filter((entry) => entry.imported === SYMBOL);
  const fromTarget = imports.filter((entry) => entry.moduleName === TARGET_MODULE);
  const fromWrong = imports.filter((entry) => entry.moduleName !== TARGET_MODULE);

  if (fromWrong.length) {
    throw new Error(`${file}: ${SYMBOL} imported from wrong module(s): ${fromWrong.map((entry) => entry.moduleName).join(', ')}`);
  }
  if (fromTarget.length !== 1) {
    throw new Error(`${file}: expected exactly one ${SYMBOL} import from ${TARGET_MODULE}, got ${fromTarget.length}`);
  }
  if (!text.includes(`${SYMBOL}()`)) {
    throw new Error(`${file}: ${SYMBOL} usage missing after import cleanup`);
  }
}

for (const file of FILES) {
  canonicalizeCalendarBundleImport(file);
}

console.log('CLOSEFLOW_CALENDAR_BUNDLE_IMPORT_DEDUP_REPAIR4_OK');
