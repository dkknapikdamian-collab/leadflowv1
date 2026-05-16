const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const clientPath = path.join(repo, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function assertIncludes(source, needle, label) {
  if (!source.includes(needle)) throw new Error(`Brak: ${label} (${needle})`);
}
function assertNotIncludes(source, needle, label) {
  if (source.includes(needle)) throw new Error(`Zakazany fragment: ${label} (${needle})`);
}

const client = read(clientPath);
const css = read(cssPath);

assertIncludes(client, 'STAGE14B_CLIENT_NEXT_ACTION_CONTEXT', 'guard Stage14B w ClientDetail');
assertIncludes(client, 'contextKind?:', 'ClientNextAction.contextKind');
assertIncludes(client, 'contextTitle?: string;', 'ClientNextAction.contextTitle');
assertIncludes(client, 'contextTo?: string;', 'ClientNextAction.contextTo');
assertIncludes(client, 'getClientNextActionContextStage14B', 'helper kontekstu akcji');
assertIncludes(client, "['caseId', 'case_id', 'relatedCaseId', 'related_case_id']", 'obs\u0142uga caseId/case_id/relatedCaseId');
assertIncludes(client, "['leadId', 'lead_id', 'relatedLeadId', 'related_lead_id']", 'obs\u0142uga leadId/lead_id/relatedLeadId');
assertIncludes(client, 'nearestActionContextStage14B', 'lookup kontekstu nearestAction');
assertIncludes(client, '...nearestActionContextStage14B', 'dopi\u0119cie kontekstu do ClientNextAction');
assertIncludes(client, 'renderClientNextActionContextStage14B(clientNextAction)', 'render kontekstu na kafelku');
assertIncludes(client, "label = action.contextKind === 'case' ? 'Sprawa' : 'Lead'", 'etykieta Sprawa/Lead');
assertIncludes(client, "normalized === 'undefined'", 'blokada undefined');
assertIncludes(client, "normalized === 'brak'", 'blokada brak');
assertNotIncludes(client, 'Sprawa: undefined', 'nie wolno renderowa\u0107 Sprawa: undefined na sta\u0142e');
assertNotIncludes(client, 'Sprawa: brak', 'nie wolno renderowa\u0107 Sprawa: brak na sta\u0142e');

assertIncludes(css, 'STAGE14B_CLIENT_NEXT_ACTION_CONTEXT', 'guard Stage14B w CSS');
assertIncludes(css, '.client-detail-next-action-context', 'klasa CSS kontekstu akcji');
assertIncludes(css, 'text-overflow: ellipsis;', 'ellipsis dla d\u0142ugiej nazwy sprawy');
assertIncludes(css, 'white-space: nowrap;', 'jedna linia dla d\u0142ugiej nazwy sprawy');
assertIncludes(css, 'font-size: 0.82rem;', 'rozmiar zgodny ze specem');

console.log('\u2714 Stage14B ClientDetail next action context guard passed');
