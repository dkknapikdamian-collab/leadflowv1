const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const REQUIRED = [
  'src/lib/plans.ts',
  'src/lib/access.ts',
  'src/hooks/useWorkspace.ts',
  'src/pages/Login.tsx',
  'api/me.ts',
  '_project/runs/2026-06-12_STAGE231E2_R2_TRIAL_14D_LOCK.md',
];

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
const workspace = read('src/hooks/useWorkspace.ts');
const login = read('src/pages/Login.tsx');
const apiMe = read('api/me.ts');
const report = read('_project/runs/2026-06-12_STAGE231E2_R2_TRIAL_14D_LOCK.md');

assert(plans.includes('export const TRIAL_DAYS = 14;'), 'plans.ts must define TRIAL_DAYS as 14.');
assert(plans.includes("trial: 'trial_14d'"), 'PLAN_IDS.trial must use canonical trial_14d.');
assert(plans.includes("name: 'Trial 14 dni'"), 'Trial plan label must say Trial 14 dni.');
assert(plans.includes('trial_14d: PLAN_IDS.trial'), 'PLAN_ALIASES must include trial_14d.');
assert(plans.includes('trial_21d: PLAN_IDS.trial'), 'PLAN_ALIASES must keep legacy trial_21d alias for existing rows.');
assert(!plans.includes('Trial 21 dni'), 'plans.ts must not show Trial 21 dni copy.');
assert(!plans.includes('export const TRIAL_DAYS = 21;'), 'plans.ts must not define 21-day trial.');

assert(access.includes("import { TRIAL_DAYS } from './plans';"), 'access.ts must source trial length from plans.ts.');
assert(!/const\s+TRIAL_LENGTH_DAYS\s*=\s*21\b/.test(access), 'access.ts must not hard-code 21-day trial length.');
assert(!/21\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/.test(access), 'access.ts must not hard-code 21-day duration.');

assert(
  workspace.includes('PLAN_IDS.trial') || workspace.includes("planId: 'trial_14d'"),
  'useWorkspace local fallback must source trial plan from PLAN_IDS.trial or canonical trial_14d.'
);
assert(
  workspace.includes('TRIAL_MS') || workspace.includes('Date.now() + 14 * 24 * 60 * 60 * 1000'),
  'useWorkspace local fallback must source trial duration from TRIAL_MS or explicit 14-day duration.'
);
assert(!workspace.includes("planId: 'trial_21d'"), 'useWorkspace must not use canonical trial_21d.');
assert(!workspace.includes('Date.now() + 21 * 24 * 60 * 60 * 1000'), 'useWorkspace must not use 21-day local fallback.');

assert(login.includes('Startujesz od 14 dni testu.'), 'Login card must say 14 days.');
assert(login.includes('14 dni testu na start'), 'Login hero must say 14 days.');
assert(!login.includes('Startujesz od 21 dni testu.'), 'Login card must not say 21 days.');
assert(!login.includes('21 dni testu na start'), 'Login hero must not say 21 days.');

assert(apiMe.includes('PLAN_TRIAL_DAYS') && apiMe.includes('PLAN_TRIAL_MS'), 'api/me.ts must source trial duration from plans.ts.');
assert(apiMe.includes('STAGE231E2_R2_TRIAL_14D_LOCK'), 'api/me.ts must include stage marker.');
assert(!/const\s+TRIAL_DAYS\s*=\s*21\b/.test(apiMe), 'api/me.ts must not hard-code TRIAL_DAYS=21.');
assert(!/21\s*\*\s*24\s*\*\s*60\s*\*\s*60\s*\*\s*1000/.test(apiMe), 'api/me.ts must not hard-code 21-day duration.');

assert(report.includes('AUDYT PRZED ETAPEM'), 'run report must include AUDYT PRZED ETAPEM.');
assert(report.includes('AUDYT PO ETAPIE'), 'run report must include AUDYT PO ETAPIE.');
assert(report.includes('14 dni'), 'run report must document 14-day trial decision.');

console.log(JSON.stringify({
  ok: true,
  stage: 'STAGE231E2_R2_TRIAL_14D_LOCK',
  contract: 'trial length is 14 days across plan model, local fallback, login copy and api/me duration source; legacy trial_21d alias remains for existing rows',
}, null, 2));