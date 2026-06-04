#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();

function read(rel) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing required file: ${rel}`);
  }
  return fs.readFileSync(p, 'utf8');
}

function assertIncludes(haystack, needle, label) {
  if (!haystack.includes(needle)) {
    throw new Error(`Missing ${label}: ${needle}`);
  }
}

const next = read('_project/07_NEXT_STEPS.md');
const decisions = read('_project/04_DECISIONS.md');
const guards = read('_project/06_GUARDS_AND_TESTS.md');

assertIncludes(next, 'STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_START', 'Stage221 start marker');
assertIncludes(next, 'STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_END', 'Stage221 end marker');

for (const stage of [
  'A35 — Readiness Audit',
  'A35B — Mandatory Next Step Contract',
  'A41 — Contact Cadence Grid',
  'A46 — Sales Funnel Movement View',
  'A42 — Lost Lead Rescue',
  'A45 — Finance Watchlist',
  'A44 — Owner Digest',
  'A36 — Drafts Rebuild',
  'A47 — Branchen Playbooks',
]) {
  assertIncludes(next, stage, `roadmap stage ${stage}`);
}

for (const required of [
  'Nie budujemy „tańszego CRM-a”',
  'owner control',
  'SaaS ma być furtką',
  'Nie budować KSeF',
  'Nie budować fakturowania',
  'Nie używać `git add .`',
]) {
  assertIncludes(next, required, `roadmap principle ${required}`);
}

assertIncludes(decisions, 'CloseFlow jako owner control system, nie tani CRM', 'owner-control decision');
assertIncludes(guards, 'check-stage221-owner-control-roadmap-memory.cjs', 'guard registration');

const roadmapPath = path.join(root, '_project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md');
if (!fs.existsSync(roadmapPath)) {
  throw new Error('Missing roadmap file: _project/roadmaps/2026-06-04 - CloseFlow owner control roadmap po researchu CRM.md');
}

console.log('STAGE221_OWNER_CONTROL_ROADMAP_MEMORY_GUARD_OK');
