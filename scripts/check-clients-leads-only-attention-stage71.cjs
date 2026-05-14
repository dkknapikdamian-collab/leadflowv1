const fs = require('fs');
const path = require('path');

const root = process.cwd();
const file = path.join(root, 'src', 'pages', 'Clients.tsx');
const text = fs.readFileSync(file, 'utf8');

function fail(message) {
  console.error('CLIENTS_LEADS_ONLY_ATTENTION_STAGE71_FAIL:', message);
  process.exit(1);
}

if (!text.includes('STAGE74_CLIENTS_LEADS_TO_LINK_PANEL')) fail('missing stage marker');
if (!text.includes('const leadsNeedingClientOrCaseLink = useMemo')) fail('missing leads-to-link candidates source');
if (text.includes('const followupCandidates = useMemo')) fail('legacy client candidates source still exists');
if (!text.includes('data-clients-lead-attention-rail="true"')) fail('missing lead attention rail data marker');
if (!text.includes('Leady do spięcia')) fail('missing lead-only rail title');
if (text.includes('Klienci do uwagi')) fail('legacy client attention title still exists');
if (!text.includes("to={leadId ? '/leads/' + leadId : '/leads'}")) fail('lead attention rows do not link to lead detail');
if (!text.includes('Brak klienta') || !text.includes('Brak sprawy')) fail('missing relation gap labels');
if (!text.includes('leadsNeedingClientOrCaseLink.length ? leadsNeedingClientOrCaseLink.map')) fail('rail does not render lead candidates');

console.log('OK clients leads-only attention stage71');
