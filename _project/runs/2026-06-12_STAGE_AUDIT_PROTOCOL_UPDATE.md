# 2026-06-12_STAGE_AUDIT_PROTOCOL_UPDATE - CloseFlow / LeadFlow

Data: 2026-06-12 20:19 Europe/Warsaw  
Status: DOCS_PROCESS_UPDATE_DONE  
Typ: run report / decyzja procesowa / audyt etapów  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Zakres

Zapisano decyzję Damiana, że każdy kolejny etap CloseFlow musi mieć obowiązkowy audyt przed wdrożeniem i audyt po wdrożeniu.

To był etap dokumentacyjno-procesowy. Nie zmieniano runtime UI, routingu, danych, Supabase, SQL, auth logiki ani komponentów aplikacji.

## Repo files read

- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/STAGE_TEMPLATE_MINIMAL.md`
- `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`

## Obsidian/project-memory files read

- Obsidian lokalny niedostępny z tego środowiska.
- Użyto repo `_project` jako project-memory.
- Przygotowano payload Obsidiana w `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`.

## Decyzja Damiana

Przy każdym etapie:

- przed wdrożeniem wykonać audyt etapu,
- po wdrożeniu wykonać audyt etapu,
- szukać realnych problemów obok zakresu, ale nie doszukiwać się ich na siłę,
- wykrywać rzeczy źle podpięte, niedopięte, niedokończone, sprzeczne z kierunkiem aplikacji albo ryzykowne,
- podawać Damianowi, gdzie wizualnie sprawdzić efekt, jeśli etap jest widoczny w aplikacji.

## Files changed

- Created: `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- Updated: `AGENTS.md`
- Updated: `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- Updated: `_project/STAGE_TEMPLATE_MINIMAL.md`
- Updated: `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md`
- Created: `_project/runs/2026-06-12_STAGE_AUDIT_PROTOCOL_UPDATE.md`

## AUDYT PRZED ETAPEM

- Existing protocol files already required scan-first and reporting, but did not clearly force a dedicated pre-stage and post-stage audit section every time.
- `STAGE_TEMPLATE_MINIMAL.md` had scan proof and report baskets, but lacked a concrete stage-area map, real adjacent-problem check, and post-stage regression audit.
- `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md` listed STAGE232A-F, but did not yet bind each stage to an explicit audit-before/audit-after workflow.
- Risk: if this stayed only in chat, the next implementation could skip the audit and repeat narrow fixes.

## What was added

1. New central protocol: `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`.
2. `AGENTS.md` now points to the active protocol and says stages without `AUDYT PRZED ETAPEM` and `AUDYT PO ETAPIE` are not closed.
3. `_project/00_PROJECT_MEMORY_PROTOCOL.md` now requires both audit sections.
4. `_project/STAGE_TEMPLATE_MINIMAL.md` now contains fields for:
   - visual verification place,
   - area map,
   - real adjacent problems,
   - regression risks,
   - post-stage cause check,
   - related-place check,
   - new problems found,
   - closure decision.
5. `_project/07_REPAIR_STAGES_HIDDEN_AUDIT_FINDINGS.md` now binds STAGE232A-F to the audit protocol and adds per-stage audit checkpoints.

## TESTY / GUARDY

- Runtime tests: NOT RUN, not applicable; no runtime code changed.
- Build: NOT RUN, not applicable; no app code changed.
- Documentation verification: performed by file update and path review.

## AUDYT PO ETAPIE

### Co mogło się zepsuć

- Risk: duplicating process rules in several files can create future drift.
- Mitigation: `AGENTS.md` points to `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md` as the detailed source, while `00_PROJECT_MEMORY_PROTOCOL` and `STAGE_TEMPLATE_MINIMAL` carry only operational requirements.

### Co sprawdzono obok

- Checked current `AGENTS.md` structure and did not remove older V8/V9 memory blocks.
- Checked `00_PROJECT_MEMORY_PROTOCOL` and kept its existing scan-first structure.
- Checked `STAGE_TEMPLATE_MINIMAL` and extended rather than replacing it.
- Checked STAGE232A-F backlog and added audit checkpoints without changing stage order.

### Nowe problemy wykryte

- Existing `AGENTS.md` contains older duplicate V8/V9 blocks. This is known documentation debt, not fixed here to avoid risky cleanup during a protocol update.

### Problemy świadomie nie ruszone

- No runtime app code.
- No SQL/Supabase/RLS.
- No visual tile UI migration.
- No README/.env encoding cleanup.
- No guard runner cleanup.

### Guard/test dowodzący

- Dedicated runtime guard not applicable for documentation-only stage.
- Future stages must include guard/test per `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`.

## Wpływ na Obsidiana

Docelowo zsynchronizować do:

- `04_KIERUNEK_DO_WDROZENIA - [ID] - CloseFlow Lead App.md`
- `09_TESTY_DO_WYKONANIA_I_WYNIKI - [ID] - CloseFlow Lead App.md`
- `11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - [ID] - CloseFlow Lead App.md`
- `08_HISTORIA_ZMIAN - [ID] - CloseFlow Lead App.md`
- `07_SCIAGA_PLIKOW - [ID] - CloseFlow Lead App.md`

Status: `OBSIDIAN_LOCAL_UNAVAILABLE - PAYLOAD_READY_IN_REPO`.

## Następny krok

Najlepszy następny etap: `STAGE232A_PUBLIC_PREVIEW_ROUTES_PRODUCTION_LOCK`, ale przed wdrożeniem musi zostać użyty nowy protokół audytu z `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`.
