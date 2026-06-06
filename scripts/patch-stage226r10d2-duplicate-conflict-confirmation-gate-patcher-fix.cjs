const fs = require('node:fs');
const path = require('node:path');

const STAGE = 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX';
const repo = process.cwd();

function read(rel) {
  return fs.readFileSync(path.join(repo, rel), 'utf8');
}
function write(rel, text) {
  fs.writeFileSync(path.join(repo, rel), text.replace(/\r\n/g, '\n'), 'utf8');
}
function ensureDir(rel) {
  fs.mkdirSync(path.join(repo, rel), { recursive: true });
}
function removeIfExists(rel) {
  const target = path.join(repo, rel);
  if (fs.existsSync(target)) fs.rmSync(target, { force: true });
}
function assertIncludes(text, token, label) {
  if (!text.includes(token)) throw new Error(`Missing token ${label}: ${token}`);
}
function replaceRequired(text, oldText, newText, label) {
  if (!text.includes(oldText)) throw new Error(`Missing patch target: ${label}`);
  return text.replace(oldText, newText);
}
function replaceRegexRequired(text, regex, replacer, label) {
  const next = text.replace(regex, replacer);
  if (next === text) throw new Error(`Missing regex patch target: ${label}`);
  return next;
}
function appendOnce(rel, marker, block) {
  let text = fs.existsSync(path.join(repo, rel)) ? read(rel) : '';
  if (!text.includes(marker)) {
    text = text.replace(/\s+$/g, '');
    text += '\n\n' + block.trim() + '\n';
    write(rel, text);
  }
}
function trimEofBlanks(rel) {
  if (!fs.existsSync(path.join(repo, rel))) return;
  const text = read(rel).replace(/\s+$/g, '') + '\n';
  write(rel, text);
}

// Cleanup files copied by the failed R10D package. They should not remain active.
[
  '_project/obsidian_updates/STAGE226R10D_DUPLICATE_CONFLICT_CONFIRMATION_GATE_OBSIDIAN_UPDATE.md',
  '_project/reports/STAGE226R10D_DUPLICATE_CONFLICT_CONFIRMATION_GATE_REPORT.md',
  '_project/runs/STAGE226R10D_DUPLICATE_CONFLICT_CONFIRMATION_GATE_RUN.md',
  'scripts/check-stage226r10d-duplicate-conflict-confirmation-gate.cjs',
  'scripts/patch-stage226r10d-duplicate-conflict-confirmation-gate.cjs',
  'tests/stage226r10d-duplicate-conflict-confirmation-gate.test.cjs',
].forEach(removeIfExists);

function patchLeads() {
  let text = read('src/pages/Leads.tsx');

  if (!text.includes('STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE')) {
    const anchor = "void STAGE226R10B_LEAD_CLIENT_CONFLICT_SINGLE_DIALOG;";
    assertIncludes(text, anchor, 'lead marker anchor');
    text = text.replace(anchor, anchor + "\nconst STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE = 'lead duplicate conflict preflight fails closed and requires explicit add anyway';\nvoid STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE;");
  }

  const oldCatch = "const conflicts = await findEntityConflictsInSupabase({ targetType: 'lead', name: preparedLead.name, email: preparedLead.email, phone: preparedLead.phone, company: preparedLead.company, workspaceId }).catch(() => ({ candidates: [] }));";
  const newCatch = "let conflicts: any;\n      try {\n        conflicts = await findEntityConflictsInSupabase({ targetType: 'lead', name: preparedLead.name, email: preparedLead.email, phone: preparedLead.phone, company: preparedLead.company, workspaceId });\n      } catch (error: any) {\n        toast.error('Nie udało się sprawdzić duplikatów. Zapis leada zatrzymany, żeby nie dodać konfliktu po cichu.');\n        return;\n      }";
  if (text.includes(oldCatch)) {
    text = text.replace(oldCatch, newCatch);
  } else if (!text.includes('Zapis leada zatrzymany')) {
    throw new Error('Missing Leads conflict preflight block and no R10D2 marker found');
  }

  const oldIf = "if (candidates.length) { setLeadConflictCandidates(candidates); setLeadConflictPendingInput(preparedLead); setIsNewLeadOpen(false); setLeadConflictOpen(true); return; }";
  const newIf = "if (candidates.length) {\n        toast.info('Znaleziono podobny rekord. Zapis leada wymaga potwierdzenia albo kliknięcia „Dodaj mimo to”.');\n        setLeadConflictCandidates(candidates);\n        setLeadConflictPendingInput(preparedLead);\n        setIsNewLeadOpen(false);\n        setLeadConflictOpen(true);\n        return;\n      }";
  if (text.includes(oldIf)) {
    text = text.replace(oldIf, newIf);
  } else if (!text.includes('Zapis leada wymaga potwierdzenia')) {
    // Handle already multiline block without the notification.
    text = replaceRegexRequired(
      text,
      /if \(candidates\.length\) \{\s*setLeadConflictCandidates\(candidates\);\s*setLeadConflictPendingInput\(preparedLead\);\s*setIsNewLeadOpen\(false\);\s*setLeadConflictOpen\(true\);\s*return;\s*\}/,
      newIf,
      'Leads conflict confirmation notification block'
    );
  }

  write('src/pages/Leads.tsx', text);
}

function patchClients() {
  let text = read('src/pages/Clients.tsx');

  const oldCatch = "const conflicts = await findEntityConflictsInSupabase({ targetType: 'client', name: preparedClient.name, email: preparedClient.email, phone: preparedClient.phone, company: preparedClient.company, workspaceId }).catch(() => ({ candidates: [] }));";
  const newCatch = "let conflicts: any;\n      try {\n        conflicts = await findEntityConflictsInSupabase({ targetType: 'client', name: preparedClient.name, email: preparedClient.email, phone: preparedClient.phone, company: preparedClient.company, workspaceId });\n      } catch (error: any) {\n        toast.error('Nie udało się sprawdzić duplikatów. Zapis klienta zatrzymany, żeby nie dodać konfliktu po cichu.');\n        return;\n      }";
  if (text.includes(oldCatch)) {
    text = text.replace(oldCatch, newCatch);
  } else if (!text.includes('Zapis klienta zatrzymany')) {
    throw new Error('Missing Clients conflict preflight block and no R10D2 marker found');
  }

  const oldIf = "if (candidates.length) { setClientConflictCandidates(candidates); setClientConflictPendingInput(preparedClient); setIsCreateOpen(false); setClientConflictOpen(true); return; }";
  const newIf = "if (candidates.length) {\n        toast.info('Znaleziono podobny rekord. Zapis klienta wymaga potwierdzenia albo kliknięcia „Dodaj mimo to”.');\n        setClientConflictCandidates(candidates);\n        setClientConflictPendingInput(preparedClient);\n        setIsCreateOpen(false);\n        setClientConflictOpen(true);\n        return;\n      }";
  if (text.includes(oldIf)) {
    text = text.replace(oldIf, newIf);
  } else if (!text.includes('Zapis klienta wymaga potwierdzenia')) {
    text = replaceRegexRequired(
      text,
      /if \(candidates\.length\) \{\s*setClientConflictCandidates\(candidates\);\s*setClientConflictPendingInput\(preparedClient\);\s*setIsCreateOpen\(false\);\s*setClientConflictOpen\(true\);\s*return;\s*\}/,
      newIf,
      'Clients conflict confirmation notification block'
    );
  }

  if (!text.includes('STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_CLIENTS')) {
    const anchor = "const CLOSEFLOW_A2_CLIENT_DUPLICATE_WARNING_BEFORE_WRITE = 'client duplicate warning before write';";
    assertIncludes(text, anchor, 'client marker anchor');
    text = text.replace(anchor, anchor + "\nconst STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_CLIENTS = 'client duplicate conflict preflight fails closed and requires explicit add anyway';\nvoid STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_CLIENTS;");
  }

  write('src/pages/Clients.tsx', text);
}

function patchPackage() {
  const packagePath = path.join(repo, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.scripts['check:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix'] = 'node scripts/check-stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.cjs';
  pkg.scripts['test:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix'] = 'node --test tests/stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.test.cjs';
  const guard = 'node scripts/check-stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.cjs';
  if (typeof pkg.scripts.prebuild === 'string' && !pkg.scripts.prebuild.includes(guard)) {
    pkg.scripts.prebuild = pkg.scripts.prebuild.trim() + ' && ' + guard;
  }
  fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
}

function patchProjectMemory() {
  ensureDir('_project/obsidian_updates');
  ensureDir('_project/reports');
  ensureDir('_project/runs');

  const block = `## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — duplicate confirmation gate

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- typ wpisu: hotfix po ręcznym smoke R10C4
- decyzja: duplikat albo konflikt danych kontaktowych może być zapisany tylko po świadomym potwierdzeniu. Brak działania checkerów konfliktów ma zatrzymać zapis, a nie przepuścić rekord po cichu.
- zmiana: Leads.tsx i Clients.tsx nie łykają błędu findEntityConflictsInSupabase do pustej listy. Przy błędzie pokazują komunikat i zatrzymują zapis. Przy konflikcie pokazują komunikat i dialog z opcją „Dodaj mimo to”.
- testy/guardy: check/test stage226r10d2 plus regresje R10C2/R10B/R10, build, verify:closeflow:quiet, git diff --check.
- audyt ryzyk: fail-closed może chwilowo blokować zapis przy awarii API konfliktów, ale to jest bezpieczniejsze niż ciche mnożenie duplikatów klientów/leadów.
- status: local ZIP patch; push po PASS i ręcznym smoke.`;
  appendOnce('_project/04_DECISIONS.md', 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX', block);
  appendOnce('_project/08_CHANGELOG_AI.md', 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX', block);
  appendOnce('_project/12_IMPLEMENTATION_LEDGER.md', 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX', block);
  appendOnce('_project/13_TEST_HISTORY.md', 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX', `## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — test history

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- planowane: npm run check:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix; npm run test:stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix; regresje R10C2/R10B/R10; npm run build; npm run verify:closeflow:quiet; git diff --check.
- manual smoke: dodaj klienta z istniejącym telefonem/e-mailem — musi być komunikat/dialog; Anuluj nie zapisuje; Dodaj mimo to zapisuje. Powtórzyć dla leada. Sprawdzić, że lead nadal nie tworzy klienta.`);
  appendOnce('_project/07_NEXT_STEPS.md', 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX', `## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — next step

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- po PASS: ręcznie przetestować konflikt/duplikat dla klienta i leada; dopiero potem wrócić do Stage226R11 timezone Google Calendar albo kolejnego etapu.
- nie ruszać: Stage227 przed domknięciem lead/client + conflict gate smoke.`);
  appendOnce('_project/06_GUARDS_AND_TESTS.md', 'STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX', `## STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — guards

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- guard: scripts/check-stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.cjs
- test: tests/stage226r10d2-duplicate-conflict-confirmation-gate-patcher-fix.test.cjs
- kontrakt: brak .catch(() => ({ candidates: [] })) przy conflict preflight; błąd checkerów zatrzymuje zapis; konflikt pokazuje komunikat i wymaga „Dodaj mimo to”.`);

  write('_project/obsidian_updates/STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX_OBSIDIAN_UPDATE.md', `# STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — Obsidian update

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- nazwa / alias wejściowy: Stage226R10D2 — Duplicate Conflict Confirmation Gate Patcher Fix
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow_Lead_App / DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX_REPORT
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: hotfix po ręcznym smoke R10C4
- status zapisu: przygotowano w repo _project/obsidian_updates
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\\Users\\malim\\Desktop\\biznesy_ai\\2.closeflow

## Decyzja

Duplikat albo konflikt danych kontaktowych może być zapisany tylko po świadomym potwierdzeniu. Brak działania checkerów konfliktów zatrzymuje zapis, nie przepuszcza rekordu po cichu.

## Testy

- check/test R10D2
- regresje R10C2/R10B/R10
- build
- verify:closeflow:quiet
- git diff --check
- manual smoke: konflikt klienta i konflikt leada, Anuluj nie zapisuje, Dodaj mimo to zapisuje.

## Audyt ryzyk

Fail-closed może chwilowo zablokować zapis przy awarii API konfliktów. To jest świadomie lepsze niż ciche mnożenie duplikatów i rozjechanie źródła prawdy.
`);
  write('_project/reports/STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX_REPORT.md', `# STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — report

## Teza

R10C4 domknął separację lead/klient, ale ręczny smoke pokazał, że konflikt/duplikat może zostać zapisany bez widocznego potwierdzenia. To trzeba zamknąć przed Stage227.

## Zmiana

- Lead create: brak cichego fallbacku do pustych konfliktów; błąd checkerów blokuje zapis i pokazuje komunikat.
- Client create: analogicznie.
- Konflikt pokazuje informację i wymaga Anuluj/Pokaż/Dodaj mimo to.
- Dodano guard i test R10D2.

## Audyt ryzyk

- Fail-closed może zatrzymać zapis przy chwilowej awarii API konfliktów.
- Stare duplikaty w bazie nie są usuwane przez ten etap.
- Ten etap nie zmienia API-level duplicate constraints; chroni główny flow UI. Później warto dodać backendowy duplicate gate jako osobny etap.
`);
  write('_project/runs/STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX_RUN.md', `# STAGE226R10D2_DUPLICATE_CONFLICT_CONFIRMATION_GATE_PATCHER_FIX — run

- data i godzina: 2026-06-06 14:23 Europe/Warsaw
- tryb: ZIP local-only, push po PASS
- zakres: Leads.tsx, Clients.tsx, package.json, guard/test, _project, Obsidian update
- testy: R10D2, R10C2, R10B, R10, build, verify, diff check
- status: do uruchomienia lokalnie
`);

  ['_project/04_DECISIONS.md','_project/06_GUARDS_AND_TESTS.md','_project/07_NEXT_STEPS.md','_project/08_CHANGELOG_AI.md','_project/12_IMPLEMENTATION_LEDGER.md','_project/13_TEST_HISTORY.md'].forEach(trimEofBlanks);
}

patchLeads();
patchClients();
patchPackage();
patchProjectMemory();

console.log(JSON.stringify({ ok: true, stage: STAGE, changed: ['src/pages/Leads.tsx','src/pages/Clients.tsx','package.json','_project/*'], cleanup: 'removed stale failed R10D files if present' }, null, 2));
