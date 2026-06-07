const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/closeflow-lead-detail-sales-signal-stage227e4.css', 'utf8');

test('Stage227E4R3 removes runtime helper explanation copy from sales context', () => {
  assert.ok(lead.includes('STAGE227E4R3_RUNTIME_COPY_CLEANUP'));
  assert.ok(lead.includes('Kontekst sprzedażowy'));
  assert.doesNotMatch(lead, /Krótko: co pomaga wykonać następny ruch/);
  assert.doesNotMatch(lead, /Najbliższe zadania, wydarzenia i braki przypięte/);
  assert.doesNotMatch(lead, /Krótki kontekst z utworzenia leada/);
  assert.doesNotMatch(lead, /Lekki kontekst/);
});

test('Stage227E4R3 does not render item hints in context cards', () => {
  assert.doesNotMatch(lead, /<p>\{item\.hint\}<\/p>/);
  assert.doesNotMatch(lead, /Jest jasny powód pracy z leadem\./);
  assert.doesNotMatch(lead, /Jest termin, pilność albo konkretny następny ruch\./);
  assert.doesNotMatch(lead, /Jest budżet albo potencjał sprzedaży\./);
  assert.doesNotMatch(lead, /Jest informacja o decyzji lub decydencie\./);
  assert.doesNotMatch(lead, /Widać ryzyko, brak albo blokadę\./);
});

test('Stage227E4R3 keeps only movement-driving context fields', () => {
  for (const label of ['Potrzeba / problem', 'Termin / pilność', 'Budżet / potencjał', 'Decyzja', 'Blokada']) {
    assert.ok(lead.includes(label), `missing ${label}`);
  }
  assert.doesNotMatch(lead, /Powód kontaktu/);
});

test('Stage227E4R3 keeps context styling compact', () => {
  assert.ok(css.includes('STAGE227E4R3_RUNTIME_COPY_CLEANUP_CSS'));
  assert.ok(css.includes('lead-detail-sales-context-card'));
  assert.ok(!css.includes('min-height: 126px'));
});
