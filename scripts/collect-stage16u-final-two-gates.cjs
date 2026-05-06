const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const outDir = path.join(root, 'test-results', 'stage16u-two-gates');
fs.mkdirSync(outDir, { recursive: true });

const targets = [
  ['build', 'cmd.exe', ['/c', 'npm.cmd', 'run', 'build']],
  ['verify-closeflow-quiet', 'cmd.exe', ['/c', 'npm.cmd', 'run', 'verify:closeflow:quiet']],
  ['test-critical', 'cmd.exe', ['/c', 'npm.cmd', 'run', 'test:critical']],
  ['a13-detail', process.execPath, ['scripts/check-a13-critical-regressions.cjs']],
  ['faza3-etap32e', process.execPath, ['--test', 'tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs']],
];

const results = [];
console.log('== Stage16U final two-gate collector ==');
for (const [name, cmd, args] of targets) {
  console.log(`\n== RUN ${name} ==`);
  const started = Date.now();
  const r = spawnSync(cmd, args, { cwd: root, encoding: 'utf8', shell: false, maxBuffer: 1024 * 1024 * 20 });
  const duration = ((Date.now() - started) / 1000).toFixed(1);
  const status = typeof r.status === 'number' ? r.status : (r.error ? 1 : 0);
  const stdout = r.stdout || '';
  const stderr = r.stderr || '';
  const combined = `${stdout}\n${stderr}`.trim();
  fs.writeFileSync(path.join(outDir, `${name}.log`), combined + '\n', 'utf8');
  const ok = status === 0;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} exit=${status} duration=${duration}s`);
  if (!ok) {
    const important = combined.split(/\r?\n/).filter((line) => /FAILED|FAIL|AssertionError|Error:|Expected|actual:|expected:|A13 critical|missing|forbidden|doesNotMatch|match/i.test(line)).slice(0, 16);
    for (const line of important) console.log(`- ${line}`);
  }
  results.push({ name, ok, status, duration: Number(duration), log: path.relative(root, path.join(outDir, `${name}.log`)).replace(/\\/g, '/') });
}

const failed = results.filter((r) => !r.ok);
const reportMd = path.join(root, 'docs', 'release', 'STAGE16U_FINAL_TWO_GATES_2026-05-06.md');
const reportJson = path.join(root, 'docs', 'release', 'STAGE16U_FINAL_TWO_GATES_2026-05-06.json');
fs.mkdirSync(path.dirname(reportMd), { recursive: true });
fs.writeFileSync(reportJson, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2) + '\n', 'utf8');
fs.writeFileSync(reportMd, [
  '# STAGE16U FINAL TWO GATES',
  '',
  `Generated: ${new Date().toISOString()}`,
  '',
  `PASSED=${results.length - failed.length}`,
  `FAILED=${failed.length}`,
  '',
  '## Results',
  '',
  ...results.map((r) => `- ${r.ok ? 'PASS' : 'FAIL'} ${r.name} exit=${r.status} log=${r.log}`),
  '',
].join('\n'), 'utf8');

console.log('\n== Stage16U summary ==');
console.log(`PASSED=${results.length - failed.length}`);
console.log(`FAILED=${failed.length}`);
console.log('REPORT_MD=docs/release/STAGE16U_FINAL_TWO_GATES_2026-05-06.md');
console.log('REPORT_JSON=docs/release/STAGE16U_FINAL_TWO_GATES_2026-05-06.json');
if (failed.length) {
  console.log('\nTop failed details:');
  failed.forEach((r, i) => console.log(`${i + 1}. ${r.name} :: ${r.log}`));
  process.exit(1);
}
