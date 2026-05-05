const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
const leadDetail = fs.readFileSync(path.join(repo, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');

test('Stage84 LeadDetail exposes work center contract with clean Polish copy', () => {
  assert.match(leadDetail, /STAGE84_LEAD_DETAIL_WORK_CENTER/);
  assert.match(leadDetail, /data-stage="stage84-lead-detail-work-center"/);
  assert.match(leadDetail, /Centrum pracy leada/);
  assert.match(leadDetail, /Ostatni ruch/);
  assert.match(leadDetail, /Dni bez ruchu/);
  assert.match(leadDetail, /Najbliższa akcja/);
  assert.match(leadDetail, /Powód ryzyka/);
  assert.match(leadDetail, /Otwórz sprawę/);
  assert.match(leadDetail, /Dopisz notatkę/);
  assert.match(leadDetail, /Oferta wysłana/);
  assert.doesNotMatch(leadDetail, /NajbliĹĽsza|PowĂłd|OtwĂłrz|sprawÄ™|notatkÄ™|wysĹ‚ana/);
});

test('Stage84 styles are present', () => {
  assert.match(css, /STAGE84_LEAD_DETAIL_WORK_CENTER/);
  assert.match(css, /\.lead-detail-work-center/);
});
