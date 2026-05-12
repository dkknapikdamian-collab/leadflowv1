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
  if (source.includes(needle)) throw new Error('Zakazany fragment po 14F: ' + label + ' (' + needle + ')');
}

const lead = read(leadPath);
const css = read(cssPath);

assertIncludes(lead, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP', 'guard Stage14F w LeadDetail');
assertIncludes(css, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP', 'guard Stage14F w CSS');
assertNotIncludes(lead, 'Co tu trzeba zrobić teraz', 'usunięte noisy copy');
assertNotIncludes(lead, 'Krótki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.', 'usunięty opis panelu decyzyjnego');
assertNotIncludes(lead, 'Brak zaplanowanych działań', 'brak akcji ma być pauzą');
assertIncludes(lead, "Powód: {leadRiskReasonStage14F || '-'}", 'fallback powodu ryzyka');
assertIncludes(lead, 'data-lead-start-service', 'widoczny marker przycisku Rozpocznij obsługę');
assertIncludes(lead, 'cf-action-button cf-action-button-primary', 'klasa widocznego przycisku startu obsługi');
assertIncludes(lead, 'data-lead-next-action-empty="-"', 'marker pustej najbliższej akcji');
assertIncludes(lead, 'Lead aktywny.', 'skrócony opis statusu aktywnego leada');
assertNotIncludes(lead, 'Lead aktywny. Możesz prowadzić kontakt sprzedażowy.', 'stary długi opis statusu leada');
assertIncludes(css, '.lead-detail-vnext-page .lead-detail-right-card p', 'lokalny override tekstów w prawym railu');
assertIncludes(css, 'overflow-wrap: anywhere !important;', 'tekst w prawym railu nie ucina się agresywnie');
assertIncludes(css, 'white-space: normal !important;', 'teksty w kartach mogą się łamać');
assertIncludes(css, '[data-one-line="true"]', 'jednowierszowość tylko jawnie oznaczona');
assertIncludes(css, '[data-lead-start-service]', 'CSS widoczności start service');
assertIncludes(css, 'visibility: visible !important;', 'button nie znika');
assertIncludes(css, '[data-lead-next-action-empty="-"]', 'CSS dla pauzy pustej akcji');

console.log('✔ Stage14F LeadDetail right rail cleanup guard passed');
