const fs = require('node:fs');
const path = require('node:path');

const repoRoot = path.resolve(__dirname, '..');
const quiet = fs.readFileSync(path.join(repoRoot, 'scripts/closeflow-release-check-quiet.cjs'), 'utf8');
const quietTest = fs.readFileSync(path.join(repoRoot, 'tests/closeflow-release-gate-quiet.test.cjs'), 'utf8');
const runnerExists = fs.existsSync(path.join(repoRoot, 'scripts/closeflow-vite-build-runner.mjs'));
const caseDetail = fs.readFileSync(path.join(repoRoot, 'src/pages/CaseDetail.tsx'), 'utf8');
const quick = fs.readFileSync(path.join(repoRoot, 'src/components/CaseQuickActions.tsx'), 'utf8');
const css = fs.readFileSync(path.join(repoRoot, 'src/styles/closeflow-case-history-visual-source-truth.css'), 'utf8');

function fail(message) {
  console.error('FAIL check:case-detail-history-visual-p1-repair5:', message);
  process.exit(1);
}

if (!caseDetail.includes('case-detail-history-unified-panel')) fail('CaseDetail nie oznacza sekcji historii jawna klasa.');
if (quick.includes('Dodaj operacyjny ruch bez starego kafelka formularza.')) fail('QuickActions helper copy wrocilo.');
if (!css.includes('CLOSEFLOW_CASE_DETAIL_HISTORY_VISUAL_P1_REPAIR5_2026_05_13')) fail('CSS nie zawiera markera Repair5.');
if (!runnerExists) fail('Brak closeflow-vite-build-runner.mjs.');
if (!quiet.includes('CLOSEFLOW_QUIET_GATE_VITE_BUILD_RUNNER_2026_05_13')) fail('Quiet gate nie ma markeru Vite runnera.');
if (!quiet.includes("runQuiet('production build', process.execPath, ['scripts/closeflow-vite-build-runner.mjs']);")) fail('Quiet gate nie uruchamia Vite runnera.');
if (quiet.includes("runNpmScript('production build', 'build');")) fail('Quiet gate nadal uruchamia nested npm build.');
if (quietTest.includes("assert.match(source, /runNpmScript\\('production build', 'build'\\)/);")) fail('Quiet test nadal wymaga starego nested npm build.');
if (!quietTest.includes('CLOSEFLOW_QUIET_GATE_VITE_BUILD_RUNNER_2026_05_13')) fail('Quiet test nie sprawdza nowego kontraktu Vite runnera.');

console.log('OK check:case-detail-history-visual-p1-repair5');
