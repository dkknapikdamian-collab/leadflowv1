const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function runNode(args) {
  return spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
}

test('Stage75 guard, test and quiet runner are syntactically valid', () => {
  for (const file of [
    'scripts/check-right-rail-card-source-of-truth-stage75.cjs',
    'tests/right-rail-card-source-of-truth.test.cjs',
    'scripts/closeflow-release-check-quiet.cjs',
  ]) {
    const result = runNode(['--check', file]);
    assert.equal(result.status, 0, file + '\n' + result.stderr);
  }
});

test('Stage75 guard passes on the current repo and is wired into package scripts', () => {
  const result = runNode(['scripts/check-right-rail-card-source-of-truth-stage75.cjs']);
  assert.equal(result.status, 0, result.stdout + result.stderr);

  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.scripts['check:right-rail-card-source-of-truth'], 'node scripts/check-right-rail-card-source-of-truth-stage75.cjs');
  assert.equal(pkg.scripts['test:right-rail-card-source-of-truth'], 'node --test tests/right-rail-card-source-of-truth.test.cjs');
});

test('verify:closeflow:quiet includes the right rail regression test', () => {
  const quiet = read('scripts/closeflow-release-check-quiet.cjs');
  assert.match(quiet, /const requiredTests = \[/);
  assert.ok(quiet.includes("'tests/right-rail-card-source-of-truth.test.cjs'"), 'quiet release gate does not include right rail regression test');
});

test('right rail source truth owns the rail card visual contract', () => {
  const css = read('src/styles/closeflow-right-rail-source-truth.css');
  for (const token of [
    '--cf-right-rail-card-bg: #ffffff',
    '--cf-right-rail-card-text: #0f172a',
    'background: var(--cf-right-rail-card-bg) !important',
    '.lead-top-relations',
    '.cases-shortcuts-rail-card',
    '.cases-risk-rail-card',
    '.clients-right-rail',
    '.right-list-row',
    '.right-list-empty',
  ]) {
    assert.ok(css.includes(token), 'missing source truth token: ' + token);
  }
});

test('/clients attention rail uses leads-only source and final copy', () => {
  const clients = read('src/pages/Clients.tsx');
  assert.ok(clients.includes('const leadsNeedingClientOrCaseLink = useMemo'));
  assert.ok(clients.includes('return (leads as Record<string, unknown>[])'));
  assert.ok(clients.includes('Leady do spięcia'));
  assert.ok(clients.includes('Brak klienta albo sprawy przy aktywnym temacie.'));
  assert.ok(clients.includes('Brak leadów wymagających spięcia.'));
  assert.ok(!clients.includes('Klienci do uwagi'));
  assert.ok(!clients.includes('Relacje bez pełnego spięcia lead/sprawa.'));
});

test('mobile dark-wrapper cleanup is allowed only when it paints rails light', () => {
  const css = read('src/styles/stage31-full-mobile-polish.css');
  assert.ok(css.includes('.bg-zinc-950'), 'stage31 fixture should still contain dark-wrapper cleanup selector');
  assert.ok(css.includes('background-color: #ffffff !important'), 'dark-wrapper cleanup must paint light, not dark');
});
