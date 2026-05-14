const fs = require('fs');
const path = require('path');

const root = process.cwd();
const clientsPath = path.join(root, 'src', 'pages', 'Clients.tsx');
const packagePath = path.join(root, 'package.json');
const clients = fs.readFileSync(clientsPath, 'utf8');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

function fail(message) {
  console.error('STAGE74_CLIENTS_LEADS_TO_LINK_PANEL_FAIL:', message);
  process.exit(1);
}

function requireToken(token, message) {
  if (!clients.includes(token)) fail(message || ('missing token: ' + token));
}

requireToken('data-clients-lead-attention-rail="true"', 'missing lead attention rail marker');
requireToken('const leadsNeedingClientOrCaseLink = useMemo', 'missing explicit lead-only data source');
requireToken('Leady do spięcia', 'missing final panel title');
requireToken('Brak klienta albo sprawy przy aktywnym temacie.', 'missing final panel subtitle');
requireToken('Brak leadów wymagających spięcia.', 'missing final empty state');
requireToken('data-right-rail-list="lead-attention"', 'missing right rail list marker');
requireToken('data-right-rail-row="lead-attention"', 'missing right rail row marker');
requireToken('right-list-row-main', 'missing shared right rail row layout');
requireToken('right-list-title', 'missing shared right rail title layout');
requireToken('right-list-meta', 'missing shared right rail meta layout');
requireToken('right-list-badges', 'missing shared right rail badge layout');
requireToken('right-list-pill right-list-pill-ok', 'missing ok relation pill');
requireToken('right-list-pill right-list-pill-warn', 'missing warn relation pill');

if (clients.includes('Klienci do uwagi')) fail('legacy client attention copy still present');
if (clients.includes('Relacje bez pełnego spięcia lead/sprawa.')) fail('legacy misleading subtitle still present');
if (clients.includes('Leady do uwagi')) fail('old vague lead attention copy still present');
if (clients.includes('const followupCandidates = useMemo')) fail('legacy client candidates source still exists');
if (clients.includes('const followupLeadCandidates = useMemo')) fail('old followupLeadCandidates source still exists; use leadsNeedingClientOrCaseLink');
if (clients.includes('followupLeadCandidates.length ? followupLeadCandidates.map')) fail('rail still renders old followupLeadCandidates');

const sourceStart = clients.indexOf('const leadsNeedingClientOrCaseLink = useMemo');
const sourceEnd = clients.indexOf('const resetNewClientForm', sourceStart);
if (sourceStart === -1 || sourceEnd === -1 || sourceEnd <= sourceStart) fail('cannot isolate lead-only candidate source block');
const block = clients.slice(sourceStart, sourceEnd);

if (!block.includes('(leads as Record<string, unknown>[])')) fail('candidate source does not iterate leads');
if (/return\s+clients\s*\./.test(block) || /clients\.filter\s*\(/.test(block)) fail('candidate source still filters clients');
if (!/status\s*===\s*['"]archived['"]/.test(block) || !/visibility\s*===\s*['"]trash['"]/.test(block)) {
  fail('candidate block does not exclude archived/trash leads');
}
if (!block.includes('getStage35RelationClientId(lead)')) fail('candidate block does not resolve client relation from lead');
if (!block.includes('caseLeadIds') || !block.includes('caseClientIds')) fail('candidate block does not inspect lead/case relation sets');
if (!/return\s+!clientId\s*\|\|\s*!hasCase/.test(block)) fail('candidate block does not keep leads missing client or case link');

const renderStart = clients.indexOf('data-clients-lead-attention-rail="true"');
const renderEnd = clients.indexOf('</aside>', renderStart);
if (renderStart === -1 || renderEnd === -1 || renderEnd <= renderStart) fail('cannot isolate lead attention rail render block');
const renderBlock = clients.slice(renderStart, renderEnd);
if (!renderBlock.includes('leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map')) fail('rail does not render leadsNeedingClientOrCaseLink');
if (!renderBlock.includes("to={leadId ? '/leads/' + leadId : '/leads'}")) fail('lead attention rows do not link to lead detail');
if (renderBlock.includes('client.name') || renderBlock.includes('client.company')) fail('rail render block still reads client row fields');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
if (!prebuild.includes('check-stage74-clients-leads-to-link-panel.cjs')) fail('prebuild does not include Stage74 guard');
if (!pkg.scripts || pkg.scripts['check:stage74-clients-leads-to-link-panel'] !== 'node scripts/check-stage74-clients-leads-to-link-panel.cjs') {
  fail('missing package script check:stage74-clients-leads-to-link-panel');
}

console.log('OK stage74 clients leads-to-link panel');
