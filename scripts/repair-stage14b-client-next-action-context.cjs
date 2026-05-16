const fs = require('node:fs');
const path = require('node:path');

const repo = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
const clientPath = path.join(repo, 'src/pages/ClientDetail.tsx');
const cssPath = path.join(repo, 'src/styles/visual-stage12-client-detail-vnext.css');

function read(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`Brak pliku: ${path.relative(repo, filePath)}`);
  return fs.readFileSync(filePath, 'utf8');
}
function write(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
}
function replaceOnce(source, pattern, replacement, label) {
  if (pattern instanceof RegExp) {
    if (!pattern.test(source)) throw new Error(`Nie znaleziono miejsca patcha: ${label}`);
    pattern.lastIndex = 0;
    return source.replace(pattern, replacement);
  }
  if (!source.includes(pattern)) throw new Error(`Nie znaleziono miejsca patcha: ${label}`);
  return source.replace(pattern, replacement);
}

let client = read(clientPath);
let css = read(cssPath);

if (!client.includes('STAGE14B_CLIENT_NEXT_ACTION_CONTEXT')) {
  client = client.replace(
    '/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */',
    '/* STAGE14B_CLIENT_NEXT_ACTION_CONTEXT */\n/* STAGE56_CASE_QUICK_ACTIONS_DICTATION_DEDUPE */'
  );
}

if (!client.includes('STAGE14B_CLIENT_NEXT_ACTION_CONTEXT_GUARD')) {
  client = replaceOnce(
    client,
    "const STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD = 'STAGE14A Repair2 removes side add-note quick action and hardens visible notes/history';\nvoid STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD;",
    "const STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD = 'STAGE14A Repair2 removes side add-note quick action and hardens visible notes/history';\nvoid STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD;\n\nconst STAGE14B_CLIENT_NEXT_ACTION_CONTEXT_GUARD = 'STAGE14B ClientDetail nearest planned action shows Sprawa or Lead context';\nvoid STAGE14B_CLIENT_NEXT_ACTION_CONTEXT_GUARD;",
    'Stage14B guard const'
  );
}

if (!client.includes('contextTitle?: string;')) {
  client = replaceOnce(
    client,
    "  relationId?: string;\n  tone: 'red' | 'amber' | 'blue' | 'emerald' | 'slate';",
    "  relationId?: string;\n  contextKind?: 'case' | 'lead';\n  contextTitle?: string;\n  contextTo?: string;\n  tone: 'red' | 'amber' | 'blue' | 'emerald' | 'slate';",
    'ClientNextAction context fields'
  );
}

const helperBlock = `
function getStage14BLeadTitle(lead: any) {
  return (
    asText(lead?.title) ||
    asText(lead?.name) ||
    asText(lead?.contactName) ||
    asText(lead?.contact_name) ||
    asText(lead?.clientName) ||
    asText(lead?.client_name) ||
    asText(lead?.company) ||
    asText(lead?.companyName) ||
    asText(lead?.company_name) ||
    'Lead'
  );
}

function readStage14BRelationId(item: any, keys: string[]) {
  const payload = item?.payload && typeof item.payload === 'object' ? item.payload : {};
  for (const key of keys) {
    const direct = asText(item?.[key]);
    if (direct) return direct;
    const nested = asText((payload as any)?.[key]);
    if (nested) return nested;
  }
  return '';
}

function getClientNextActionContextStage14B(item: any, leads: any[], cases: any[]) {
  const caseId = readStage14BRelationId(item, ['caseId', 'case_id', 'relatedCaseId', 'related_case_id']);
  const leadId = readStage14BRelationId(item, ['leadId', 'lead_id', 'relatedLeadId', 'related_lead_id']);
  const caseRecord = caseId
    ? cases.find((caseItem) => String(caseItem?.id || '').trim() === caseId)
    : null;

  if (caseRecord) {
    const contextTitle = getCaseTitle(caseRecord);
    return contextTitle
      ? { contextKind: 'case' as const, contextTitle, contextTo: \`/cases/\${caseId}\` }
      : {};
  }

  const leadRecord = leadId
    ? leads.find((leadItem) => String(leadItem?.id || '').trim() === leadId)
    : null;

  if (leadRecord) {
    const contextTitle = getStage14BLeadTitle(leadRecord);
    return contextTitle
      ? { contextKind: 'lead' as const, contextTitle, contextTo: \`/leads/\${leadId}\` }
      : {};
  }

  return {};
}

function renderClientNextActionContextStage14B(action: ClientNextAction) {
  const contextTitle = asText(action?.contextTitle);
  if (!contextTitle) return null;
  const normalized = contextTitle.toLowerCase();
  if (normalized === 'undefined' || normalized === 'null' || normalized === 'brak') return null;

  const label = action.contextKind === 'case' ? 'Sprawa' : 'Lead';
  return (
    <p className="client-detail-next-action-context" title={contextTitle}>
      {label}: {contextTitle}
    </p>
  );
}
`;

if (!client.includes('getClientNextActionContextStage14B')) {
  client = replaceOnce(
    client,
    "function getCaseValueLabel(caseRecord: any) {",
    `${helperBlock}\nfunction getCaseValueLabel(caseRecord: any) {`,
    'Stage14B context helpers before getCaseValueLabel'
  );
}

if (!client.includes('nearestActionContextStage14B')) {
  client = replaceOnce(
    client,
    "    const targetCaseId = String(nearest.caseId || '');\n    const targetLeadId = String(nearest.leadId || '');",
    "    const targetCaseId = String(nearest.caseId || '');\n    const targetLeadId = String(nearest.leadId || '');\n    const nearestActionContextStage14B = getClientNextActionContextStage14B(nearest, leads, cases);",
    'nearest action context lookup'
  );
}

if (!client.includes('...nearestActionContextStage14B')) {
  client = replaceOnce(
    client,
    "      to: targetCaseId ? `/cases/${targetCaseId}` : targetLeadId ? `/leads/${targetLeadId}` : '/today',\n      tone: 'amber',",
    "      to: targetCaseId ? `/cases/${targetCaseId}` : targetLeadId ? `/leads/${targetLeadId}` : '/today',\n      ...nearestActionContextStage14B,\n      tone: 'amber',",
    'nearest action return context spread'
  );
}

if (!client.includes('renderClientNextActionContextStage14B(clientNextAction)')) {
  const patterns = [
    {
      pattern: /(<p>\{clientNextAction\.subtitle\}<\/p>)/,
      replacement: `$1\n              {renderClientNextActionContextStage14B(clientNextAction)}`,
      label: 'next action subtitle paragraph',
    },
    {
      pattern: /(<small>\{clientNextAction\.subtitle\}<\/small>)/,
      replacement: `$1\n              {renderClientNextActionContextStage14B(clientNextAction)}`,
      label: 'next action subtitle small',
    },
    {
      pattern: /(\{clientNextAction\.subtitle\})/,
      replacement: `$1\n              {renderClientNextActionContextStage14B(clientNextAction)}`,
      label: 'next action subtitle fallback',
    },
  ];
  let patched = false;
  for (const entry of patterns) {
    if (entry.pattern.test(client)) {
      client = client.replace(entry.pattern, entry.replacement);
      patched = true;
      break;
    }
  }
  if (!patched) throw new Error('Nie znaleziono renderu clientNextAction.subtitle do dopi\u0119cia kontekstu.');
}

const cssBlock = `

/* STAGE14B_CLIENT_NEXT_ACTION_CONTEXT */
.client-detail-next-action-context {
  margin: 0.25rem 0 0;
  color: var(--cf-muted-text, #64748b);
  font-size: 0.82rem;
  line-height: 1.35;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`;
if (!css.includes('STAGE14B_CLIENT_NEXT_ACTION_CONTEXT')) {
  css = `${css.replace(/\s*$/u, '')}${cssBlock}`;
}

write(clientPath, client);
write(cssPath, css);

console.log('OK: Stage14B ClientDetail nearest action context patch applied.');
