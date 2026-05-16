const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const leadPath = path.join(repo, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage14-lead-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Brak pliku: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8');
}

function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) throw new Error('Brak: ' + label + ' (' + needle + ')');
}

function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) throw new Error('Zakazany fragment po 14F Repair1: ' + label + ' (' + needle + ')');
}

const source = read(leadPath);
const css = read(cssPath);

assertIncludes(source, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP', 'bazowy marker Stage14F');
assertIncludes(source, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR1_BUILD_FIX', 'marker Repair1 build fix');
assertNotIncludes(source, "serviceCaseStatusLabel : 'Brak powi\u0105zanej sprawy}</small>", 'uszkodzony literal linked case');
assertNotIncludes(source, "'Brak powi\u0105zanej sprawy}</small>", 'brakuj\u0105cy apostrof w linked case empty state');
assertNotIncludes(source, 'Co tu trzeba zrobi\u0107 teraz', 'zb\u0119dny tytu\u0142 work-center');
assertNotIncludes(source, 'Kr\u00F3tki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.', 'zb\u0119dny opis work-center');
assertNotIncludes(source, 'Brak zaplanowanych dzia\u0142a\u0144.', 'stary pusty opis najbli\u017Cszej akcji');
assertNotIncludes(source, 'Brak zaplanowanych dzia\u0142a\u0144', 'stary pusty opis najbli\u017Cszej akcji bez kropki');
assertIncludes(source, 'data-lead-next-action-empty="-"', 'marker pustej najbli\u017Cszej akcji');
assertIncludes(source, 'leadRiskReasonStage14F', '\u017Ar\u00F3d\u0142o powodu ryzyka');
assertIncludes(source, 'Pow\u00F3d: -', 'fallback powodu ryzyka');
assertIncludes(source, 'data-lead-start-service', 'widoczny przycisk startu obs\u0142ugi');
assertIncludes(source, 'cf-action-button-primary', 'primary action class dla startu obs\u0142ugi');
assertIncludes(source, 'Lead aktywny.', 'skr\u00F3cony opis statusu leada');
assertIncludes(css, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP', 'CSS override Stage14F');
assertIncludes(css, '[data-lead-start-service]', 'CSS widoczno\u015Bci przycisku startu obs\u0142ugi');
assertIncludes(css, 'overflow-wrap: anywhere', 'CSS przeciw ucinaniu tekstu');

console.log('\u2714 Stage14F Repair1 LeadDetail build fix guard passed');
