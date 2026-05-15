const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');

const required = [
  'LEAD_STATUS_LABELS_STAGE77',
  'Nowy',
  'Oferta wysĹ‚ana',
  'Czeka na odpowiedĹş',
  'Przegrany',
  'function statusLabel(status?: string)',
  'function statusClass(status?: string)',
];

for (const needle of required) {
  assert.ok(source.includes(needle), `Missing exact Stage77 label/marker: ${needle}`);
}

const statusOptionsCount = (source.match(/const STATUS_OPTIONS\s*=\s*\[/g) || []).length;
assert.equal(statusOptionsCount, 1, 'LeadDetail should keep one STATUS_OPTIONS block');
console.log('OK LeadDetail Stage77 exact status labels');
