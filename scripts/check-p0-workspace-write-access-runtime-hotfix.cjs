const fs = require('fs');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

const accessGate = fs.readFileSync('src/server/_access-gate.ts', 'utf8');
const auth = fs.readFileSync('src/server/_supabase-auth.ts', 'utf8');

assert(accessGate.includes('P0_WORKSPACE_WRITE_ACCESS_STATUS_COMPAT_2026_05_03'), 'brak markera hotfixa access gate');
assert(accessGate.includes('normalizeWorkspaceAccessStatus'), 'brak normalizacji statusu workspace');
assert(accessGate.includes("rawStatus === 'trial_expired' && freePlan"), 'trial_expired + free nie przechodzi w free_active');
assert(accessGate.includes('hasFutureDate(trialEndsAt)'), 'brak naprawy trial_expired/inactive przy przyszlym trialEndsAt');
assert(accessGate.includes("status === 'free_active' || status === 'free'"), 'Free nie jest traktowany jako dozwolony write status');
assert(accessGate.includes("status.startsWith('closeflow_')"), 'brak kompatybilnosci starych planow closeflow_*');
assert(accessGate.includes('const status = normalizeWorkspaceAccessStatus(workspace, explicitStatus);'), 'assertWorkspaceWriteAccess nie uzywa normalizacji statusu');
assert(auth.includes('row.status ?? row.statusCode'), 'writeAuthErrorResponse nie przepuszcza status/statusCode');
assert(auth.includes('status >= 400 && status <= 599'), 'writeAuthErrorResponse nie ogranicza statusu HTTP');

console.log('PASS p0 workspace write access runtime hotfix');
