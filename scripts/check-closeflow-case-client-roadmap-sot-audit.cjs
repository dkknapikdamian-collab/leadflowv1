#!/usr/bin/env node
const fs = require('node:fs');

const DOC = 'docs/bugs/CLOSEFLOW_CASE_CLIENT_ROADMAP_SOT_REPAIR_2026-05-10.md';

function fail(message) {
  console.error('CLOSEFLOW_CASE_CLIENT_ROADMAP_SOT_AUDIT_FAIL:', message);
  process.exit(1);
}

if (!fs.existsSync(DOC)) fail(`missing ${DOC}`);

const text = fs.readFileSync(DOC, 'utf8');

const requiredSnippets = [
  'ETAP 0',
  'audyt realnego kodu',
  'Nie zmieniać:',
  'Lista bugów',
  'Obecne źródło danych',
  'Docelowe źródło danych',
  'src/pages/CaseDetail.tsx',
  'src/pages/ClientDetail.tsx',
  'src/pages/Clients.tsx',
  'src/pages/Activity.tsx',
  'src/pages/Cases.tsx',
  'src/lib/supabase-fallback.ts',
  'src/lib/calendar-items.ts',
  'src/lib/scheduling.ts',
  'src/lib/finance/finance-calculations.ts',
  'src/lib/finance/finance-client-summary.ts',
  'src/lib/work-items/planned-actions.ts',
  'src/lib/work-items/normalize.ts',
  'src/lib/data-contract.ts',
  'api/cases.ts',
  'api/clients.ts',
  'api/activities.ts',
  'api/work-items.ts',
  'api/tasks.ts',
  'api/events.ts',
  'BRAK',
  'BUG-01',
  'BUG-02',
  'BUG-03',
  'BUG-04',
  'BUG-05',
  'BUG-06',
  'BUG-07',
  'BUG-08',
  'getNearestPlannedAction',
  'buildFinanceSnapshot',
  'buildClientFinanceSummary',
  'activities',
  'git status --short',
];

for (const snippet of requiredSnippets) {
  if (!text.includes(snippet)) fail(`missing snippet: ${snippet}`);
}

const forbiddenRuntimeChangeClaims = [
  'UI zostało zmienione',
  'logika została zmieniona',
  'dane zostały zmienione',
  'naprawiono runtime',
];

for (const snippet of forbiddenRuntimeChangeClaims) {
  if (text.includes(snippet)) fail(`forbidden runtime claim: ${snippet}`);
}

console.log('CLOSEFLOW_CASE_CLIENT_ROADMAP_SOT_AUDIT_CHECK_OK');
