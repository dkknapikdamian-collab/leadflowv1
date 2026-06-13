const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

function requireToken(source, token, label) {
  if (!source.includes(token)) throw new Error(`${label} missing token: ${token}`);
}

const engine = read('src/lib/owner-control/owner-control-baseline.ts');
const today = read('src/pages/TodayStable.tsx');
const settings = read('src/pages/Settings.tsx');
const workspaceHook = read('src/hooks/useWorkspace.ts');
const api = read('api/system.ts');
const me = read('api/me.ts');
const migration = read('supabase/migrations/20260613065348_stage231f_r3_owner_control_workspace_settings.sql');
const pkg = JSON.parse(read('package.json'));

for (const token of ['buildOwnerControlBaseline', 'buildNextMoveContract', 'buildActivityTruth', 'getNearestPlannedAction', 'missingNextStep', 'criticalDays', 'warningDays']) {
  requireToken(engine, token, 'engine');
}
for (const token of ['Co masz zrobić dzisiaj', 'buildOwnerControlBaseline', 'ownerControlBaseline.items.map', 'badgeTone']) {
  requireToken(today, token, 'Today');
}
if (today.includes('getLeadRisk(')) throw new Error('Today still uses legacy local getLeadRisk');
if (today.includes('.slice(0, 5)')) throw new Error('Today still limits owner control risk lists to five records');
for (const token of ['Progi kontroli sprzedaży', 'Ostrzegaj po', 'Alarm krytyczny po', 'Zapisz progi', 'data-stage231f-r3-owner-control-preview']) {
  requireToken(settings, token, 'Settings');
}
for (const token of ['isSupabaseConfigured()', 'writeOwnerRiskSettings', 'API workspace jest niedost']) {
  requireToken(settings, token, 'Settings fallback');
}
for (const token of ['readOwnerRiskSettings()', 'ownerControlWarningDays: ownerRiskSettings.warningDays', 'ownerControlCriticalDays: ownerRiskSettings.criticalDays']) {
  requireToken(workspaceHook, token, 'workspace hard-refresh fallback');
}
requireToken(api, 'assertWorkspaceOwnerOrAdmin(workspaceId, req)', 'workspace permission gate');
for (const token of ['owner_control_warning_days', 'owner_control_critical_days', 'owner_control_high_value_threshold_pln']) {
  requireToken(api, token, 'workspace API');
  requireToken(me, token, '/api/me');
  requireToken(migration, token, 'migration');
}
if (pkg.scripts['check:stage231f-r3-owner-control-baseline'] !== 'node scripts/check-stage231f-r3-owner-control-baseline.cjs') throw new Error('missing check script');
if (pkg.scripts['test:stage231f-r3-owner-control-baseline'] !== 'node --test tests/stage231f-r3-owner-control-baseline.test.cjs') throw new Error('missing test script');

console.log('STAGE231F_R3_OWNER_CONTROL_BASELINE: OK');
