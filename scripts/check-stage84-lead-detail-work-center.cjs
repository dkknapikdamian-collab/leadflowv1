const fs = require('fs');
const path = require('path');

const repo = process.cwd();
function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
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

['NajbliĹĽsza', 'PowĂłd', 'OtwĂłrz', 'sprawÄ™', 'notatkÄ™', 'wysĹ‚ana'].forEach((text) => assertNotContains(leadDetail, text));

assertContains(css, 'STAGE84_LEAD_DETAIL_WORK_CENTER');
assertContains(css, '.lead-detail-work-center');
assertContains(doc, 'Stage84');
assertContains(doc, 'Lead Detail jako centrum pracy');

console.log('PASS STAGE84_LEAD_DETAIL_WORK_CENTER');
