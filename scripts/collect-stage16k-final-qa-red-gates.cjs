#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = process.cwd();
const npmBin = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const outMd = path.join(root, 'docs', 'release', 'FINAL_QA_RED_GATES_2026-05-06.md');
const outJson = path.join(root, 'docs', 'release', 'FINAL_QA_RED_GATES_2026-05-06.json');
const fullLogDir = path.join(root, 'test-results', 'stage16k-red-gates');

function stripBom(text) {
  const value = String(text || '');
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function read(rel) {
  const target = path.join(root, rel);
  if (!fs.existsSync(target)) return '';
  return stripBom(fs.readFileSync(target, 'utf8'));
}

function readJson(rel) {
  try { return JSON.parse(read(rel)); } catch { return null; }
}

function quoteWindowsArg(value) {
  const raw = String(value == null ? '' : value);
  if (/^[A-Za-z0-9_:@%+=,.\/\\-]+$/.test(raw)) return raw;
  return '"' + raw.replace(/"/g, '\\"') + '"';
}

function buildSpawn(command, commandArgs) {
  const argsList = Array.isArray(commandArgs) ? commandArgs : [];
  const display = [command].concat(argsList).join(' ');
  if (process.platform === 'win32' && /\.(cmd|bat)$/i.test(command)) {
    const commandLine = [command].concat(argsList).map(quoteWindowsArg).join(' ');
    return { command: 'cmd.exe', args: ['/d', '/s', '/c', commandLine], display: commandLine };
  }
  return { command, args: argsList, display };
}

function run(command, commandArgs, opts = {}) {
  const startedAt = Date.now();
  const target = buildSpawn(command, commandArgs);
  const res = spawnSync(target.command, target.args, {
    cwd: root,
    encoding: 'utf8',
    shell: false,
    timeout: opts.timeoutMs || 20 * 60 * 1000,
    windowsHide: true,
    env: process.env,
  });
  const status = typeof res.status === 'number' ? res.status : res.error && res.error.code === 'ETIMEDOUT' ? 124 : 1;
  return {
    name: opts.name || target.display,
    command: target.display,
    ok: status === 0,
    code: status,
    durationMs: Date.now() - startedAt,
    stdout: stripBom(res.stdout || ''),
    stderr: stripBom(res.stderr || (res.error ? String(res.error.message || res.error) : '')),
  };
}

function tail(text, maxLines = 140, maxChars = 24000) {
  const value = stripBom(text).replace(/\r\n/g, '\n');
  const lines = value.split('\n');
  const out = lines.slice(Math.max(0, lines.length - maxLines)).join('\n');
  return out.length <= maxChars ? out : out.slice(out.length - maxChars);
}

function escapeMd(value) {
  return String(value == null ? '' : value).replace(/\|/g, '\\|').replace(/\n/g, '<br>');
}

function codeBlock(value, lang = 'text') {
  const text = String(value || '').trimEnd();
  return '```' + lang + '\n' + (text || 'brak outputu') + '\n```';
}

function parseReleaseGateTests() {
  const files = ['scripts/closeflow-release-check-quiet.cjs', 'scripts/closeflow-release-check.cjs'];
  const found = new Set();
  for (const rel of files) {
    const source = read(rel);
    const regex = /tests\/[A-Za-z0-9_.\-\/]+\.test\.cjs/g;
    let match;
    while ((match = regex.exec(source))) found.add(match[0]);
  }
  return Array.from(found).filter((rel) => fs.existsSync(path.join(root, rel))).sort();
}

function extractLikelyFailures(result) {
  const combined = [result.stdout, result.stderr].filter(Boolean).join('\n');
  const lines = combined.split(/\r?\n/);
  const hits = [];
  const patterns = [
    /^FAILED:/,
    /^FAIL:/,
    /^\u2716 /,
    /AssertionError/i,
    /Error:/,
    /P0 .*failed/i,
    /guard failed/i,
    /failed with exit code/i,
    /Expected values to be strictly equal/i,
    /The input did not match/i,
    /doesNotMatch/i,
  ];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (patterns.some((pattern) => pattern.test(trimmed))) hits.push(trimmed);
  }
  return hits.slice(0, 60);
}

function envSnapshot() {
  const keys = [
    'APP_URL', 'RELEASE_PREVIEW_URL', 'VERCEL_URL',
    'VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY',
    'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET',
    'RESEND_API_KEY', 'DIGEST_FROM_EMAIL', 'CRON_SECRET',
    'AI_ENABLED', 'GEMINI_API_KEY', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET',
  ];
  return keys.map((key) => ({ key, status: process.env[key] ? 'SET_IN_PROCESS' : 'NOT_SET_IN_PROCESS' }));
}

fs.mkdirSync(path.dirname(outMd), { recursive: true });
fs.mkdirSync(fullLogDir, { recursive: true });

const pkg = readJson('package.json') || { scripts: {} };
const scripts = pkg.scripts || {};
const plannedScripts = [
  'build',
  'verify:closeflow:quiet',
  'test:critical',
  'check:polish-mojibake',
  'check:ui-truth-copy',
  'check:workspace-scope',
  'check:no-body-workspace-trust',
  'check:plan-access-gating',
  'check:assistant-operator-v1',
  'check:pwa-safe-cache',
  'test:route-smoke',
  'test:button-action-map',
  'check:button-action-map',
  'check:admin-backend-guard',
  'check:service-role-scoped-mutations',
].filter((name) => scripts[name]);

const results = [];

console.log('== Stage16K red gate collector ==');
console.log('Repo:', root);
console.log('Mode: collect all, do not stop on first failure');

for (const scriptName of plannedScripts) {
  console.log('\n== RUN npm run ' + scriptName + ' ==');
  const result = run(npmBin, ['run', scriptName], { name: 'npm run ' + scriptName, timeoutMs: scriptName === 'test:critical' || scriptName === 'verify:closeflow:quiet' ? 30 * 60 * 1000 : 20 * 60 * 1000 });
  result.likelyFailures = extractLikelyFailures(result);
  results.push(result);
  const logName = scriptName.replace(/[^A-Za-z0-9_.-]+/g, '_') + '.log';
  fs.writeFileSync(path.join(fullLogDir, logName), ['COMMAND: ' + result.command, 'EXIT: ' + result.code, 'STDOUT:', result.stdout, 'STDERR:', result.stderr].join('\n'), 'utf8');
  console.log(result.ok ? 'PASS' : 'FAIL', scriptName, 'exit=' + result.code, 'duration=' + (result.durationMs / 1000).toFixed(1) + 's');
  if (!result.ok && result.likelyFailures.length) {
    console.log(result.likelyFailures.slice(0, 12).map((line) => '- ' + line).join('\n'));
  }
}

const releaseGateTests = parseReleaseGateTests();
console.log('\n== RUN individual release gate tests: ' + releaseGateTests.length + ' files ==');
for (const rel of releaseGateTests) {
  const result = run(process.execPath, ['--test', rel], { name: 'node --test ' + rel, timeoutMs: 5 * 60 * 1000 });
  result.testFile = rel;
  result.likelyFailures = extractLikelyFailures(result);
  results.push(result);
  const logName = rel.replace(/[^A-Za-z0-9_.-]+/g, '_') + '.log';
  fs.writeFileSync(path.join(fullLogDir, logName), ['COMMAND: ' + result.command, 'EXIT: ' + result.code, 'STDOUT:', result.stdout, 'STDERR:', result.stderr].join('\n'), 'utf8');
  if (!result.ok) console.log('FAIL', rel, 'exit=' + result.code);
}

const failed = results.filter((result) => !result.ok);
const passed = results.filter((result) => result.ok);

const gitInfo = {
  branch: run('git', ['branch', '--show-current'], { name: 'git branch', timeoutMs: 60 * 1000 }).stdout.trim(),
  head: run('git', ['rev-parse', '--short', 'HEAD'], { name: 'git head', timeoutMs: 60 * 1000 }).stdout.trim(),
  status: run('git', ['status', '--short'], { name: 'git status', timeoutMs: 60 * 1000 }).stdout.trim(),
};

const report = {
  generatedAt: new Date().toISOString(),
  repoRoot: root,
  git: gitInfo,
  summary: { total: results.length, passed: passed.length, failed: failed.length },
  env: envSnapshot(),
  failed: failed.map((result) => ({
    name: result.name,
    command: result.command,
    code: result.code,
    durationMs: result.durationMs,
    testFile: result.testFile || null,
    likelyFailures: result.likelyFailures || [],
    stdoutTail: tail(result.stdout, 80, 12000),
    stderrTail: tail(result.stderr, 80, 12000),
  })),
  passed: passed.map((result) => ({ name: result.name, command: result.command, durationMs: result.durationMs, testFile: result.testFile || null })),
};

fs.writeFileSync(outJson, JSON.stringify(report, null, 2), 'utf8');

const failedTable = failed.length
  ? failed.map((r, index) => '| ' + (index + 1) + ' | `' + escapeMd(r.name) + '` | `' + escapeMd(r.testFile || '-') + '` | ' + r.code + ' | ' + (r.durationMs / 1000).toFixed(1) + 's |').join('\n')
  : '| - | brak | - | - | - |';

const failureSections = failed.length
  ? failed.map((r, index) => {
      const hints = (r.likelyFailures || []).length ? (r.likelyFailures || []).map((line) => '- ' + line).join('\n') : '- brak kr\u00F3tkiego wzorca, sprawd\u017A tail outputu';
      return '### ' + (index + 1) + '. `' + r.name + '`\n\n' +
        '- Test file: `' + (r.testFile || '-') + '`\n' +
        '- Command: `' + escapeMd(r.command) + '`\n' +
        '- Exit: `' + r.code + '`\n' +
        '- Duration: `' + (r.durationMs / 1000).toFixed(1) + 's`\n\n' +
        '**Najwa\u017Cniejsze linie:**\n\n' + hints + '\n\n' +
        '**STDOUT tail:**\n\n' + codeBlock(tail(r.stdout, 80, 12000)) + '\n\n' +
        '**STDERR tail:**\n\n' + codeBlock(tail(r.stderr, 80, 12000));
    }).join('\n\n')
  : 'Brak czerwonych gate\u00F3w.';

const md = '# Stage16K Final QA Red Gates \u2014 zbiorczy raport\n\n' +
  '**Generated:** ' + report.generatedAt + '\n\n' +
  '| Pole | Warto\u015B\u0107 |\n|---|---|\n' +
  '| Repo | `' + escapeMd(root) + '` |\n' +
  '| Branch | `' + escapeMd(gitInfo.branch || 'UNKNOWN') + '` |\n' +
  '| HEAD | `' + escapeMd(gitInfo.head || 'UNKNOWN') + '` |\n' +
  '| Working tree | `' + (gitInfo.status ? 'DIRTY' : 'CLEAN') + '` |\n' +
  '| Total checks | `' + results.length + '` |\n' +
  '| Passed | `' + passed.length + '` |\n' +
  '| Failed | `' + failed.length + '` |\n\n' +
  '## Czerwone gatey\n\n' +
  '| # | Check | Test file | Exit | Czas |\n|---:|---|---|---:|---:|\n' + failedTable + '\n\n' +
  '## Szczeg\u00F3\u0142y czerwonych gate\u00F3w\n\n' + failureSections + '\n\n' +
  '## Pe\u0142ne logi\n\n' +
  'Pe\u0142ne logi zapisane w: `test-results/stage16k-red-gates/`\n\n' +
  '## JSON\n\n' +
  'Maszynowy raport: `docs/release/FINAL_QA_RED_GATES_2026-05-06.json`\n';

fs.writeFileSync(outMd, md, 'utf8');

console.log('\n== Stage16K summary ==');
console.log('PASSED=' + passed.length);
console.log('FAILED=' + failed.length);
console.log('REPORT_MD=' + path.relative(root, outMd).replace(/\\/g, '/'));
console.log('REPORT_JSON=' + path.relative(root, outJson).replace(/\\/g, '/'));

if (failed.length) {
  console.log('\nTop failed checks:');
  failed.slice(0, 20).forEach((r, index) => console.log((index + 1) + '. ' + r.name + (r.testFile ? ' [' + r.testFile + ']' : '')));
}

// Collector intentionally exits 0 so PowerShell does not stop before user can paste the report.
process.exit(0);
