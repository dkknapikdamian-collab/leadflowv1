const fs = require('fs');

function fail(message) {
  console.error('STAGE220A29_LEAD_CONFIRM_NO_SW_RELOAD_GUARD: FAIL');
  console.error(message);
  process.exit(1);
}

function read(path) {
  return fs.readFileSync(path, 'utf8');
}

function requireText(text, needle, label) {
  if (!text.includes(needle)) fail(label + ' missing: ' + needle);
}

function forbidText(text, needle, label) {
  if (text.includes(needle)) fail(label + ' forbidden: ' + needle);
}

const leads = read('src/pages/Leads.tsx');
const swRegister = read('src/pwa/register-service-worker.ts');
const pkg = JSON.parse(read('package.json'));

requireText(leads, 'STAGE220A29_LEAD_TRASH_VST_CONFIRM', 'Leads A29 marker');
requireText(leads, "import { ConfirmDialog } from '../components/confirm-dialog';", 'ConfirmDialog import');
requireText(leads, 'leadArchiveConfirmStage220A29', 'lead archive confirm state');
requireText(leads, 'conflictArchiveConfirmStage220A29', 'conflict archive confirm state');
requireText(leads, 'executeArchiveLeadStage220A29', 'lead archive executor');
requireText(leads, 'executeArchiveConflictCandidateStage220A29', 'conflict archive executor');
requireText(leads, 'data-stage220a29-lead-trash-confirm="true"', 'lead trash confirm marker');
requireText(leads, 'data-stage220a29-conflict-trash-confirm="true"', 'conflict trash confirm marker');
forbidText(leads, "window.confirm('Przenieść leada do kosza", 'native lead trash confirm');
forbidText(leads, 'Przenieść rekord z konfliktu do kosza:', 'native conflict trash confirm');

requireText(swRegister, 'STAGE220A29_NO_RUNTIME_SERVICE_WORKER_REGISTER', 'SW A29 marker');
requireText(swRegister, 'registration.unregister()', 'existing SW retirement');
forbidText(swRegister, "navigator.serviceWorker.register('/service-worker.js'", 'runtime SW register');
forbidText(swRegister, 'registration.update()', 'runtime SW update');

const prebuild = String(pkg.scripts && pkg.scripts.prebuild || '');
requireText(prebuild, 'node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs', 'prebuild A29 guard');

console.log('STAGE220A29_LEAD_CONFIRM_NO_SW_RELOAD_GUARD: OK');
