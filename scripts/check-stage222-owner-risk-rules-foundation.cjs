const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

function fail(message) {
  console.error('STAGE222_OWNER_RISK_RULES_FOUNDATION_FAIL: ' + message);
  process.exit(1);
}

const helperPath = 'src/lib/owner-control/owner-risk-rules.ts';
const settingsPath = 'src/lib/owner-control/owner-risk-settings.ts';
if (!exists(helperPath)) fail('missing owner-risk-rules helper');
if (!exists(settingsPath)) fail('missing owner-risk-settings adapter');

const helper = read(helperPath);
const settingsAdapter = read(settingsPath);
const settings = read('src/pages/Settings.tsx');
const leads = read('src/pages/Leads.tsx');
const cases = read('src/pages/Cases.tsx');
const recordBadges = exists('src/lib/record-operational-badges.ts') ? read('src/lib/record-operational-badges.ts') : '';
const today = read('src/pages/TodayStable.tsx');
const pkg = JSON.parse(read('package.json'));

for (const token of [
  'DEFAULT_HIGH_VALUE_THRESHOLD_PLN = 5000',
  'DEFAULT_OWNER_CONTROL_WARNING_DAYS = 7',
  'DEFAULT_OWNER_CONTROL_CRITICAL_DAYS = 14',
  'SALES_SILENCE_THRESHOLDS_DAYS = [1, 2, 3, 5, 7, 14]',
  'OwnerRiskSeverity',
  'OwnerRiskBadge',
  'OwnerRiskSettings',
  'normalizeOwnerRiskSettings',
  'getLeadOwnerRiskBadges',
  'getCaseOwnerRiskBadges',
  'getMoneyOwnerRiskBadges',
  'settings.warningDays',
  'settings.criticalDays',
  'Brak następnej akcji',
  'Wysoka wartość',
  'Brak następnego ruchu',
  'Sprawa bez ruchu ${settings.warningDays}+ dni',
  'Sprawa bez ruchu ${settings.criticalDays}+ dni',
  'Pieniądze bez ruchu',
]) {
  if (!helper.includes(token)) fail('helper missing token: ' + token);
}

if (!settings.includes('Progi kontroli sprzedaży')) fail('Settings missing owner control threshold section');
if (!settings.includes('Ostrzegaj po')) fail('Settings missing warning days input label');
if (!settings.includes('Alarm krytyczny po')) fail('Settings missing critical days input label');
if (!settings.includes('Wysoka wartość od')) fail('Settings missing high value input label');
if (!settings.includes('readOwnerRiskSettings')) fail('Settings missing owner risk settings adapter read');
if (!settings.includes('writeOwnerRiskSettings')) fail('Settings missing owner risk settings adapter write');
if (!settingsAdapter.includes('Lokalny zapis działa tylko jako fallback')) fail('Settings adapter must describe local fallback');

if (!leads.includes('buildRecordOperationalBadges')) fail('Leads must keep record-level badge integration');
if (!recordBadges.includes('getLeadOwnerRiskBadges')) fail('Record badges must reuse owner risk rules for leads');

if (!cases.includes('getCaseOwnerRiskBadges')) fail('Cases list missing owner risk case badges helper');
if (!cases.includes('data-stage222-owner-risk-case-badge="true"')) fail('Cases list missing case badge marker');
if (!cases.includes('cf-status-pill')) fail('Case badges must use existing status pill');

if (today.includes('Kontrola sprzedaży')) fail('Today must not get new Kontrola sprzedaży section');
if (!today.includes('Wysoka wartość / ryzyko')) fail('Today must keep existing Wysoka wartość / ryzyko section');

if (/stage222.*\.css/i.test(settings + leads + cases + today)) fail('Stage222 must not add one-off CSS');

if (pkg.scripts['check:stage222-owner-risk-rules-foundation'] !== 'node scripts/check-stage222-owner-risk-rules-foundation.cjs') fail('missing package check script');
if (pkg.scripts['test:stage222-owner-risk-rules-foundation'] !== 'node --test tests/stage222-owner-risk-rules-foundation.test.cjs') fail('missing package test script');

console.log('STAGE222_OWNER_RISK_RULES_FOUNDATION: OK');
