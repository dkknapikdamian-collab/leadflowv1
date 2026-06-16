const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function read(file) {
  const full = path.join(ROOT, file);
  if (!fs.existsSync(full)) throw new Error(`Missing required file: ${file}`);
  return fs.readFileSync(full, 'utf8');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const plans = read('src/lib/plans.ts');
const access = read('src/lib/access.ts');
const apiMe = read('api/me.ts');
const r2Guard = read('scripts/check-stage231e2-r2-trial-14d-lock.cjs');
const r2Report = read('_project/runs/2026-06-12_STAGE231E2_R2_TRIAL_14D_LOCK.md');

// R3 contract:
// - older account bootstrap guard must not block the accepted R2 product decision.
// - canonical trial is 14 days.
// - trial_21d remains allowed only as a legacy alias for existing DB rows.
// - unknown/missing plans fail closed and must not silently grant trial features.

assert(plans.includes('export const TRIAL_DAYS = 14;'), 'plans.ts must define the active trial as 14 days.');
assert(plans.includes("trial: 'trial_14d'"), 'PLAN_IDS.trial must use canonical trial_14d.');
assert(plans.includes('trial_14d: PLAN_IDS.trial'), 'plans.ts must include trial_14d alias.');
assert(plans.includes('trial_21d: PLAN_IDS.trial'), 'plans.ts must keep trial_21d as a legacy alias for existing rows.');
assert(!plans.includes('export const TRIAL_DAYS = 14;'), 'plans.ts must not define 21-day trial.');
assert(!plans.includes("trial: 'trial_14d'"), 'trial_21d must not be the canonical trial id.');
assert(!plans.includes('Trial 14 dni'), 'active plan copy must not say Trial 14 dni.');

assert(
  plans.includes('STAGE231E2_R2_TRIAL_14D_LOCK') || plans.includes('STAGE231E2_ACCOUNT_TRIAL_BOOTSTRAP_BLOCKER'),
  'plans.ts must document the account trial/bootstrap stage marker.'
);

assert(access.includes("import { TRIAL_DAYS } from './plans';"), 'access.ts must source trial length from plans.ts.');
assert(!/const\s+TRIAL_LENGTH_DAYS\s*=\s*21\b/.test(access), 'access.ts must not hard-code a 21-day trial.');
assert(!/21\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/.test(access), 'access.ts must not hard-code 21-day milliseconds.');

assert(apiMe.includes('PLAN_TRIAL_DAYS') && apiMe.includes('PLAN_TRIAL_MS'), 'api/me.ts must source trial duration from plans.ts.');
assert(apiMe.includes('STAGE231E2_R2_TRIAL_14D_LOCK'), 'api/me.ts must include R2 stage marker.');
assert(!/const\s+TRIAL_DAYS\s*=\s*21\b/.test(apiMe), 'api/me.ts must not hard-code TRIAL_DAYS=21.');
assert(!/21\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/.test(apiMe), 'api/me.ts must not hard-code 21-day milliseconds.');

assert(r2Guard.includes('STAGE231E2_R2_TRIAL_14D_LOCK'), 'R2 trial 14d guard must exist.');
assert(r2Report.includes('AUDYT PRZED ETAPEM') && r2Report.includes('AUDYT PO ETAPIE'), 'R2 run report must include stage audits.');
assert(r2Report.includes('14 dni') || r2Report.includes('14-day'), 'R2 run report must document 14-day trial decision.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_ACCOUNT_TRIAL_BOOTSTRAP_GUARD_R3',
  contract: 'older bootstrap guard accepts R2 14-day trial model, keeps legacy trial_21d alias, and blocks 21-day canonical fallback',
}, null, 2));