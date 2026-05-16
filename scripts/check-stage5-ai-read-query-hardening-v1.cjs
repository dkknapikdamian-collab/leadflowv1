
// STAGE5_AI_READ_QUERY_HARDENING_V1
const fs = require('fs');
const path = require('path');

const root = process.cwd();
function read(rel) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) throw new Error(`Missing file: ${rel}`);
  return fs.readFileSync(full, 'utf8');
}
function pass(msg) { console.log(`PASS ${msg}`); }
function mustContain(rel, text) {
  const content = read(rel);
  if (!content.includes(text)) throw new Error(`${rel} missing marker/text: ${text}`);
  pass(`${rel} contains ${text}`);
}
function mustNotContain(rel, text) {
  const content = read(rel);
  if (content.includes(text)) throw new Error(`${rel} must not contain: ${text}`);
  pass(`${rel} does not contain ${text}`);
}

mustContain('src/server/ai-assistant.ts', 'STAGE5_AI_READ_QUERY_HARDENING_V1');
mustContain('src/server/ai-assistant.ts', 'itemOverlapsWindow');
mustContain('src/server/ai-assistant.ts', 'NAME_INFLECTIONS');
mustContain('src/server/ai-assistant.ts', 'marka: ["marek"]');
mustContain('src/server/ai-assistant.ts', 'itemMatchesLookup');
mustNotContain('src/server/ai-assistant.ts', 'const prefixed = prefixedMatches.find((match) => (match.index ?? 0) >= explicitDateEnd) || prefixedMatches[0];\n  const prefixed =');
mustContain('docs/release/STAGE5_AI_READ_QUERY_HARDENING_V1_2026-05-06.md', 'Czy jutro o 17 co\u015B mam?');
mustContain('tests/stage5-ai-read-query-hardening-v1.test.cjs', 'Marka');

console.log('PASS STAGE5_AI_READ_QUERY_HARDENING_V1');
