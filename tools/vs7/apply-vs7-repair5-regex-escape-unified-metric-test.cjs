#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const marker = 'CLOSEFLOW_VS7_REPAIR5_REGEX_ESCAPE_UNIFIED_METRIC_TEST';

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8');
}

function write(rel, text) {
  fs.writeFileSync(path.join(root, rel), text, 'utf8');
}

function ensureFile(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error('Missing file: ' + rel);
}

function escapeInvalidDataSelectorRegexLiterals(text) {
  // Repair invalid regex literals like /[data-cf-operator-metric-tone="blue"]/
  // In JS regex, [ ... ] is a character class, so selector brackets must be escaped.
  return text.replace(/\/(\[data-(?:cf|eliteflow)[^\]\r\n]+\])\//g, (_match, selector) => {
    return '/\\' + selector.replace(/\]/g, '\\]') + '/';
  });
}

const files = [
  'tests/unified-top-metric-tiles.test.cjs',
  'scripts/check-unified-top-metric-tiles.cjs',
];

for (const rel of files) {
  ensureFile(rel);
  const before = read(rel);
  let after = escapeInvalidDataSelectorRegexLiterals(before);
  if (!after.includes(marker)) {
    after += '\n/* ' + marker + ': data selector regex literals escaped after VS7 repair4. */\n';
  }
  if (after !== before) write(rel, after);
}

const doc = 'docs/ui/CLOSEFLOW_VS7_REPAIR5_REGEX_ESCAPE_UNIFIED_METRIC_TEST_2026-05-09.md';
write(doc, `# CLOSEFLOW VS-7 Repair5 - regex escape unified metric test\n\n## Cel\nNaprawia SyntaxError po repair4: nieucieczone selektory CSS w regex literalach, np. /[data-cf-operator-metric-tone="blue"]/.\n\n## Zakres\n- tests/unified-top-metric-tiles.test.cjs\n- scripts/check-unified-top-metric-tiles.cjs\n\n## Nie zmienia\n- runtime VS-7\n- kolorów\n- UI\n- danych\n- Supabase\n\n## Marker\n${marker}\n`);

console.log(marker + '_PATCHED');
