const fs = require('fs');
const path = require('path');

const repoRoot = process.cwd();
const leadPath = path.join(repoRoot, 'src', 'pages', 'LeadDetail.tsx');

function fail(message) {
  console.error('FAIL STAGE227E2_TOP_CARDS_POLISH: ' + message);
  process.exit(1);
}
function pass(message) {
  console.log('PASS ' + message);
}
function read(filePath) {
  if (!fs.existsSync(filePath)) fail('missing file: ' + path.relative(repoRoot, filePath));
  return fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
}
function requireContains(source, token, label) {
  if (!source.includes(token)) fail('missing: ' + label);
  pass('contains ' + label);
}
function extractFunction(source, functionName) {
  const marker = 'function ' + functionName + '(';
  const start = source.indexOf(marker);
  if (start < 0) fail('missing function: ' + functionName);
  const open = source.indexOf('{', start);
  if (open < 0) fail('missing function body: ' + functionName);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    const char = source[i];
    if (char === '{') depth += 1;
    if (char === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  fail('unterminated function: ' + functionName);
}
function extractTopCards(source) {
  const marker = 'data-stage227e2-top-cards="true"';
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) fail('missing data-stage227e2-top-cards marker');
  const start = source.lastIndexOf('<section', markerIndex);
  const end = source.indexOf('</section>', markerIndex);
  if (start < 0 || end < 0) fail('cannot extract Stage227E2 top cards section');
  return source.slice(start, end + '</section>'.length);
}

const source = read(leadPath);
const NEXT_STEP = 'Nast\u0119pny krok';
const POTENTIAL = 'Potencja\u0142';
const SILENCE_RISK = 'Cisza / ryzyko';
const ACTIVE_LEAD = 'Aktywny lead';
const VALUE = 'Warto\u015b\u0107';

requireContains(source, 'STAGE227E2_LEAD_DETAIL_TOP_CARDS_POLISH', 'STAGE227E2_LEAD_DETAIL_TOP_CARDS_POLISH');
requireContains(source, 'data-stage227e2-top-cards="true"', 'data-stage227e2-top-cards="true"');
requireContains(source, 'function getLeadSilenceRisk(', 'function getLeadSilenceRisk(');
requireContains(source, 'leadSilenceRisk', 'leadSilenceRisk');

const topCards = extractTopCards(source);
requireContains(topCards, NEXT_STEP, NEXT_STEP);
requireContains(topCards, POTENTIAL, POTENTIAL);
requireContains(topCards, SILENCE_RISK, SILENCE_RISK);

if (topCards.includes(ACTIVE_LEAD)) fail('top cards still contain decorative Aktywny lead');
if (topCards.includes('<h2>' + VALUE + '</h2>')) fail('top cards still use WartoĹ›Ä‡ heading instead of PotencjaĹ‚');
if (topCards.includes('sortedLinkedTasks.length + sortedLinkedEvents.length')) fail('top cards still use decorative task/event count');
pass('top cards labels and removed decorative count are OK');

const silenceFn = extractFunction(source, 'getLeadSilenceRisk');
if (silenceFn.includes('updatedAt') || silenceFn.includes('updated_at')) {
  fail('getLeadSilenceRisk still uses updatedAt or updated_at');
}
pass('getLeadSilenceRisk does not use updatedAt/updated_at');

console.log('PASS STAGE227E2_TOP_CARDS_POLISH');