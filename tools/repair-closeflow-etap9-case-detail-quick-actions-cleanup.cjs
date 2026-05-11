const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
function filePath(...parts) { return path.join(ROOT, ...parts); }
function read(rel) { return fs.readFileSync(filePath(rel), 'utf8'); }
function write(rel, text) { fs.writeFileSync(filePath(rel), text, 'utf8'); }
function exists(rel) { return fs.existsSync(filePath(rel)); }

const MARKER = 'CLOSEFLOW_ETAP9_CASE_DETAIL_QUICK_ACTIONS_LIGHT';

function normalizeNewlines(text) {
  return text.replace(/\r\n/g, '\n');
}

function ensurePackageScript() {
  const rel = 'package.json';
  const pkg = JSON.parse(read(rel));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:case-detail-quick-actions-cleanup'] = 'node scripts/check-closeflow-case-detail-quick-actions-cleanup.cjs';
  write(rel, JSON.stringify(pkg, null, 2) + '\n');
}

function findMatchingTagEnd(text, startIndex, tagName) {
  const tagRe = new RegExp(`<\\/?${tagName}\\b[^>]*>`, 'gi');
  tagRe.lastIndex = startIndex;
  let depth = 0;
  let match;
  while ((match = tagRe.exec(text))) {
    const token = match[0];
    const isClose = /^<\//.test(token);
    const isSelfClosing = /\/>$/.test(token);
    if (!isClose && !isSelfClosing) depth += 1;
    if (isClose) depth -= 1;
    if (depth === 0) return tagRe.lastIndex;
  }
  return -1;
}

function removeLegacyQuickActionsSection(text) {
  let current = text;
  let removed = 0;
  let index = 0;
  while (true) {
    const start = current.indexOf('<section', index);
    if (start === -1) break;
    const end = findMatchingTagEnd(current, start, 'section');
    if (end === -1) break;
    const segment = current.slice(start, end);
    const looksLikeLegacyRightCard = /className=\{?['"`][^'"`]*(?:right-card|case-detail-right-card)[^'"`]*['"`]\}?/.test(segment)
      || /case-detail-right-card/.test(segment);
    const hasLegacyTitle = segment.includes('Szybkie akcje');
    const hasOnlyMissingButton = segment.includes('Dodaj brak') && !segment.includes('Dodaj operacyjny ruch bez starego kafelka formularza');
    const isNotCurrentComponent = !segment.includes('<CaseQuickActions') && !segment.includes('case-quick-actions');
    if (looksLikeLegacyRightCard && hasLegacyTitle && hasOnlyMissingButton && isNotCurrentComponent) {
      current = current.slice(0, start) + current.slice(end);
      removed += 1;
      index = Math.max(0, start - 20);
      continue;
    }
    index = end;
  }
  return { text: current, removed };
}

function stripTemporaryBrokenProps(text) {
  return text.replace(/\s+data-case-detail-quick-actions-slot=\{?['"]true['"]\}?/g, '');
}

function ensureCaseDetail() {
  const rel = 'src/pages/CaseDetail.tsx';
  let text = normalizeNewlines(read(rel));
  text = stripTemporaryBrokenProps(text);
  const before = text;
  const result = removeLegacyQuickActionsSection(text);
  text = result.text;
  const renderCount = (text.match(/<CaseQuickActions\b/g) || []).length;
  if (renderCount !== 1) {
    throw new Error(`Expected exactly one rendered <CaseQuickActions /> in CaseDetail.tsx, found ${renderCount}.`);
  }
  const legacyAfter = collectLegacySections(text);
  if (legacyAfter.length) {
    throw new Error(`Legacy right-card quick actions section still exists after cleanup (${legacyAfter.length}).`);
  }
  if (text !== before) write(rel, text);
  return result.removed;
}

function collectLegacySections(text) {
  const sections = [];
  let index = 0;
  while (true) {
    const start = text.indexOf('<section', index);
    if (start === -1) break;
    const end = findMatchingTagEnd(text, start, 'section');
    if (end === -1) break;
    const segment = text.slice(start, end);
    const looksLikeLegacyRightCard = /case-detail-right-card/.test(segment) || /right-card/.test(segment);
    const hasLegacyCombo = segment.includes('Szybkie akcje') && segment.includes('Dodaj brak');
    const isCurrentQuickActions = segment.includes('case-quick-actions') || segment.includes('Dodaj operacyjny ruch bez starego kafelka formularza');
    if (looksLikeLegacyRightCard && hasLegacyCombo && !isCurrentQuickActions) sections.push(segment);
    index = end;
  }
  return sections;
}

function ensureCaseQuickActionsContract() {
  const rel = 'src/components/CaseQuickActions.tsx';
  if (!exists(rel)) throw new Error('Missing src/components/CaseQuickActions.tsx');
  let text = normalizeNewlines(read(rel));
  const required = [
    'case-quick-actions',
    'case-quick-actions__header',
    'Dodaj operacyjny ruch bez starego kafelka formularza',
    'Dodaj notatkę',
    'Dodaj zadanie',
    'Dodaj wydarzenie',
    'Dodaj brak'
  ];
  for (const token of required) {
    if (!text.includes(token)) throw new Error(`CaseQuickActions.tsx missing required token: ${token}`);
  }
  // Do not require a single literal "Szybkie akcje" here. The current component may use the copy in accessible/title contexts too.
  if (!text.includes('Szybkie akcje')) {
    throw new Error('CaseQuickActions.tsx must still expose the Szybkie akcje title.');
  }
}

function removePreviousEtap9CssBlocks(css) {
  return css
    .replace(/\/\* CLOSEFLOW_ETAP9_CASE_DETAIL_QUICK_ACTIONS_LIGHT \*\/[\s\S]*?(?=\/\* [A-Z0-9_:-]+|$)/g, '')
    .replace(/\/\* CLOSEFLOW_ETAP9_REPAIR[0-9]+[^*]*\*\/[\s\S]*?(?=\/\* [A-Z0-9_:-]+|$)/g, '');
}

function ensureLightCss() {
  const rel = 'src/styles/visual-stage13-case-detail-vnext.css';
  if (!exists(rel)) throw new Error(`Missing ${rel}`);
  let css = normalizeNewlines(read(rel));
  css = removePreviousEtap9CssBlocks(css).trimEnd();
  const block = `

/* ${MARKER} */
.case-detail-vnext-page .case-quick-actions {
  background: #ffffff !important;
  background-image: none !important;
  border: 1px solid rgba(148, 163, 184, 0.28) !important;
  border-radius: 28px !important;
  box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08) !important;
  color: #0f172a !important;
  overflow: hidden !important;
}

.case-detail-vnext-page .case-quick-actions__header {
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), #ffffff) !important;
  border-bottom: 1px solid rgba(148, 163, 184, 0.22) !important;
  color: #0f172a !important;
}

.case-detail-vnext-page .case-quick-actions__header h2,
.case-detail-vnext-page .case-quick-actions__header strong {
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
}

.case-detail-vnext-page .case-quick-actions__header p,
.case-detail-vnext-page .case-quick-actions__header small {
  color: #64748b !important;
  -webkit-text-fill-color: #64748b !important;
}

.case-detail-vnext-page .case-quick-actions__grid,
.case-detail-vnext-page .case-quick-actions__list,
.case-detail-vnext-page .case-quick-actions__body {
  background: #ffffff !important;
  color: #0f172a !important;
}

.case-detail-vnext-page .case-quick-actions button,
.case-detail-vnext-page .case-quick-actions__button {
  background: #ffffff !important;
  background-image: none !important;
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
  border-color: rgba(148, 163, 184, 0.36) !important;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06) !important;
}

.case-detail-vnext-page .case-quick-actions button:hover,
.case-detail-vnext-page .case-quick-actions__button:hover {
  background: #f8fafc !important;
  color: #1d4ed8 !important;
  -webkit-text-fill-color: #1d4ed8 !important;
  border-color: rgba(37, 99, 235, 0.32) !important;
}

.case-detail-vnext-page .case-quick-actions button svg,
.case-detail-vnext-page .case-quick-actions__button svg {
  color: #2563eb !important;
  stroke: currentColor !important;
}
`;
  write(rel, css + block + '\n');
}

function sanitizePageAdaptersCss() {
  const rel = 'src/styles/page-adapters/page-adapters.css';
  if (!exists(rel)) return;
  let css = normalizeNewlines(read(rel));
  css = removePreviousEtap9CssBlocks(css).trimEnd() + '\n';
  write(rel, css);
}

function main() {
  ensurePackageScript();
  const removed = ensureCaseDetail();
  ensureCaseQuickActionsContract();
  sanitizePageAdaptersCss();
  ensureLightCss();
  console.log(`✔ Applied CLOSEFLOW_ETAP9_REPAIR5_CASE_DETAIL_QUICK_ACTIONS_GUARDED patch. Removed legacy sections: ${removed}.`);
}

main();
