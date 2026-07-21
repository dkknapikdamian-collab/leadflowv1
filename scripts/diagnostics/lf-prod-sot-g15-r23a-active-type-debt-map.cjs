const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');

const root = path.resolve(__dirname, '..', '..');
const configPath = path.join(root, 'tsconfig.r23a-active.json');
const outputDir = path.resolve(process.env.R23A_OUTPUT_DIR || path.join(root, 'r23a-artifacts'));
const inputHead = String(process.env.R23A_INPUT_HEAD || '8480a77d76a4777c2b9ea9d069c632bfd14f5099').trim();
const analysisHead = String(process.env.GITHUB_SHA || process.env.R23A_ANALYSIS_HEAD || 'LOCAL').trim();

function fail(message) {
  console.error(`R23A_MAP_FAILED: ${message}`);
  process.exit(1);
}

function relative(filePath) {
  return path.relative(root, filePath).replace(/\\/g, '/');
}

function isAllowedRootFile(filePath) {
  const value = relative(filePath);
  return value === 'vite.config.ts' || value.startsWith('src/') || value.startsWith('api/');
}

function readConfig() {
  const read = ts.readConfigFile(configPath, ts.sys.readFile);
  if (read.error) {
    fail(ts.flattenDiagnosticMessageText(read.error.messageText, '\n'));
  }
  const parsed = ts.parseJsonConfigFileContent(read.config, ts.sys, root, undefined, configPath);
  if (parsed.errors.length > 0) {
    fail(parsed.errors.map((entry) => ts.flattenDiagnosticMessageText(entry.messageText, '\n')).join('\n'));
  }
  return parsed;
}

function parseDiagnostics(output) {
  const errors = [];
  for (const line of output.split(/\r?\n/)) {
    const match = line.match(/^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/);
    if (match) {
      errors.push({
        file: relative(path.resolve(root, match[1])),
        line: Number(match[2]),
        column: Number(match[3]),
        code: match[4],
        message: match[5].trim(),
      });
      continue;
    }
    if (line.trim() && errors.length > 0 && /^\s+/.test(line)) {
      errors[errors.length - 1].message += ` ${line.trim()}`;
    }
  }
  return errors;
}

function countBy(values, selector) {
  const result = {};
  for (const value of values) {
    const key = selector(value);
    result[key] = (result[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(result).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0])));
}

function topEntries(map, limit = 25) {
  return Object.entries(map).slice(0, limit).map(([key, count]) => ({ key, count }));
}

const parsedConfig = readConfig();
const rootFiles = parsedConfig.fileNames.map(relative).sort();
const scopeLeaks = parsedConfig.fileNames.filter((filePath) => !isAllowedRootFile(filePath)).map(relative).sort();
if (scopeLeaks.length > 0) {
  fail(`Active diagnostic scope leaked outside src/api/vite.config.ts: ${scopeLeaks.join(', ')}`);
}
if (rootFiles.length === 0) {
  fail('No active TypeScript root files were resolved.');
}

const tscBin = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc');
if (!fs.existsSync(tscBin)) {
  fail('TypeScript is not installed. Run npm ci first.');
}

const run = spawnSync(process.execPath, [tscBin, '--noEmit', '--pretty', 'false', '-p', configPath], {
  cwd: root,
  encoding: 'utf8',
  env: process.env,
  maxBuffer: 64 * 1024 * 1024,
});
if (run.error) {
  fail(run.error.message);
}

const rawOutput = [run.stdout || '', run.stderr || ''].filter(Boolean).join('\n').trim();
const errors = parseDiagnostics(rawOutput);
if ((run.status || 0) !== 0 && errors.length === 0) {
  fail(`tsc exited ${run.status} but no structured diagnostics were parsed. Output: ${rawOutput.slice(0, 4000)}`);
}

const byCode = countBy(errors, (entry) => entry.code);
const byFile = countBy(errors, (entry) => entry.file);
const byArea = countBy(errors, (entry) => entry.file.split('/')[0] || 'root');
const missingReactTypeErrors = errors.filter((entry) => entry.code === 'TS7016' && /react(?:\/jsx-runtime)?/.test(entry.message)).length;
const implicitJsxErrors = errors.filter((entry) => entry.code === 'TS7026').length;
const status = errors.length > 0 ? 'PASS_MAP_GENERATED_WITH_ACTIVE_DEBT' : 'PASS_MAP_GENERATED_CLEAN';
const nextStage = errors.length > 0
  ? 'LF-PROD-SOT-G15-R23B_ACTIVE_TYPE_DEBT_REPAIR_PLAN'
  : 'LF-PROD-SOT-G15-R24_CLASSIFY_AND_REPAIR_REPO_BACKUP_HYGIENE';

const report = {
  stage: 'LF-PROD-SOT-G15-R23A_TSC_ACTIVE_SCOPE_AND_TYPE_DEBT_MAP',
  status,
  input_head: inputHead,
  analysis_head: analysisHead,
  config: 'tsconfig.r23a-active.json',
  scope_root_file_count: rootFiles.length,
  scope_leaks: scopeLeaks,
  tsc_exit_code: run.status || 0,
  total_errors: errors.length,
  unique_error_files: Object.keys(byFile).length,
  missing_react_type_errors: missingReactTypeErrors,
  implicit_jsx_errors: implicitJsxErrors,
  errors_by_code: byCode,
  errors_by_area: byArea,
  top_error_files: topEntries(byFile),
  next_stage: nextStage,
  root_files: rootFiles,
  diagnostics: errors,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(path.join(outputDir, 'active-type-debt.json'), `${JSON.stringify(report, null, 2)}\n`, 'utf8');
fs.writeFileSync(path.join(outputDir, 'active-type-debt.log'), `${rawOutput}\n`, 'utf8');

const markdown = [
  '# LF-PROD-SOT-G15-R23A — Active TypeScript debt map',
  '',
  `STATUS: ${status}`,
  `INPUT_HEAD: ${inputHead}`,
  `ANALYSIS_HEAD: ${analysisHead}`,
  `ACTIVE_ROOT_FILES: ${rootFiles.length}`,
  `TSC_EXIT_CODE: ${run.status || 0}`,
  `TOTAL_ERRORS: ${errors.length}`,
  `UNIQUE_ERROR_FILES: ${Object.keys(byFile).length}`,
  `MISSING_REACT_TYPE_ERRORS: ${missingReactTypeErrors}`,
  `IMPLICIT_JSX_ERRORS: ${implicitJsxErrors}`,
  '',
  '## Errors by code',
  ...topEntries(byCode, 50).map((entry) => `- ${entry.key}: ${entry.count}`),
  '',
  '## Top error files',
  ...topEntries(byFile, 30).map((entry) => `- ${entry.key}: ${entry.count}`),
  '',
  `NEXT_STAGE: ${nextStage}`,
  '',
].join('\n');
fs.writeFileSync(path.join(outputDir, 'active-type-debt.md'), markdown, 'utf8');

console.log(`R23A_STATUS=${status}`);
console.log(`R23A_ACTIVE_ROOT_FILES=${rootFiles.length}`);
console.log(`R23A_TOTAL_ERRORS=${errors.length}`);
console.log(`R23A_UNIQUE_ERROR_FILES=${Object.keys(byFile).length}`);
console.log(`R23A_NEXT_STAGE=${nextStage}`);
