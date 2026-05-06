#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { validatePolishMojibake } = require('./check-polish-mojibake.cjs');

function read(root, rel, failures) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    failures.push(`${rel} missing`);
    return '';
  }
  return fs.readFileSync(full, 'utf8');
}

function expect(failures, condition, message) {
  if (!condition) failures.push(message);
}

function validateUiTruthCopy(root = process.cwd()) {
  const failures = [];
  failures.push(...validatePolishMojibake(root).map((hit) => `${hit.split(':').slice(0,2).join(':')}: mojibake marker detected`));

  const uiTruth = read(root, 'src/lib/ui-truth.ts', failures);
  const billing = read(root, 'src/pages/Billing.tsx', failures);
  const support = read(root, 'src/pages/SupportCenter.tsx', failures);
  const globalQuickActions = read(root, 'src/components/GlobalQuickActions.tsx', failures);
  const adminAi = read(root, 'src/pages/AdminAiSettings.tsx', failures);
  const pkgText = read(root, 'package.json', failures);

  for (const badge of ['Gotowe', 'Beta', 'Wymaga konfiguracji', 'Niedostępne w Twoim planie', 'W przygotowaniu']) {
    expect(failures, uiTruth.includes(badge), `src/lib/ui-truth.ts missing feature truth badge: ${badge}`);
    expect(failures, billing.includes(badge) || adminAi.includes(badge) || globalQuickActions.includes(badge), `runtime UI missing feature truth badge: ${badge}`);
  }

  expect(failures, !billing.includes('MOJIBAKE_GUARD'), 'src/pages/Billing.tsx still contains MOJIBAKE_GUARD constants');
  expect(failures, billing.includes('Stripe wymaga konfiguracji') || billing.includes('Wymaga konfiguracji'), 'Billing must not present Stripe checkout as always ready');
  expect(failures, billing.includes('webhook') || billing.includes('Webhook'), 'Billing must explain paid access is confirmed by webhook');

  expect(failures, !support.includes('Wyślij zgłoszenie'), 'SupportCenter should not say Wyślij zgłoszenie when it stores an in-app support request');
  expect(failures, !support.includes('Wyślij odpowiedź'), 'SupportCenter should not say Wyślij odpowiedź when it stores an in-app reply');
  expect(failures, support.includes('Zapisz zgłoszenie') || support.includes('Zapisz odpowiedź'), 'SupportCenter missing save-based support copy');

  expect(failures, globalQuickActions.includes('Niedostępne w Twoim planie') || globalQuickActions.includes('Wymaga konfiguracji') || globalQuickActions.includes('Beta'), 'GlobalQuickActions should carry truth-status copy for gated AI actions');

  try {
    const pkg = JSON.parse(pkgText);
    expect(failures, pkg.scripts?.['check:ui-truth-copy'] === 'node scripts/check-ui-truth-copy.cjs', 'package.json missing check:ui-truth-copy script');
    expect(failures, pkg.scripts?.['test:ui-truth-copy'] === 'node --test tests/ui-truth-copy.test.cjs', 'package.json missing test:ui-truth-copy script');
  } catch (error) {
    failures.push(`package.json invalid JSON: ${error.message}`);
  }

  return failures;
}

if (require.main === module) {
  const failures = validateUiTruthCopy(process.cwd());
  if (failures.length) {
    console.error('UI truth/copy guard failed.');
    for (const failure of failures.slice(0, 160)) console.error('- ' + failure);
    if (failures.length > 160) console.error(`...and ${failures.length - 160} more`);
    process.exit(1);
  }
  console.log('OK: UI truth/copy guard passed.');
}

module.exports = { validateUiTruthCopy };
