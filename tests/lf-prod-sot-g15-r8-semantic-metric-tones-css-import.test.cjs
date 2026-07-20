const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const indexCssPath = path.join(root, 'src/index.css');
const semanticCssPath = path.join(root, 'src/styles/closeflow-operator-semantic-tones.css');
const guardPath = path.join(root, 'scripts/check-vs7-semantic-metric-tones.cjs');

const indexCss = fs.readFileSync(indexCssPath, 'utf8');
const semanticCss = fs.readFileSync(semanticCssPath, 'utf8');
const semanticImport = "@import './styles/closeflow-operator-semantic-tones.css';";

test('semantic metric tone stylesheet is imported exactly once', () => {
  assert.equal(indexCss.split(semanticImport).length - 1, 1);
});

test('semantic tones load after design-system and before core contracts', () => {
  const designSystem = indexCss.indexOf("@import './styles/design-system/index.css';");
  const semanticTones = indexCss.indexOf(semanticImport);
  const coreContracts = indexCss.indexOf("@import './styles/core/core-contracts.css';");

  assert.ok(designSystem >= 0);
  assert.ok(semanticTones > designSystem);
  assert.ok(coreContracts > semanticTones);
});

test('semantic stylesheet retains source-of-truth marker and runtime selectors', () => {
  assert.match(semanticCss, /CLOSEFLOW_VS7_SEMANTIC_METRIC_TONE_SOURCE_OF_TRUTH/);
  assert.match(semanticCss, /data-cf-semantic-tone/);
  assert.match(semanticCss, /data-cf-operator-metric-icon-tone/);
  assert.match(semanticCss, /data-cf-semantic-section-card/);
});

test('VS7 guard passes after the import repair', () => {
  const result = spawnSync(process.execPath, [guardPath], {
    cwd: root,
    encoding: 'utf8',
  });

  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /CLOSEFLOW_VS7_SEMANTIC_METRIC_TONES_OK/);
});
