const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
function read(rel) { return fs.readFileSync(path.join(ROOT, rel), 'utf8').replace(/\r\n/g, '\n'); }
function exists(rel) { return fs.existsSync(path.join(ROOT, rel)); }
function fail(message) {
  console.error(`\u2718 ETAP9 CaseDetail quick actions cleanup guard failed: ${message}`);
  process.exit(1);
}
function ok(message) { console.log(`\u2714 ${message}`); }
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
function collectSections(text) {
  const sections = [];
  let index = 0;
  while (true) {
    const start = text.indexOf('<section', index);
    if (start === -1) break;
    const end = findMatchingTagEnd(text, start, 'section');
    if (end === -1) break;
    sections.push(text.slice(start, end));
    index = end;
  }
  return sections;
}
function getCssFiles() {
  const roots = ['src/styles'];
  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/case-detail|CaseDetail|page-adapters|closeflow-visual-system|closeflow-action-tokens/.test(entry.name) && entry.name.endsWith('.css')) files.push(full);
    }
  }
  for (const root of roots) walk(path.join(ROOT, root));
  return files;
}
function cssRuleBlocks(css) {
  const blocks = [];
  const re = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = re.exec(css))) blocks.push({ selector: m[1], body: m[2] });
  return blocks;
}
const caseDetail = read('src/pages/CaseDetail.tsx');
const caseQuickActions = read('src/components/CaseQuickActions.tsx');
if (!caseDetail.includes("import CaseQuickActions from '../components/CaseQuickActions'")) {
  fail('CaseDetail.tsx must import CaseQuickActions.');
}
const renderCount = (caseDetail.match(/<CaseQuickActions\b/g) || []).length;
if (renderCount !== 1) fail(`Expected exactly one rendered <CaseQuickActions /> in CaseDetail.tsx, found ${renderCount}.`);
if (caseDetail.includes('data-case-detail-quick-actions-slot')) fail('Temporary data-case-detail-quick-actions-slot prop must not stay in CaseDetail.tsx.');
const legacySections = collectSections(caseDetail).filter((section) => {
  const looksLikeRightCard = section.includes('case-detail-right-card') || section.includes('right-card');
  const legacyCombo = section.includes('Szybkie akcje') && section.includes('Dodaj brak');
  const currentQuickActions = section.includes('case-quick-actions') || section.includes('Dodaj operacyjny ruch bez starego kafelka formularza');
  return looksLikeRightCard && legacyCombo && !currentQuickActions;
});
if (legacySections.length) fail(`Legacy right-card panel "Szybkie akcje / Dodaj brak" still exists (${legacySections.length}).`);
for (const token of ['case-quick-actions', 'case-quick-actions__header', 'Szybkie akcje', 'Dodaj operacyjny ruch bez starego kafelka formularza']) {
  if (!caseQuickActions.includes(token)) fail(`CaseQuickActions.tsx missing required token: ${token}`);
}
const cssFiles = getCssFiles();
let cssAll = '';
for (const file of cssFiles) cssAll += `\n/* FILE:${path.relative(ROOT, file)} */\n` + fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
if (!cssAll.includes('CLOSEFLOW_ETAP9_CASE_DETAIL_QUICK_ACTIONS_LIGHT')) fail('Missing CLOSEFLOW_ETAP9_CASE_DETAIL_QUICK_ACTIONS_LIGHT CSS marker.');
if (!/\.case-detail-vnext-page\s+\.case-quick-actions\s*\{[\s\S]*?background:\s*#ffffff\s*!important/.test(cssAll)) {
  fail('Light background for .case-quick-actions is missing.');
}
const darkTokens = ['#020617', '#0f172a', 'rgb(15, 23, 42)', 'rgb(15,23,42)'];
for (const block of cssRuleBlocks(cssAll)) {
  if (!block.selector.includes('.case-quick-actions')) continue;
  const backgroundLines = block.body.split('\n').filter((line) => /background(?:-image)?\s*:/.test(line));
  for (const line of backgroundLines) {
    const lower = line.toLowerCase();
    if (darkTokens.some((token) => lower.includes(token))) {
      fail(`Dark background token is still applied to .case-quick-actions: ${line.trim()}`);
    }
  }
}
ok('ETAP9 repair5 CaseDetail quick actions cleanup guard passed.');
