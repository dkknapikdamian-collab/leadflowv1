const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const outDir = path.join(root, 'test-results', 'stage16x-a13-direct-details');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(root, 'docs', 'release'), { recursive: true });

function run(label, command, args) {
  const started = Date.now();
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    shell: false,
    env: { ...process.env, NO_COLOR: '1', FORCE_COLOR: '0' },
  });
  const durationMs = Date.now() - started;
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const exitCode = typeof result.status === 'number' ? result.status : (result.error ? 'SPAWN_ERROR' : null);
  fs.writeFileSync(path.join(outDir, `${label}.stdout.txt`), stdout, 'utf8');
  fs.writeFileSync(path.join(outDir, `${label}.stderr.txt`), stderr, 'utf8');
  return {
    label,
    command: [command, ...args].join(' '),
    exitCode,
    durationMs,
    error: result.error ? String(result.error.stack || result.error.message || result.error) : null,
    stdout,
    stderr,
  };
}

function extractFailures(text) {
  return String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('- ') || /failed|missing|forbidden|mojibake|Firestore|Gemini|rawText|Templates/i.test(line))
    .slice(0, 120);
}

const checks = [
  run('a13-direct', process.execPath, ['scripts/check-a13-critical-regressions.cjs']),
  run('a13-test-wrapper', process.execPath, ['--test', 'tests/a13-critical-regressions.test.cjs']),
  run('test-critical-compact', process.execPath, ['scripts/run-tests-compact.cjs', '--critical']),
];

const report = {
  generatedAt: new Date().toISOString(),
  branch: run('git-branch', 'git', ['branch', '--show-current']).stdout.trim(),
  head: run('git-head', 'git', ['rev-parse', '--short', 'HEAD']).stdout.trim(),
  checks: checks.map((check) => ({
    label: check.label,
    command: check.command,
    exitCode: check.exitCode,
    durationMs: check.durationMs,
    error: check.error,
    failureLines: extractFailures(`${check.stdout}\n${check.stderr}`),
  })),
};

const md = [
  '# Stage16X A13 direct detail report',
  '',
  `Generated: ${report.generatedAt}`,
  `Branch: ${report.branch}`,
  `HEAD: ${report.head}`,
  '',
  '## Summary',
  '',
  ...report.checks.map((check) => `- ${check.exitCode === 0 ? 'PASS' : 'FAIL'} ${check.label} exit=${check.exitCode} duration=${(check.durationMs / 1000).toFixed(1)}s`),
  '',
  '## Failure details',
  '',
  ...report.checks.flatMap((check) => [
    `### ${check.label}`,
    '',
    `Command: \`${check.command}\``,
    `Exit code: \`${check.exitCode}\``,
    '',
    'Key failure lines:',
    '',
    ...(check.failureLines.length ? check.failureLines.map((line) => `- ${line.replace(/^\-\s*/, '')}`) : ['- No extracted failure lines. Open full stdout/stderr files.']),
    '',
    '<details><summary>STDOUT</summary>',
    '',
    '```text',
    check.stdout || '',
    '```',
    '',
    '</details>',
    '',
    '<details><summary>STDERR</summary>',
    '',
    '```text',
    check.stderr || '',
    '```',
    '',
    '</details>',
    '',
  ]),
].join('\n');

const mdPath = path.join(root, 'docs', 'release', 'STAGE16X_A13_DIRECT_DETAILS_2026-05-06.md');
const jsonPath = path.join(root, 'docs', 'release', 'STAGE16X_A13_DIRECT_DETAILS_2026-05-06.json');
fs.writeFileSync(mdPath, md, 'utf8');
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2), 'utf8');

console.log('== Stage16X summary ==');
for (const check of report.checks) {
  console.log(`${check.exitCode === 0 ? 'PASS' : 'FAIL'} ${check.label} exit=${check.exitCode}`);
  for (const line of check.failureLines.slice(0, 20)) console.log('- ' + line.replace(/^\-\s*/, ''));
}
console.log('REPORT_MD=docs/release/STAGE16X_A13_DIRECT_DETAILS_2026-05-06.md');
console.log('REPORT_JSON=docs/release/STAGE16X_A13_DIRECT_DETAILS_2026-05-06.json');

// Collector should not fail the shell. The report is the deliverable.
process.exit(0);
