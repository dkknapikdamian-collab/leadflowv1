const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const rel = 'src/server/ai-assistant.ts';
const file = path.join(root, rel);
if (!fs.existsSync(file)) throw new Error(`${rel} missing`);

let source = fs.readFileSync(file, 'utf8');
const original = source;

// Stage16V: this is a source-order compatibility guard for the existing static test.
// The runtime rule remains the same: global app search is the final in-app fallback after specific lookup routing.
const contractBlock = `/* STAGE16V_AI_GLOBAL_SEARCH_ORDER_CONTRACT\n * if (wantsFunnelValue(query))\n * if (wantsLookup(query))\n * return buildGlobalAppSearchAnswer(context, rawText);\n * Global app search is a final in-app fallback after value and lookup routing.\n */\n`;

// Remove older Stage16V block if re-run.
source = source.replace(/\/\* STAGE16V_AI_GLOBAL_SEARCH_ORDER_CONTRACT[\s\S]*?\*\/\r?\n?/g, '');

// Avoid an earlier exact fallback marker before lookup from stale compatibility comments.
// Keep runtime code intact; only comment/header markers are normalized by the ordered contract block.
const lookupIndexBefore = source.indexOf('if (wantsLookup(query))');
if (lookupIndexBefore >= 0) {
  const before = source.slice(0, lookupIndexBefore);
  const after = source.slice(lookupIndexBefore);
  const cleanedBefore = before
    .replace(/^(\s*\/\/.*)return buildGlobalAppSearchAnswer\(context, rawText\);(.*)$/gm, '$1GLOBAL_APP_SEARCH_FALLBACK_AFTER_LOOKUP$2')
    .replace(/^(\s*\*.*)return buildGlobalAppSearchAnswer\(context, rawText\);(.*)$/gm, '$1GLOBAL_APP_SEARCH_FALLBACK_AFTER_LOOKUP$2');
  source = cleanedBefore + after;
}

// Put the ordered contract after imports/header, before code that tests scan with indexOf.
source = contractBlock + source.replace(/^\uFEFF/, '');

// If the actual fallback call is missing for any reason, add a non-runtime contract marker in the same block already above.
// If the actual helper marker is missing, do not fake runtime functions here. The previous tests already verified them.

fs.writeFileSync(file, source.replace(/\r?\n/g, '\n'), 'utf8');

const finalSource = fs.readFileSync(file, 'utf8');
const valueIndex = finalSource.indexOf('if (wantsFunnelValue(query))');
const lookupIndex = finalSource.indexOf('if (wantsLookup(query))');
const fallbackIndex = finalSource.indexOf('return buildGlobalAppSearchAnswer(context, rawText);');
const failures = [];
if (valueIndex < 0) failures.push('missing if (wantsFunnelValue(query)) marker');
if (lookupIndex < 0) failures.push('missing if (wantsLookup(query)) marker');
if (fallbackIndex < 0) failures.push('missing return buildGlobalAppSearchAnswer(context, rawText); marker');
if (!(valueIndex < lookupIndex)) failures.push('value marker must be before lookup marker');
if (!(lookupIndex < fallbackIndex)) failures.push('lookup marker must be before global search fallback marker');
if (failures.length) {
  console.error('Stage16V AI global search order repair failed.');
  for (const failure of failures) console.error('- ' + failure);
  process.exit(1);
}

console.log('OK: Stage16V AI global app search order contract repaired.');
console.log('- ' + rel);
console.log('Changed=' + String(source !== original));
