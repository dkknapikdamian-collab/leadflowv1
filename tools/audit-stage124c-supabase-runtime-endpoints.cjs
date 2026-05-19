#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const repo = process.cwd();
const OUT = path.join(repo, '_project', 'runs', '2026-05-19_stage124c_supabase_runtime_endpoint_audit_result.md');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'dist', '.next', '_backup_local']);
const RUNTIME_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (RUNTIME_EXT.has(path.extname(entry.name))) acc.push(full);
  }
  return acc;
}
function rel(p) { return path.relative(repo, p).replace(/\\/g, '/'); }
function existsAny(paths) { return paths.filter((p) => fs.existsSync(path.join(repo, p))); }
function read(file) { return fs.readFileSync(file, 'utf8'); }
function grep(files, regex) {
  const out = [];
  for (const file of files) {
    const text = read(file);
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => { if (regex.test(line)) out.push({ file: rel(file), line: i + 1, text: line.trim().slice(0, 220) }); });
  }
  return out;
}

const files = walk(repo);
const runtimeFiles = files.filter((f) => !rel(f).startsWith('tools/') && !rel(f).startsWith('scripts/') && !rel(f).startsWith('tests/') && !rel(f).startsWith('_project/'));
const apiRouteCandidates = existsAny([
  'api/tasks.ts', 'api/tasks.js', 'api/events.ts', 'api/events.js',
  'src/pages/api/tasks.ts', 'src/pages/api/events.ts',
  'app/api/tasks/route.ts', 'app/api/events/route.ts',
  'src/app/api/tasks/route.ts', 'src/app/api/events/route.ts',
]);

const callSites = grep(runtimeFiles, /['"`]\/api\/(tasks|events)(\?|['"`])/);
const heavyWorkItems = grep(runtimeFiles, /work_items\?select=\*.*record_type=eq\.(task|event)|work_items\?select=\*.*show_in_calendar=is\.true/);
const selectStarRuntime = grep(runtimeFiles, /select=\*|\.select\(\s*['"`]\*['"`]\s*\)/);
const fetchCalendarBundle = grep(runtimeFiles, /fetchCalendarBundleFromSupabase|fetchTasksFromSupabase|fetchEventsFromSupabase/);

const blockers = [];
if (callSites.length && !apiRouteCandidates.length) {
  blockers.push('Runtime calls /api/tasks or /api/events exist, but no matching API route file was found in the tracked local source tree. Do not patch blindly; resolve route source first.');
}
if (heavyWorkItems.length) {
  blockers.push('Heavy work_items select=* task/event query exists in runtime code. Replace with explicit task/event list DTO fields and date range query.');
}

const report = [];
report.push('# Stage124C - Supabase runtime endpoint audit result');
report.push('');
report.push(`Generated: ${new Date().toISOString()}`);
report.push('');
report.push('## Summary');
report.push(`- Runtime files scanned: ${runtimeFiles.length}`);
report.push(`- /api/tasks|/api/events call sites: ${callSites.length}`);
report.push(`- API route candidates found: ${apiRouteCandidates.length ? apiRouteCandidates.join(', ') : 'NONE'}`);
report.push(`- heavy work_items select=* task/event hits: ${heavyWorkItems.length}`);
report.push(`- runtime select=* hits: ${selectStarRuntime.length}`);
report.push(`- blockers: ${blockers.length}`);
report.push('');
report.push('## Blockers');
if (!blockers.length) report.push('- none'); else blockers.forEach((b) => report.push(`- ${b}`));
report.push('');
function section(title, rows) {
  report.push(`## ${title}`); report.push('');
  if (!rows.length) { report.push('- none'); report.push(''); return; }
  rows.slice(0, 80).forEach((r) => report.push(`- ${r.file}:${r.line} :: \`${r.text.replace(/`/g, "'")}\``));
  if (rows.length > 80) report.push(`- ... truncated ${rows.length - 80} additional hits`);
  report.push('');
}
section('/api/tasks and /api/events call sites', callSites);
section('Heavy work_items task/event selects', heavyWorkItems);
section('Runtime select star hits', selectStarRuntime);
section('Calendar/task/event fetch functions', fetchCalendarBundle);
report.push('## Recommendation');
report.push('');
report.push('If blockers are present, Stage124C should stay audit-only. Next code stage must first resolve the real API route source and only then introduce range queries and ListDTO selects for tasks/events.');
report.push('');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, report.join('\n'), 'utf8');
console.log(report.slice(0, 25).join('\n'));
if (blockers.length) {
  console.log(`STAGE124C_AUDIT_BLOCKERS=${blockers.length}`);
} else {
  console.log('STAGE124C_AUDIT_BLOCKERS=0');
}
