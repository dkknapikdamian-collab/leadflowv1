const fs = require('node:fs');
const path = require('node:path');
const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const leadPath = path.join(repo, 'src/pages/LeadDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage14-lead-detail-vnext.css');
function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error('Missing file: ' + path.relative(repo, filePath));
  return fs.readFileSync(filePath, 'utf8');
}
function must(source, needle, label) {
  if (!source.includes(needle)) throw new Error('Missing ' + label + ': ' + needle);
}
function mustNot(source, needle, label) {
  if (source.includes(needle)) throw new Error('Forbidden ' + label + ': ' + needle);
}
const lead = read(leadPath);
const css = read(cssPath);
const pow = 'Pow\u00f3d';
const noPlanned = 'Brak zaplanowanych dzia\u0142a\u0144';
must(lead, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP', 'base stage marker');
must(lead, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP_REPAIR7_FINALIZE', 'Repair7 marker');
must(lead, 'data-lead-next-action-empty="-"', 'empty next action marker');
must(lead, pow + ': -', 'risk reason dash fallback');
must(lead, 'leadRiskReasonStage14F', 'risk reason source');
must(lead, 'data-lead-start-service', 'start service marker');
must(lead, 'cf-action-button-primary', 'start service primary class');
must(lead, 'Lead aktywny.', 'short active lead status');
mustNot(lead, 'Co tu trzeba zrobi\u0107 teraz', 'old right rail title');
mustNot(lead, 'Kr\u00f3tki panel decyzyjny bez skakania po zadaniach, kalendarzu i historii.', 'old right rail description');
mustNot(lead, noPlanned, 'old no planned action text');
mustNot(lead, "'Brak powi\u0105zanej sprawy}</small>", 'broken linked case literal');
must(css, 'STAGE14F_LEAD_DETAIL_RIGHT_RAIL_CLEANUP', 'base CSS stage marker');
must(css, 'STAGE14F_REPAIR7_FINALIZE_RIGHT_RAIL', 'Repair7 CSS marker');
must(css, '[data-lead-next-action-empty="-"]', 'CSS empty action marker');
must(css, 'overflow-wrap: anywhere', 'text wrapping guard');
console.log('OK: Stage14F Repair7 inline guard passed');
