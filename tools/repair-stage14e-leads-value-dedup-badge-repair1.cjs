const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const leadsPath = path.join(repo, 'src/pages/Leads.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage20-lead-form-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}
function normalizeEol(value) {
  return String(value || '').replace(/\r\n/g, '\n');
}
function findMatchingBrace(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  let inLineComment = false;
  let inBlockComment = false;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    const next = source[i + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (ch === quote && !escaped) quote = null;
      escaped = ch === '\\' && !escaped;
      if (ch !== '\\') escaped = false;
      continue;
    }
    if (ch === '/' && next === '/') {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
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
function replaceFunction(source, name, replacement) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) throw new Error(`Nie znaleziono funkcji ${name}`);
  const open = source.indexOf('{', start);
  if (open < 0) throw new Error(`Nie znaleziono bloku funkcji ${name}`);
  const close = findMatchingBrace(source, open);
  if (close < 0) throw new Error(`Nie znaleziono końca funkcji ${name}`);
  return source.slice(0, start) + replacement + source.slice(close + 1);
}
function addAttrToOpeningTag(opening, attr) {
  if (opening.includes(attr.split('=')[0])) return opening;
  return opening.replace(/>\s*$/u, ` ${attr}>`);
}
function addClassToOpeningTag(opening, className) {
  if (opening.includes(className)) return opening;
  if (/className="[^"]*"/u.test(opening)) {
    return opening.replace(/className="([^"]*)"/u, (_m, current) => `className="${current} ${className}"`);
  }
  if (/className='[^']*'/u.test(opening)) {
    return opening.replace(/className='([^']*)'/u, (_m, current) => `className='${current} ${className}'`);
  }
  if (/className=\{/u.test(opening)) {
    return opening;
  }
  return opening.replace(/>\s*$/u, ` className="${className}">`);
}
function patchOpening(source, start, end, patcher) {
  const opening = source.slice(start, end);
  const patched = patcher(opening);
  if (patched === opening) return source;
  return source.slice(0, start) + patched + source.slice(end);
}
function patchValuePill(source) {
  if (source.includes('data-lead-value-pill="true"')) return source;
  const listAnchors = ['filteredLeads.map', 'filteredLeads.slice', 'filteredLeads.length'];
  let listStart = -1;
  for (const anchor of listAnchors) {
    const idx = source.indexOf(anchor);
    if (idx >= 0) {
      listStart = idx;
      break;
    }
  }
  if (listStart < 0) listStart = 0;

  const candidates = [];
  let idx = source.indexOf('Wartość', listStart);
  while (idx >= 0) {
    const strongStart = source.indexOf('<strong', idx);
    if (strongStart >= 0 && strongStart - idx < 1800) {
      const strongEnd = source.indexOf('>', strongStart);
      const strongClose = source.indexOf('</strong>', strongEnd);
      if (strongEnd >= 0 && strongClose >= 0) {
        const block = source.slice(idx, strongClose + '</strong>'.length);
        const score = Number(block.includes('leadValueLabel')) + Number(block.includes('dealValue')) + Number(block.includes('PLN')) + Number(block.includes('formatRelationValue'));
        candidates.push({ labelIndex: idx, strongStart, strongEnd: strongEnd + 1, score });
      }
    }
    idx = source.indexOf('Wartość', idx + 1);
  }

  if (!candidates.length) {
    let valueIdx = source.indexOf('leadValueLabel', listStart);
    while (valueIdx >= 0) {
      const strongStart = source.lastIndexOf('<strong', valueIdx);
      const strongEnd = source.indexOf('>', strongStart);
      if (strongStart >= listStart && strongEnd >= valueIdx && strongEnd - strongStart < 500) {
        candidates.push({ labelIndex: valueIdx, strongStart, strongEnd: strongEnd + 1, score: 10 });
        break;
      }
      valueIdx = source.indexOf('leadValueLabel', valueIdx + 1);
    }
  }

  if (!candidates.length) throw new Error('Nie znaleziono dedykowanego <strong> wartości leada do oznaczenia data-lead-value-pill.');
  candidates.sort((a, b) => b.score - a.score || a.strongStart - b.strongStart);
  const selected = candidates[0];

  let patched = patchOpening(source, selected.strongStart, selected.strongEnd, (opening) => {
    let next = addClassToOpeningTag(opening, 'lead-card-value-pill');
    next = addAttrToOpeningTag(next, 'data-lead-value-pill="true"');
    return next;
  });

  const delta = patched.length - source.length;
  const strongStartAfter = selected.strongStart + delta;
  const parentStart = patched.lastIndexOf('<div', strongStartAfter);
  const parentEnd = parentStart >= 0 ? patched.indexOf('>', parentStart) : -1;
  if (parentStart >= 0 && parentEnd >= 0 && strongStartAfter - parentStart < 1600) {
    patched = patchOpening(patched, parentStart, parentEnd + 1, (opening) => {
      let next = addClassToOpeningTag(opening, 'lead-card-value-block');
      next = addAttrToOpeningTag(next, 'data-stage14e-leads-value-layout="true"');
      return next;
    });
  }

  return patched;
}
function getFunctionBody(source, name) {
  const start = source.indexOf(`function ${name}(`);
  if (start < 0) return '';
  const open = source.indexOf('{', start);
  if (open < 0) return '';
  const close = findMatchingBrace(source, open);
  if (close < 0) return '';
  return source.slice(open + 1, close);
}

let leads = normalizeEol(read(leadsPath));
let css = normalizeEol(read(cssPath));
const originalLeads = leads;
const originalCss = css;

if (!leads.includes('STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1')) {
  leads = leads.replace('// CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP', '// CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP\n// STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1');
}

const compactMetaReplacement = [
  'function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, _leadValueLabel: string = \'\') {',
  '  // STAGE14E_LEADS_VALUE_META_DEDUP: value belongs only to the dedicated value block/pill, never to compact meta.',
  '  void _leadValueLabel;',
  '  const company = String(lead?.company || \'\').trim();',
  '  const caseLabel = linkedCase ? \'sprawa: \' + (linkedCase.title || \'otwarta\') : \'\';',
  '',
  '  return [',
  '    sourceLabel,',
  '    company,',
  '    caseLabel,',
  '  ].filter(Boolean).join(\' · \');',
  '}',
].join('\n');

leads = replaceFunction(leads, 'buildLeadCompactMeta', compactMetaReplacement);
leads = patchValuePill(leads);

const cssBlock = [
  '',
  '',
  '/* STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1 */',
  '.main-leads-html .lead-card-value-block,',
  '.main-leads-html [data-stage14e-leads-value-layout="true"] {',
  '  display: flex !important;',
  '  flex-direction: column !important;',
  '  align-items: flex-start !important;',
  '  justify-content: flex-start !important;',
  '  gap: 0.35rem !important;',
  '  min-width: 0 !important;',
  '}',
  '',
  '.main-leads-html .lead-card-value-pill,',
  '.main-leads-html [data-lead-value-pill="true"] {',
  '  display: inline-flex !important;',
  '  align-items: center !important;',
  '  justify-content: center !important;',
  '  width: max-content !important;',
  '  max-width: fit-content !important;',
  '  flex: 0 0 auto !important;',
  '  align-self: flex-start !important;',
  '  white-space: nowrap !important;',
  '  padding: 0.25rem 0.55rem !important;',
  '  border-radius: 999px !important;',
  '  box-sizing: border-box !important;',
  '}',
].join('\n');

if (!css.includes('STAGE14E_LEADS_VALUE_DEDUP_BADGE_REPAIR1')) {
  css = css.replace(/\s*$/u, '') + cssBlock + '\n';
}

const metaBody = getFunctionBody(leads, 'buildLeadCompactMeta');
if (!metaBody.includes('STAGE14E_LEADS_VALUE_META_DEDUP')) throw new Error('Nie podmieniono buildLeadCompactMeta na wariant Stage14E.');
const returnArray = metaBody.slice(metaBody.indexOf('return ['), metaBody.indexOf('].filter'));
if (returnArray.includes('leadValueLabel') || returnArray.includes('_leadValueLabel')) {
  throw new Error('buildLeadCompactMeta nadal wkłada wartość do meta leada.');
}
if (!leads.includes('data-lead-value-pill="true"')) throw new Error('Nie oznaczono wartości data-lead-value-pill="true".');
if (!leads.includes('data-stage14e-leads-value-layout="true"')) throw new Error('Nie oznaczono bloku wartości data-stage14e-leads-value-layout="true".');
if (leads === originalLeads) throw new Error('Stage14E Repair1 nie zmienił src/pages/Leads.tsx.');
if (css === originalCss) throw new Error('Stage14E Repair1 nie zmienił CSS.');

write(leadsPath, leads);
write(cssPath, css);
console.log('OK: Stage14E Repair1 Leads value dedupe badge patch applied.');
