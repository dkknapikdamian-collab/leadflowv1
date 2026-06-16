# 2026-06-16 - CF-CODEX-CONTEXT-INDEX-004

Status: PREPARED_IN_ZIP / DO_APPLY_TEST_COMMIT_PUSH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY Z KODU / PLIKOW

- `AGENTS.md` already requires scan-first and project memory discipline.
- `_project/CODEX_CONTEXT_INDEX.md` was missing before this stage.
- `_project/00_PROJECT_MEMORY_PROTOCOL.md` requires scan proof, pre-stage audit, post-stage audit, guard/test result and Obsidian update.
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` is the canonical stage queue and points to `STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH` as the nearest product stage.

## AUDYT PRZED ETAPEM

- Typ etapu: docs / project-memory / guard / context routing.
- Ekran aplikacji: brak; this stage does not touch runtime UI.
- Affected files: AGENTS.md, _project/CODEX_CONTEXT_INDEX.md, project ledgers, guard/helper scripts, Obsidian payload.
- Existing implementation: repo did not have `_project/CODEX_CONTEXT_INDEX.md`; project relied on broad scan-first instructions scattered across AGENTS and _project files.
- Safest path: add bounded index, exact-list helper and guard only. Do not touch runtime code.

## ZNALEZIONE PROBLEMY

- Brak nowych poza zakresem. The existing found-problems ledger already records roadmap/guard drift issues.

## TESTY / GUARDY

Required after apply:

```powershell
node scripts/check-cf-codex-context-index.cjs
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/codex-context-pack.ps1
git diff --check
```

## AUDYT PO ETAPIE

To complete after local apply:

- verify guard PASS,
- verify helper generates `_LOCAL_CHECKS/codex-context/closeflow-context-pack.md`,
- remove `_LOCAL_CHECKS` before commit,
- verify no runtime files changed,
- sync Obsidian payload after app repo push.

## BRAKI I RYZYKA

- This stage does not fix historical quiet gate drift or mojibake in old files.
- The active product next stage remains `STAGE232A_LEAD_MISSING_BLOCKER_SOURCE_OF_TRUTH`.

## GIT / ZIP STATUS

- ZIP prepared.
- Commit/push required after PASS.
- Obsidian sync required after app repo push.
