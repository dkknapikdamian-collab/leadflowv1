const fs = require('fs');
const path = require('path');

const repo = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(repo, 'src', 'pages', 'Leads.tsx'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

assert(source.includes('SimpleFiltersCard'), 'Leads.tsx must import/use SimpleFiltersCard.');
assert(source.includes('TopValueRecordsCard'), 'Leads.tsx must still use TopValueRecordsCard.');
assert(source.includes('dataTestId="leads-simple-filters-card"'), 'Missing leads simple filters dataTestId.');
assert(source.includes('title="Filtry proste"'), 'Missing simple filters title.');
assert(source.includes('description="Bez przesady, tylko najpotrzebniejsze."'), 'Missing simple filters description.');
assert(source.includes("label: 'Aktywne'"), 'Missing Aktywne filter.');
assert(source.includes("label: 'Zagro\u017Cone'"), 'Missing Zagrozone filter.');
assert(source.includes("label: 'Historia'"), 'Missing Historia filter.');
assert(source.includes("label: 'Kosz'"), 'Missing Kosz filter.');
assert(source.includes('value: stats.active'), 'Aktywne must use stats.active.');
assert(source.includes('value: stats.atRisk'), 'Zagrozone must use stats.atRisk.');
assert(source.includes('value: stats.linkedToCase'), 'Historia must use stats.linkedToCase.');
assert(source.includes('value: stats.trash'), 'Kosz must use stats.trash.');
assert(source.includes("setQuickFilter('active')"), 'Aktywne must set quick filter active.');
assert(source.includes("setQuickFilter('at-risk')"), 'Zagrozone must set quick filter at-risk.');
assert(source.includes("setQuickFilter('history')"), 'Historia must set quick filter history.');
assert(source.includes("setQuickFilter('all')"), 'Kosz must reset quick filter to all.');
assert(source.includes('setShowTrash(true)'), 'Kosz must enable trash view.');

const simpleIndex = source.indexOf('dataTestId="leads-simple-filters-card"');
const topIndex = source.indexOf('title="Najcenniejsze leady"');
assert(simpleIndex >= 0 && topIndex >= 0 && simpleIndex < topIndex, 'Filtry proste must render before Najcenniejsze leady.');

console.log('OK tests/stage82-leads-simple-filters-card.test.cjs');
