const fs = require('fs');
const path = require('path');

const root = process.cwd();
const casePath = path.join(root, 'src/pages/CaseDetail.tsx');
const cssPath = path.join(root, 'src/styles/closeflow-case-detail-stage217-operation-workspace.css');

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);
  return fs.readFileSync(file, 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const source = read(casePath);
const css = read(cssPath);

assert(source.includes("type CaseDetailTab = 'service' | 'checklists' | 'history';"), 'CaseDetailTab still allows dead/path tab or has unexpected contract.');
assert(source.includes('data-stage220a9-case-tabs-top="true"'), 'Top production tabs marker missing.');
assert(source.indexOf('data-stage220a9-case-tabs-top="true"') < source.indexOf('className="case-detail-shell"'), 'Tabs must be above case-detail-shell.');
assert(!source.includes("activeTab === 'path'"), 'Dead Sciezka tab content still exists.');
assert(!source.includes("{ key: 'path'"), 'Dead Sciezka trigger still exists.');
assert(source.includes('data-stage220a9-tab-content="service"'), 'Service tab content marker missing.');
assert(source.includes('data-stage220a9-tab-content="checklists"'), 'Checklists tab content marker missing.');
assert(source.includes('data-stage220a9-tab-content="history"'), 'History tab content marker missing.');
assert(source.includes('data-stage220a9-unified-history-tab="true"'), 'Unified history tab marker missing.');
assert(source.includes('caseHistoryItems.map((item) =>'), 'History tab must render unified caseHistoryItems.');
assert(!/activeTab === 'history'[\s\S]{0,1200}activities\.map\(\(activity\)/.test(source), 'History tab still renders raw activities.map instead of unified history.');
assert(css.includes('STAGE220A9_CASE_DETAIL_PRODUCTION_TABS'), 'Stage220A9 CSS marker missing.');
assert(css.includes('.case-detail-main-column > .case-detail-section-card[data-stage220a9-tab-content]'), 'CSS override for visible tab content missing.');

console.log('OK STAGE220A9 case detail production tabs guard passed');