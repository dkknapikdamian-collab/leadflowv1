const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const leadsPath = path.join(repo, 'src/pages/Leads.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage20-lead-form-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`Brak: ${label} (${needle})`);
}
function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) throw new Error(`Zakazany fragment: ${label} (${needle})`);
}
function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (ch === quote && !escaped) quote = null;
      escaped = ch === '\\' && !escaped;
      if (ch !== '\\') escaped = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
      escaped = false;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}
function getFunctionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Nie znaleziono funkcji ${name}`);
  const open = source.indexOf('{', start);
  const close = findMatchingBrace(source, open);
  if (open < 0 || close < 0) throw new Error(`Nie znaleziono bloku funkcji ${name}`);
  return source.slice(open + 1, close);
}

const leads = read(leadsPath);
const css = read(cssPath);
const metaBody = getFunctionBody(leads, 'buildLeadCompactMeta');
const returnStart = metaBody.indexOf('return [');
const returnEnd = metaBody.indexOf('].filter');
if (returnStart < 0 || returnEnd < 0) throw new Error('buildLeadCompactMeta nie ma oczekiwanej listy return.');
const returnArray = metaBody.slice(returnStart, returnEnd);

assertIncludes(leads, 'STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1', 'marker Stage14E Repair1');
assertIncludes(leads, 'STAGE14E_LEADS_VALUE_META_DEDUP', 'komentarz dedupe meta');
assertIncludes(leads, 'void _leadValueLabel;', 'leadValueLabel ignorowany w meta');
if (returnArray.includes('leadValueLabel') || returnArray.includes('_leadValueLabel')) {
  throw new Error('Warto\u015B\u0107 leada nadal jest zwracana w buildLeadCompactMeta.');
}
assertIncludes(leads, 'data-lead-value-pill="true"', 'warto\u015B\u0107 ma data-lead-value-pill');
assertIncludes(leads, 'data-stage14e-leads-value-layout="true"', 'blok warto\u015Bci ma data-stage14e marker');

assertIncludes(css, 'STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1', 'CSS marker Stage14E');
assertIncludes(css, '[data-lead-value-pill="true"]', 'CSS targetuje tylko value pill');
assertIncludes(css, 'display: inline-flex !important;', 'value pill inline-flex');
assertIncludes(css, 'width: max-content !important;', 'value pill max-content');
assertIncludes(css, 'max-width: fit-content !important;', 'value pill fit-content');
assertIncludes(css, 'flex: 0 0 auto !important;', 'value pill nie rozci\u0105ga si\u0119');
assertIncludes(css, 'align-self: flex-start !important;', 'value pill nie stretchuje');
assertIncludes(css, 'white-space: nowrap !important;', 'value pill jedna linia');
assertIncludes(css, 'border-radius: 999px !important;', 'value pill rounded');
assertNotIncludes(returnArray, 'PLN', 'meta nie ma kwoty PLN');

console.log('\u2714 Stage14E Repair1 Leads value dedupe badge guard passed');
