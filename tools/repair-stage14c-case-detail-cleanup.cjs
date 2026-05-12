const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');

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
function removeLineImport(source, importRegex, label) {
  const before = source;
  source = source.replace(importRegex, '');
  if (before !== source) console.log(`- removed import: ${label}`);
  return source;
}
function findStatementEnd(source, start) {
  let quote = null;
  let escaped = false;
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
    const prev = source[i - 1];
    if (quote) {
      if (quote === '`' && ch === '$' && source[i + 1] === '{' && !escaped) {
        brace += 1;
        i += 1;
        continue;
      }
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
    if (ch === '(') paren += 1;
    if (ch === ')') paren = Math.max(0, paren - 1);
    if (ch === '{') brace += 1;
    if (ch === '}') brace = Math.max(0, brace - 1);
    if (ch === '[') bracket += 1;
    if (ch === ']') bracket = Math.max(0, bracket - 1);
    if (ch === ';' && paren === 0 && brace === 0 && bracket === 0) {
      let end = i + 1;
      while (source[end] === '\n') end += 1;
      return end;
    }
    if (ch === ';' && prev === ')' && paren === 0 && bracket === 0) {
      let end = i + 1;
      while (source[end] === '\n') end += 1;
      return end;
    }
  }
  return -1;
}
function removeConstStatementContaining(source, needle, label) {
  let changed = false;
  while (source.includes(needle)) {
    const idx = source.indexOf(needle);
    const before = source.slice(0, idx);
    const candidates = [before.lastIndexOf('\nconst '), before.lastIndexOf('\n  const '), before.lastIndexOf('\n    const ')].filter((value) => value >= 0);
    if (!candidates.length) break;
    const start = Math.max(...candidates) + 1;
    const end = findStatementEnd(source, start);
    if (end < 0) break;
    source = source.slice(0, start) + source.slice(end);
    changed = true;
  }
  if (changed) console.log(`- removed const statement: ${label}`);
  return source;
}
function findEnclosingOpeningTag(source, needleIndex, tags) {
  let best = null;
  for (const tag of tags) {
    const idx = source.lastIndexOf(`<${tag}`, needleIndex);
    if (idx >= 0 && (!best || idx > best.index)) best = { tag, index: idx };
  }
  return best;
}
function findMatchingTagEnd(source, tag, start) {
  const tagRegex = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  tagRegex.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tagRegex.exec(source))) {
    const text = match[0];
    const isClosing = text.startsWith(`</${tag}`);
    const isSelfClosing = /\/>\s*$/.test(text);
    if (isClosing) depth -= 1;
    else if (!isSelfClosing) depth += 1;
    if (depth === 0) {
      let end = tagRegex.lastIndex;
      while (source[end] === '\n') end += 1;
      return end;
    }
  }
  return -1;
}
function removeEnclosingBlockByNeedle(source, needle, label, options = {}) {
  const tags = options.tags || ['section', 'aside', 'div'];
  const requiredWithinBlock = options.requiredWithinBlock || [];
  let changed = false;
  while (source.includes(needle)) {
    const needleIndex = source.indexOf(needle);
    const opening = findEnclosingOpeningTag(source, needleIndex, tags);
    if (!opening) break;
    const end = findMatchingTagEnd(source, opening.tag, opening.index);
    if (end < 0) break;
    const block = source.slice(opening.index, end);
    if (requiredWithinBlock.length && !requiredWithinBlock.every((item) => block.includes(item))) break;
    source = source.slice(0, opening.index) + source.slice(end);
    changed = true;
  }
  if (changed) console.log(`- removed block: ${label}`);
  return { source, changed };
}
function replaceCaseHeaderBreadcrumb(source) {
  let changed = false;
  const patterns = [
    /<p\s+className="case-detail-breadcrumb">\s*Sprawy\s*\/\s*\{getCaseTitle\(caseData\)\}\s*<\/p>/g,
    /<p\s+className="case-detail-breadcrumb">\s*\{`Sprawy\s*\/\s*\$\{getCaseTitle\(caseData\)\}`\}\s*<\/p>/g,
    /<p\s+className="case-detail-breadcrumb">\s*Sprawy\s*\/\s*\{caseData\?\.title[^}]*\}\s*<\/p>/g,
  ];
  for (const pattern of patterns) {
    const before = source;
    source = source.replace(pattern, '<p className="case-detail-breadcrumb">Sprawy</p>');
    if (source !== before) changed = true;
  }
  source = source.replace(/(<p\s+className="case-detail-breadcrumb">\s*)Sprawy\s*\/\s*([^<]+)(\s*<\/p>)/g, (_m, left, _middle, right) => {
    changed = true;
    return `${left}Sprawy${right}`;
  });
  if (changed) console.log('- simplified duplicated header breadcrumb');
  return source;
}
function removeHeaderPreTitleDuplicates(source) {
  const headerOpen = source.indexOf('<header');
  if (headerOpen < 0) return source;
  const headerEnd = source.indexOf('</header>', headerOpen);
  if (headerEnd < 0) return source;
  const header = source.slice(headerOpen, headerEnd + '</header>'.length);
  const h1Index = header.indexOf('<h1');
  if (h1Index < 0) return source;
  let beforeH1 = header.slice(0, h1Index);
  const afterH1 = header.slice(h1Index);
  const originalBeforeH1 = beforeH1;

  beforeH1 = beforeH1.replace(/\n\s*<(p|span|small)\b[^>]*>\s*\{getCaseTitle\(caseData\)\}\s*<\/\1>\s*/g, '\n');
  beforeH1 = beforeH1.replace(/\n\s*<(p|span|small)\b[^>]*>\s*\{getCaseStatusLabel\(caseData\?\.status\)\}\s*<\/\1>\s*/g, '\n');
  beforeH1 = beforeH1.replace(/\n\s*<(p|span|small)\b[^>]*>\s*\{getCaseStatusLabel\(caseData\.status\)\}\s*<\/\1>\s*/g, '\n');

  if (beforeH1 === originalBeforeH1) return source;
  console.log('- removed duplicated small header title/status before h1');
  const patchedHeader = beforeH1 + afterH1;
  return source.slice(0, headerOpen) + patchedHeader + source.slice(headerEnd + '</header>'.length);
}
function countIn(value, needle) {
  return value.split(needle).length - 1;
}

let source = normalizeEol(read(casePath));
const original = source;

if (!source.includes('STAGE14C_CASE_DETAIL_CLEANUP')) {
  source = source.replace('/* STAGE68P_CASE_HISTORY_PACKAGE_FINAL */', '/* STAGE14C_CASE_DETAIL_CLEANUP */\n/* STAGE68P_CASE_HISTORY_PACKAGE_FINAL */');
}

source = removeLineImport(source, /^import\s+\{\s*ActivityRoadmap\s*\}\s+from\s+'\.\.\/components\/ActivityRoadmap';\s*\n/gm, 'ActivityRoadmap');
source = removeLineImport(source, /^import\s+\{\s*buildCaseActivityRoadmap\s*\}\s+from\s+'\.\.\/lib\/activity-roadmap';\s*\n/gm, 'buildCaseActivityRoadmap');
source = removeConstStatementContaining(source, 'buildCaseActivityRoadmap', 'case activity roadmap memo');

let removedRoadmap = false;
for (const needle of ['Roadmapa sprawy', '<ActivityRoadmap', 'case-detail-roadmap-panel', 'cf-activity-roadmap']) {
  const result = removeEnclosingBlockByNeedle(source, needle, `roadmap panel by ${needle}`, { tags: ['section', 'div'] });
  source = result.source;
  removedRoadmap = removedRoadmap || result.changed;
}

let removedPortal = false;
for (const needle of ['Portal i źródła', 'Kopiuj portal']) {
  const result = removeEnclosingBlockByNeedle(source, needle, `portal/source panel by ${needle}`, { tags: ['section', 'div'] });
  source = result.source;
  removedPortal = removedPortal || result.changed;
}

// The purple panel reported by the user lived in the same right rail neighbourhood in older builds.
// Remove only known decorative helper panels, not operational tasks/events/payments/history.
for (const needle of [
  'case-detail-roadmap-helper',
  'case-detail-purple-panel',
  'case-detail-next-step-soft-panel',
  'case-detail-soft-next-step-panel',
  'CASE_DETAIL_SOFT_NEXT_STEP',
]) {
  const result = removeEnclosingBlockByNeedle(source, needle, `decorative panel by ${needle}`, { tags: ['section', 'div'] });
  source = result.source;
}

source = replaceCaseHeaderBreadcrumb(source);
source = removeHeaderPreTitleDuplicates(source);

if (source === original) {
  throw new Error('Stage14C nie zmienił CaseDetail.tsx. Przerywam, żeby nie robić pustego commita.');
}

write(casePath, source);
console.log('OK: Stage14C CaseDetail cleanup patch applied.');
console.log(`Removed roadmap panel: ${removedRoadmap ? 'yes' : 'not found after flexible scan'}`);
console.log(`Removed portal/source panel: ${removedPortal ? 'yes' : 'not found after flexible scan'}`);
