const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('Stage222 owner risk rules helper defines thresholds and badge contracts', () => {
  const helper = read('src/lib/owner-control/owner-risk-rules.ts');

  for (const token of [
    'DEFAULT_HIGH_VALUE_THRESHOLD_PLN = 5000',
    'DEFAULT_OWNER_CONTROL_WARNING_DAYS = 7',
    'DEFAULT_OWNER_CONTROL_CRITICAL_DAYS = 14',
    'SALES_SILENCE_THRESHOLDS_DAYS = [1, 2, 3, 5, 7, 14]',
    'normalizeOwnerRiskSettings',
    'getLeadOwnerRiskBadges',
    'getCaseOwnerRiskBadges',
    'getMoneyOwnerRiskBadges',
    'settings.warningDays',
    'settings.criticalDays',
    'Brak następnej akcji',
    'Wysoka wartość',
    'Brak następnego ruchu',
    'Pieniądze bez ruchu',
  ]) {
    assert.match(helper, new RegExp(token.replace(/[+]/g, '\\+').replace(/[[]/g, '\\[').replace(/[]]/g, '\\]')), 'missing token: ' + token);
  }
});

test('Stage222 wires settings, lead badges and case badges without new Today panel', () => {
  const settings = read('src/pages/Settings.tsx');
  const cases = read('src/pages/Cases.tsx');
  const recordBadges = read('src/lib/record-operational-badges.ts');
  const today = read('src/pages/TodayStable.tsx');

  assert.match(settings, /Progi kontroli sprzedaży/);
  assert.match(settings, /Ostrzegaj po/);
  assert.match(settings, /Alarm krytyczny po/);
  assert.match(settings, /Wysoka wartość od/);
  assert.match(settings, /writeOwnerRiskSettings/);
  assert.match(recordBadges, /getLeadOwnerRiskBadges/);
  assert.match(cases, /getCaseOwnerRiskBadges/);
  assert.match(cases, /data-stage222-owner-risk-case-badge="true"/);
  assert.doesNotMatch(today, /Kontrola sprzedaży/);
  assert.match(today, /Wysoka wartość \/ ryzyko/);
});

test('Stage222 package scripts exist', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:stage222-owner-risk-rules-foundation'], 'node scripts/check-stage222-owner-risk-rules-foundation.cjs');
  assert.equal(pkg.scripts['test:stage222-owner-risk-rules-foundation'], 'node --test tests/stage222-owner-risk-rules-foundation.test.cjs');
});
