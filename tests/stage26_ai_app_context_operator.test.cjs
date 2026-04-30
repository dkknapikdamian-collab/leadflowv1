const { execFileSync } = require('node:child_process');
const path = require('node:path');

const runner = path.join(__dirname, 'stage26_ai_app_context_operator_runner.mjs');
execFileSync(process.execPath, ['--import', 'tsx', runner], { stdio: 'inherit' });
console.log('PASS stage26_ai_app_context_operator');
