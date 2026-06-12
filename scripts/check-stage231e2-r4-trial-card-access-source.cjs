const fs = require('fs');
const path = require('path');

const root = process.cwd();
const layoutPath = path.join(root, 'src/components/Layout.tsx');
const reportPath = path.join(root, '_project/runs/2026-06-13_STAGE231E2_R4_TRIAL_CARD_ACCESS_SOURCE.md');

function fail(message) {
  console.error('STAGE231E2_R4_TRIAL_CARD_ACCESS_SOURCE_FAIL:', message);
  process.exit(1);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

const layout = fs.readFileSync(layoutPath, 'utf8');

assert(!layout.includes("import { parseISO, differenceInDays } from 'date-fns';"), 'Layout must not import date-fns for trial card days.');
assert(!layout.includes('differenceInDays(parseISO(workspace.trialEndsAt)'), 'Trial card must not derive days directly from workspace.trialEndsAt.');
assert(!layout.includes('workspace?.subscriptionStatus === \'trial_active\' ? <TrialCard'), 'Trial card must not render from raw workspace subscriptionStatus only.');
assert(!layout.includes('(safeDays / 21) * 100'), 'Trial card progress must not use stale 21-day denominator.');
assert(layout.includes('trialProgressPercent'), 'TrialCard must use trialProgressPercent from access summary.');
assert(layout.includes('shouldShowTrialCard'), 'Layout must calculate shouldShowTrialCard from access state.');
assert(layout.includes('access?.isTrialActive'), 'Trial card visibility must require access.isTrialActive.');
assert(layout.includes("access?.status === 'trial_active' || access?.status === 'trial_ending'"), 'Trial card visibility must allow active/ending trial states from access.');
assert(layout.includes('trialDaysLeft > 0'), 'Trial card visibility must block Trial 0 dni.');
assert(layout.includes('ctaLabel={access?.ctaLabel}'), 'Trial card CTA must use access ctaLabel.');

assert(fs.existsSync(reportPath), 'Run report must exist.');
const report = fs.readFileSync(reportPath, 'utf8');
for (const section of [
  'FAKTY Z KODU',
  'AUDYT PRZED ETAPEM',
  'CO ZMIENIONO',
  'TESTY / GUARDY',
  'AUDYT PO ETAPIE',
  'RYZYKA',
  'OBSIDIAN PAYLOAD',
  'NASTEPNY KROK',
]) {
  assert(report.includes(section), `Run report missing section: ${section}`);
}

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_R4_TRIAL_CARD_ACCESS_SOURCE',
  contract: 'sidebar trial card uses access summary, 14-day progress, and cannot render Trial 0 dni from raw workspace status',
}, null, 2));
