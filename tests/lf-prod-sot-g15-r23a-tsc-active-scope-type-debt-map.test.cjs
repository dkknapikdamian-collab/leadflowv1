const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');
const { parseTscOutput, buildSummary } = require('../scripts/diagnostics/map-g15-r23a-active-tsc-debt.cjs');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-g15-r23a-tsc-active-scope.cjs');
const config = JSON.parse(fs.readFileSync(path.join(root, 'tsconfig.json'), 'utf8'));

test('R23A active TypeScript scope guard passes', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /excludes historical patcher roots/);
});

test('main tsconfig has an exact active-source boundary', () => {
  assert.deepEqual(config.include, ['src/**/*', 'api/**/*', 'vite.config.ts']);
  for (const excluded of ['node_modules', 'dist', '_project', '_local_backups', 'backups', 'bisect', 'scripts', 'tools']) {
    assert.ok(config.exclude.includes(excluded), `missing exclude ${excluded}`);
  }
  assert.equal(config.compilerOptions.allowJs, true);
  assert.equal(config.compilerOptions.noEmit, true);
});

test('diagnostic parser maps active TypeScript errors without hiding them', () => {
  const parsed = parseTscOutput([
    "src/pages/ClientDetail.tsx(10,4): error TS2322: Example active error",
    "api/system.ts(20,8): error TS2345: Example API error",
  ].join('\n'));
  const summary = buildSummary(2, parsed);
  assert.equal(summary.status, 'ACTIVE_TYPE_DEBT_IDENTIFIED');
  assert.equal(summary.errorCount, 2);
  assert.deepEqual(summary.firstError, {
    file: 'src/pages/ClientDetail.tsx',
    line: 10,
    column: 4,
    code: 'TS2322',
    message: 'Example active error',
  });
  assert.equal(summary.nonActiveErrorCount, 0);
});

test('diagnostic rejects historical scope leakage and global type-foundation failures', () => {
  const leaked = buildSummary(2, parseTscOutput('scripts/old-patcher.cjs(1,1): error TS1005: expected'));
  assert.equal(leaked.status, 'NON_PRODUCT_SCOPE_LEAK');

  const globalFailure = buildSummary(2, parseTscOutput("error TS2688: Cannot find type definition file for 'react'."));
  assert.equal(globalFailure.status, 'GLOBAL_TYPE_FOUNDATION_ERROR');
});
