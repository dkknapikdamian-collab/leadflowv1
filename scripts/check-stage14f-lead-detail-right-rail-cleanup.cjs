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
assertNotIncludes(source, "serviceCaseStatusLabel : 'Brak powiązanej sprawy}</small>", 'uszkodzony literal linked case');
assertNotIncludes(source, "'Brak powiązanej sprawy}</small>", 'brakujący apostrof w linked case empty state');
assertNotIncludes(source, 'Co tu trzeba zrobić teraz', 'zbędny tytuł work-center');
assertNotIncludes(source, 'Krótki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.', 'zbędny opis work-center');
assertNotIncludes(source, 'Brak zaplanowanych działań.', 'stary pusty opis najbliższej akcji');
assertNotIncludes(source, 'Brak zaplanowanych działań', 'stary pusty opis najbliższej akcji bez kropki');
assertIncludes(source, 'data-lead-next-action-empty="-"', 'marker pustej najbliższej akcji');
assertIncludes(source, 'leadRiskReasonStage14F', 'źródło powodu ryzyka');
assertIncludes(source, 'Powód: -', 'fallback powodu ryzyka');
assertIncludes(source, 'data-lead-start-service', 'widoczny przycisk startu obsługi');
assertIncludes(source, 'cf-action-button-primary', 'primary action class dla startu obsługi');
assertIncludes(source, 'Lead aktywny.', 'skrócony opis statusu leada');
assertIncludes(css, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP', 'CSS override Stage14F');
assertIncludes(css, '[data-lead-start-service]', 'CSS widoczności przycisku startu obsługi');
assertIncludes(css, 'overflow-wrap: anywhere', 'CSS przeciw ucinaniu tekstu');

console.log('✔ Stage14F Repair1 LeadDetail build fix guard passed');
