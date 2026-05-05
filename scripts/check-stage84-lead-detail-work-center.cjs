const fs = require('fs');
const path = require('path');

const root = process.cwd();
const files = {
  leadDetail: path.join(root, 'src/pages/LeadDetail.tsx'),
  css: path.join(root, 'src/styles/visual-stage14-lead-detail-vnext.css'),
  doc: path.join(root, 'docs/release/STAGE84_LEAD_DETAIL_WORK_CENTER_2026-05-05.md'),
};

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${path.relative(root, file)}`);
  return fs.readFileSync(file, 'utf8');
}

function mustContain(name, text, needle) {
  if (!text.includes(needle)) throw new Error(`${name} missing: ${needle}`);
  console.log(`PASS ${name}: contains ${needle}`);
}

const leadDetail = read(files.leadDetail);
const css = read(files.css);
const doc = read(files.doc);

mustContain('LeadDetail.tsx', leadDetail, 'STAGE84_LEAD_DETAIL_WORK_CENTER');
mustContain('LeadDetail.tsx', leadDetail, 'data-stage="stage84-lead-detail-work-center"');
mustContain('LeadDetail.tsx', leadDetail, 'Centrum pracy leada');
mustContain('LeadDetail.tsx', leadDetail, 'Ostatni ruch');
mustContain('LeadDetail.tsx', leadDetail, 'Dni bez ruchu');
mustContain('LeadDetail.tsx', leadDetail, 'NajbliĹĽsza akcja');
mustContain('LeadDetail.tsx', leadDetail, 'PowĂłd ryzyka');
mustContain('LeadDetail.tsx', leadDetail, 'lead-detail-note-box');
mustContain('CSS', css, 'STAGE84_LEAD_DETAIL_WORK_CENTER');
mustContain('CSS', css, '.lead-detail-work-center');
mustContain('Release doc', doc, 'Stage84');
console.log('PASS STAGE84_LEAD_DETAIL_WORK_CENTER');