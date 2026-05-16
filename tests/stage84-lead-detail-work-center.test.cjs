const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const repo = path.join(__dirname, '..');
function chars() {
  return String.fromCharCode.apply(String, arguments);
}
const leadDetail = fs.readFileSync(path.join(repo, 'src/pages/LeadDetail.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repo, 'src/styles/visual-stage14-lead-detail-vnext.css'), 'utf8');

test('Stage84 LeadDetail exposes work center contract with clean Polish copy', () => {
  assert.match(leadDetail, /STAGE84_LEAD_DETAIL_WORK_CENTER/);
  assert.match(leadDetail, /data-stage="stage84-lead-detail-work-center"/);
  assert.match(leadDetail, /Centrum pracy leada/);
  assert.match(leadDetail, /Ostatni ruch/);
  assert.match(leadDetail, /Dni bez ruchu/);
  assert.match(leadDetail, /Najbli\u017Csza zaplanowana akcja/);
  assert.match(leadDetail, /Pow\u00F3d ryzyka/);
  assert.match(leadDetail, /Otw\u00F3rz spraw\u0119/);
  assert.match(leadDetail, /Dopisz notatk\u0119/);
  assert.match(leadDetail, /Oferta wys\u0142ana/);
const forbiddenMojibakePatterns = [
    chars(0x0139),
    chars(0x00c4),
    chars(0x0102),
    chars(0x00e2, 0x20ac),
    chars(0x00c5, 0x00bc),
    chars(0x00c5, 0x00ba),
    chars(0x00c5, 0x201a),
    chars(0x00c5, 0x201e),
    chars(0x00c5, 0x203a),
    chars(0x00c3, 0x00b3),
  ];
  assert.equal(
    forbiddenMojibakePatterns.some((pattern) => leadDetail.includes(pattern)),
    false,
    'LeadDetail.tsx must not contain mojibake markers',
  );
});

test('Stage84 styles are present', () => {
  assert.match(css, /STAGE84_LEAD_DETAIL_WORK_CENTER/);
  assert.match(css, /\.lead-detail-work-center/);
});
