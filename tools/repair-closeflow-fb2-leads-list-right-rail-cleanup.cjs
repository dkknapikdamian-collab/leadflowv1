const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const marker = 'CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP';

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8').replace(/^\uFEFF/, '');
}

function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text, 'utf8');
  console.log('patched:', rel);
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

const leadsRel = 'src/pages/Leads.tsx';
let leads = read(leadsRel);

if (!leads.includes(marker)) {
  leads = leads.replace(
    '// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER',
    '// CLOSEFLOW_A2_DUPLICATE_WARNING_UX_FINALIZER\n// CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP',
  );
}

const compactMetaRe = /function buildLeadCompactMeta\(lead: any, linkedCase: CaseRecord \| undefined, sourceLabel: string, leadValueLabel: string = ''\) \{[\s\S]*?\n\}/;
const compactMetaNext = `function buildLeadCompactMeta(lead: any, linkedCase: CaseRecord | undefined, sourceLabel: string, leadValueLabel: string = '') {
  // CLOSEFLOW_FB2_LEADS_PHONE_SINGLE_SOURCE: kontakt jest pokazywany raz w sekcji kontaktu, bez drugiego "Telefon: ..." w meta.
  const company = String(lead?.company || '').trim();
  const caseLabel = linkedCase ? 'sprawa: ' + (linkedCase.title || 'otwarta') : '';

  return [
    sourceLabel,
    leadValueLabel,
    company,
    caseLabel,
  ].filter(Boolean).join(' · ');
}`;
ensure(compactMetaRe.test(leads), `${leadsRel}: buildLeadCompactMeta not found`);
leads = leads.replace(compactMetaRe, compactMetaNext);

const relationBlockRe = /  \/\/ RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS[\s\S]*?  const relationFunnelValue = useMemo\(\n    \(\) => buildRelationFunnelValue\(\{ leads: activeLeads, clients \}\),\n    \[activeLeads, clients\],\n  \);/;
const relationBlockNext = `  // RELATION_FUNNEL_SUM_FROM_ACTIVE_LEADS_AND_CLIENTS
  const relationValueEntries = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients, cases }),
    [activeLeads, clients, cases],
  );

  // CLOSEFLOW_FB2_RIGHT_RAIL_LEADS_ONLY: right rail pokazuje tylko aktywne leady, bez klientów i spraw.
  const mostValuableRelations = useMemo(
    () => buildRelationValueEntries({ leads: activeLeads, clients: [], cases: [] }).slice(0, 5),
    [activeLeads],
  );

  const relationFunnelValue = useMemo(
    () => buildRelationFunnelValue({ leads: activeLeads, clients }),
    [activeLeads, clients],
  );`;
ensure(relationBlockRe.test(leads), `${leadsRel}: relation value block not found`);
leads = leads.replace(relationBlockRe, relationBlockNext);

const textReplacements = new Map([
  ['Najcenniejsze relacje', 'Najcenniejsze leady'],
  ['Najcenniejsze kontakty', 'Najcenniejsze leady'],
  ['Najcenniejsi klienci', 'Najcenniejsze leady'],
  ['najcenniejsze relacje', 'najcenniejsze leady'],
]);
for (const [from, to] of textReplacements) {
  leads = leads.split(from).join(to);
}

// Usuwa tylko przegadany prefiks, nie usuwa pola telefonu ani labela formularza "Telefon".
leads = leads.replace(/Telefon:\s*/g, '');

if (!leads.includes('Najcenniejsze leady')) {
  leads = leads.replace(
    /(<h2[^>]*>)([^<]*Najcenniejsze[^<]*)(<\/h2>)/,
    '$1Najcenniejsze leady$3',
  );
}

write(leadsRel, leads);

const cssRel = 'src/styles/closeflow-list-row-tokens.css';
let css = read(cssRel);
const cssPatch = `
/* CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP
   Right rail lead value rows: lead-only list, stable text fit, no short-word breaking.
*/
.main-leads-html .right-card,
.main-leads-html .right-card *,
.main-leads-html [data-fb2-leads-right-rail],
.main-leads-html [data-fb2-leads-right-rail] * {
  min-width: 0;
}

.main-leads-html .right-card a,
.main-leads-html .right-card button,
.main-leads-html .right-card article,
.main-leads-html [data-fb2-leads-right-rail] a,
.main-leads-html [data-fb2-leads-right-rail] button,
.main-leads-html [data-fb2-leads-right-rail] article {
  max-width: 100%;
  overflow: hidden;
}

.main-leads-html .right-card h3,
.main-leads-html .right-card strong,
.main-leads-html .right-card p,
.main-leads-html [data-fb2-leads-right-rail] h3,
.main-leads-html [data-fb2-leads-right-rail] strong,
.main-leads-html [data-fb2-leads-right-rail] p {
  overflow-wrap: normal;
  word-break: normal;
  hyphens: manual;
}

.main-leads-html .right-card h3,
.main-leads-html .right-card p,
.main-leads-html [data-fb2-leads-right-rail-name],
.main-leads-html .fb2-lead-right-rail-name {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.main-leads-html [data-fb2-leads-right-rail-amount],
.main-leads-html .fb2-lead-right-rail-amount {
  flex: 0 0 auto;
  white-space: nowrap;
}
`;
if (!css.includes('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP')) {
  css = css.trimEnd() + '\n\n' + cssPatch.trim() + '\n';
  write(cssRel, css);
} else {
  console.log('already patched:', cssRel);
}

// Final assertions before guard.
leads = read(leadsRel);
css = read(cssRel);
ensure(leads.includes(marker), `${leadsRel}: missing marker`);
ensure(leads.includes('CLOSEFLOW_FB2_RIGHT_RAIL_LEADS_ONLY'), `${leadsRel}: missing lead-only right rail marker`);
ensure(leads.includes("buildRelationValueEntries({ leads: activeLeads, clients: [], cases: [] })"), `${leadsRel}: right rail not lead-only`);
ensure(!leads.includes('Najcenniejsze relacje'), `${leadsRel}: old right rail label still present`);
ensure(!leads.includes('Telefon:'), `${leadsRel}: duplicated phone prefix still present`);
ensure(css.includes('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP'), `${cssRel}: missing css marker`);
ensure(css.includes('min-width: 0'), `${cssRel}: missing min-width 0`);
ensure(css.includes('-webkit-line-clamp: 2'), `${cssRel}: missing line clamp`);
ensure(css.includes('word-break: normal'), `${cssRel}: missing no short-word breaking`);

console.log('CLOSEFLOW_FB2_LEADS_LIST_RIGHT_RAIL_CLEANUP_PATCH_OK');
