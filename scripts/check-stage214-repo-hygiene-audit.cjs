#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const root = process.cwd();
const checks = [];
function check(label, condition) { checks.push({ label, pass: Boolean(condition) }); }
function read(p) { return fs.readFileSync(path.join(root, p), 'utf8'); }

const generatorPath = 'tools/stage214-generate-repo-hygiene-audit.cjs';
const guardPath = 'scripts/check-stage214-repo-hygiene-audit.cjs';
const reportPath = '_project/reports/STAGE214_REPO_HYGIENE_BACKUP_AUDIT_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage214 repo hygiene backup audit.md';

check('Stage214 generator exists', fs.existsSync(path.join(root, generatorPath)));
check('Stage214 guard exists', fs.existsSync(path.join(root, guardPath)));
check('Stage214 report exists', fs.existsSync(path.join(root, reportPath)));
check('Stage214 Obsidian update exists', fs.existsSync(path.join(root, obsidianPath)));

if (fs.existsSync(path.join(root, generatorPath))) {
  const generator = read(generatorPath);
  check('generator uses git status --short', generator.includes('git status --short'));
  check('generator excludes Stage214 generated paths from audit counts', generator.includes('stage214_generated') && generator.includes('selfPaths'));
  check('generator classifies backup categories', generator.includes('local_backups_root') && generator.includes('project_backups') && generator.includes('bak_files'));
  check('generator writes report and Obsidian update', generator.includes('STAGE214_REPO_HYGIENE_BACKUP_AUDIT_2026-05-31.md') && generator.includes('Stage214 repo hygiene backup audit'));
}

for (const p of [reportPath, obsidianPath]) {
  if (!fs.existsSync(path.join(root, p))) continue;
  const text = read(p);
  check(`${p} declares audit only`, text.includes('STATUS: AUDIT_ONLY'));
  check(`${p} declares no delete executed`, text.includes('NO_DELETE_EXECUTED'));
  check(`${p} bans git add dot`, text.includes('NO_GIT_ADD_DOT') || text.includes('git add .'));
  check(`${p} mentions backup categories`, /backup/i.test(text) && /\.bak|bak_files/i.test(text));
  check(`${p} mentions no SQL/RLS/GRANT`, /SQL/.test(text) && /RLS/.test(text) && /GRANT/.test(text));
  check(`${p} has next step`, /NASTĘPNY KROK|Następny krok|REKOMENDOWANY Stage214-B/i.test(text));
  check(`${p} does not instruct deletion now`, !/Remove-Item\s+-Recurse|-delete\b|rm\s+-rf/i.test(text));
}

const failed = checks.filter((c) => !c.pass);
for (const c of checks) console.log(`${c.pass ? 'PASS' : 'FAIL'} - ${c.label}`);
if (failed.length) {
  console.error(`\nFAIL: ${failed.length} Stage214 checks failed.`);
  process.exit(1);
}
console.log(`\nPASS: ${checks.length} Stage214 checks passed.`);
