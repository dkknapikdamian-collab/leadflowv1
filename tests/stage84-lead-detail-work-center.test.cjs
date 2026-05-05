const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = process.cwd();

test('Stage84 LeadDetail exposes work center contract', () => {
  const leadDetail = fs.readFileSync(path.join(root, 'src/pages/LeadDetail.tsx'), 'utf8');
  assert.match(leadDetail, /STAGE84_LEAD_DETAIL_WORK_CENTER/);
  assert.match(leadDetail, /leadWorkCenter/);
  assert.match(leadDetail, /data-stage="stage84-lead-detail-work-center"/);
  assert.match(leadDetail, /Centrum pracy leada/);
  assert.match(leadDetail, /Ostatni ruch/);
  assert.match(leadDetail, /Dni bez ruchu/);
  assert.match(leadDetail, /NajbliĹĽsza akcja/);
  assert.match(leadDetail, /PowĂłd ryzyka/);
});

test('Stage84 styles are present', () => {
  const css = fs.readFileSync(path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');
  assert.match(css, /STAGE84_LEAD_DETAIL_WORK_CENTER/);
  assert.match(css, /\.lead-detail-work-center/);
  assert.match(css, /\.lead-detail-work-risk-danger/);
});