const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Stage115 LeadDetail uses shared client-style contact card source', () => {
  const component = read('src/components/entity-contact-card.tsx');
  const lead = read('src/pages/LeadDetail.tsx');
  const client = read('src/pages/ClientDetail.tsx');
  const leadCss = read('src/styles/visual-stage14-lead-detail-vnext.css');
  const sharedCss = read('src/styles/entity-contact-card.css');

  assert.match(component, /export function EntityContactInfoList/);
  assert.match(component, /client-detail-info-row/);
  assert.match(component, /client-detail-contact-list/);
  assert.match(component, /Kopiuj telefon/);
  assert.match(component, /Kopiuj email/);
  assert.match(component, /EventEntityIcon/);

  assert.ok(lead.includes("import EntityContactCard from '../components/entity-contact-card';"));
  assert.match(lead, /data-stage115-lead-contact-client-parity/);
  assert.match(lead, /<EntityContactCard/);
  assert.match(lead, /className="lead-detail-left-rail"/);
  assert.ok(!lead.includes('function InfoLine('));
  assert.doesNotMatch(lead, /lead-detail-contact-grid/);
  assert.doesNotMatch(lead, /lead-detail-info-line/);

  assert.ok(client.includes("import { EntityContactInfoList } from '../components/entity-contact-card';"));
  assert.match(client, /<EntityContactInfoList/);
  assert.ok(!client.includes('function InfoRow('));

  assert.ok(leadCss.includes('grid-template-columns: 300px minmax(0, 1fr) 310px'));
  assert.match(leadCss, /.lead-detail-left-rail/);
  assert.match(sharedCss, /STAGE115_LEAD_CONTACT_CLIENT_PARITY/);
});
