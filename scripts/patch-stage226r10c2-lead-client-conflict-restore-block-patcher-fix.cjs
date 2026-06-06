const fs = require('node:fs');
const path = require('node:path');

const root = process.cwd();
const stage = 'STAGE226R10C2_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_PATCHER_FIX';

function read(relPath) {
  return fs.readFileSync(path.join(root, relPath), 'utf8');
}

function write(relPath, content) {
  fs.writeFileSync(path.join(root, relPath), content, 'utf8');
}

function removeIfExists(relPath) {
  const full = path.join(root, relPath);
  if (fs.existsSync(full)) fs.rmSync(full, { force: true });
}

function appendOnce(relPath, marker, text) {
  if (!fs.existsSync(path.join(root, relPath))) return;
  const current = read(relPath);
  if (current.includes(marker)) return;
  write(relPath, `${current.replace(/\s*$/, '')}\n\n${text}\n`);
}

function fail(message) {
  throw new Error(`${stage}_PATCH_FAIL: ${message}`);
}

function replaceRestoreConflictCandidate(leads) {
  const startToken = '  const restoreConflictCandidate = async (candidate: EntityConflictCandidate) => {';
  const start = leads.indexOf(startToken);
  if (start < 0) fail('restoreConflictCandidate start not found');

  const afterStart = start + startToken.length;
  const rest = leads.slice(afterStart);
  const endMatch = rest.match(/\r?\n\s*const\s+handleCreateLead\s*=\s*async\s*\(/);
  if (!endMatch || typeof endMatch.index !== 'number') {
    fail('restoreConflictCandidate end marker not found before handleCreateLead');
  }
  const end = afterStart + endMatch.index;

  const replacement = `  const restoreConflictCandidate = async (candidate: EntityConflictCandidate) => {
    if (candidate.entityType === 'client') {
      toast.info('Znaleziono podobnego klienta. To nie jest ten sam rekord. Otwórz klienta albo utwórz osobnego leada.');
      return;
    }
    if (!candidate.canRestore) { toast.info('Ten rekord ma historię. Najpierw go otwórz i zdecyduj, co zrobić.'); return; }
    try {
      setLeadSubmitting(true);
      await updateLeadInSupabase({ id: candidate.id, status: 'new', leadVisibility: 'active', salesOutcome: 'open', closedAt: null });
      toast.success('Lead przywrócony');
      setLeadConflictOpen(false);
      await loadLeads();
    } catch (error: any) { toast.error('Nie udało się przywrócić rekordu: ' + (error?.message || 'REQUEST_FAILED')); }
    finally { setLeadSubmitting(false); }
  };
`;

  return leads.slice(0, start) + replacement + leads.slice(end);
}

function sanitizeConflictCandidatesAtState(leads) {
  const raw = "const candidates = Array.isArray(conflicts.candidates) ? conflicts.candidates as EntityConflictCandidate[] : [];";
  const safe = `const candidates = Array.isArray(conflicts.candidates)
        ? (conflicts.candidates as EntityConflictCandidate[]).map((candidate) => candidate.entityType === 'client' ? { ...candidate, canRestore: false } : candidate)
        : [];`;
  if (leads.includes(safe)) return leads;
  if (!leads.includes(raw)) fail('raw conflict candidates assignment not found');
  return leads.replace(raw, safe);
}

function ensurePackageScripts() {
  const pkgPath = 'package.json';
  let pkg = read(pkgPath);

  const checkLine = '    "check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix": "node scripts/check-stage226r10c2-lead-client-conflict-restore-block-patcher-fix.cjs"';
  const testLine = '    "test:stage226r10c2-lead-client-conflict-restore-block-patcher-fix": "node --test tests/stage226r10c2-lead-client-conflict-restore-block-patcher-fix.test.cjs"';

  if (!pkg.includes('"check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix"')) {
    const anchor = '    "test:stage226r10b-lead-client-conflict-single-dialog": "node --test tests/stage226r10b-lead-client-conflict-single-dialog.test.cjs"';
    if (!pkg.includes(anchor)) fail('package R10B script anchor not found');
    pkg = pkg.replace(anchor, `${anchor},\n${checkLine},\n${testLine}`);
  }

  const r10bGuard = 'node scripts/check-stage226r10b-lead-client-conflict-single-dialog.cjs';
  const r10c2Guard = 'node scripts/check-stage226r10c2-lead-client-conflict-restore-block-patcher-fix.cjs';
  if (!pkg.includes(r10c2Guard)) {
    if (!pkg.includes(r10bGuard)) fail('prebuild R10B guard anchor not found');
    pkg = pkg.replace(r10bGuard, `${r10bGuard} && ${r10c2Guard}`);
  }

  write(pkgPath, pkg);
}

function cleanupFailedR10CFiles() {
  const stale = [
    'scripts/patch-stage226r10c-lead-client-conflict-restore-block.cjs',
    'scripts/check-stage226r10c-lead-client-conflict-restore-block.cjs',
    'tests/stage226r10c-lead-client-conflict-restore-block.test.cjs',
    '_project/obsidian_updates/STAGE226R10C_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_OBSIDIAN_UPDATE.md',
    '_project/reports/STAGE226R10C_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_REPORT.md',
    '_project/runs/STAGE226R10C_LEAD_CLIENT_CONFLICT_RESTORE_BLOCK_RUN.md',
  ];
  stale.forEach(removeIfExists);
}

cleanupFailedR10CFiles();

let leads = read('src/pages/Leads.tsx');
leads = replaceRestoreConflictCandidate(leads);
leads = sanitizeConflictCandidatesAtState(leads);
if (leads.includes("await updateClientInSupabase({ id: candidate.id, archivedAt: null });")) {
  fail('client restore still present after patch');
}
write('src/pages/Leads.tsx', leads);

ensurePackageScripts();

const memoryBlock = `## ${stage} — fix po czerwonym R10C

- data i godzina: 2026-06-06 13:55 Europe/Warsaw
- typ wpisu: hotfix patchera i kontraktu lead/client separation po R10B/R10C
- decyzja: klient z konfliktu przy tworzeniu leada nie może być przywracany z flow leada; tylko Pokaż klienta albo Dodaj mimo to jako osobnego leada.
- zmiana: restoreConflictCandidate blokuje candidate.entityType === 'client' bez updateClientInSupabase; kandydaci typu client dostają canRestore=false przed zapisaniem do state.
- naprawa procesu: R10C2 usuwa nieudane, niezatwierdzone pliki R10C po przerwanym apply i dodaje odporny patcher regexowy.
- testy: R10C2 guard/test, R10B guard/test, R10 guard/test, build, verify:closeflow:quiet, git diff --check.
- ryzyko: istniejący klient z tymi samymi danymi dalej będzie widoczny w /clients, ale nie jest tworzony ani przywracany przez dodanie leada.
`;

appendOnce('_project/04_DECISIONS.md', stage, memoryBlock);
appendOnce('_project/06_GUARDS_AND_TESTS.md', stage, memoryBlock);
appendOnce('_project/07_NEXT_STEPS.md', stage, `## ${stage} — next step\n\n- data i godzina: 2026-06-06 13:55 Europe/Warsaw\n- po PASS: wykonać manual smoke /clients -> /leads -> /clients. Dopiero potem Stage226R11 timezone albo Stage227.\n- nie ruszać: Stage227, Google Calendar, finanse, RLS, schema.\n`);
appendOnce('_project/08_CHANGELOG_AI.md', stage, memoryBlock);
appendOnce('_project/12_IMPLEMENTATION_LEDGER.md', stage, memoryBlock);
appendOnce('_project/13_TEST_HISTORY.md', stage, `## ${stage} — test history\n\n- data i godzina: 2026-06-06 13:55 Europe/Warsaw\n- wymagane: npm run check:stage226r10c2-lead-client-conflict-restore-block-patcher-fix; npm run test:stage226r10c2-lead-client-conflict-restore-block-patcher-fix; npm run check:stage226r10b-lead-client-conflict-single-dialog; npm run test:stage226r10b-lead-client-conflict-single-dialog; npm run check:stage226r10-lead-client-separation-runtime; npm run test:stage226r10-lead-client-separation-runtime; npm run build; npm run verify:closeflow:quiet; git diff --check.\n- manual smoke: liczba klientów przed/po dodaniu leada nie może wzrosnąć; lead podobny do klienta nie przywraca klienta z formularza leada.\n`);

console.log(JSON.stringify({ ok: true, stage, changed: ['src/pages/Leads.tsx', 'package.json', '_project/*'], cleanup: 'removed stale failed R10C files if present' }, null, 2));
