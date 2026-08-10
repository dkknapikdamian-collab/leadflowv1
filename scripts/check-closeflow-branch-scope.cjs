const cp = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function run(command) {
  return cp.execSync(command, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

const branch = run('git branch --show-current');
const workflowPath = path.join(process.cwd(), '_project', 'WORKFLOW_STATE.json');
const manifestPath = path.join(process.cwd(), '_project', 'PROJECT_MANIFEST.json');

function readJson(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.error(`CLOSEFLOW_BRANCH_SCOPE_FAIL: missing ${label}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    console.error(`CLOSEFLOW_BRANCH_SCOPE_FAIL: invalid ${label}: ${error.message}`);
    process.exit(1);
  }
}

const workflow = readJson(workflowPath, '_project/WORKFLOW_STATE.json');
const manifest = readJson(manifestPath, '_project/PROJECT_MANIFEST.json');
const expectedTarget = workflow.current_workflow?.target_branch;
const canonicalBase = manifest.canonical_branch;

if (!expectedTarget || branch !== expectedTarget) {
  console.error(`CLOSEFLOW_BRANCH_SCOPE_FAIL: current branch is ${branch}, expected active target ${expectedTarget || '(missing)'}`);
  process.exit(1);
}

const upstream = run('git status --short --branch');

if (!upstream.includes(branch)) {
  console.error(`CLOSEFLOW_BRANCH_SCOPE_FAIL: status does not confirm ${branch}`);
  process.exit(1);
}

if (!canonicalBase || branch === canonicalBase) {
  console.error(`CLOSEFLOW_BRANCH_SCOPE_FAIL: working branch must remain distinct from canonical base ${canonicalBase || '(missing)'}`);
  process.exit(1);
}

console.log(`CLOSEFLOW_BRANCH_SCOPE_PASS: CloseFlow work is scoped to ${branch}; canonical base is ${canonicalBase}. Do not push or merge canonical branches.`);
