const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'tsconfig.r23a-active.json');
const mapperPath = path.join(root, 'scripts', 'diagnostics', 'lf-prod-sot-g15-r23a-active-type-debt-map.cjs');

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const mapper = fs.readFileSync(mapperPath, 'utf8');

test('R23A scope includes only active product and API roots', () => {
  assert.deepEqual(config.include, [
    'src/**/*.ts',
    'src/**/*.tsx',
    'src/**/*.d.ts',
    'api/**/*.ts',
    'api/**/*.tsx',
    'vite.config.ts',
  ]);
  assert.equal(config.compilerOptions.allowJs, false);
  assert.equal(config.compilerOptions.checkJs, false);
  assert.equal(config.compilerOptions.noEmit, true);
});

test('R23A scope explicitly excludes historical and generated roots', () => {
  for (const required of ['node_modules', 'dist', 'coverage', '_project', '_backup', 'backup', 'backups', 'scripts', 'tools', '**/*.cjs', '**/*.mjs']) {
    assert.ok(config.exclude.includes(required), `missing exclusion: ${required}`);
  }
});

test('R23A mapper rejects scope leaks and emits structured evidence', () => {
  assert.match(mapper, /Active diagnostic scope leaked outside src\/api\/vite\.config\.ts/);
  assert.match(mapper, /active-type-debt\.json/);
  assert.match(mapper, /active-type-debt\.md/);
  assert.match(mapper, /active-type-debt\.log/);
  assert.match(mapper, /errors_by_code/);
  assert.match(mapper, /top_error_files/);
  assert.match(mapper, /LF-PROD-SOT-G15-R23B_ACTIVE_TYPE_DEBT_REPAIR_PLAN/);
});

test('R23A mapper is diagnostic and does not edit product or package files', () => {
  assert.doesNotMatch(mapper, /writeFileSync\([^\n]*(?:package\.json|package-lock\.json|src\/|api\/)/);
  assert.doesNotMatch(mapper, /git\s+(?:add|commit|push|reset|clean)/);
});
