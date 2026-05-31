/* CLOSEFLOW_STAGE135_RIGHT_RAIL_HEADING_SOURCE_TRUTH_GUARD */
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
function mustInclude(rel, marker) {
  const content = read(rel);
  if (!content.includes(marker)) throw new Error(`${rel} missing required marker: ${marker}`);
}
mustInclude('src/App.tsx', "import './styles/closeflow-right-rail-heading-source-truth-stage135.css';");
mustInclude('src/styles/closeflow-right-rail-heading-source-truth-stage135.css', 'CLOSEFLOW_STAGE135_RIGHT_RAIL_HEADING_SOURCE_TRUTH');
mustInclude('src/styles/closeflow-right-rail-heading-source-truth-stage135.css', '--closeflow-stage135-right-rail-heading-source-truth: "active"');
[
  '.lead-right-rail','.clients-right-rail','.cases-right-rail','.activity-right-rail',
  '.panel-head','.activity-right-card-head',
  '[data-testid="leads-simple-filters-card"]','[data-testid="leads-top-value-records-card"]',
  '[data-testid="clients-simple-filters-card"]','[data-testid="clients-top-value-records-card"]',
  '.cases-shortcuts-rail-card','.cases-risk-rail-card','.activity-right-card',
  '--cf135-rail-heading-font-size: 14px','--cf135-rail-heading-line-height: 18px',
  '--cf135-rail-description-font-size: 12px','--cf135-rail-heading-min-height: 38px',
].forEach((marker) => mustInclude('src/styles/closeflow-right-rail-heading-source-truth-stage135.css', marker));
mustInclude('_project/STAGE135_RIGHT_RAIL_HEADING_SOURCE_TRUTH_REPORT.md', 'Mapa dokładnie klikniętych napisów');
mustInclude('OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-22 - CloseFlow Stage135 right rail heading source truth.md', 'Stage135');
console.log('OK: Stage135 right rail heading source truth guard passed.');
