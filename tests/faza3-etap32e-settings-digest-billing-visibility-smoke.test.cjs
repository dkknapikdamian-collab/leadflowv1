const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8').replace(/^\uFEFF/, '');
}

function count(text, needle) {
  return (text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
}

test('Faza 3 Etap 3.2E has unique Settings plan gates', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.equal(count(settings, 'const canUseGoogleCalendarByPlan'), 1);
  assert.equal(count(settings, 'const canUseDigestByPlan'), 1);
  assert.equal(count(settings, 'const digestUiVisibleByPlan'), 1);
});

test('Faza 3 Etap 3.2E gates Settings Google Calendar and digest visibility', () => {
  const settings = read('src/pages/Settings.tsx');

  assert.match(settings, /canUseGoogleCalendarByPlan\s*=\s*Boolean\(isAdmin \|\| isAppOwner \|\| access\?\.features\?\.googleCalendar\)/);
  assert.match(settings, /const loadGoogleCalendarStatus = async \(\) => \{[\s\S]*if \(!canUseGoogleCalendarByPlan\) \{[\s\S]*DISABLED_BY_PLAN[\s\S]*return;[\s\S]*setCheckingGoogleCalendar\(true\)/);
  assert.match(settings, /useEffect\(\(\) => \{[\s\S]*if \(!canUseGoogleCalendarByPlan\)[\s\S]*loadGoogleCalendarStatus\(\)[\s\S]*\}, \[workspace\?\.id, activeUserId, activeUserEmail, canUseGoogleCalendarByPlan\]\)/);
  assert.match(settings, /<section hidden=\{!canUseGoogleCalendarByPlan\} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-stage12="outbound-backfill"/);
  assert.match(settings, /<section hidden=\{!canUseGoogleCalendarByPlan\} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-reminder-ui="stage06"/);
  assert.match(settings, /<section hidden=\{!canUseGoogleCalendarByPlan\} className="settings-section-card" data-plan-visibility-stage32e="google-calendar" data-google-calendar-sync-v1-stage03="true"/);
  assert.match(settings, /canUseDigestByPlan\s*=\s*Boolean\(isAdmin \|\| isAppOwner \|\| access\?\.features\?\.digest\)/);
  assert.match(settings, /digestUiVisibleByPlan\s*=\s*DAILY_DIGEST_EMAIL_UI_VISIBLE && canUseDigestByPlan/);
});

test('Faza 3 Etap 3.2E keeps Billing as allowed upsell/comparison surface', () => {
  const billing = read('src/pages/Billing.tsx');
  const pkg = JSON.parse(read('package.json'));
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');

  assert.match(billing, /data-plan-visibility-stage32e="billing-plan-comparison"/);
  assert.match(billing, /data-plan-visibility-stage32e="billing-feature-matrix"/);
  assert.match(billing, /Google Calendar sync \u2014 w przygotowaniu \/ wymaga konfiguracji OAuth/);
  assert.match(billing, /Asystent aplikacji i dyktowanie AI w trybie warunkowym \(provider \+ env\)/);
  assert.ok(billing.includes('Warstwy AI: lokalne/regu'));
  assert.ok(billing.includes('zewn\u0119trzny model dopiero po konfiguracji providera i env w Vercel.'));
  assert.match(billing, /Funkcji nieudost\u0119pnionych backendowo nie udajemy\./);

  assert.equal(pkg.scripts['check:faza3-etap32e-settings-digest-billing-visibility-smoke'], 'node scripts/check-faza3-etap32e-settings-digest-billing-visibility-smoke.cjs');
  assert.equal(pkg.scripts['test:faza3-etap32e-settings-digest-billing-visibility-smoke'], 'node --test tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs');
  assert.match(quiet, /tests\/faza3-etap32e-settings-digest-billing-visibility-smoke\.test\.cjs/);
});
