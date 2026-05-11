const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = process.cwd();

const STAGE_FILES = [
  'api/cases.ts',
  'api/clients.ts',
  'src/lib/data-contract.ts',
  'src/lib/supabase-fallback.ts',
  'src/lib/client-cases.ts',
  'docs/clients/CLOSEFLOW_CLIENT_PRIMARY_CASE_2026-05-10.md',
  'docs/quality/CLOSEFLOW_STAGE_POLISH_COPY_GUARD_2026-05-11.md',
  'scripts/check-closeflow-client-primary-case.cjs',
  'scripts/check-closeflow-stage-polish-guard.cjs',
  'supabase/migrations/20260510_add_primary_case_to_clients.sql',
];

const TEXT_EXTENSIONS = new Set([
  '.ts', '.tsx', '.js', '.cjs', '.mjs', '.json', '.md', '.css', '.scss', '.sql', '.html', '.txt', '.yml', '.yaml'
]);

const EXCLUDED_DIRS = [
  'node_modules/',
  'dist/',
  '.git/',
  '.closeflow-recovery-backups/',
  'coverage/',
  '.vercel/',
];

// Mojibake is detected through code points, not literal broken glyphs.
// This prevents the guard from becoming its own false positive.
const BAD_CODEPOINTS = [
  0x0139, // common leading char in broken Polish sequences
  0x00C5, // common leading char in broken Polish sequences
  0x00C4, // common leading char in broken Polish sequences
  0x0102, // common leading char in double-broken UTF-8 sequences
  0x00C2, // stray non-breaking-space / encoding artefact prefix
  0x00C3, // common Latin-1 mojibake prefix
  0x00E2, // smart quotes / dash mojibake prefix
  0xFFFD, // replacement character
];
const BAD_MARKERS = BAD_CODEPOINTS.map((code) => String.fromCodePoint(code));

function toPosix(rel) {
  return String(rel || '').replace(/\\/g, '/').replace(/^\.\//, '');
}

function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}

function isExcluded(rel) {
  const normalized = toPosix(rel);
  return EXCLUDED_DIRS.some((prefix) => normalized.startsWith(prefix));
}

function isTextFile(rel) {
  return TEXT_EXTENSIONS.has(path.extname(rel));
}

function getGitChangedFiles() {
  const commands = [
    'git diff --name-only --diff-filter=ACMRTUXB HEAD',
    'git diff --name-only --cached --diff-filter=ACMRTUXB',
  ];
  const out = new Set();
  for (const command of commands) {
    try {
      const result = execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
      for (const line of result.split(/\r?\n/g)) {
        const rel = toPosix(line.trim());
        if (rel) out.add(rel);
      }
    } catch {
      // Git diff is best-effort. Stage files still provide the deterministic contract.
    }
  }
  return [...out];
}

function walk(dir, out = []) {
  const abs = path.join(root, dir);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    const rel = toPosix(path.join(dir, entry.name));
    if (isExcluded(rel)) continue;
    if (entry.isDirectory()) walk(rel, out);
    else out.push(rel);
  }
  return out;
}

function getFilesToScan() {
  const scope = String(process.env.CLOSEFLOW_POLISH_GUARD_SCOPE || 'stage').toLowerCase();
  const files = new Set([...STAGE_FILES, ...getGitChangedFiles()].map(toPosix));

  if (scope === 'all') {
    for (const top of ['src', 'api', 'scripts', 'docs', 'supabase']) {
      for (const rel of walk(top)) files.add(toPosix(rel));
    }
  }

  return [...files]
    .filter((rel) => rel && exists(rel) && !isExcluded(rel) && isTextFile(rel))
    .sort();
}

function lineColumnAt(content, index) {
  const before = content.slice(0, index);
  const lines = before.split(/\r?\n/g);
  return { line: lines.length, column: lines[lines.length - 1].length + 1 };
}

function snippetAt(content, index) {
  const start = Math.max(0, index - 36);
  const end = Math.min(content.length, index + 36);
  return content.slice(start, end).replace(/\r?\n/g, ' ').trim();
}

function markerName(marker) {
  return 'U+' + marker.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
}

const findings = [];
for (const rel of getFilesToScan()) {
  const abs = path.join(root, rel);
  const content = fs.readFileSync(abs, 'utf8');
  for (const marker of BAD_MARKERS) {
    let index = content.indexOf(marker);
    while (index !== -1) {
      const pos = lineColumnAt(content, index);
      findings.push({
        file: rel,
        marker: markerName(marker),
        line: pos.line,
        column: pos.column,
        snippet: snippetAt(content, index),
      });
      index = content.indexOf(marker, index + marker.length);
    }
  }
}

if (findings.length) {
  console.error('CLOSEFLOW_STAGE_POLISH_GUARD_FAILED');
  console.error('found=' + findings.length);
  for (const item of findings) {
    console.error(`${item.file}:${item.line}:${item.column} ${item.marker} :: ${item.snippet}`);
  }
  process.exit(1);
}

console.log('CLOSEFLOW_STAGE_POLISH_GUARD_OK');
console.log('files_checked=' + getFilesToScan().length);
console.log('scope=' + String(process.env.CLOSEFLOW_POLISH_GUARD_SCOPE || 'stage').toLowerCase());
