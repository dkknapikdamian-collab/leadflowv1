#!/usr/bin/env node
const fs = require('fs');

const checks = [];
function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '') : '';
}
function check(condition, label) {
  console.log(`${condition ? 'PASS' : 'FAIL'} ${label}`);
  checks.push(Boolean(condition));
}
function notContains(file, needle, label) {
  const text = read(file);
  check(!text.includes(needle), `${file}: ${label}`);
}
function contains(file, needle, label) {
  const text = read(file);
  check(text.includes(needle), `${file}: ${label}`);
}

notContains('src/pages/Calendar.tsx', "from '../components/entity-actions';", 'date-fns/router symbols are not grouped into entity-actions import');
contains('src/pages/Calendar.tsx', "from 'date-fns';", 'date-fns import exists');
contains('src/pages/Calendar.tsx', 'parseISO', 'Calendar keeps parseISO available');
contains('src/pages/Calendar.tsx', 'format', 'Calendar keeps format available');
contains('src/pages/Calendar.tsx', 'startOfMonth', 'Calendar keeps month helpers available');

notContains('src/pages/ClientDetail.tsx', "Mic } from 'react-router-dom'", 'Mic is not imported from router');
notContains('src/pages/ClientDetail.tsx', "MicOff } from 'react-router-dom'", 'MicOff is not imported from router');
notContains('src/pages/ClientDetail.tsx', "Pin } from 'react-router-dom'", 'Pin is not imported from router');
contains('src/pages/ClientDetail.tsx', "from 'lucide-react';", 'ClientDetail has lucide import');

notContains('src/pages/Leads.tsx', "format } from '../components/ui-system'", 'format is not imported from ui-system');
notContains('src/pages/Leads.tsx', "EntityConflictDialog } from 'react-router-dom'", 'EntityConflictDialog is not imported from router');
notContains('src/pages/Login.tsx', "Tabs } from '../components/ui-system'", 'Tabs is not imported from ui-system');
notContains('src/pages/Tasks.tsx', "addDays } from '../components/ui/card'", 'addDays is not imported from card');
notContains('src/pages/Tasks.tsx', "fetchTasksFromSupabase } from 'date-fns'", 'Supabase helpers are not imported from date-fns');
notContains('src/pages/Templates.tsx', "FolderKanban } from '../components/ui-system'", 'FolderKanban is not imported from ui-system');
notContains('src/pages/NotificationsCenter.tsx', "Clock3 } from '../components/ui-system'", 'Clock3 is not imported from ui-system');

contains('src/components/finance/CaseSettlementPanel.tsx', 'FIN-5_CLOSEFLOW_CASE_SETTLEMENT_PANEL_V1', 'FIN-5 panel marker remains');
contains('docs/fixes/CLOSEFLOW_API0_VERCEL_HOBBY_FUNCTION_CONSOLIDATION_2026-05-10.md', 'Vercel Hobby', 'API-0 doc remains');

const failed = checks.filter((ok) => !ok).length;
console.log(`\nSummary: ${checks.length - failed} pass, ${failed} fail.`);
if (failed) {
  console.error('FAIL CLOSEFLOW_TSC_IMPORT_REGRESSION_FAILED');
  process.exit(1);
}
console.log('CLOSEFLOW_TSC_IMPORT_REGRESSION_OK');
