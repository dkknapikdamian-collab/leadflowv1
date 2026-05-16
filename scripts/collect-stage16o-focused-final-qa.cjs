
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const repo = process.cwd();
const outDir = path.join(repo, 'test-results', 'stage16o-focused-final-qa');
fs.mkdirSync(outDir, { recursive: true });
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const nodeCmd = process.execPath;
const targets = [
  { label: 'build', cmd: npmCmd, args: ['run', 'build'] },
  { label: 'verify-closeflow-quiet', cmd: npmCmd, args: ['run', 'verify:closeflow:quiet'] },
  { label: 'test-critical', cmd: npmCmd, args: ['run', 'test:critical'] },
  { label: 'ai-assistant-autospeech-and-clear-input', cmd: nodeCmd, args: ['--test', 'tests/ai-assistant-autospeech-and-clear-input.test.cjs'] },
  { label: 'ai-assistant-capture-handoff', cmd: nodeCmd, args: ['--test', 'tests/ai-assistant-capture-handoff.test.cjs'] },
  { label: 'ai-assistant-command-center', cmd: nodeCmd, args: ['--test', 'tests/ai-assistant-command-center.test.cjs'] },
  { label: 'billing-ui-polish-and-diagnostics', cmd: nodeCmd, args: ['--test', 'tests/billing-ui-polish-and-diagnostics.test.cjs'] },
  { label: 'final-red-gates-collector', cmd: npmCmd, args: ['run', 'check:final-qa-red-gates:collect'] },
];

function safeName(label) { return label.replace(/[^a-z0-9_.-]+/gi, '_'); }
function extractLines(text) {
  return String(text || '')
    .split(/\r?\n/)
    .filter((line) => /FAIL|FAILED|\u2716|AssertionError|Error:|Expected|actual|expected|missing|forbidden|RollupError|SyntaxError|TS\d+/i.test(line))
    .slice(0, 40);
}

const results = [];
console.log('== Stage16O focused final QA collector ==');
console.log('Repo: ' + repo);
for (const target of targets) {
  console.log('\n== RUN ' + target.label + ' ==');
  const start = Date.now();
  const r = spawnSync(target.cmd, target.args, { cwd: repo, encoding: 'utf8', shell: false, windowsHide: true });
  const duration = ((Date.now() - start) / 1000).toFixed(1) + 's';
  const stdout = r.stdout || '';
  const stderr = r.stderr || '';
  const full = '$ ' + [target.cmd].concat(target.args).join(' ') + '\n\nSTDOUT:\n' + stdout + '\n\nSTDERR:\n' + stderr + '\n';
  fs.writeFileSync(path.join(outDir, safeName(target.label) + '.log'), full, 'utf8');
  const ok = r.status === 0;
  console.log((ok ? 'PASS ' : 'FAIL ') + target.label + ' exit=' + r.status + ' duration=' + duration);
  if (!ok) for (const line of extractLines(stdout + '\n' + stderr).slice(0, 8)) console.log('- ' + line);
  results.push({ label: target.label, command: [target.cmd].concat(target.args), exitCode: r.status, signal: r.signal, duration, ok, highlights: extractLines(stdout + '\n' + stderr), log: 'test-results/stage16o-focused-final-qa/' + safeName(target.label) + '.log' });
}
const passed = results.filter(r => r.ok).length;
const failed = results.length - passed;
const reportMd = path.join(repo, 'docs', 'release', 'STAGE16O_FOCUSED_FINAL_QA_2026-05-06.md');
const reportJson = path.join(repo, 'docs', 'release', 'STAGE16O_FOCUSED_FINAL_QA_2026-05-06.json');
fs.mkdirSync(path.dirname(reportMd), { recursive: true });
let md = '# Stage16O focused final QA report - 2026-05-06\n\n';
md += '- Passed: ' + passed + '\n- Failed: ' + failed + '\n\n';
for (const r of results) {
  md += '## ' + (r.ok ? 'PASS' : 'FAIL') + ': `' + r.label + '`\n\n';
  md += '- Exit: `' + r.exitCode + '`\n- Log: `' + r.log + '`\n\n';
  if (r.highlights.length) {
    md += '```text\n' + r.highlights.join('\n') + '\n```\n\n';
  }
}
fs.writeFileSync(reportMd, md, 'utf8');
fs.writeFileSync(reportJson, JSON.stringify({ passed, failed, results }, null, 2), 'utf8');
console.log('\n== Stage16O summary ==');
console.log('PASSED=' + passed);
console.log('FAILED=' + failed);
console.log('REPORT_MD=docs/release/STAGE16O_FOCUSED_FINAL_QA_2026-05-06.md');
console.log('REPORT_JSON=docs/release/STAGE16O_FOCUSED_FINAL_QA_2026-05-06.json');
console.log('\nTop failed details:');
results.filter(r => !r.ok).slice(0, 12).forEach((r, i) => {
  console.log((i+1) + '. ' + r.label + ' :: ' + (r.highlights[0] || 'open full log'));
});
process.exit(0);
