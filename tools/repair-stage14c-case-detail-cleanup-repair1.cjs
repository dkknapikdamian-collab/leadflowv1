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
function count(value, needle) {
  return String(value || '').split(needle).length - 1;
}
function stripUnusedImports(source) {
  const before = source;
  source = source.replace(/import\s*\{\s*ActivityRoadmap\s*\}\s*from\s*['"][^'"]*ActivityRoadmap['"];\s*/g, '');
  source = source.replace(/import\s*\{\s*buildCaseActivityRoadmap\s*\}\s*from\s*['"][^'"]*activity-roadmap['"];\s*/g, '');
  if (before !== source) console.log('- removed roadmap imports');
  return source;
}
function findStatementStart(source, idx) {
  const candidates = [
    source.lastIndexOf('\nconst ', idx),
    source.lastIndexOf('\n  const ', idx),
    source.lastIndexOf('\n    const ', idx),
    source.lastIndexOf('\nlet ', idx),
    source.lastIndexOf('\n  let ', idx),
    source.lastIndexOf('\n    let ', idx),
  ].filter((item) => item >= 0);
  if (!candidates.length) return -1;
  return Math.max(...candidates) + 1;
}
function findJsStatementEnd(source, start) {
  let quote = null;
  let escaped = false;
  let paren = 0;
  let brace = 0;
  let bracket = 0;
  for (let i = start; i < source.length; i += 1) {
    const ch = source[i];
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
    else if (ch === ')') paren = Math.max(0, paren - 1);
    else if (ch === '{') brace += 1;
    else if (ch === '}') brace = Math.max(0, brace - 1);
    else if (ch === '[') bracket += 1;
    else if (ch === ']') bracket = Math.max(0, bracket - 1);
    else if (ch === ';' && paren === 0 && brace === 0 && bracket === 0) {
      let end = i + 1;
      while (source[end] === '\n') end += 1;
      return end;
    }
  }
  return -1;
}
function removeStatementsContaining(source, needles, label) {
  let changed = false;
  let guard = 0;
  while (guard < 50) {
    guard += 1;
    const positions = needles.map((needle) => source.indexOf(needle)).filter((idx) => idx >= 0);
    if (!positions.length) break;
    const idx = Math.min(...positions);
    const start = findStatementStart(source, idx);
    if (start < 0) break;
    const end = findJsStatementEnd(source, start);
    if (end < 0) break;
    source = source.slice(0, start) + source.slice(end);
    changed = true;
  }
  if (changed) console.log(`- removed statements: ${label}`);
  return source;
}
function tagNameAt(source, openIndex) {
  const match = /^<([A-Za-z][A-Za-z0-9.]*)\b/.exec(source.slice(openIndex));
  return match ? match[1] : '';
}
function findOpeningTagBefore(source, idx, tags) {
  let best = null;
  for (const tag of tags) {
    const regex = new RegExp(`<${tag}\\b`, 'g');
    let match;
    while ((match = regex.exec(source)) && match.index <= idx) {
      if (!best || match.index > best.index) best = { index: match.index, tag };
    }
  }
  return best;
}
function findMatchingTagEnd(source, start, tag) {
  const re = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
  re.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = re.exec(source))) {
    const text = match[0];
    const closing = text.startsWith(`</${tag}`);
    const selfClosing = /\/\s*>$/.test(text);
    if (closing) depth -= 1;
    else if (!selfClosing) depth += 1;
    if (depth === 0) {
      let end = re.lastIndex;
      while (source[end] === '\n') end += 1;
      return end;
    }
  }
  return -1;
}
function removeEnclosingBlock(source, needle, label, tags = ['section', 'aside', 'div']) {
  let changed = false;
  let guard = 0;
  while (source.includes(needle) && guard < 50) {
    guard += 1;
    const idx = source.indexOf(needle);
    const opening = findOpeningTagBefore(source, idx, tags);
    if (!opening) break;
    const end = findMatchingTagEnd(source, opening.index, opening.tag);
    if (end < 0) break;
    const block = source.slice(opening.index, end);
    // Avoid removing the whole page shell by accident.
    if (block.length > 25000) break;
    source = source.slice(0, opening.index) + source.slice(end);
    changed = true;
  }
  if (changed) console.log(`- removed block: ${label}`);
  return { source, changed };
}
function findClassBlock(source, classNeedle) {
  const classIdx = source.indexOf(classNeedle);
  if (classIdx < 0) return null;
  const open = source.lastIndexOf('<', classIdx);
  if (open < 0) return null;
  const tag = tagNameAt(source, open);
  if (!tag) return null;
  const end = findMatchingTagEnd(source, open, tag);
  if (end < 0) return null;
  return { start: open, end, tag, block: source.slice(open, end) };
}
function splitTopLevelJsxChildren(block) {
  // Returns ranges relative to block for direct JSX children inside the outer rail tag.
  const firstClose = block.indexOf('>');
  if (firstClose < 0) return [];
  const outerTag = tagNameAt(block, 0);
  const outerClose = block.lastIndexOf(`</${outerTag}>`);
  if (outerClose < 0) return [];
  const innerStart = firstClose + 1;
  const innerEnd = outerClose;
  const children = [];
  let i = innerStart;
  while (i < innerEnd) {
    while (i < innerEnd && /\s/.test(block[i])) i += 1;
    if (i >= innerEnd) break;
    if (block[i] !== '<') {
      i += 1;
      continue;
    }
    if (block.startsWith('</', i)) break;
    const tag = tagNameAt(block, i);
    if (!tag) {
      i += 1;
      continue;
    }
    const end = findMatchingTagEnd(block, i, tag);
    if (end < 0 || end > innerEnd + 200) {
      i += 1;
      continue;
    }
    children.push({ start: i, end, text: block.slice(i, end) });
    i = end;
  }
  return children;
}
function removeRightRailCards(source) {
  const rail = findClassBlock(source, 'case-detail-right-rail');
  if (!rail) return { source, removed: [] };
  const children = splitTopLevelJsxChildren(rail.block);
  const removeNeedles = [
    '<ActivityRoadmap',
    'Roadmapa sprawy',
    'case-detail-roadmap-panel',
    'cf-activity-roadmap',
    'Portal i źródła',
    'Portal i zrodla',
    'Portal i zródła',
    'Portal klienta',
    'Kopiuj portal',
    'handleCopyPortal',
    'Powiązany lead',
    'Powiazany lead',
    'Źródła',
    'Zrodla',
    'sourceLead',
    'leadData',
    'portalUrl',
    'portalReady',
    'createClientPortalTokenInSupabase',
    'case-detail-soft-next-step-panel',
    'case-detail-next-step-soft-panel',
    'case-detail-purple-panel',
    'case-detail-roadmap-helper',
    'CASE_DETAIL_SOFT_NEXT_STEP',
  ];
  const removed = [];
  let patchedBlock = rail.block;
  // Remove from bottom to top so ranges stay valid.
  const toRemove = children
    .filter((child) => removeNeedles.some((needle) => child.text.includes(needle)))
    .sort((a, b) => b.start - a.start);
  for (const child of toRemove) {
    removed.push(removeNeedles.find((needle) => child.text.includes(needle)) || 'matched card');
    patchedBlock = patchedBlock.slice(0, child.start) + patchedBlock.slice(child.end);
  }
  if (!removed.length) return { source, removed };
  source = source.slice(0, rail.start) + patchedBlock + source.slice(rail.end);
  console.log(`- removed right rail cards: ${removed.join(', ')}`);
  return { source, removed };
}
function removeSelfClosingActivityRoadmap(source) {
  const before = source;
  source = source.replace(/<ActivityRoadmap\b[\s\S]*?\/\>\s*/g, '');
  if (before !== source) console.log('- removed self-closing ActivityRoadmap fallback');
  return source;
}
function simplifyBreadcrumb(source) {
  const before = source;
  source = source.replace(/(<p\s+className=["']case-detail-breadcrumb["']\s*>)[\s\S]*?(<\/p>)/g, (match, left, right) => {
    if (!match.includes('Sprawy')) return match;
    if (!match.includes('/') && !match.includes('getCaseTitle') && !match.includes('caseData?.title')) return match;
    return `${left}Sprawy${right}`;
  });
  if (source !== before) console.log('- simplified header breadcrumb');
  return source;
}
function removeHeaderDuplicateSmallText(source) {
  const headerStart = source.indexOf('<header');
  if (headerStart < 0) return source;
  const headerEnd = source.indexOf('</header>', headerStart);
  if (headerEnd < 0) return source;
  let header = source.slice(headerStart, headerEnd + '</header>'.length);
  const before = header;
  const h1Idx = header.indexOf('<h1');
  if (h1Idx >= 0) {
    let pre = header.slice(0, h1Idx);
    const post = header.slice(h1Idx);
    pre = pre.replace(/\n\s*<(small|p|span)\b[^>]*>\s*\{\s*getCaseTitle\(caseData\)\s*\}\s*<\/\1>\s*/g, '\n');
    pre = pre.replace(/\n\s*<(small|p|span)\b[^>]*>\s*\{\s*getCaseStatusLabel\(caseData\?\.status\)\s*\}\s*<\/\1>\s*/g, '\n');
    pre = pre.replace(/\n\s*<(small|p|span)\b[^>]*>\s*\{\s*getCaseStatusLabel\(caseData\.status\)\s*\}\s*<\/\1>\s*/g, '\n');
    header = pre + post;
  }
  if (header !== before) {
    console.log('- removed duplicate small header title/status');
    source = source.slice(0, headerStart) + header + source.slice(headerEnd + '</header>'.length);
  }
  return source;
}
function ensureStageGuard(source) {
  if (source.includes('STAGE14C_CASE_DETAIL_CLEANUP_REPAIR1')) return source;
  const marker = '/* STAGE68P_CASE_HISTORY_PACKAGE_FINAL */';
  if (source.includes(marker)) {
    return source.replace(marker, '/* STAGE14C_CASE_DETAIL_CLEANUP_REPAIR1 */\n/* STAGE14C_CASE_DETAIL_CLEANUP */\n' + marker);
  }
  return '/* STAGE14C_CASE_DETAIL_CLEANUP_REPAIR1 */\n/* STAGE14C_CASE_DETAIL_CLEANUP */\n' + source;
}

let source = normalizeEol(read(casePath));
const original = source;

source = ensureStageGuard(source);
source = stripUnusedImports(source);
source = removeStatementsContaining(source, ['buildCaseActivityRoadmap(', 'ActivityRoadmapTimeline', 'caseActivityRoadmap', 'activityRoadmap'], 'roadmap memo/data');

const rightRailResult = removeRightRailCards(source);
source = rightRailResult.source;

for (const needle of [
  '<ActivityRoadmap',
  'Roadmapa sprawy',
  'case-detail-roadmap-panel',
  'cf-activity-roadmap',
  'Portal i źródła',
  'Portal i zrodla',
  'Portal klienta',
  'Kopiuj portal',
  'Powiązany lead',
  'Powiazany lead',
  'case-detail-purple-panel',
  'case-detail-soft-next-step-panel',
  'case-detail-next-step-soft-panel',
]) {
  const result = removeEnclosingBlock(source, needle, `fallback by ${needle}`, ['section', 'aside', 'div']);
  source = result.source;
}
source = removeSelfClosingActivityRoadmap(source);
source = simplifyBreadcrumb(source);
source = removeHeaderDuplicateSmallText(source);

if (source === original) {
  throw new Error('Repair1 nie zmienił src/pages/CaseDetail.tsx. To oznacza, że selektory nadal nie pasują do aktualnego kodu. Nie robię pustego etapu.');
}

if (source.includes('<ActivityRoadmap')) throw new Error('Po patchu nadal istnieje <ActivityRoadmap w CaseDetail.tsx.');
if (source.includes("../components/ActivityRoadmap")) throw new Error('Po patchu nadal istnieje import ActivityRoadmap w CaseDetail.tsx.');
if (source.includes('buildCaseActivityRoadmap(')) throw new Error('Po patchu nadal istnieje buildCaseActivityRoadmap(...) w CaseDetail.tsx.');
if (count(source, 'getCaseTitle(caseData)') > count(original, 'getCaseTitle(caseData)')) throw new Error('Patch nie powinien dodawać duplikatów tytułu.');

write(casePath, source);
console.log('OK: Stage14C Repair1 actual CaseDetail cleanup patch applied.');
