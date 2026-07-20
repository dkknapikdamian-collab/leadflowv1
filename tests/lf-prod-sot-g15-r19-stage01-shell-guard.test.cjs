const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const guardPath = path.join(root, 'scripts/check-visual-stage01-shell.cjs');
const layout = fs.readFileSync(path.join(root, 'src/components/Layout.tsx'), 'utf8');
const quickActions = fs.readFileSync(path.join(root, 'src/components/GlobalQuickActions.tsx'), 'utf8');
const stage01Css = fs.readFileSync(path.join(root, 'src/styles/visual-stage01-shell.css'), 'utf8');
const indexCss = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
const guard = fs.readFileSync(guardPath, 'utf8');

test('reconciled Stage01 guard passes against current shell source truth', () => {
  const result = spawnSync(process.execPath, [guardPath], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`);
  assert.match(result.stdout, /guard reconciled with current navigation and global-action source truth/);
});

test('Stage01 stylesheet remains active while current shell overrides remain explicit', () => {
  assert.match(indexCss, /visual-stage01-shell\.css/);
  assert.match(stage01Css, /VISUAL_STAGE_01_SHELL_CSS/);
  assert.match(layout, /closeflow-compact-top-shell-source-truth\.css/);
  assert.match(layout, /closeflow-operator-top-trim-source-truth\.css/);
  assert.match(layout, /closeflow-unified-page-canvas-stage211c\.css/);
});

test('current navigation uses plan-gated Inbox szkiców and Zgłoszenia copy', () => {
  assert.match(layout, /label: 'Inbox szkiców'/);
  assert.match(layout, /label: 'Zgłoszenia'/);
  assert.match(layout, /canUseAiDraftsByPlan/);
  assert.doesNotMatch(layout, /label: 'Szkice AI'/);
  assert.doesNotMatch(layout, /label: 'Pomoc'/);
});

test('current global toolbar keeps plan gates and direct modal actions', () => {
  assert.match(quickActions, /canUseQuickAiCaptureByPlan/);
  assert.match(quickActions, /canUseAiDraftsByPlan/);
  assert.match(quickActions, /data-global-client-direct-modal-trigger="true"/);
  assert.match(quickActions, /data-global-task-direct-modal-trigger="true"/);
  assert.match(quickActions, /ClientCreateDialog/);
  assert.match(quickActions, /TaskCreateDialog/);
});

test('guard covers current shell and action source contracts', () => {
  for (const required of [
    'OperatorTopBarRuntime',
    'VisualFoundationRuntimeStage212M',
    'ContextActionDialogsHost',
    'QuickAiCapture',
    'ClientCreateDialog',
    'TaskCreateDialog',
    'closeflow-command-actions-source-truth.css',
  ]) assert.match(guard, new RegExp(required.replace(/\./g, '\\.')));
});
