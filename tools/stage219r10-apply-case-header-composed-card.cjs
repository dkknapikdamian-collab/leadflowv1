const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const casePath = path.join(repo, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css');

function read(file) { return fs.readFileSync(file, 'utf8'); }
function write(file, text) { fs.writeFileSync(file, text, 'utf8'); }

function cleanupFailedArtifacts() {
  const stale = [
    'scripts/check-stage219r8-case-detail-real-refresh-flat-cards.cjs',
    'tools/stage219r8-apply-case-detail-real-refresh-flat-cards.cjs',
    '_project/reports/STAGE219R8_CASE_DETAIL_REAL_REFRESH_FLAT_CARDS_2026-06-02.md',
    'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/STAGE219R8_CASE_DETAIL_REAL_REFRESH_FLAT_CARDS_20260602.md',
    'scripts/check-stage219r7-case-detail-real-refresh-flatten.cjs',
    'tools/stage219r7-apply-case-detail-real-refresh-flatten.cjs',
    '_project/reports/STAGE219R7_CASE_DETAIL_REAL_REFRESH_FLATTEN_2026-06-02.md',
    'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/STAGE219R7_CASE_DETAIL_REAL_REFRESH_FLATTEN_20260602.md',
    'scripts/check-stage219r6-case-detail-refresh-flat-cards.cjs',
    'tools/stage219r6-apply-case-detail-refresh-flat-cards.cjs',
    '_project/reports/STAGE219R6_CASE_DETAIL_REFRESH_FLAT_CARDS_2026-06-02.md',
    'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/STAGE219R6_CASE_DETAIL_REFRESH_FLAT_CARDS_20260602.md',
  ];
  for (const rel of stale) {
    const file = path.join(repo, rel);
    if (fs.existsSync(file)) fs.rmSync(file, { force: true });
  }
}

function replaceOnce(text, search, replacement, label) {
  if (!text.includes(search)) throw new Error(`Nie znaleziono anchoru: ${label}`);
  return text.replace(search, replacement);
}

cleanupFailedArtifacts();

let caseText = read(casePath);

if (!caseText.includes('STAGE219_R10_CASE_HEADER_COMPOSED_CARD')) {
  const helperAnchor = `function getCaseTitle(caseData?: CaseRecord | null) {\n  return String(caseData?.title || caseData?.clientName || 'Sprawa bez nazwy');\n}\n`;
  const helperBlock = `${helperAnchor}const STAGE219_R10_CASE_HEADER_COMPOSED_CARD = 'case detail header shows client dash case in one compact row';\nvoid STAGE219_R10_CASE_HEADER_COMPOSED_CARD;\nfunction normalizeCaseHeaderPiece(value: unknown) {\n  return String(value || '').replace(/\\s+/g, ' ').trim();\n}\nfunction getCaseHeaderClientLabel(caseData?: CaseRecord | null) {\n  return normalizeCaseHeaderPiece(caseData?.clientName) || 'Brak klienta';\n}\nfunction getCaseHeaderCaseLabel(caseData?: CaseRecord | null) {\n  const client = getCaseHeaderClientLabel(caseData);\n  const title = normalizeCaseHeaderPiece(caseData?.title) || normalizeCaseHeaderPiece(caseData?.clientName) || 'Sprawa';\n  const lowerTitle = title.toLowerCase();\n  const lowerClient = client.toLowerCase();\n  if (client !== 'Brak klienta' && lowerTitle.startsWith(lowerClient)) {\n    const trimmed = normalizeCaseHeaderPiece(title.slice(client.length).replace(/^[\\s\\-–—:|]+/, ''));\n    if (trimmed) return trimmed;\n  }\n  return title;\n}\n`;
  caseText = replaceOnce(caseText, helperAnchor, helperBlock, 'getCaseTitle helper');
}

const oldTitle = `<h1>{getCaseTitle(caseData)}</h1>`;
const newTitle = `<h1 className="case-detail-header-composed-title" data-stage219r10-header-title="true" title={getCaseHeaderClientLabel(caseData) + ' — ' + getCaseHeaderCaseLabel(caseData)}>\n                <span className="case-detail-header-client-name">{getCaseHeaderClientLabel(caseData)}</span>\n                <span className="case-detail-header-separator" aria-hidden="true">—</span>\n                <span className="case-detail-header-case-name">{getCaseHeaderCaseLabel(caseData)}</span>\n              </h1>`;
if (!caseText.includes('data-stage219r10-header-title="true"')) {
  caseText = replaceOnce(caseText, oldTitle, newTitle, 'CaseDetail h1 title');
}

write(casePath, caseText);

let css = read(cssPath);
if (!css.includes('STAGE219_R10_CASE_HEADER_COMPOSED_CARD')) {
  css += `\n\n/* STAGE219_R10_CASE_HEADER_COMPOSED_CARD\n   Cel: górny kafelek CaseDetail ma być chłodny, zwarty i czytelny:\n   klient — nazwa sprawy w jednym wierszu obok powrotu, bez pustego hero. */\n.case-detail-vnext-page .case-detail-header.case-detail-header {\n  align-items: center !important;\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(248, 250, 252, 0.96)) !important;\n  border: 1px solid rgba(148, 163, 184, 0.16) !important;\n  border-radius: 22px !important;\n  box-shadow: 0 16px 38px rgba(15, 23, 42, 0.06) !important;\n  display: flex !important;\n  margin-bottom: 18px !important;\n  min-height: 66px !important;\n  padding: 12px 18px !important;\n}\n\n.case-detail-vnext-page .case-detail-header-copy.case-detail-header-copy {\n  align-items: center !important;\n  display: flex !important;\n  flex-direction: row !important;\n  flex-wrap: nowrap !important;\n  gap: 14px !important;\n  min-width: 0 !important;\n  width: 100% !important;\n}\n\n.case-detail-vnext-page .case-detail-back-button.case-detail-back-button {\n  flex: 0 0 auto !important;\n  margin: 0 !important;\n}\n\n.case-detail-vnext-page .case-detail-breadcrumb,\n.case-detail-vnext-page .case-detail-header-meta,\n.case-detail-vnext-page .case-detail-title-row .case-detail-pill {\n  display: none !important;\n}\n\n.case-detail-vnext-page .case-detail-title-row.case-detail-title-row {\n  align-items: center !important;\n  display: flex !important;\n  flex: 1 1 auto !important;\n  min-width: 0 !important;\n  width: auto !important;\n}\n\n.case-detail-vnext-page .case-detail-header-composed-title.case-detail-header-composed-title {\n  align-items: center !important;\n  color: #0f172a !important;\n  display: flex !important;\n  flex: 1 1 auto !important;\n  font-size: clamp(15px, 1.25vw, 18px) !important;\n  font-weight: 850 !important;\n  gap: 8px !important;\n  letter-spacing: -0.01em !important;\n  line-height: 1.15 !important;\n  margin: 0 !important;\n  min-width: 0 !important;\n  overflow: hidden !important;\n  text-align: left !important;\n  white-space: nowrap !important;\n}\n\n.case-detail-vnext-page .case-detail-header-client-name,\n.case-detail-vnext-page .case-detail-header-case-name {\n  display: inline-block !important;\n  min-width: 0 !important;\n  overflow: hidden !important;\n  text-overflow: ellipsis !important;\n  white-space: nowrap !important;\n}\n\n.case-detail-vnext-page .case-detail-header-client-name {\n  flex: 0 1 auto !important;\n  max-width: 34ch !important;\n}\n\n.case-detail-vnext-page .case-detail-header-separator {\n  color: #94a3b8 !important;\n  flex: 0 0 auto !important;\n  font-weight: 800 !important;\n}\n\n.case-detail-vnext-page .case-detail-header-case-name {\n  color: #334155 !important;\n  flex: 1 1 auto !important;\n}\n\n.case-detail-vnext-page .cf-case-detail-delete-action {\n  flex: 0 0 auto !important;\n}\n\n@media (max-width: 760px) {\n  .case-detail-vnext-page .case-detail-header-copy.case-detail-header-copy {\n    gap: 10px !important;\n  }\n\n  .case-detail-vnext-page .case-detail-header-composed-title.case-detail-header-composed-title {\n    font-size: 14px !important;\n  }\n\n  .case-detail-vnext-page .case-detail-header-client-name {\n    max-width: 18ch !important;\n  }\n}\n`;
}
write(cssPath, css);

console.log('OK Stage219-R10 case header composed card applied');
