const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const css = fs.readFileSync(path.join(repo, 'src/styles/closeflow-detail-view-source-truth-stage219.css'), 'utf8');

const errors = [];
const must = (ok, msg) => { if (!ok) errors.push(msg); };

must(css.includes('STAGE220A8_6_ACTION_COUNTS_AND_COLORS'), 'A8-6 marker missing');
must(css.includes('grid-template-columns: minmax(0, 1fr) auto auto'), 'accordion count layout must use label/count/toggle grid');
must(css.includes('.stage220a8-case-actions-group-trigger > strong'), 'count badge selector missing');
must(css.includes('grid-column: 3'), 'toggle icon must sit in third grid column');
must(css.includes('[data-stage220a8-case-actions-group="next"]'), 'next group color selector missing');
must(css.includes('[data-stage220a8-case-actions-group="blockers"]'), 'blockers group color selector missing');
must(css.includes('[data-stage220a8-case-actions-group="active"]'), 'active group color selector missing');
must(css.includes('#dbeafe'), 'next group blue color missing');
must(css.includes('#fef3c7'), 'blocker amber color missing');
must(css.includes('#d1fae5'), 'active green color missing');
must(css.includes('position: relative !important'), 'row click layer position missing');
must(css.includes('z-index: 2'), 'row click layer z-index missing');
must(css.includes('pointer-events: auto'), 'row action pointer-events guard missing');

if (errors.length) {
  console.error('Stage220A8 action counts colors guard failed:');
  for (const error of errors) console.error('- ' + error);
  process.exit(1);
}

console.log('OK Stage220A8 action counts colors guard passed');
