#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const stage = 'Stage215';
const reportPath = '_project/reports/STAGE215_SUPABASE_COVERAGE_MATRIX_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage215 Supabase coverage matrix.md';

function exists(p) {
  return fs.existsSync(path.join(root, p));
}

function read(p) {
  const full = path.join(root, p);
  return exists(p) ? fs.readFileSync(full, 'utf8') : '';
}

function listFiles(dir) {
  const out = [];
  const start = path.join(root, dir);
  if (!fs.existsSync(start)) return out;
  const walk = (current) => {
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      const rel = path.relative(root, full).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', '.git', '_local_backups'].includes(entry.name)) continue;
        if (rel.startsWith('_project/backups/')) continue;
        walk(full);
      } else {
        out.push(rel);
      }
    }
  };
  walk(start);
  return out;
}

const apiFiles = listFiles('api').filter((p) => /\.(ts|js)$/.test(p)).sort();
const pageFiles = listFiles('src/pages').filter((p) => /\.(tsx|ts|jsx|js)$/.test(p)).sort();
const libFiles = listFiles('src/lib').filter((p) => /\.(tsx|ts|jsx|js)$/.test(p)).sort();
const serverFiles = listFiles('src/server').filter((p) => /\.(tsx|ts|jsx|js)$/.test(p)).sort();
const migrationFiles = listFiles('supabase/migrations').filter((p) => /\.(sql|ts|js)$/.test(p)).sort();

const supabaseFallback = read('src/lib/supabase-fallback.ts');
const serverSupabase = read('src/server/_supabase.ts');
const packageJson = read('package.json');

function hasText(fileText, text) {
  return fileText.includes(text);
}

function hasApi(pathName) {
  return apiFiles.includes(`api/${pathName}.ts`) || apiFiles.includes(`api/${pathName}.js`);
}

function hasPage(pathName) {
  return pageFiles.some((p) => p.endsWith(pathName));
}

function hasClientExport(name) {
  return new RegExp(`export\\s+(async\\s+function|const)\\s+${name}\\b`).test(supabaseFallback);
}

function hasApiCall(route) {
  return supabaseFallback.includes(route);
}

function detectRouteEvidence(module) {
  const checks = [];
  for (const api of module.apiFiles || []) {
    checks.push({ label: `api:${api}`, ok: hasApi(api) });
  }
  for (const page of module.pages || []) {
    checks.push({ label: `page:${page}`, ok: hasPage(page) });
  }
  for (const fn of module.clientFns || []) {
    checks.push({ label: `client:${fn}`, ok: hasClientExport(fn) });
  }
  for (const route of module.apiRoutes || []) {
    checks.push({ label: `route:${route}`, ok: hasApiCall(route) });
  }
  return checks;
}

const modules = [
  {
    id: 'auth_workspace',
    label: 'Auth + workspace context',
    tables: ['profiles', 'workspaces', 'workspace_members'],
    apiFiles: ['me', 'workspace-settings', 'system'],
    apiRoutes: ['/api/me', '/api/workspace-settings', '/api/system?kind=profile-settings'],
    clientFns: ['fetchMeFromSupabase', 'updateWorkspaceSettingsInSupabase', 'updateProfileSettingsInSupabase'],
    pages: ['Settings.tsx', 'Login.tsx'],
    uiRoutes: ['/login', '/settings'],
    criticalFlow: 'login -> workspace context -> x-workspace-id headers -> scoped API reads',
    manualQa: [
      'Login with real operator account.',
      'Open /settings and confirm workspace/profile data loads.',
      'Hard refresh / and /settings. Confirm no INVALID_API_RESPONSE.',
      'Confirm workspace id persists and data does not switch to another workspace.'
    ],
  },
  {
    id: 'leads',
    label: 'Leads',
    tables: ['leads'],
    apiFiles: ['leads'],
    apiRoutes: ['/api/leads'],
    clientFns: ['fetchLeadsFromSupabase', 'insertLeadToSupabase', 'updateLeadInSupabase', 'deleteLeadFromSupabase', 'startLeadServiceInSupabase'],
    pages: ['Leads.tsx', 'LeadDetail.tsx'],
    uiRoutes: ['/leads', '/leads/:id'],
    criticalFlow: 'create/read/update/archive/start service',
    manualQa: [
      'Create a lead with name, phone/email, source, value and next action.',
      'Hard refresh /leads and detail page. Confirm lead persists.',
      'Edit status/value/next action. Confirm Today and Calendar react correctly.',
      'Archive/delete lead only through intended UI and confirm it does not leak into active views.'
    ],
  },
  {
    id: 'clients',
    label: 'Clients',
    tables: ['clients'],
    apiFiles: ['clients'],
    apiRoutes: ['/api/clients'],
    clientFns: ['fetchClientsFromSupabase', 'fetchClientByIdFromSupabase', 'createClientInSupabase', 'updateClientInSupabase', 'deleteClientFromSupabase'],
    pages: ['Clients.tsx', 'ClientDetail.tsx'],
    uiRoutes: ['/clients', '/clients/:id'],
    criticalFlow: 'create/read/update/archive primary-case',
    manualQa: [
      'Create or convert a client.',
      'Open client detail after hard refresh.',
      'Edit contact data and primary case.',
      'Confirm archived clients do not pollute active calendar/task lists.'
    ],
  },
  {
    id: 'cases',
    label: 'Cases',
    tables: ['cases', 'case_items'],
    apiFiles: ['cases', 'case-items'],
    apiRoutes: ['/api/cases', '/api/case-items'],
    clientFns: ['fetchCasesFromSupabase', 'fetchCaseByIdFromSupabase', 'createCaseInSupabase', 'updateCaseInSupabase', 'deleteCaseFromSupabase', 'fetchCaseItemsFromSupabase', 'insertCaseItemToSupabase', 'updateCaseItemInSupabase'],
    pages: ['Cases.tsx', 'CaseDetail.tsx'],
    uiRoutes: ['/cases', '/cases/:id'],
    criticalFlow: 'case CRUD + case item checklist + portal preparation',
    manualQa: [
      'Create case linked to client or lead.',
      'Open case detail after hard refresh.',
      'Add/update checklist item.',
      'Confirm related tasks/events/activities show proper context.'
    ],
  },
  {
    id: 'tasks',
    label: 'Tasks',
    tables: ['tasks'],
    apiFiles: ['tasks', 'system'],
    apiRoutes: ['/api/tasks', '/api/system?apiRoute=tasks'],
    clientFns: ['fetchTasksFromSupabase', 'insertTaskToSupabase', 'updateTaskInSupabase', 'deleteTaskFromSupabase'],
    pages: ['TasksStable.tsx', 'TodayStable.tsx', 'Calendar.tsx'],
    uiRoutes: ['/tasks', '/', '/calendar'],
    criticalFlow: 'task CRUD + done + Today/Calendar propagation',
    manualQa: [
      'Create task from Tasks and from Calendar.',
      'Mark task done from Today.',
      'Hard refresh /tasks, /, and /calendar.',
      'Confirm parent archived client/case filtering still works.'
    ],
  },
  {
    id: 'events_calendar',
    label: 'Events + Calendar',
    tables: ['events'],
    apiFiles: ['events', 'system'],
    apiRoutes: ['/api/events', '/api/system?apiRoute=events'],
    clientFns: ['fetchEventsFromSupabase', 'insertEventToSupabase', 'updateEventInSupabase', 'deleteEventFromSupabase'],
    pages: ['Calendar.tsx', 'TodayStable.tsx'],
    uiRoutes: ['/calendar', '/'],
    criticalFlow: 'event CRUD + calendar hard refresh + Google sync non-blocking refresh',
    manualQa: [
      'Create event from Calendar.',
      'Edit and move event.',
      'Hard refresh /calendar.',
      'Check Google sync status and ensure local calendar remains usable if Google sync fails.'
    ],
  },
  {
    id: 'notifications',
    label: 'Notifications',
    tables: ['tasks', 'events', 'leads', 'activities'],
    apiFiles: ['system'],
    apiRoutes: ['/api/system?kind='],
    clientFns: [],
    pages: ['NotificationsCenter.tsx'],
    uiRoutes: ['/notifications'],
    criticalFlow: 'derived notifications + read/snooze/log without full bundle spam',
    manualQa: [
      'Open /notifications with overdue task/event/lead.',
      'Snooze notification.',
      'Mark notification read.',
      'Return after hard refresh and confirm no error in console.'
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    tables: ['activities'],
    apiFiles: ['activities'],
    apiRoutes: ['/api/activities'],
    clientFns: ['fetchActivitiesFromSupabase', 'insertActivityToSupabase', 'updateActivityInSupabase', 'deleteActivityFromSupabase'],
    pages: ['Activity.tsx', 'CaseDetail.tsx', 'LeadDetail.tsx', 'ClientDetail.tsx'],
    uiRoutes: ['/activity', '/cases/:id', '/leads/:id', '/clients/:id'],
    criticalFlow: 'activity writes from reminders/portal/operations and scoped reads',
    manualQa: [
      'Trigger activity from reminder or case action.',
      'Open activity list.',
      'Confirm activity links to correct lead/case/client.',
      'Confirm no cross-workspace activity leakage.'
    ],
  },
  {
    id: 'payments_billing',
    label: 'Payments + billing',
    tables: ['payments', 'workspaces'],
    apiFiles: ['payments', 'billing-checkout', 'billing-actions', 'workspace-settings'],
    apiRoutes: ['/api/payments', '/api/billing-checkout', '/api/billing-actions', '/api/workspace-settings'],
    clientFns: ['fetchPaymentsFromSupabase', 'createPaymentInSupabase', 'updatePaymentInSupabase', 'deletePaymentFromSupabase', 'createBillingCheckoutSessionInSupabase', 'billingActionInSupabase'],
    pages: ['Billing.tsx', 'LeadDetail.tsx', 'CaseDetail.tsx', 'ClientDetail.tsx'],
    uiRoutes: ['/billing', '/leads/:id', '/cases/:id', '/clients/:id'],
    criticalFlow: 'payment CRUD + billing checkout + subscription access gates',
    manualQa: [
      'Create payment row in context of lead/case/client.',
      'Edit payment status.',
      'Open /billing and verify current access copy.',
      'Dry-run checkout if payment env is not production-ready.'
    ],
  },
  {
    id: 'ai_drafts_templates',
    label: 'AI drafts + response templates',
    tables: ['ai_drafts', 'response_templates'],
    apiFiles: ['system', 'response-templates'],
    apiRoutes: ['/api/system?kind=ai-drafts', '/api/response-templates'],
    clientFns: ['fetchResponseTemplatesFromSupabase', 'createResponseTemplateInSupabase', 'updateResponseTemplateInSupabase'],
    pages: ['AiDrafts.tsx', 'ResponseTemplates.tsx', 'Templates.tsx', 'TodayStable.tsx'],
    uiRoutes: ['/ai-drafts', '/templates', '/'],
    criticalFlow: 'draft read/approve + template CRUD',
    manualQa: [
      'Create or view AI draft.',
      'Approve draft into lead if configured.',
      'Create response template.',
      'Hard refresh template page and confirm persistence.'
    ],
  },
  {
    id: 'portal_storage',
    label: 'Client portal + storage upload',
    tables: ['client_portal_tokens', 'cases', 'case_items', 'activities', 'storage bucket'],
    apiFiles: ['client-portal-tokens', 'client-portal-session', 'storage-upload', 'case-items'],
    apiRoutes: ['/api/client-portal-tokens', '/api/client-portal-session', '/api/storage-upload', '/api/case-items'],
    clientFns: ['fetchClientPortalTokenFromSupabase', 'createPortalSessionFromSupabase', 'createClientPortalTokenInSupabase', 'fetchPortalCaseBundleFromSupabase', 'uploadPortalFileInSupabase', 'submitPortalCaseItemInSupabase'],
    pages: ['ClientPortal.tsx', 'CaseDetail.tsx'],
    uiRoutes: ['/portal', '/cases/:id'],
    criticalFlow: 'operator creates token -> client opens portal -> uploads file -> case item updates',
    manualQa: [
      'Create portal token for case.',
      'Open portal session.',
      'Upload small test file.',
      'Confirm file path/item status/activity persist and no operator data leaks.'
    ],
  },
  {
    id: 'support_settings',
    label: 'Support + settings',
    tables: ['support_requests', 'profiles', 'workspaces'],
    apiFiles: ['support-requests', 'system', 'workspace-settings'],
    apiRoutes: ['/api/support-requests', '/api/system?kind=profile-settings', '/api/workspace-settings'],
    clientFns: ['fetchSupportRequestsFromSupabase', 'createSupportRequestInSupabase', 'appendSupportReplyInSupabase', 'updateSupportRequestStatusInSupabase'],
    pages: ['SupportCenter.tsx', 'Settings.tsx'],
    uiRoutes: ['/support', '/settings'],
    criticalFlow: 'support ticket + profile/workspace settings',
    manualQa: [
      'Create support request.',
      'Append reply or status if admin path is available.',
      'Update profile/workspace settings.',
      'Hard refresh settings and support page.'
    ],
  },
];

const rows = modules.map((module) => {
  const evidence = detectRouteEvidence(module);
  const missing = evidence.filter((item) => !item.ok).map((item) => item.label);
  const present = evidence.filter((item) => item.ok).map((item) => item.label);
  return {
    ...module,
    evidence,
    present,
    missing,
    structuralStatus: missing.length === 0 ? 'STRUCTURAL_PASS' : 'STRUCTURAL_GAP',
    qaStatus: 'DO_WYKONANIA',
  };
});

function mdEscape(value) {
  return String(value || '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function renderMatrixTable(items) {
  const lines = [];
  lines.push('| obszar | tabele / storage | API | UI | structural | QA | braki strukturalne |');
  lines.push('|---|---|---|---|---|---|---|');
  for (const row of items) {
    lines.push(`| ${mdEscape(row.label)} | ${mdEscape(row.tables.join(', '))} | ${mdEscape((row.apiRoutes || []).join(', '))} | ${mdEscape(row.uiRoutes.join(', '))} | ${row.structuralStatus} | ${row.qaStatus} | ${mdEscape(row.missing.join('; ') || 'brak')} |`);
  }
  return lines.join('\n');
}

function renderManualQa(items) {
  const lines = [];
  for (const row of items) {
    lines.push(`### ${row.label}`);
    lines.push('');
    lines.push(`- status strukturalny: ${row.structuralStatus}`);
    lines.push(`- status QA: ${row.qaStatus}`);
    lines.push(`- krytyczny flow: ${row.criticalFlow}`);
    lines.push('- testy reczne:');
    for (const item of row.manualQa) lines.push(`  - [ ] ${item}`);
    lines.push('');
  }
  return lines.join('\n');
}

const summary = {
  totalModules: rows.length,
  structuralPass: rows.filter((row) => row.structuralStatus === 'STRUCTURAL_PASS').length,
  structuralGap: rows.filter((row) => row.structuralStatus !== 'STRUCTURAL_PASS').length,
  apiFiles: apiFiles.length,
  pageFiles: pageFiles.length,
  libFiles: libFiles.length,
  serverFiles: serverFiles.length,
  migrationFiles: migrationFiles.length,
};

const now = new Date().toISOString();

const report = `---
typ: raport_stage
stage: Stage215
status: coverage_matrix_prepared
project: CloseFlow / LeadFlow
data: 2026-05-31
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage215 - Supabase Coverage Matrix + Functional QA

## Cel

Ten etap definiuje, kiedy mozna powiedziec, ze migracja Supabase jest ogarnieta. Nie naprawia kodu, nie zmienia SQL, nie zmienia RLS, nie zmienia GRANT i nie dotyka danych Supabase.

Stage215 tworzy macierz:

\`\`\`text
tabela/storage -> API endpoint -> funkcja klienta -> ekran UI -> test manualny -> status
\`\`\`

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- poprzednie etapy: Stage213B, Stage213C-A, Stage213C-B, Stage213C-C, Stage214
- generated_at: ${now}

## Scan evidence

- api files: ${summary.apiFiles}
- page files: ${summary.pageFiles}
- lib files: ${summary.libFiles}
- server files: ${summary.serverFiles}
- migration files: ${summary.migrationFiles}
- structural pass: ${summary.structuralPass}
- structural gap: ${summary.structuralGap}
- modules total: ${summary.totalModules}

## Definicja DONE dla Supabase

Supabase migration mozna uznac za ogarnieta dopiero wtedy, gdy:

- kazdy obszar krytyczny ma structural status \`STRUCTURAL_PASS\` albo jawnie opisany accepted gap,
- kazdy obszar krytyczny ma manual QA \`PASS\`,
- nie ma \`INVALID_API_RESPONSE\` w konsoli dla glownego flow,
- hard refresh dziala na trasach: \`/\`, \`/leads\`, \`/clients\`, \`/cases\`, \`/tasks\`, \`/calendar\`, \`/notifications\`, \`/settings\`,
- workspace scope dziala i nie miesza danych miedzy workspace,
- portal klienta nie pokazuje danych operatora,
- storage upload, jesli testowany, ma kontrolowana sciezke i aktywny bucket,
- query budget po Stage213C nie wraca do polling/retry storm.

## Macierz pokrycia

${renderMatrixTable(rows)}

## Manual QA checklist

${renderManualQa(rows)}

## Krytyczne reguly

- Nie uzywaj \`git add .\`.
- Nie tworz ani nie uruchamiaj SQL w tym etapie.
- Nie zmieniaj RLS ani GRANT w tym etapie.
- Nie kasuj backupow w tym etapie.
- Jezeli test manualny wykryje blad, zapisz go jako osobny Stage216-* fix, a nie naprawiaj wszystkiego naraz.

## Proponowana kolejnosc po Stage215

1. Stage216-A - leads/clients/cases CRUD and detail page fixes.
2. Stage216-B - tasks/events/calendar relation fixes.
3. Stage216-C - notifications/activity QA fixes.
4. Stage216-D - portal/storage QA fixes.
5. Stage216-E - settings/billing/support QA fixes.

## Testy wykonawcze

\`\`\`powershell
node tools/stage215-generate-supabase-coverage-matrix.cjs
node scripts/check-stage215-supabase-coverage-matrix.cjs
npm run build
\`\`\`

## Wynik

Stage215 jest audytem/macierza. Nie wykonano cleanupu, nie wykonano SQL, nie zmieniono RLS, nie zmieniono GRANT, nie zmieniono danych Supabase.
`;

const obsidian = `# 2026-05-31 - CloseFlow Stage215 Supabase coverage matrix

## FAKTY

- Stage215 tworzy macierz pokrycia Supabase dla CloseFlow / LeadFlow.
- Nie zmienia kodu aplikacji runtime.
- Nie wykonuje SQL.
- Nie zmienia RLS.
- Nie zmienia GRANT.
- Nie dotyka danych Supabase.
- Generator przeskanowal lokalne pliki repo i przygotowal raport Stage215.

## DECYZJE DAMIANA

- Kierunek: sprawdzic funkcjonalnie cala migracje Supabase, a nie uznawac jej za zakonczona po pojedynczym buildzie.
- Cleanup backupow nie jest teraz priorytetem.

## HIPOTEZY AI

- Najwieksze ryzyko po Stage213C to martwe endpointy albo relacje, nie juz sam query budget.
- Macierz coverage jest najbezpieczniejszym sposobem zamykania migracji bez zgadywania.

## MACIERZ - SKROT

- modules total: ${summary.totalModules}
- structural pass: ${summary.structuralPass}
- structural gap: ${summary.structuralGap}
- api files: ${summary.apiFiles}
- page files: ${summary.pageFiles}

## DO POTWIERDZENIA

- Ktore testy manualne Damian wykona na produkcji, a ktore lokalnie.
- Czy portal/storage testujemy teraz, czy po core CRM flow.
- Czy billing testujemy w dry-run, czy z realnym providerem.

## TESTY

\`\`\`powershell
node tools/stage215-generate-supabase-coverage-matrix.cjs
node scripts/check-stage215-supabase-coverage-matrix.cjs
npm run build
\`\`\`

## RYZYKA

- Build nie potwierdza, ze endpoint API zwraca poprawny JSON.
- Structural pass nie oznacza functional pass.
- Testy manualne musza objac hard refresh, CRUD, relacje i workspace scope.

## NASTEPNY KROK

Stage216-A: leads/clients/cases CRUD + detail pages, tylko po uzupelnieniu wynikow manual QA z Stage215.

## Status zapisu

- status: przygotowano przez Stage215 generator
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
`;

fs.mkdirSync(path.dirname(path.join(root, reportPath)), { recursive: true });
fs.mkdirSync(path.dirname(path.join(root, obsidianPath)), { recursive: true });
fs.writeFileSync(path.join(root, reportPath), report, 'utf8');
fs.writeFileSync(path.join(root, obsidianPath), obsidian, 'utf8');

console.log('Stage215 Supabase coverage matrix generated.');
console.log(`Modules: ${summary.totalModules}`);
console.log(`Structural PASS: ${summary.structuralPass}`);
console.log(`Structural GAP: ${summary.structuralGap}`);
console.log(`Report: ${reportPath}`);
console.log(`Obsidian: ${obsidianPath}`);
