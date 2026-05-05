const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function chars() {
  return String.fromCharCode.apply(String, arguments);
}
function assertContains(file, text) {
  const body = read(file);
  if (!body.includes(text)) {
    console.error('FAIL ' + file + ': missing ' + text);
    process.exit(1);
  }
  console.log('PASS ' + file + ': contains ' + text);
}
function assertNotContains(file, text) {
  const body = read(file);
  if (body.includes(text)) {
    console.error('FAIL ' + file + ': contains forbidden mojibake ' + text);
    process.exit(1);
  }
}

const leadDetail = 'src/pages/LeadDetail.tsx';
const css = 'src/styles/visual-stage14-lead-detail-vnext.css';
const doc = 'docs/release/STAGE84_LEAD_DETAIL_WORK_CENTER_2026-05-05.md';

[
  'STAGE84_LEAD_DETAIL_WORK_CENTER',
  'data-stage="stage84-lead-detail-work-center"',
  'Centrum pracy leada',
  'Ostatni ruch',
  'Dni bez ruchu',
  'Najbliższa akcja',
  'Powód ryzyka',
  'Otwórz sprawę',
  'Dopisz notatkę',
  'Oferta wysłana',
  'lead-detail-note-box',
].forEach((text) => assertContains(leadDetail, text));

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
forbiddenMojibakePatterns.forEach((text) => assertNotContains(leadDetail, text));

assertContains(css, 'STAGE84_LEAD_DETAIL_WORK_CENTER');
assertContains(css, '.lead-detail-work-center');
assertContains(doc, 'Stage84');
assertContains(doc, 'Lead Detail jako centrum pracy');

console.log('PASS STAGE84_LEAD_DETAIL_WORK_CENTER');
