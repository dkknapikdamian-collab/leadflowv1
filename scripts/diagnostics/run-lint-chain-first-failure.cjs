const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

function splitShellChain(command) {
  const input = String(command || '').trim();
  const commands = [];
  let current = '';
  let quote = null;
  let escaped = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\' && quote !== "'") {
      current += char;
      escaped = true;
      continue;
    }

    if ((char === '"' || char === "'") && (!quote || quote === char)) {
      quote = quote ? null : char;
      current += char;
      continue;
    }

    if (!quote && char === '&' && next === '&') {
      const trimmed = current.trim();
      if (!trimmed) {
        throw new Error('G15_R6_EMPTY_LINT_CHAIN_SEGMENT');
      }
      commands.push(trimmed);
      current = '';
      index += 1;
      continue;
    }

    current += char;
  }

  if (quote) {
    throw new Error('G15_R6_UNTERMINATED_QUOTE');
  }

  const finalCommand = current.trim();
  if (finalCommand) commands.push(finalCommand);

  if (commands.length === 0) {
    throw new Error('G15_R6_LINT_CHAIN_EMPTY');
  }

  return commands;
}

function normalizeCommand(command, platform = process.platform) {
  const npmExecutable = platform === 'win32' ? 'npm.cmd' : 'npm';
  return String(command).replace(/\bnpm\.cmd\b/g, npmExecutable);
}

function sanitizeForFileName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'command';
}

function writeFileEnsuringParent(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

function runDiagnostic({ root, packagePath, artifactRoot, platform = process.platform, spawn = spawnSync }) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const configuredLint = String(packageJson?.scripts?.lint || '').trim();
  const commands = splitShellChain(configuredLint).map((command) => normalizeCommand(command, platform));
  const startedAt = new Date().toISOString();
  const stepResults = [];
  let firstFailure = null;

  fs.mkdirSync(artifactRoot, { recursive: true });
  console.log(`G15_R6_PLATFORM=${platform}`);
  console.log(`G15_R6_COMMAND_COUNT=${commands.length}`);

  for (let index = 0; index < commands.length; index += 1) {
    const command = commands[index];
    const stepNumber = index + 1;
    const stepStartedAt = new Date().toISOString();
    console.log(`G15_R6_STEP_INDEX=${stepNumber}`);
    console.log(`G15_R6_STEP_COMMAND=${command}`);

    const result = spawn(command, {
      cwd: root,
      env: process.env,
      shell: true,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });

    const stdout = String(result.stdout || '');
    const stderr = String(result.stderr || '');
    const exitCode = typeof result.status === 'number' ? result.status : 1;
    const combinedOutput = [stdout, stderr].filter(Boolean).join(stderr && stdout ? '\n--- STDERR ---\n' : '');
    const fileName = `${String(stepNumber).padStart(2, '0')}-${sanitizeForFileName(command)}.log`;
    const logPath = path.join(artifactRoot, fileName);
    writeFileEnsuringParent(logPath, combinedOutput);

    const stepResult = {
      index: stepNumber,
      command,
      exit_code: exitCode,
      status: exitCode === 0 ? 'PASS' : 'FIRST_NONZERO',
      started_at: stepStartedAt,
      finished_at: new Date().toISOString(),
      log_file: path.relative(root, logPath).replace(/\\/g, '/'),
      spawn_error: result.error ? String(result.error.stack || result.error.message || result.error) : null,
    };
    stepResults.push(stepResult);

    console.log(`G15_R6_STEP_EXIT_CODE=${exitCode}`);
    console.log(`G15_R6_STEP_STATUS=${stepResult.status}`);
    console.log(`G15_R6_STEP_LOG=${stepResult.log_file}`);

    if (exitCode !== 0) {
      firstFailure = stepResult;
      break;
    }
  }

  const summary = {
    stage_id: 'LF-PROD-SOT-G15-R6_IDENTIFY_NEXT_REAL_LINT_CHAIN_FAILURE',
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    platform,
    configured_lint: configuredLint,
    normalized_commands: commands,
    commands_passed_before_failure: stepResults.filter((entry) => entry.status === 'PASS').length,
    first_nonzero_command: firstFailure?.command || null,
    first_nonzero_exit_code: firstFailure?.exit_code ?? null,
    first_nonzero_log_file: firstFailure?.log_file || null,
    result: firstFailure ? 'FIRST_NONZERO_IDENTIFIED' : 'ALL_COMMANDS_PASS',
    steps: stepResults,
  };

  const summaryPath = path.join(artifactRoot, 'summary.json');
  writeFileEnsuringParent(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

  console.log(`G15_R6_RESULT=${summary.result}`);
  console.log(`G15_R6_COMMANDS_PASSED_BEFORE_FAILURE=${summary.commands_passed_before_failure}`);
  console.log(`G15_R6_FIRST_NONZERO_COMMAND=${summary.first_nonzero_command || 'NONE'}`);
  console.log(`G15_R6_FIRST_NONZERO_EXIT_CODE=${summary.first_nonzero_exit_code ?? 'NONE'}`);
  console.log(`G15_R6_SUMMARY=${path.relative(root, summaryPath).replace(/\\/g, '/')}`);

  return summary;
}

function main() {
  const root = path.resolve(__dirname, '../..');
  const packagePath = path.join(root, 'package.json');
  const artifactRoot = path.join(root, '_project/artifacts/g15-r6-lint-chain');

  try {
    runDiagnostic({ root, packagePath, artifactRoot });
  } catch (error) {
    console.error(error?.stack || error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  normalizeCommand,
  runDiagnostic,
  sanitizeForFileName,
  splitShellChain,
};
