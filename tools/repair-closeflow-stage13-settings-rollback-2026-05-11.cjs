const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const STAGE = 'CLOSEFLOW_STAGE13_SETTINGS_ROLLBACK_2026_05_11';
const repo = process.cwd();

function abs(p) {
  return path.join(repo, p);
}

function exists(p) {
  return fs.existsSync(abs(p));
}

function read(p) {
  return fs.readFileSync(abs(p), 'utf8');
}

function write(p, value) {
  fs.mkdirSync(path.dirname(abs(p)), { recursive: true });
  fs.writeFileSync(abs(p), value, 'utf8');
}

function removeFile(p) {
  const full = abs(p);
  if (fs.existsSync(full)) fs.rmSync(full, { force: true });
}

function runGit(args, options = {}) {
  return cp.execFileSync('git', args, {
    cwd: repo,
    encoding: 'utf8',
    stdio: options.stdio || ['ignore', 'pipe', 'pipe'],
  });
}

function tryGit(args) {
  try {
    return runGit(args).trim();
  } catch (_) {
    return '';
  }
}

function backupExisting(paths) {
  const backupRoot = abs(`.closeflow-recovery-backups/stage13-settings-rollback-${Date.now()}`);
  fs.mkdirSync(backupRoot, { recursive: true });
  for (const p of paths) {
    const src = abs(p);
    if (!fs.existsSync(src)) continue;
    const dst = path.join(backupRoot, p);
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
  }
  return backupRoot;
}

function findSettingsLegacyAddCommit() {
  const output = tryGit(['log', '--diff-filter=A', '--format=%H', '--', 'src/pages/SettingsLegacy.tsx']);
  const commits = output.split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
  return commits[0] || '';
}

function restoreFromGitParent(stageCommit, filePath) {
  const content = runGit(['show', `${stageCommit}^:${filePath}`]);
  write(filePath, content);
}

function removeStage13CssFallback() {
  const cssPath = 'src/styles/Settings.css';
  if (!exists(cssPath)) return;
  let css = read(cssPath);

  // Remove explicitly marked Stage 13 repair blocks if they were appended.
  css = css.replace(/\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_START\s*\*\/[\s\S]*?\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_END\s*\*\//g, '');
  css = css.replace(/\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_START\s*\*\/[\s\S]*?\/\*\s*CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_END\s*\*\//g, '');
  css = css.replace(/\/\*\s*CLOSEFLOW_STAGE13_SETTINGS[^*]*\*\/[\s\S]*?(?=\/\*\s*CLOSEFLOW_|$)/g, '');

  // If no markers exist, remove the most dangerous vnext selectors.
  const selectors = [
    'settings-vnext-page',
    'settings-shell',
    'settings-main-column',
    'settings-tabs',
    'settings-tab',
    'settings-panel-card',
    'settings-account-rail',
    'settings-account-card',
    'settings-account-list',
    'settings-account-row',
    'settings-plan-grid',
    'settings-status-grid',
    'settings-badge-row',
  ];
  for (const selector of selectors) {
    const re = new RegExp(`\\n?\\.${selector}[^{}]*\\{[^{}]*(?:\\{[^{}]*\\}[^{}]*)*\\}`, 'g');
    css = css.replace(re, '');
  }

  // Remove media blocks that only reference settings-shell/account rail.
  css = css.replace(/@media\s*\([^)]*max-width[^)]*\)\s*\{[\s\S]*?\.settings-shell[\s\S]*?\.settings-account-rail[\s\S]*?\}/g, '');

  write(cssPath, css.trim() + '\n');
}

function cleanupPackageScripts() {
  const pkgPath = 'package.json';
  if (!exists(pkgPath)) return;
  const pkg = JSON.parse(read(pkgPath));
  pkg.scripts = pkg.scripts || {};
  delete pkg.scripts['check:settings-tabs-layout'];
  delete pkg.scripts['check:settings-layout-repair1'];
  pkg.scripts['check:settings-rollback-2026-05-11'] = 'node scripts/check-closeflow-settings-rollback-2026-05-11.cjs';
  write(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

function removeStage13Files() {
  const files = [
    'src/pages/SettingsLegacy.tsx',
    'scripts/check-closeflow-settings-tabs-layout.cjs',
    'scripts/check-closeflow-settings-layout-repair1.cjs',
    'tools/repair-closeflow-stage13-settings-tabs-layout-2026-05-11.cjs',
    'tools/repair-closeflow-stage13-settings-layout-repair1-2026-05-11.cjs',
    'docs/release/CLOSEFLOW_STAGE13_SETTINGS_TABS_LAYOUT_2026-05-11.md',
    'docs/release/CLOSEFLOW_STAGE13_SETTINGS_LAYOUT_REPAIR1_2026-05-11.md',
  ];
  files.forEach(removeFile);
}

function main() {
  console.log(`${STAGE}: starting`);
  if (!exists('src/pages/Settings.tsx')) {
    throw new Error('Missing src/pages/Settings.tsx');
  }

  const backupRoot = backupExisting([
    'src/pages/Settings.tsx',
    'src/pages/SettingsLegacy.tsx',
    'src/styles/Settings.css',
    'package.json',
  ]);
  console.log(`${STAGE}: backup ${backupRoot}`);

  const stageCommit = findSettingsLegacyAddCommit();
  if (stageCommit) {
    console.log(`${STAGE}: restoring Settings.tsx and Settings.css from parent of ${stageCommit}`);
    restoreFromGitParent(stageCommit, 'src/pages/Settings.tsx');
    try {
      restoreFromGitParent(stageCommit, 'src/styles/Settings.css');
    } catch (err) {
      console.log(`${STAGE}: could not restore Settings.css from git parent, using fallback css cleanup`);
      removeStage13CssFallback();
    }
  } else if (exists('src/pages/SettingsLegacy.tsx')) {
    console.log(`${STAGE}: no add commit found, copying SettingsLegacy.tsx to Settings.tsx`);
    write('src/pages/Settings.tsx', read('src/pages/SettingsLegacy.tsx'));
    removeStage13CssFallback();
  } else {
    throw new Error('Cannot rollback Settings: no SettingsLegacy.tsx and no git add commit for it. Use git log to identify the pre-stage13 commit manually.');
  }

  cleanupPackageScripts();
  removeStage13Files();

  console.log(`${STAGE}: finished`);
}

main();
