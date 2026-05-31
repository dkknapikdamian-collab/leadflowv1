#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const reportPath = '_project/reports/STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage216-A leads clients cases functional QA.md';

const STAGE = 'STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA';
const generatedAt = new Date().toISOString();

function exists(p) {
  return fs.existsSync(path.join(root, p));
}

function read(p) {
  return exists(p) ? fs.readFileSync(path.join(root, p), 'utf8') : '';
}

function ensureDirFor(filePath) {
  fs.mkdirSync(path.dirname(path.join(root, filePath)), { recursive: true });
}

const sourceFiles = {
  supabaseFallback: 'src/lib/supabase-fallback.ts',
  serverSupabase: 'src/server/_supabase.ts',
  apiLeads: 'api/leads.ts',
  apiClients: 'api/clients.ts',
  apiCases: 'api/cases.ts',
  leadsPage: 'src/pages/Leads.tsx',
  leadDetailPage: 'src/pages/LeadDetail.tsx',
  clientsPage: 'src/pages/Clients.tsx',
  clientDetailPage: 'src/pages/ClientDetail.tsx',
  casesPage: 'src/pages/Cases.tsx',
  caseDetailPage: 'src/pages/CaseDetail.tsx',
};

const contents = Object.fromEntries(Object.entries(sourceFiles).map(([key, value]) => [key, read(value)]));

function has(text, needle) {
  return String(text || '').includes(needle);
}

function sourceStatus(filePath, markers = []) {
  const text = read(filePath);
  if (!text) return 'MISSING_FILE';
  const missingMarkers = markers.filter((marker) => !has(text, marker));
  return missingMarkers.length ? `STATIC_GAP:${missingMarkers.join('|')}` : 'STATIC_PASS';
}

const modules = [
  {
    id: 'LCC-01',
    name: 'Leads list',
    entity: 'lead',
    api: '/api/leads',
    ui: '/leads',
    clientFunctions: ['fetchLeadsFromSupabase', 'insertLeadToSupabase', 'updateLeadInSupabase', 'deleteLeadFromSupabase', 'findEntityConflictsInSupabase'],
    apiFile: 'api/leads.ts',
    uiFile: 'src/pages/Leads.tsx',
    relationChecks: ['lead → client', 'lead → case via linked_case_id / start_service'],
    manual: [
      'Open /leads after hard refresh.',
      'Create a lead with name, company, phone/email, value and source.',
      'Open created lead detail.',
      'Edit status/value/next action.',
      'Move/convert lead to service/case if UI exposes this action.',
      'Archive/delete lead and verify it disappears from active list.',
    ],
    status: sourceStatus('api/leads.ts', ['export default async function handler', 'LEAD_LIST_SELECT_STAGE124', 'workspace_id']) + ' / ' + sourceStatus('src/pages/Leads.tsx', ['fetchLeadsFromSupabase', 'insertLeadToSupabase', 'updateLeadInSupabase']),
  },
  {
    id: 'LCC-02',
    name: 'Lead detail',
    entity: 'lead',
    api: '/api/leads?id=:id',
    ui: '/leads/:id',
    clientFunctions: ['fetchLeadByIdFromSupabase', 'updateLeadInSupabase', 'startLeadServiceInSupabase', 'fetchActivitiesFromSupabase'],
    apiFile: 'api/leads.ts',
    uiFile: 'src/pages/LeadDetail.tsx',
    relationChecks: ['lead detail → activities', 'lead detail → case link', 'lead detail → client link'],
    manual: [
      'Open an existing lead detail directly by URL.',
      'Hard refresh the detail page.',
      'Confirm no INVALID_API_RESPONSE appears.',
      'Confirm empty/missing id shows controlled not-found/error state.',
    ],
    status: sourceStatus('api/leads.ts', ['requestedId', 'LEAD_DETAIL_SELECT_STAGE124']) + ' / ' + sourceStatus('src/pages/LeadDetail.tsx', ['fetchLeadByIdFromSupabase']),
  },
  {
    id: 'LCC-03',
    name: 'Clients list',
    entity: 'client',
    api: '/api/clients',
    ui: '/clients',
    clientFunctions: ['fetchClientsFromSupabase', 'createClientInSupabase', 'updateClientInSupabase', 'deleteClientFromSupabase', 'findEntityConflictsInSupabase'],
    apiFile: 'api/clients.ts',
    uiFile: 'src/pages/Clients.tsx',
    relationChecks: ['client → cases', 'client → tasks/events via relations', 'client archive hides child work from calendar'],
    manual: [
      'Open /clients after hard refresh.',
      'Create a client with name, company and contact fields.',
      'Edit contact fields and save.',
      'Confirm duplicate conflict dialog does not block valid explicit override.',
      'Archive/delete client and verify active list excludes archived row.',
    ],
    status: sourceStatus('api/clients.ts', ['CLIENT_LIST_SELECT_STAGE124', 'CLIENT_WORKSPACE_REQUIRED', 'assertWorkspaceWriteAccess']) + ' / ' + sourceStatus('src/pages/Clients.tsx', ['fetchClientsFromSupabase', 'createClientInSupabase', 'updateClientInSupabase']),
  },
  {
    id: 'LCC-04',
    name: 'Client detail',
    entity: 'client',
    api: '/api/clients?id=:id',
    ui: '/clients/:clientId',
    clientFunctions: ['fetchClientByIdFromSupabase', 'fetchCasesFromSupabase', 'fetchLeadsFromSupabase', 'fetchTasksFromSupabase', 'fetchEventsFromSupabase', 'fetchPaymentsFromSupabase'],
    apiFile: 'api/clients.ts',
    uiFile: 'src/pages/ClientDetail.tsx',
    relationChecks: ['client detail → cases', 'client detail → acquisition history', 'client detail → payments'],
    manual: [
      'Open client detail directly by URL.',
      'Hard refresh client detail.',
      'Confirm related cases and acquisition history render.',
      'Create a new case from client if UI exposes this action.',
      'Confirm no useWorkspace/useParams runtime crash.',
    ],
    status: sourceStatus('api/clients.ts', ['CLIENT_DETAIL_SELECT_STAGE124', 'CLIENT_NOT_FOUND']) + ' / ' + sourceStatus('src/pages/ClientDetail.tsx', ['fetchClientByIdFromSupabase', 'fetchCasesFromSupabase']),
  },
  {
    id: 'LCC-05',
    name: 'Cases list',
    entity: 'case',
    api: '/api/cases',
    ui: '/cases',
    clientFunctions: ['fetchCasesFromSupabase', 'createCaseInSupabase', 'updateCaseInSupabase', 'deleteCaseFromSupabase'],
    apiFile: 'api/cases.ts',
    uiFile: 'src/pages/Cases.tsx',
    relationChecks: ['case → client', 'case → lead', 'case → primary case for client'],
    manual: [
      'Open /cases after hard refresh.',
      'Create case without linked lead but with client contact fields.',
      'Create case linked to existing lead/client if possible.',
      'Edit status and finance fields.',
      'Archive/delete case and confirm list excludes archived row.',
    ],
    status: sourceStatus('api/cases.ts', ['CASE_LIST_SELECT_STAGE124', 'ensureClientForCase', 'assertWorkspaceWriteAccess']) + ' / ' + sourceStatus('src/pages/Cases.tsx', ['fetchCasesFromSupabase']),
  },
  {
    id: 'LCC-06',
    name: 'Case detail',
    entity: 'case',
    api: '/api/cases?id=:id',
    ui: '/cases/:id',
    clientFunctions: ['fetchCaseByIdFromSupabase', 'fetchCaseItemsFromSupabase', 'fetchActivitiesFromSupabase', 'fetchPaymentsFromSupabase'],
    apiFile: 'api/cases.ts',
    uiFile: 'src/pages/CaseDetail.tsx',
    relationChecks: ['case detail → items', 'case detail → activities', 'case detail → portal', 'case detail → payments'],
    manual: [
      'Open case detail directly by URL.',
      'Hard refresh case detail.',
      'Confirm tasks/events/activity/case items are stable.',
      'Add/update a case item or note if UI exposes this action.',
      'Confirm portal readiness/action panel does not throw.',
    ],
    status: sourceStatus('api/cases.ts', ['CASE_DETAIL_SELECT_STAGE124', 'CASE_NOT_FOUND']) + ' / ' + sourceStatus('src/pages/CaseDetail.tsx', ['fetchCaseByIdFromSupabase']),
  },
];

const hardRefreshRoutes = ['/', '/leads', '/clients', '/cases', '/leads/:id', '/clients/:clientId', '/cases/:id'];

const facts = [
  'Stage216-A is a functional QA gate for Leads / Clients / Cases after Stage215 coverage matrix.',
  'The frontend API wrapper throws INVALID_API_RESPONSE when an endpoint returns non-JSON/raw content, so runtime endpoint checks matter.',
  'Server Supabase access requires SUPABASE_SERVICE_ROLE_KEY and a Supabase URL, so missing env can still break API while build passes.',
  'Clients and cases APIs require workspace context and scoped write access for mutations.',
  'No SQL, RLS, GRANT, data mutation, cleanup, or runtime UI patch is performed by this stage.',
];

const decisions = [
  'Do not repair every module at once.',
  'Stage216-A only covers Leads / Clients / Cases.',
  'Runtime write probes are opt-in only and disabled by default.',
  'If Stage216-A finds runtime FAILs, split fixes into Stage216-A1/A2/A3 rather than one large risky patch.',
];

const hypotheses = [
  'Likely failure class #1: detail pages can fail after hard refresh if id/detail endpoint shape differs from list DTO assumptions.',
  'Likely failure class #2: relation creation lead → client → case can fail through workspace scoping or duplicate conflict logic.',
  'Likely failure class #3: empty-state UI may be acceptable visually but still hide INVALID_API_RESPONSE errors in console.',
];

const nextSteps = [
  'Run static Stage216-A guard.',
  'Run optional GET-only probe against local or production URL with real workspace/auth headers.',
  'Perform manual QA checklist for /leads, /clients, /cases and detail routes.',
  'Record PASS/FAIL evidence in this report before any Stage216-A fix.',
];

function tableRows() {
  return modules.map((m) => `| ${m.id} | ${m.name} | \`${m.api}\` | \`${m.ui}\` | ${m.clientFunctions.map(fn => `\`${fn}\``).join(', ')} | ${m.relationChecks.join('; ')} | ${m.status} | RUNTIME_NOT_RUN |`).join('\n');
}

function manualChecklist() {
  return modules.map((m) => [
    `### ${m.id} - ${m.name}`,
    '',
    ...m.manual.map((item) => `- [ ] ${item}`),
    '- [ ] Console has no `INVALID_API_RESPONSE`.',
    '- [ ] Network response is JSON, not HTML/error shell.',
    '- [ ] Data still appears after `CTRL+F5`.',
    '',
  ].join('\n')).join('\n');
}

const report = `---
typ: raport_stage
stage: Stage216-A
status: prepared
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage216-A - Leads / Clients / Cases functional QA

## Cel

Ustalić, czy rdzeń CRM po migracji Supabase działa funkcjonalnie: leady, klienci, sprawy, ich detail pages i relacje.

To jest etap QA + bramka do poprawek. Nie wykonuje automatycznych napraw runtime.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- poprzedni etap: Stage215 Supabase Coverage Matrix
- report_id: STAGE216A_LEADS_CLIENTS_CASES_FUNCTIONAL_QA_2026-05-31

## FAKTY

${facts.map((x) => `- ${x}`).join('\n')}

## DECYZJE DAMIANA / OPERACYJNE

${decisions.map((x) => `- ${x}`).join('\n')}

## HIPOTEZY AI

${hypotheses.map((x) => `- ${x}`).join('\n')}

## Zakres

| ID | Moduł | API | UI | Funkcje klienta | Relacje | Static status | Runtime status |
|---|---|---|---|---|---|---|---|
${tableRows()}

## Trasy hard-refresh

${hardRefreshRoutes.map((route) => `- [ ] \`${route}\``).join('\n')}

## Manual QA checklist

${manualChecklist()}

## Opcjonalny runtime probe

Domyślnie probe jest GET-only i nie zapisuje danych.

\`\`\`powershell
$env:CLOSEFLOW_APP_URL="http://localhost:3000"
$env:CLOSEFLOW_WORKSPACE_ID="REAL_WORKSPACE_UUID"
# opcjonalnie, jeśli endpoint wymaga tokenu:
# $env:CLOSEFLOW_ACCESS_TOKEN="SUPABASE_ACCESS_TOKEN"
node tools/stage216a-lcc-api-probe.cjs
\`\`\`

Write probe jest wyłączony. Nie uruchamiać go bez osobnej decyzji.

## TESTY AUTOMATYCZNE

\`\`\`powershell
node scripts/check-stage216a-lcc-functional-qa.cjs
npm run build
\`\`\`

## RYZYKA

- Build PASS nie potwierdza runtime Supabase.
- Lista może działać, a detail page może padać po hard refresh.
- GET może działać, a POST/PATCH/DELETE może padać przez workspace/RLS/access gate.
- Nie mieszać tego etapu z tasks/events/calendar.

## NASTĘPNY KROK

${nextSteps.map((x) => `- ${x}`).join('\n')}
`;

const obsidian = `# 2026-05-31 - CloseFlow Stage216-A leads clients cases functional QA

## FAKTY

${facts.map((x) => `- ${x}`).join('\n')}

## DECYZJE DAMIANA

${decisions.map((x) => `- ${x}`).join('\n')}

## HIPOTEZY AI

${hypotheses.map((x) => `- ${x}`).join('\n')}

## DO POTWIERDZENIA

- Realny workspace id do runtime probe.
- Czy runtime probe ma być tylko GET-only, czy później dopuszczamy write probe w trybie testowym.
- Czy FAIL-e z lead/client/case mają iść jako Stage216-A1/A2/A3.

## TESTY

- \`node scripts/check-stage216a-lcc-functional-qa.cjs\`
- \`npm run build\`
- manual QA dla \`/leads\`, \`/clients\`, \`/cases\`, \`/leads/:id\`, \`/clients/:clientId\`, \`/cases/:id\`
- opcjonalny GET-only probe: \`node tools/stage216a-lcc-api-probe.cjs\`

## RYZYKA

- API może zwracać HTML/error shell i frontend pokaże \`INVALID_API_RESPONSE\`.
- Write access może być inny niż read access.
- Detail pages mogą mieć inne kontrakty niż list DTO.

## ZAKRES

- Leads
- Clients
- Cases
- Detail pages
- Relacje lead → client → case

## CZEGO NIE RUSZANO

- SQL
- RLS
- GRANT
- dane Supabase
- Calendar
- NotificationsCenter
- Tasks/Events
- backupy

## NASTĘPNY KROK

- Uruchomić Stage216-A guard/build.
- Wykonać manual QA.
- Potem Stage216-A1 dla pierwszego realnego FAIL-a.
`;

ensureDirFor(reportPath);
ensureDirFor(obsidianPath);
fs.writeFileSync(path.join(root, reportPath), report);
fs.writeFileSync(path.join(root, obsidianPath), obsidian);

console.log('Stage216-A Leads / Clients / Cases functional QA generated.');
console.log(`Report: ${reportPath}`);
console.log(`Obsidian: ${obsidianPath}`);
