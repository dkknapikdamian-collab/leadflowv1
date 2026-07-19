const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');

function splitAndChain(source) {
  const commands = [];
  let quote = null;
  let escaped = false;
  let start = 0;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === '\\') {
      escaped = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === '&' && source[index + 1] === '&') {
      const command = source.slice(start, index).trim();
      if (!command) throw new Error(`EMPTY_LINT_COMMAND_AT_INDEX:${commands.length + 1}`);
      commands.push(command);
      index += 1;
      start = index + 1;
    }
  }

  if (quote) throw new Error('UNTERMINATED_QUOTE_IN_LINT_CHAIN');
  const finalCommand = source.slice(start).trim();
  if (!finalCommand) throw new Error('EMPTY_FINAL_LINT_COMMAND');
  commands.push(finalCommand);
  return commands;
}

function normalizeCommand(command, platform = process.platform) {
  const npmExecutable = platform === 'win32' ? 'npm.cmd' : 'npm';
  return command.replace(/\bnpm\.cmd\b/g, npmExecutable);
}

function tailLines(value, limit = 120) {
  const lines = String(value || '').replace(/\r\n/g, '\n').split('\n');
  return lines.slice(Math.max(0, lines.length - limit)).join('\n');
}

function ensureDirectory(directory) {
  fs.mkdirSync(directory, { recursive: true });
}

function writeTextReport(outputPath, result) {
  const lines = [
    `STAGE_ID=${result.stageId}`,
    `PLATFORM=${result.platform}`,
    `COMMANDS_TOTAL=${result.commandsTotal}`,
    `COMMANDS_PASSED_BEFORE_FAILURE=${result.commandsPassedBeforeFailure}`,
    `RESULT=${result.result}`,
    `FIRST_NONZERO_INDEX=${result.firstNonzero?.index ?? 'NONE'}`,
    `FIRST_NONZERO_COMMAND=${result.firstNonzero?.command ?? 'NONE'}`,
    `FIRST_NONZERO_EXIT_CODE=${result.firstNonzero?.exitCode ?? 'NONE'}`,
    `STARTED_AT=${result.startedAt}`,
    `FINISHED_AT=${result.finishedAt}`,
    '',
    'COMMAND_RESULTS:',
  ];
  for (const command of result.commands) {
    lines.push(`${command.index}. ${command.status} exit=${command.exitCode} command=${command.command}`);
  }
  if (result.firstNonzero) {
    lines.push('', 'FIRST_NONZERO_TAIL:', result.firstNonzero.tail);
  }
  fs.writeFileSync(outputPath, `${lines.join('\n')}\n`);
}

function runDiagnostic({
  packagePath = path.join(root, 'package.json'),
  outputDirectory = process.env.G15_R6_OUTPUT_DIR || path.join(os.tmpdir(), 'g15-r6-lint-diagnostic'),
  platform = process.platform,
} = {}) {
  const startedAt = new Date().toISOString();
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const lintChain = String(packageJson?.scripts?.lint || '').trim();
  if (!lintChain) throw new Error('LINT_CHAIN_MISSING');

  const rawCommands = splitAndChain(lintChain);
  const commands = rawCommands.map((command) => normalizeCommand(command, platform));
  if (platform !== 'win32' && commands.some((command) => /\bnpm\.cmd\b/.test(command))) {
    throw new Error('WINDOWS_ONLY_NPM_CMD_REMAINS_AFTER_NORMALIZATION');
  }

  ensureDirectory(outputDirectory);
  const commandResults = [];
  let firstNonzero = null;

  console.log(`G15_R6_PLATFORM=${platform}`);
  console.log(`G15_R6_COMMANDS_TOTAL=${commands.length}`);

  for (let offset = 0; offset < commands.length; offset += 1) {
    const index = offset + 1;
    const command = commands[offset];
    const commandStartedAt = new Date().toISOString();
    console.log(`G15_R6_COMMAND_START index=${index} command=${command}`);

    const execution = spawnSync(command, {
      cwd: root,
      env: process.env,
      shell: true,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    const exitCode = typeof execution.status === 'number' ? execution.status : 1;
    const stdout = execution.stdout || '';
    const stderr = execution.stderr || '';
    const combined = `${stdout}${stderr ? `${stdout ? '\n' : ''}${stderr}` : ''}`;
    const logName = `${String(index).padStart(2, '0')}-${exitCode === 0 ? 'pass' : 'nonzero'}.log`;
    fs.writeFileSync(path.join(outputDirectory, logName), combined);

    const commandResult = {
      index,
      originalCommand: rawCommands[offset],
      command,
      exitCode,
      status: exitCode === 0 ? 'PASS' : 'FIRST_NONZERO',
      startedAt: commandStartedAt,
      finishedAt: new Date().toISOString(),
      logFile: logName,
    };
    commandResults.push(commandResult);
    console.log(`G15_R6_COMMAND_END index=${index} exit=${exitCode} status=${commandResult.status}`);

    if (exitCode !== 0) {
      firstNonzero = {
        index,
        originalCommand: rawCommands[offset],
        command,
        exitCode,
        logFile: logName,
        tail: tailLines(combined),
      };
      break;
    }
  }

  const result = {
    stageId: 'LF-PROD-SOT-G15-R6_IDENTIFY_NEXT_REAL_LINT_CHAIN_FAILURE',
    platform,
    lintChain,
    commandsTotal: commands.length,
    commandsPassedBeforeFailure: firstNonzero ? firstNonzero.index - 1 : commandResults.length,
    commands: commandResults,
    firstNonzero,
    result: firstNonzero ? 'PASS_FIRST_NONZERO_IDENTIFIED' : 'PASS_LINT_CHAIN_ALL_GREEN',
    startedAt,
    finishedAt: new Date().toISOString(),
  };

  fs.writeFileSync(path.join(outputDirectory, 'diagnostic.json'), `${JSON.stringify(result, null, 2)}\n`);
  writeTextReport(path.join(outputDirectory, 'diagnostic.txt'), result);

  console.log(`G15_R6_COMMANDS_PASSED_BEFORE_FAILURE=${result.commandsPassedBeforeFailure}`);
  console.log(`G15_R6_RESULT=${result.result}`);
  if (firstNonzero) {
    console.log(`G15_R6_FIRST_NONZERO_INDEX=${firstNonzero.index}`);
    console.log(`G15_R6_FIRST_NONZERO_COMMAND=${firstNonzero.command}`);
    console.log(`G15_R6_FIRST_NONZERO_EXIT_CODE=${firstNonzero.exitCode}`);
    console.log('G15_R6_FIRST_NONZERO_TAIL_BEGIN');
    console.log(firstNonzero.tail);
    console.log('G15_R6_FIRST_NONZERO_TAIL_END');
  }
  console.log(`G15_R6_ARTIFACT_DIRECTORY=${outputDirectory}`);
  return result;
}

if (require.main === module) {
  try {
    runDiagnostic();
  } catch (error) {
    console.error(`G15_R6_DIAGNOSTIC_ERROR=${error?.stack || error}`);
    process.exit(1);
  }
}

module.exports = {
  normalizeCommand,
  runDiagnostic,
  splitAndChain,
  tailLines,
};
