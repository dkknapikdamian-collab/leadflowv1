const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const outDir = path.join(root, 'test-results', 'stage16p-focused-final-qa');
fs.mkdirSync(outDir, { recursive: true });

const targets = [
  ['build', 'npm.cmd run build'],
  ['verify-closeflow-quiet', 'npm.cmd run verify:closeflow:quiet'],
  ['test-critical', 'npm.cmd run test:critical'],
  ['ai-assistant-autospeech-and-clear-input', 'node --test tests/ai-assistant-autospeech-and-clear-input.test.cjs'],
  ['ai-assistant-capture-handoff', 'node --test tests/ai-assistant-capture-handoff.test.cjs'],
  ['ai-assistant-command-center', 'node --test tests/ai-assistant-command-center.test.cjs'],
  ['billing-ui-polish-and-diagnostics', 'node --test tests/billing-ui-polish-and-diagnostics.test.cjs'],
  ['final-red-gates-collector', 'npm.cmd run check:final-qa-red-gates:collect'],
];

function runLine(commandLine) {
  const started = Date.now();
  const isWin = process.platform === 'win32';
  const cmd = isWin ? 'cmd.exe' : 'bash';
  const args = isWin ? ['/d', '/s', '/c', commandLine] : ['-lc', commandLine];
  const result = spawnSync(cmd, args, {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true,
    maxBuffer: 1024 * 1024 * 20,
  });
  const duration = Date.now() - started;
  return {
    commandLine,
    exitCode: typeof result.status === 'number' ? result.status : null,
    signal: result.signal || null,
    error: result.error ? String(result.error.stack || result.error.message || result.error) : null,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    durationMs: duration,
  };
}

function summarizeFailure(result) {
  const lines = `${result.stderr}\n${result.stdout}`.split(/\r?\n/);
  const useful = [];
  for (const line of lines) {
    if (/error|fail|failed|AssertionError|Expected|Unexpected|TS\d+|Rollup|vite/i.test(line)) {
      useful.push(line.trim());
    }
    if (useful.length >= 12) break;
  }
  if (result.error) useful.unshift('SPAWN_ERROR: ' + result.error);
  if (result.signal) useful.unshift('SIGNAL: ' + result.signal);
  return useful.filter(Boolean);
}

const results = [];
console.log('== Stage16P focused final QA collector ==');
console.log('Repo: ' + root);
console.log('Mode: Windows-safe cmd.exe /c npm.cmd run ...');

for (const [label, commandLine] of targets) {
  console.log('\n== RUN ' + label + ' ==');
  const result = runLine(commandLine);
  const safeLabel = label.replace(/[^a-z0-9_-]+/gi, '_');
  fs.writeFileSync(path.join(outDir, safeLabel + '.stdout.log'), result.stdout, 'utf8');
  fs.writeFileSync(path.join(outDir, safeLabel + '.stderr.log'), result.stderr + (result.error ? '\n' + result.error : ''), 'utf8');
  const ok = result.exitCode === 0;
  console.log((ok ? 'PASS ' : 'FAIL ') + label + ' exit=' + result.exitCode + ' duration=' + (result.durationMs / 1000).toFixed(1) + 's');
  if (!ok) {
    for (const line of summarizeFailure(result).slice(0, 8)) console.log('- ' + line);
  }
  results.push({ label, commandLine, ok, ...result, failureSummary: summarizeFailure(result) });
}

const passed = results.filter((r) => r.ok).length;
const failed = results.length - passed;
const reportBase = path.join(root, 'docs', 'release');
fs.mkdirSync(reportBase, { recursive: true });
const jsonRel = 'docs/release/STAGE16P_FOCUSED_FINAL_QA_2026-05-06.json';
const mdRel = 'docs/release/STAGE16P_FOCUSED_FINAL_QA_2026-05-06.md';
fs.writeFileSync(path.join(root, jsonRel), JSON.stringify({ generatedAt: new Date().toISOString(), passed, failed, results }, null, 2) + '\n', 'utf8');
const md = [];
md.push('# STAGE16P FOCUSED FINAL QA - 2026-05-06');
md.push('');
md.push(`PASSED=${passed}`);
md.push(`FAILED=${failed}`);
md.push('');
for (const r of results) {
  md.push(`## ${r.ok ? 'PASS' : 'FAIL'} ${r.label}`);
  md.push('');
  md.push(`- Command: \`${r.commandLine}\``);
  md.push(`- Exit code: \`${r.exitCode}\``);
  md.push(`- Duration: \`${(r.durationMs / 1000).toFixed(1)}s\``);
  if (!r.ok && r.failureSummary.length) {
    md.push('');
    md.push('### Failure summary');
    for (const line of r.failureSummary) md.push('- ' + line.replace(/\|/g, '\\|'));
  }
  md.push('');
}
fs.writeFileSync(path.join(root, mdRel), md.join('\n'), 'utf8');

console.log('\n== Stage16P summary ==');
console.log('PASSED=' + passed);
console.log('FAILED=' + failed);
console.log('REPORT_MD=' + mdRel);
console.log('REPORT_JSON=' + jsonRel);
if (failed) {
  console.log('\nTop failed details:');
  results.filter((r) => !r.ok).slice(0, 10).forEach((r, idx) => {
    const first = r.failureSummary[0] || 'open full log';
    console.log(`${idx + 1}. ${r.label} :: ${first}`);
  });
}
process.exitCode = failed ? 1 : 0;
