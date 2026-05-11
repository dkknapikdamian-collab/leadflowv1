const fs = require('fs');
const path = require('path');

const repo = process.argv[2] || process.cwd();
const read = (p) => fs.readFileSync(path.join(repo, p), 'utf8');
const write = (p, c) => fs.writeFileSync(path.join(repo, p), c.replace(/\r?\n/g, '\n'));

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

function insertAfter(text, needle, insertion) {
  if (text.includes(insertion.trim())) return text;
  const index = text.indexOf(needle);
  ensure(index >= 0, `Nie znaleziono miejsca wstawienia: ${needle}`);
  return text.slice(0, index + needle.length) + insertion + text.slice(index + needle.length);
}

function removeBalancedElementWithMarker(text, marker) {
  let markerIndex = text.indexOf(marker);
  if (markerIndex < 0) return text;
  let result = text;
  while (markerIndex >= 0) {
    const openStart = result.lastIndexOf('<', markerIndex);
    if (openStart < 0) break;
    const openMatch = /^<([A-Za-z][A-Za-z0-9]*)\b/.exec(result.slice(openStart));
    if (!openMatch) break;
    const tag = openMatch[1];
    let cursor = openStart;
    let depth = 0;
    const tagRe = new RegExp(`<\\/?${tag}\\b[^>]*>`, 'g');
    tagRe.lastIndex = openStart;
    let end = -1;
    let match;
    while ((match = tagRe.exec(result))) {
      const token = match[0];
      const selfClosing = /\/>$/.test(token);
      const closing = /^<\//.test(token);
      if (!closing && !selfClosing) depth += 1;
      if (closing) depth -= 1;
      if (depth === 0) {
        end = tagRe.lastIndex;
        break;
      }
    }
    if (end < 0) break;
    result = result.slice(0, openStart) + result.slice(end);
    markerIndex = result.indexOf(marker);
  }
  return result;
}

function ensureImport(text) {
  if (text.includes("../components/CaseQuickActions")) return text;
  const importLine = "import CaseQuickActions from '../components/CaseQuickActions';\n";
  if (text.includes("import { ActivityRoadmap } from '../components/ActivityRoadmap';")) {
    return text.replace("import { ActivityRoadmap } from '../components/ActivityRoadmap';", "import { ActivityRoadmap } from '../components/ActivityRoadmap';\n" + importLine.trimEnd());
  }
  if (text.includes("import Layout from '../components/Layout';")) {
    return text.replace("import Layout from '../components/Layout';", "import Layout from '../components/Layout';\n" + importLine.trimEnd());
  }
  throw new Error('Nie znaleziono stabilnego miejsca na import CaseQuickActions.');
}

function findAsideInsertion(text) {
  const asideRe = /<aside\b[^>]*className=(?:"[^"]*(?:case-detail-right|right-column|right-card-column|sidebar)[^"]*"|'[^']*(?:case-detail-right|right-column|right-card-column|sidebar)[^']*')[^>]*>/g;
  let match = asideRe.exec(text);
  if (!match) {
    const genericAside = /<aside\b[^>]*>/g;
    match = genericAside.exec(text);
  }
  ensure(match, 'Nie znaleziono prawej kolumny <aside> w CaseDetail.tsx.');
  return match.index + match[0].length;
}

function ensureQuickActionsRender(text) {
  if (text.includes('data-case-quick-actions-anchor="case-detail"') || text.includes('<CaseQuickActions')) return text;
  const insertionPoint = findAsideInsertion(text);
  const block = `\n            <div data-case-quick-actions-anchor="case-detail">\n              <CaseQuickActions\n                caseId={caseData.id}\n                caseTitle={getCaseTitle(caseData)}\n                clientId={caseData.clientId || null}\n                leadId={caseData.leadId || null}\n                onAddPayment={() => setIsCasePaymentOpen(true)}\n              />\n            </div>\n`;
  return text.slice(0, insertionPoint) + block + text.slice(insertionPoint);
}

function patchPackageJson() {
  const pkgPath = path.join(repo, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:closeflow-case-quick-actions'] = 'node scripts/check-closeflow-case-quick-actions.cjs';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function patchStyles() {
  const stylePath = 'src/styles/visual-stage13-case-detail-vnext.css';
  const full = path.join(repo, stylePath);
  if (!fs.existsSync(full)) return;
  let css = read(stylePath);
  if (css.includes('case-quick-actions__grid')) return;
  css += `\n\n/* CLOSEFLOW_STAGE5_CASE_QUICK_ACTIONS */\n.case-quick-actions {\n  display: grid;\n  gap: 12px;\n}\n.case-quick-actions__header {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n}\n.case-quick-actions__header span {\n  display: grid;\n  gap: 4px;\n}\n.case-quick-actions__header strong {\n  font-size: 0.95rem;\n  font-weight: 800;\n}\n.case-quick-actions__header small {\n  color: var(--muted-foreground, #64748b);\n  font-size: 0.78rem;\n  line-height: 1.35;\n}\n.case-quick-actions__grid {\n  display: grid;\n  grid-template-columns: 1fr;\n  gap: 8px;\n}\n.case-quick-actions__button {\n  width: 100%;\n  border: 1px solid rgba(148, 163, 184, 0.22);\n  border-radius: 14px;\n  background: rgba(255, 255, 255, 0.86);\n  color: #0f172a;\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 12px;\n  font-size: 0.86rem;\n  font-weight: 700;\n  text-align: left;\n  transition: transform 0.14s ease, border-color 0.14s ease, background 0.14s ease;\n}\n.case-quick-actions__button:hover {\n  transform: translateY(-1px);\n  border-color: rgba(15, 23, 42, 0.2);\n  background: #fff;\n}\n.case-quick-actions__button--note svg { color: #7c3aed; }\n.case-quick-actions__button--task svg { color: #059669; }\n.case-quick-actions__button--event svg { color: #2563eb; }\n.case-quick-actions__button--missing svg { color: #d97706; }\n.case-quick-actions__button--payment svg { color: #16a34a; }\n.case-detail-dialog-stack {\n  display: grid;\n  gap: 14px;\n}\n.case-detail-dialog-stack label {\n  display: grid;\n  gap: 6px;\n}\n.case-detail-dialog-stack label > span {\n  font-size: 0.82rem;\n  font-weight: 800;\n  color: #334155;\n}\n`;
  write(stylePath, css);
}

function main() {
  const casePath = 'src/pages/CaseDetail.tsx';
  ensure(fs.existsSync(path.join(repo, casePath)), 'Brak src/pages/CaseDetail.tsx');
  let text = read(casePath);

  text = removeBalancedElementWithMarker(text, 'data-case-create-actions-panel="true"');
  text = removeBalancedElementWithMarker(text, 'case-detail-create-action-card');
  text = ensureImport(text);
  text = ensureQuickActionsRender(text);

  write(casePath, text);
  patchStyles();
  patchPackageJson();
  console.log('CLOSEFLOW_CASE_QUICK_ACTIONS_REPAIR_PATCH_OK');
}

main();
