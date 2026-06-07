# Stage227E1 — Lead Detail IA Contract + Visual Source of Truth — run report

Data: 2026-06-06 15:00 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Tryb: ZIP local-only, bez samodzielnego pushu

## Routing

- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- idea_id: nie dotyczy
- report_id: nie dotyczy
- canonical_name: CloseFlow / LeadFlow
- aliasy: CloseFlow, LeadFlow, leadflowv1
- folder Obsidiana: DO_POTWIERDZENIA, prawdopodobnie `10_PROJEKTY/CloseFlow`
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Co zostało dodane

- `docs/stages/STAGE227E1_LEAD_DETAIL_IA_CONTRACT.md`
- `scripts/check-stage227e1-lead-detail-ia-contract.cjs`
- `tests/stage227e1-lead-detail-ia-contract.test.cjs`
- `_project/roadmap/2026-06-06 - Stage227E1 Lead Detail IA Contract.md`
- `_project/reports/2026-06-06 - Stage227E1 Lead Detail IA Contract run report.md`
- `_project/obsidian_updates/2026-06-06 - Stage227E1 Lead Detail IA Contract.md`

`package.json` dostaje skrypty:

- `check:stage227e1-lead-detail-ia-contract`
- `test:stage227e1-lead-detail-ia-contract`

## Testy do wykonania lokalnie

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
npm run check:stage227e1-lead-detail-ia-contract
npm run test:stage227e1-lead-detail-ia-contract
git diff --check
git status --short
```

## Audyt ryzyk po etapie

- Ryzyko runtime: niskie, bo E1 nie zmienia UI ani danych.
- Ryzyko utraty kierunku: średnie, jeśli Stage227E2 ominie kontrakt. Guard i dokument mają to blokować.
- Ryzyko fałszywie czerwonego guarda: średnie, jeśli późniejszy refactor przeniesie wspólne klasy do nowych komponentów. Wtedy trzeba zaktualizować guard razem z kontraktem, nie wyłączać go.
- Ryzyko duplikacji stylów: wysokie w kolejnym etapie, dlatego E1 jawnie blokuje osobne lead-only style dla tych samych akcji.
- Ryzyko danych braków: średnie, bo docelowy model braków nie jest jeszcze projektowany. E1 ogranicza `Dodaj brak` do ręcznej blokady/braku bez nowej tabeli.

## Czego nie ruszano

- `LeadDetail.tsx` runtime layout,
- `CaseDetail.tsx` runtime layout,
- Supabase schema,
- migracje SQL,
- Google Calendar,
- finanse,
- routing,
- powiadomienia.

## Następny krok

Po PASS i akceptacji: selektywny commit/push Stage227E1. Dopiero potem Stage227E2.
