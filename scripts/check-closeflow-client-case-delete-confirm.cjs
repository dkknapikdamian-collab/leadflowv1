#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();

function fail(message, details = []) {
  console.error('CLOSEFLOW_CLIENT_CASE_DELETE_CONFIRM_ETAP9_CHECK_FAILED');
  console.error(message);
  for (const detail of details) console.error('- ' + detail);
  process.exit(1);
}

function read(rel) {
  const filePath = path.join(root, rel);
  if (!fs.existsSync(filePath)) fail('Brak wymaganego pliku.', [rel]);
  return fs.readFileSync(filePath, 'utf8');
}

const clientDetail = read('src/pages/ClientDetail.tsx');
const pkg = JSON.parse(read('package.json'));

const scriptName = 'check:closeflow-client-case-delete-confirm';
const scriptValue = 'node scripts/check-closeflow-client-case-delete-confirm.cjs';

if (pkg.scripts?.[scriptName] !== scriptValue) {
  fail('package.json nie wystawia guardu delete-confirm.', [
    'Oczekiwane: "' + scriptName + '": "' + scriptValue + '"',
  ]);
}

const caseDeleteSignals = [
  'deleteCaseFromSupabase',
  'handleDeleteCase',
  'onDeleteCase',
  'client-case-delete',
  'data-client-case-delete',
  'Usu\u0144 spraw\u0119',
  'Usun spraw\u0119',
  'Usun sprawe',
];

const confirmSignals = [
  'window.confirm(',
  'confirm(',
  'Potwierd\u017A usuni\u0119cie',
  'Potwierdz usuniecie',
  'potwierd',
  'confirmScheduleConflicts',
  'EntityConflictDialog',
  'DeleteConfirm',
  'ConfirmDialog',
  'data-client-case-delete-confirm',
];

const exposesCaseDelete = caseDeleteSignals.some((signal) => clientDetail.includes(signal));
const hasConfirmation = confirmSignals.some((signal) => clientDetail.toLowerCase().includes(signal.toLowerCase()));
const hasDangerZone = clientDetail.includes('cf-danger-action-zone')
  || clientDetail.includes("actionButtonClass('danger'")
  || clientDetail.includes('dangerActionZone');

if (exposesCaseDelete && !hasConfirmation) {
  fail('ClientDetail pokazuje lub obs\u0142uguje usuwanie sprawy bez widocznego potwierdzenia.', [
    'Dodaj confirm/dialog przed usuni\u0119ciem sprawy z klienta.',
  ]);
}

if (!hasDangerZone) {
  fail('ClientDetail nie ma jawnej strefy akcji niebezpiecznych.', [
    'Oczekiwany marker: cf-danger-action-zone lub actionButtonClass(\'danger\') lub dangerActionZone.',
  ]);
}

console.log('CLOSEFLOW_CLIENT_CASE_DELETE_CONFIRM_ETAP9_CHECK_OK');
console.log('case_delete_exposed=' + exposesCaseDelete);
console.log('confirmation_guarded=' + (exposesCaseDelete ? hasConfirmation : 'not_required_no_case_delete_action'));
console.log('danger_zone=true');
