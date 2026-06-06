const fs = require('node:fs');
function read(path) { return fs.readFileSync(path, 'utf8'); }
function fail(message) { throw new Error('STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX_GUARD_FAIL: ' + message); }
function requireText(text, token, label) { if (!text.includes(token)) fail(label + ' missing token: ' + token); }
function forbidText(text, token, label) { if (text.includes(token)) fail(label + ' forbidden token present: ' + token); }

const leads = read('src/pages/Leads.tsx');
const clients = read('src/pages/Clients.tsx');
const pkg = JSON.parse(read('package.json'));

forbidText(leads, ".catch(() => ({ candidates: [] }))", 'Leads conflict preflight must not fail open');
forbidText(clients, ".catch(() => ({ candidates: [] }))", 'Clients conflict preflight must not fail open');
requireText(leads, 'Zapis leada zatrzymany', 'Leads fail-closed duplicate check');
requireText(clients, 'Zapis klienta zatrzymany', 'Clients fail-closed duplicate check');
requireText(leads, 'Zapis leada wymaga potwierdzenia', 'Leads duplicate confirmation notification');
requireText(clients, 'Zapis klienta wymaga potwierdzenia', 'Clients duplicate confirmation notification');
requireText(leads, 'setLeadConflictOpen(true)', 'Leads conflict dialog open');
requireText(clients, 'setClientConflictOpen(true)', 'Clients conflict dialog open');
requireText(leads, 'handleCreateLeadAnyway', 'Leads explicit add anyway path');
requireText(clients, 'handleCreateClientAnyway', 'Clients explicit add anyway path');
requireText(leads, 'candidate.entityType === \'client\' ? { ...candidate, canRestore: false } : candidate', 'Lead client candidate non-restorable map');

const scripts = pkg.scripts || {};
requireText(JSON.stringify(scripts), 'check:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix', 'package check script');
requireText(JSON.stringify(scripts), 'test:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix', 'package test script');
requireText(String(scripts.prebuild || ''), 'check-stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.cjs', 'prebuild guard');

console.log(JSON.stringify({ ok: true, stage: 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX' }, null, 2));
