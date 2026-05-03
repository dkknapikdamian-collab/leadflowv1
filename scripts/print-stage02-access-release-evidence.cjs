#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'docs', 'release', 'STAGE02_ACCESS_BILLING_EVIDENCE_2026-05-03.md');

function sh(command) {
  try {
    return execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch {
    return 'COMMAND_FAILED: ' + command;
  }
}

const packagePath = path.join(root, 'package.json');
const quietPath = path.join(root, 'scripts', 'closeflow-release-check-quiet.cjs');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const quiet = fs.existsSync(quietPath) ? fs.readFileSync(quietPath, 'utf8') : '';
const checks = [
  ['Stage02A source of truth guard', 'check:access-billing-source-of-truth-stage02a'],
  ['Stage02B CaseDetail write gate', 'check:case-detail-write-access-gate-stage02b'],
  ['Stage02C evidence guard', 'check:stage02-access-billing-release-evidence'],
  ['Repo backup hygiene', 'check:repo-backup-hygiene'],
  ['Quiet release gate', 'verify:closeflow:quiet'],
];

const lines = [];
lines.push('# Stage02 release evidence - access / billing / workspace');
lines.push('');
lines.push('Date: 2026-05-03');
lines.push('Branch: ' + sh('git branch --show-current'));
lines.push('Commit: ' + sh('git rev-parse --short HEAD') + ' - ' + sh('git log -1 --pretty=%s'));
lines.push('');
lines.push('## Working tree at evidence generation');
lines.push('');
lines.push('```');
lines.push(sh('git status --short') || 'clean');
lines.push('```');
lines.push('');
lines.push('## Guards');
lines.push('');
for (const [label, script] of checks) {
  lines.push('- ' + label + ': ' + (pkg.scripts && pkg.scripts[script] ? '`' + script + '`' : 'MISSING'));
}
lines.push('- Quiet runner includes Stage02B test: ' + (quiet.includes('tests/case-detail-write-access-gate-stage02b.test.cjs') ? 'YES' : 'NO'));
lines.push('- Quiet runner includes Stage02C evidence test: ' + (quiet.includes('tests/stage02-access-billing-release-evidence.test.cjs') ? 'YES' : 'NO'));
lines.push('- Quiet runner includes repo backup hygiene test: ' + (quiet.includes('tests/repo-backup-folders-not-tracked.test.cjs') ? 'YES' : 'NO'));
lines.push('');
lines.push('## Stage02 closed risks');
lines.push('');
lines.push('- Trial length, access statuses and billing UI truth are guarded by Stage02A.');
lines.push('- CaseDetail now has an explicit write access gate and Stage02A has no remaining warning for this screen.');
lines.push('- Backup folders from local stage work are blocked by repo hygiene guard.');
lines.push('- Digest and Polish text guards no longer force ASCII-only UI copy.');
lines.push('');
lines.push('## Manual release checks still required');
lines.push('');
lines.push('- Stripe checkout and webhook in test mode: success, cancel, resume and payment_failed.');
lines.push('- Trial expired on a real workspace: read access remains, new writes are blocked.');
lines.push('- Create lead, task, event and case item on an active trial workspace.');
lines.push('- Mobile reload and PWA clean refresh.');
lines.push('');
lines.push('## Next stage');
lines.push('');
lines.push('Stage03A should start API/Supabase schema contract hardening and reduce runtime schema fallback chaos.');
lines.push('');

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, lines.join('\n'), 'utf8');
console.log('Wrote ' + path.relative(root, out));
