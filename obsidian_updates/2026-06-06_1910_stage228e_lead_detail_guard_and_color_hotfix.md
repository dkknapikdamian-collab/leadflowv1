# 2026-06-06 19:10 Europe/Warsaw — Stage228E LeadDetail guard and color hotfix

- entity_id: E001
- workspace_id: DO_POTWIERDZENIA
- project_id: CloseFlow / LeadFlow
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: hotfix po pushu z failing guard

## Co się stało

Stage228D został wypchnięty po rebase mimo failing guard:
`FAIL Stage228D: inner accordion content must not force white card background`.

## Decyzja

Nie robimy force-push. Robimy osobny Stage228E hotfix.

## Zakres Stage228E

- pełne kolorowe tło rozwiniętego akordeonu LeadDetail,
- brak białych wewnętrznych kart w kolorowych sekcjach,
- semantyczny guard zamiast kruchego exact-string newline,
- nowy guard Stage228E.

## Testy

- npm run verify:stage228d-lead-detail-real-fix
- npm run verify:stage228e-lead-detail-guard-and-color-hotfix
- git diff --check

## Audyt ryzyk

- CSS override jest celowo zawężony do `.lead-detail-stage228d-action-center`.
- Nie rusza danych, SQL, Supabase, CaseDetail ani finansów.
- Test ręczny UI nadal wymagany przed push.
