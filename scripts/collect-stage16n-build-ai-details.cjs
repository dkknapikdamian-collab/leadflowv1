const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const outDir = path.join(root, 'test-results', 'stage16n-build-ai-details');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(path.join(root, 'docs', 'release'), { recursive: true });

const targets = [
  { name: 'build', cmd: 'npm.cmd', args: ['run', 'build'] },
  { name: 'verify-closeflow-quiet', cmd: 'npm.cmd', args: ['run', 'verify:closeflow:quiet'] },
  { name: 'test-critical', cmd: 'npm.cmd', args: ['run', 'test:critical'] },
  { name: 'ai-assistant-autospeech-and-clear-input', cmd: process.execPath, args: ['--test', 'tests/ai-assistant-autospeech-and-clear-input.test.cjs'] },
  { name: 'ai-assistant-capture-handoff', cmd: process.execPath, args: ['--test', 'tests/ai-assistant-capture-handoff.test.cjs'] },
  { name: 'ai-assistant-command-center', cmd: process.execPath, args: ['--test', 'tests/ai-assistant-command-center.test.cjs'] },
];

function runTarget(target) {
  const started = Date.now();
  const result = spawnSync(target.cmd, target.args, {
    cwd: root,
    encoding: 'utf8',
    shell: false,
    maxBuffer: 1024 * 1024 * 20,
  });
  const durationMs = Date.now() - started;
  const stdout = result.stdout || '';
  const stderr = result.stderr || '';
  const safeName = target.name.replace(/[^a-z0-9_.-]+/gi, '-');
  fs.writeFileSync(path.join(outDir, safeName + '.stdout.txt'), stdout, 'utf8');
  fs.writeFileSync(path.join(outDir, safeName + '.stderr.txt'), stderr, 'utf8');
  fs.writeFileSync(path.join(outDir, safeName + '.combined.txt'), [
    '$ ' + [target.cmd, ...target.args].join(' '),
    '',
    'EXIT=' + result.status,
    'DURATION_MS=' + durationMs,
    '',
    '--- STDOUT ---',
    stdout,
    '',
    '--- STDERR ---',
    stderr,
  ].join('\n'), 'utf8');

  const failureLines = (stdout + '\n' + stderr)
    .split(/\r?\n/)
    .filter((line) =>
      /error TS|Failed to resolve|Could not resolve|Unexpected token|SyntaxError|ReferenceError|AssertionError|Expected values|The input did not match|doesNotMatch|failing tests|✖|FAILED:|FAIL:|Error:/.test(line)
    )
    .slice(0, 80);

  return {
    name: target.name,
    command: [target.cmd, ...target.args].join(' '),
    exitCode: result.status,
    durationMs,
    stdoutFile: path.relative(root, path.join(outDir, safeName + '.stdout.txt')).replace(/\\/g, '/'),
    stderrFile: path.relative(root, path.join(outDir, safeName + '.stderr.txt')).replace(/\\/g, '/'),
    combinedFile: path.relative(root, path.join(outDir, safeName + '.combined.txt')).replace(/\\/g, '/'),
    failureLines,
  };
}

console.log('== Stage16N build + AI failure detail collector ==');
console.log('Repo: ' + root);
console.log('Targets: ' + targets.length);

const results = [];
for (const target of targets) {
  console.log('');
  console.log('== RUN ' + target.name + ' ==');
  const result = runTarget(target);
  results.push(result);
  console.log((result.exitCode === 0 ? 'PASS' : 'FAIL') + ' ' + target.name + ' exit=' + result.exitCode + ' duration=' + (result.durationMs / 1000).toFixed(1) + 's');
  for (const line of result.failureLines.slice(0, 10)) console.log('- ' + line);
}

const failed = results.filter((item) => item.exitCode !== 0);
const passed = results.length - failed.length;

const reportJson = {
  generatedAt: new Date().toISOString(),
  repo: root,
  passed,
  failed: failed.length,
  results,
};

const jsonPath = path.join(root, 'docs', 'release', 'STAGE16N_BUILD_AI_FAILURE_DETAILS_2026-05-06.json');
fs.writeFileSync(jsonPath, JSON.stringify(reportJson, null, 2), 'utf8');

const md = [
  '# STAGE16N - Build + AI failed details',
  '',
  `Generated: ${reportJson.generatedAt}`,
  '',
  `PASSED=${passed}`,
  `FAILED=${failed.length}`,
  '',
  '## Failed targets',
  '',
  ...failed.flatMap((item, index) => [
    `### ${index + 1}. ${item.name}`,
    '',
    `- Command: \`${item.command}\``,
    `- Exit: \`${item.exitCode}\``,
    `- Duration: \`${(item.durationMs / 1000).toFixed(1)}s\``,
    `- Full log: \`${item.combinedFile}\``,
    '',
    'Key lines:',
    '',
    '```text',
    ...(item.failureLines.length ? item.failureLines : ['No extracted failure lines. Open full log file.']),
    '```',
    '',
  ]),
  '## All targets',
  '',
  ...results.map((item) => `- ${item.exitCode === 0 ? 'PASS' : 'FAIL'} \`${item.name}\` -> \`${item.combinedFile}\``),
  '',
].join('\n');

const mdPath = path.join(root, 'docs', 'release', 'STAGE16N_BUILD_AI_FAILURE_DETAILS_2026-05-06.md');
fs.writeFileSync(mdPath, md, 'utf8');

console.log('');
console.log('== Stage16N summary ==');
console.log('PASSED=' + passed);
console.log('FAILED=' + failed.length);
console.log('REPORT_MD=' + path.relative(root, mdPath).replace(/\\/g, '/'));
console.log('REPORT_JSON=' + path.relative(root, jsonPath).replace(/\\/g, '/'));
console.log('');
console.log('Top failed details:');
failed.slice(0, 10).forEach((item, index) => {
  const first = item.failureLines[0] || 'open full log';
  console.log(String(index + 1) + '. ' + item.name + ' :: ' + first);
});
process.exit(0);
