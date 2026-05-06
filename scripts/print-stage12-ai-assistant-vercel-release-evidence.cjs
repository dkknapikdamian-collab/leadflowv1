const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = process.cwd();
const STAGE = 'STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_V1';
const OUT = path.join(root, 'docs/release/STAGE12_AI_ASSISTANT_VERCEL_RELEASE_EVIDENCE_LATEST.md');

function run(command) {
  try {
    return childProcess.execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  } catch (error) {
    return String(error?.stdout || error?.stderr || error?.message || '').trim();
  }
}
function exists(rel) { return fs.existsSync(path.join(root, rel)); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }
function listApiFunctionFiles(dir = path.join(root, 'api')) {
  if (!fs.existsSync(dir)) return [];
  const result = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...listApiFunctionFiles(full));
    else if (/\.(ts|js|mjs|cjs)$/i.test(entry.name) && !/\.d\.ts$/i.test(entry.name)) result.push(full);
  }
  return result;
}

const apiFiles = listApiFunctionFiles().map((file) => path.relative(root, file).replace(/\\/g, '/')).sort();
const vercel = exists('vercel.json') ? read('vercel.json') : '';
const system = exists('api/system.ts') ? read('api/system.ts') : '';
const assistantHandlerExists = exists('src/server/assistant-query-handler.ts');
const assistantPhysicalExists = exists('api/assistant/query.ts');
const rewriteOk = /"source"\s*:\s*"\/api\/assistant\/query"/.test(vercel) && /"destination"\s*:\s*"\/api\/system\?kind=assistant-query"/.test(vercel);
const systemRouteOk = system.includes('STAGE10C_ASSISTANT_QUERY_SYSTEM_KIND_ROUTE') && system.includes("__stage10cKind === 'assistant-query'");

const branch = run('git rev-parse --abbrev-ref HEAD');
const commit = run('git rev-parse --short HEAD');
const status = run('git status --short') || 'clean';
const now = new Date().toISOString();

const lines = [
  '# ' + STAGE,
  '',
  'GeneratedAt: `' + now + '`',
  'Branch: `' + branch + '`',
  'Commit: `' + commit + '`',
  '',
  '## Vercel Hobby API budget evidence',
  '',
  '- api function count <= 12: `' + (apiFiles.length <= 12 ? 'PASS' : 'FAIL') + '`',
  '- api function count: `' + apiFiles.length + '`',
  '- api/assistant/query.ts removed: `' + (!assistantPhysicalExists ? 'PASS' : 'FAIL') + '`',
  '- /api/assistant/query rewrite to /api/system?kind=assistant-query: `' + (rewriteOk ? 'PASS' : 'FAIL') + '`',
  '- api/system.ts assistant-query route: `' + (systemRouteOk ? 'PASS' : 'FAIL') + '`',
  '- src/server/assistant-query-handler.ts exists: `' + (assistantHandlerExists ? 'PASS' : 'FAIL') + '`',
  '',
  '## Physical API functions',
  '',
  ...apiFiles.map((file) => '- `' + file + '`'),
  '',
  '## Working tree',
  '',
  '```text',
  status,
  '```',
  '',
  '## Commands for manual verification',
  '',
  '```powershell',
  'node scripts/check-stage11-vercel-hobby-function-budget-guard.cjs',
  'node --test tests/stage11-vercel-hobby-function-budget-guard.test.cjs',
  'node scripts/print-stage12-ai-assistant-vercel-release-evidence.cjs',
  'node --test tests/stage12-ai-assistant-vercel-release-evidence.test.cjs',
  'npm run build',
  '```',
  '',
  '## Verdict',
  '',
  apiFiles.length <= 12 && !assistantPhysicalExists && rewriteOk && systemRouteOk && assistantHandlerExists
    ? 'PASS: assistant endpoint is collapsed under system API and remains inside Vercel Hobby function budget.'
    : 'FAIL: release evidence found a Vercel Hobby or assistant route issue.',
  '',
];

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, lines.join('\n'), 'utf8');
console.log('PASS ' + STAGE + ' wrote ' + path.relative(root, OUT).replace(/\\/g, '/'));
