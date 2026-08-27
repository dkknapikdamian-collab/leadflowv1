const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('FRT-010 renders a real Lead Detail composition from the existing record owners', () => {
  const detail = read('src/pages/LeadDetail.tsx');
  const fallback = read('src/lib/supabase-fallback.ts');
  const layout = read('src/components/Layout.tsx');
  const shell = read('src/styles/owners/closeflow-page-shell.css');
  const detailCss = read('src/styles/owners/closeflow-rails-and-detail.css');
  const contract = read('_project/contracts/forteca-clean/FRT-010_LEAD_DETAIL.md');

  assert.match(contract, /STAGE_ID: FRT-010/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(detail, /data-forteca-frt-010-runtime="true"/);
  assert.match(detail, /data-forteca-frt-010-lead-header="true"/);
  assert.match(detail, /activeLeadDetailTab/);
  assert.match(detail, /leadActivityHistoryItems/);
  assert.match(detail, /displayedLeadWorkEntries/);
  assert.match(detail, /handleStartLeadEditing/);
  assert.match(detail, /handleCreateQuickTask/);
  assert.match(detail, /handleCreateQuickEvent/);
  assert.match(detail, /setIsAddNoteOpen\(true\)/);
  assert.match(detail, /href={`tel:\$\{String\(lead\.phone\)\}`}/);
  assert.match(detail, /setIsCreateCaseOpen\(true\)/);
  assert.match(fallback, /export function isLocalDevPreviewEnabled\(\)/);
  assert.match(fallback, /dev-activity-3/);
  assert.match(fallback, /fetchActivitiesFromSupabase/);
  assert.match(layout, /cf-route-lead-detail/);
  assert.match(layout, /navGroupsForShell/);
  assert.match(shell, /\.cf-route-lead-detail \.brand-logo\.forteca-shell-logo/);
  assert.match(shell, /\.cf-route-lead-detail > main\.main-lead-detail/);
  assert.match(shell, /\.lead-detail-legacy-shell/);
  assert.match(detailCss, /\.forteca-lead-detail/);
  assert.match(detailCss, /@media \(max-width: 760px\)/);
});

test('FRT-010 keeps the route honest and production-safe', () => {
  const detail = read('src/pages/LeadDetail.tsx');
  const fallback = read('src/lib/supabase-fallback.ts');

  assert.doesNotMatch(detail, /ACME Logistics|Jan Kowalski|Beta Systems/);
  assert.match(detail, /Brak opisu potrzeb klienta/);
  assert.match(detail, /Brak zaplanowanego kroku/);
  assert.match(fallback, /Only for local dev UI preview when Supabase is not configured/);
  assert.match(fallback, /return import\.meta\.env\.DEV && !isSupabaseConfigured\(\)/);
});
