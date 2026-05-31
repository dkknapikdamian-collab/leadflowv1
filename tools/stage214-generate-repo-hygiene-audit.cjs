#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');

const root = process.cwd();
const today = '2026-05-31';
const reportPath = '_project/reports/STAGE214_REPO_HYGIENE_BACKUP_AUDIT_2026-05-31.md';
const obsidianPath = 'OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-31 - CloseFlow Stage214 repo hygiene backup audit.md';
const selfPaths = new Set([
  'tools/stage214-generate-repo-hygiene-audit.cjs',
  'scripts/check-stage214-repo-hygiene-audit.cjs',
  reportPath,
  obsidianPath,
]);

function run(command) {
  return childProcess.execSync(command, { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(path.join(root, filePath)), { recursive: true });
}

function normalizePath(rawPath) {
  return String(rawPath || '')
    .replace(/^"|"$/g, '')
    .replace(/\\/g, '/')
    .trim();
}

function parseStatusLine(line) {
  if (!line || line.length < 4) return null;
  const code = line.slice(0, 2);
  let filePath = line.slice(3).trim();
  if (filePath.includes(' -> ')) filePath = filePath.split(' -> ').pop();
  filePath = normalizePath(filePath);
  if (!filePath) return null;
  return { code, filePath, raw: line };
}

function classify(filePath) {
  const p = filePath.toLowerCase();
  if (selfPaths.has(filePath)) return 'stage214_generated';
  if (p === '_local_backups' || p.startsWith('_local_backups/')) return 'local_backups_root';
  if (p.startsWith('_project/backups/')) return 'project_backups';
  if (p.startsWith('_project/archive/')) return 'project_archive';
  if (p.endsWith('.patch') || p.includes('/backup_before_restore')) return 'patch_backup';
  if (p.includes('.bak') || p.endsWith('.bak') || p.includes('before-rollback')) return 'bak_files';
  if (p.startsWith('dist/') || p === 'dist') return 'build_output_dist';
  if (p.startsWith('node_modules/') || p === 'node_modules') return 'node_modules';
  return 'other_untracked';
}

function groupBy(items, fn) {
  const grouped = new Map();
  for (const item of items) {
    const key = fn(item);
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(item);
  }
  return grouped;
}

function mdTable(rows) {
  const header = '| category | count | action now | recommendation |\n|---|---:|---|---|';
  return [header, ...rows.map((row) => `| ${row.category} | ${row.count} | ${row.actionNow} | ${row.recommendation} |`)].join('\n');
}

const statusShort = run('git status --short');
const statusEntries = statusShort
  .split(/\r?\n/)
  .map(parseStatusLine)
  .filter(Boolean)
  .filter((entry) => !selfPaths.has(entry.filePath));

const untracked = statusEntries.filter((entry) => entry.code === '??');
const trackedModified = statusEntries.filter((entry) => entry.code !== '??');
const grouped = groupBy(untracked, (entry) => classify(entry.filePath));

const categoryOrder = [
  'local_backups_root',
  'project_backups',
  'project_archive',
  'patch_backup',
  'bak_files',
  'build_output_dist',
  'node_modules',
  'other_untracked',
];

const summaryRows = categoryOrder
  .filter((category) => grouped.has(category))
  .map((category) => {
    const count = grouped.get(category).length;
    const recommendationMap = {
      local_backups_root: 'Keep outside commits. Consider moving outside repo or adding a narrow ignore rule after manual review.',
      project_backups: 'Do not commit raw backups. Decide whether selected final reports should be archived; otherwise ignore or move outside repo.',
      project_archive: 'Review separately. Archive folders may be legitimate, but untracked archive dumps should not be swept into commit.',
      patch_backup: 'Do not commit emergency patch backups. Keep only if explicitly needed for rollback evidence.',
      bak_files: 'Do not commit .bak files. Prefer one documented report over scattered backup copies.',
      build_output_dist: 'Do not commit build output unless the project explicitly tracks it.',
      node_modules: 'Never commit dependency folders.',
      other_untracked: 'Manual review required before any add/delete decision.',
    };
    return {
      category,
      count,
      actionNow: 'audit only, no delete',
      recommendation: recommendationMap[category] || 'manual review',
    };
  });

function listBlock(category) {
  const items = grouped.get(category) || [];
  if (!items.length) return '';
  return `\n### ${category} (${items.length})\n\n\`\`\`text\n${items.map((entry) => `${entry.code} ${entry.filePath}`).join('\n')}\n\`\`\`\n`;
}

const report = `---
typ: raport_stage
stage: Stage214
status: audit_only
project: CloseFlow / LeadFlow
data: ${today}
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
---

# Stage214 - Repo hygiene backup audit

STATUS: AUDIT_ONLY
NO_DELETE_EXECUTED
NO_GIT_ADD_DOT

## Cel

Zmapować lokalne nieśledzone backupy, pliki .bak, patche, foldery archiwalne i inne elementy, które nie powinny przypadkiem wejść do repo przez \`git add .\`.

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow
- poprzedni etap: Stage213C-A/B/C Supabase query budget fixes

## Fakty

- Stage214 nie usuwa plików.
- Stage214 nie przenosi plików.
- Stage214 nie dotyka SQL, RLS, GRANT ani danych Supabase.
- Stage214 tworzy tylko raport, guard i update Obsidiana.
- Zakaz: \`git add .\`.

## Podsumowanie lokalnego \`git status --short\`

- total status entries, excluding Stage214 generated files: ${statusEntries.length}
- untracked entries: ${untracked.length}
- tracked modified entries unrelated to Stage214: ${trackedModified.length}

${mdTable(summaryRows.length ? summaryRows : [{ category: 'none', count: 0, actionNow: 'audit only', recommendation: 'working tree has no untracked backup categories detected' }])}

## Zmienione śledzone pliki poza Stage214

${trackedModified.length ? `\`\`\`text\n${trackedModified.map((entry) => entry.raw).join('\n')}\n\`\`\`` : 'Brak wykrytych śledzonych zmian poza Stage214 w momencie audytu.'}

## Pełna lista według kategorii

${categoryOrder.map(listBlock).join('\n') || 'Brak nieśledzonych plików w monitorowanych kategoriach.'}

## Decyzja operacyjna

Nie commitować lokalnych backupów, plików .bak, folderów _local_backups ani folderów _project/backups bez osobnej decyzji. Stage214 to tylko mapa minowego pola, nie sprzątanie kombajnem.

## Rekomendowany Stage214-B

1. Dodać lub poprawić reguły .gitignore dla typowych lokalnych backupów, ale tylko po sprawdzeniu, że nie ukryją ważnych raportów.
2. Przenieść oczywiste lokalne backupy poza repo, do katalogu lokalnego archiwum, jeżeli Damian potwierdzi.
3. Zostawić w repo tylko dokumentację etapów, guardy i finalne raporty.
4. Nigdy nie używać \`git add .\` w CloseFlow.

## Testy

- \`node scripts/check-stage214-repo-hygiene-audit.cjs\`
- \`npm run build\` jako sanity check po wygenerowaniu raportu
`;

const obsidian = `# 2026-05-31 - CloseFlow Stage214 repo hygiene backup audit

STATUS: AUDIT_ONLY
NO_DELETE_EXECUTED
NO_GIT_ADD_DOT

## FAKTY

- Stage213C-A/B/C zostały domknięte przed Stage214.
- Lokalny working tree zawiera dużo nieśledzonych backupów, plików .bak, patchy i folderów archiwalnych.
- Stage214 nie usuwa i nie przenosi plików.
- Stage214 tworzy mapę ryzyka, żeby przypadkiem nie dodać lokalnego śmietnika do repo.

## PODSUMOWANIE

- total status entries excluding Stage214 files: ${statusEntries.length}
- untracked entries: ${untracked.length}
- tracked modified entries unrelated to Stage214: ${trackedModified.length}

${mdTable(summaryRows.length ? summaryRows : [{ category: 'none', count: 0, actionNow: 'audit only', recommendation: 'working tree has no untracked backup categories detected' }])}

## DECYZJA

Nie używać \`git add .\`. Nie commitować backupów, .bak ani dumpów archiwalnych. Najpierw osobna decyzja, potem ewentualny Stage214-B cleanup.

## RYZYKA

- Backupi mogą zawierać stare wersje kodu, które po przypadkowym commicie przywrócą błędy.
- Zbyt szerokie .gitignore może ukryć ważny raport albo guard.
- Usuwanie bez mapy może skasować plik potrzebny do odtworzenia wcześniejszego etapu.

## NASTĘPNY KROK

Po commicie Stage214 audit: zdecydować, czy robimy Stage214-B jako bezpieczny cleanup albo tylko .gitignore hardening.
`;

ensureDir(reportPath);
ensureDir(obsidianPath);
fs.writeFileSync(path.join(root, reportPath), report, 'utf8');
fs.writeFileSync(path.join(root, obsidianPath), obsidian, 'utf8');

console.log('Stage214 repo hygiene audit generated.');
console.log(`Untracked entries: ${untracked.length}`);
console.log(`Tracked modified entries outside Stage214: ${trackedModified.length}`);
for (const row of summaryRows) console.log(`${row.category}: ${row.count}`);
