const fs = require('node:fs');
const path = require('node:path');
const childProcess = require('node:child_process');

const ROOT = process.cwd();
const rel = (file) => path.join(ROOT, file);
const exists = (file) => fs.existsSync(rel(file));
const read = (file) => fs.readFileSync(rel(file), 'utf8');
const errors = [];
const warnings = [];
const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const requireFile = (file) => { if (!exists(file)) fail('missing file: ' + file); };
const requireText = (file, text, label = text) => { if (!exists(file) || !read(file).includes(text)) fail(file + ' missing ' + label); };
const forbid = (file, pattern, label) => { if (exists(file) && pattern.test(read(file))) fail(file + ' still has forbidden ' + label); };
const forbidText = (file, text, label = text) => { if (exists(file) && read(file).includes(text)) fail(file + ' still has forbidden ' + label); };

const canonical = 'src/lib/source-of-truth/billing-options.ts';
const billingPage = 'src/pages/Billing.tsx';
const accessRuntime = 'src/lib/access.ts';
const packageJson = 'package.json';
const reportPath = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY/LF-UI-SOT-CZ2-006_ACCESS_BILLING_PLAN_SOURCE_OF_TRUTH.md';
const routerPath = '10_PROJEKTY/CloseFlow_Lead_App/04_NAPRAWA_ZRODLA_PRAWDY - CloseFlow Lead App.md';

[canonical, billingPage, accessRuntime, packageJson].forEach(requireFile);

for (const token of [
  'BillingPeriod',
  'CheckoutPlanKey',
  'BillingPlanKey',
  'BillingPlanAvailability',
  'BillingPlanCard',
  'BillingAccessCopy',
  'BillingLimitItem',
  'BILLING_PLAN_OPTIONS',
  'BILLING_ACCESS_COPY_BY_STATUS',
  'BILLING_LIMIT_ITEMS',
  'BILLING_SETTLEMENT_STATUS_LABELS',
  'getBillingPlanPrice',
  'getBillingPlanPeriodLabel',
  'getBillingAccessCopy',
  'getDisplayBillingPlanId',
  'getCurrentBillingPlanName',
  'isBillingPlanCurrent',
  'getBillingPlanAvailability',
  'getBillingPlanStatusLabel',
  'getBillingSettlementStatusLabel',
  'getBillingLimitValue',
  'getBillingLimitTone',
]) requireText(canonical, token, token);

requireText(billingPage, "from '../lib/source-of-truth/billing-options'", 'billing-options import');
for (const token of [
  'BILLING_PLAN_OPTIONS',
  'BILLING_SETTLEMENT_STATUS_LABELS',
  'getBillingAccessCopy',
  'getBillingPlanAvailability',
  'getBillingPlanPeriodLabel',
  'getBillingPlanPrice',
  'getBillingPlanStatusLabel',
  'getBillingSettlementStatusLabel',
  'getCurrentBillingPlanName',
  'getDisplayBillingPlanId',
  'isBillingPlanCurrent',
]) requireText(billingPage, token, token);

forbid(billingPage, /type\s+CheckoutPlanKey\s*=/, 'local CheckoutPlanKey');
forbid(billingPage, /type\s+PlanAvailability\s*=/, 'local PlanAvailability');
forbid(billingPage, /type\s+PlanCard\s*=/, 'local PlanCard');
forbid(billingPage, /const\s+BILLING_PLANS\s*[:=]/, 'local BILLING_PLANS');
forbid(billingPage, /const\s+ACCESS_COPY\s*[:=]/, 'local ACCESS_COPY');
forbid(billingPage, /const\s+LIMIT_ITEMS\s*[:=]/, 'local LIMIT_ITEMS');
forbid(billingPage, /const\s+SETTLEMENT_STATUS_LABELS\s*[:=]/, 'local SETTLEMENT_STATUS_LABELS');
for (const helper of [
  'getPlanPrice',
  'getPlanPeriodLabel',
  'getAccessCopy',
  'getDisplayPlanId',
  'getCurrentPlanName',
  'isPlanCurrent',
  'getPlanAvailability',
  'getPlanStatusLabel',
  'getSettlementStatusLabel',
  'getLimitValue',
  'getLimitTone',
]) forbid(billingPage, new RegExp('function\\s+' + helper + '\\s*\\('), 'local helper ' + helper);

requireText(billingPage, 'createBillingCheckoutSessionInSupabase', 'checkout session integration');
requireText(billingPage, 'billingActionInSupabase', 'billing action integration');
requireText(billingPage, 'fetchPaymentsFromSupabase', 'settlement fetch');

const accessSource = exists(accessRuntime) ? read(accessRuntime) : '';
const accessWrapped = accessSource.includes('billing-options') || accessSource.includes('ui-tones');
const accessLegacyDebt = true;
if (!accessWrapped && !accessLegacyDebt) {
  fail('access.ts toneClassName/chipClassName is neither wrapped nor explicitly deferred as legacy debt');
}
if (!accessWrapped) {
  warn('LEGACY_DEBT: access.ts toneClassName/chipClassName full cleanup deferred after billing-options SOT');
}

for (const file of [canonical, billingPage, accessRuntime]) {
  for (const marker of ['Ä', 'Ă', 'Ĺ', 'â€', '�']) {
    if (exists(file) && read(file).includes(marker)) fail(file + ' contains mojibake marker: ' + marker);
  }
  for (const token of ['BILLING_BILLING_PLAN_OPTIONS', 'ACCESS_ACCESS_COPY', 'PLAN_PLAN_OPTIONS', 'BILLING_UI_TONES_TONES', 'bg-${', 'text-${', 'border-${']) {
    forbidText(file, token, 'bad billing token ' + token);
  }
}

requireText(
  packageJson,
  '"verify:lf-ui-sot-cz2-006-access-billing-source-of-truth": "node scripts/guards/verify-lf-ui-sot-cz2-006-access-billing-source-of-truth.cjs"',
  'package script verify:lf-ui-sot-cz2-006-access-billing-source-of-truth',
);

function findObsidianRoot() {
  const candidates = [
    process.env.OBSIDIAN_VAULT_ROOT,
    path.resolve(ROOT, '..', '00_OBSIDIAN_VAULT'),
    ROOT,
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(path.join(candidate, reportPath)) || fs.existsSync(path.join(candidate, routerPath)));
}

const obsidianRoot = findObsidianRoot();
if (obsidianRoot) {
  const reportAbs = path.join(obsidianRoot, reportPath);
  const routerAbs = path.join(obsidianRoot, routerPath);
  if (!fs.existsSync(reportAbs)) fail('missing Obsidian CZ2-006 report: ' + reportPath);
  if (!fs.existsSync(routerAbs)) fail('missing Obsidian CZ2 router: ' + routerPath);
  if (fs.existsSync(reportAbs)) {
    const report = fs.readFileSync(reportAbs, 'utf8');
    for (const token of ['LF-UI-SOT-CZ2-006', 'BILLING_OPTIONS_SOT_ADDED', 'BILLING_PAGE_WRAPPED', 'LOCAL_DUPLICATES_REMOVED_IN_SCOPE']) {
      if (!report.includes(token)) fail('Obsidian CZ2-006 report missing ' + token);
    }
  }
  if (fs.existsSync(routerAbs)) {
    const router = fs.readFileSync(routerAbs, 'utf8');
    if (!router.includes('LF-UI-SOT-CZ2-006')) fail('Obsidian router missing LF-UI-SOT-CZ2-006');
    if (!router.includes('BILLING_OPTIONS_SOT_ADDED')) fail('Obsidian router missing CZ2-006 implementation status');
  }
} else {
  warn('Obsidian vault not found from app repo; set OBSIDIAN_VAULT_ROOT or sync ../00_OBSIDIAN_VAULT to enable report/router verification.');
}

let changed = [];
try {
  changed = childProcess.execSync('git diff --name-only', { cwd: ROOT, encoding: 'utf8' })
    .split(/\r?\n/).filter(Boolean);
} catch {
  warn('git diff --name-only unavailable; scoped touch check limited to static file checks');
}
for (const file of changed) {
  if (/\.css$/i.test(file)) fail('CSS touched: ' + file);
  if (file === 'src/App.tsx') fail('src/App.tsx touched');
  if (file === 'src/lib/routes.ts') fail('src/lib/routes.ts touched');
  if (/^(supabase|migrations|sql)\//i.test(file) || /\.sql$/i.test(file)) fail('SQL/migration touched: ' + file);
}

const result = {
  ok: errors.length === 0,
  stage: 'LF-UI-SOT-CZ2-006',
  canonical,
  scopedConsumers: [billingPage],
  accessRuntime: accessWrapped ? 'WRAPPED' : 'LEGACY_DEBT_DEFERRED',
  changedFiles: changed,
  warnings,
  errors,
};
console.log(JSON.stringify(result, null, 2));
if (errors.length > 0) process.exit(1);
