const assert = require('assert');
const fs = require('fs');
const test = require('node:test');

const lead = fs.readFileSync('src/pages/LeadDetail.tsx', 'utf8');
const css = fs.readFileSync('src/styles/visual-stage14-lead-detail-vnext.css', 'utf8');

function headerBlock() {
  const start = lead.indexOf('data-stage227e1-header-phone-visibility="true"');
  const end = lead.indexOf('</header>', start);
  assert.ok(start >= 0, 'Stage227E1 header marker missing');
  assert.ok(end > start, 'Stage227E1 header block missing');
  return lead.slice(start, end);
}

test('Stage227E1 exposes phone in the first visible header data line', () => {
  const header = headerBlock();
  assert.ok(lead.includes('STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY'));
  assert.ok(header.includes('data-stage227e1-header-phone="true"'));
  assert.ok(header.includes("lead.phone || 'Brak telefonu'"));
  assert.ok(header.includes("copyValue('Telefon'"));
});

test('Stage227E1 header has source, email, company and last contact as compact data, not a combined contact field', () => {
  const header = headerBlock();
  for (const marker of [
    'data-stage227e1-header-source="true"',
    'data-stage227e1-header-email="true"',
    'data-stage227e1-header-company="true"',
    'data-stage227e1-header-last-contact="true"',
  ]) {
    assert.ok(header.includes(marker), `missing ${marker}`);
  }

  assert.doesNotMatch(header, /Kontakt: \{lead\.phone \|\| lead\.email/);
  assert.doesNotMatch(header, /Zrodlo:/);
  assert.doesNotMatch(header, /Ostatnia aktywnosc:/);
  assert.doesNotMatch(header, /Brak kontaktu/);
});

test('Stage227E1 has CSS contract for visible header contact data', () => {
  assert.ok(css.includes('STAGE227E1_LEAD_HEADER_PHONE_VISIBILITY'));
  assert.ok(css.includes('.lead-detail-header-contact-grid'));
  assert.ok(css.includes('.lead-detail-header-phone-item'));
  assert.ok(css.includes('.lead-detail-header-contact-grid .lead-detail-header-meta-item button'));
});
