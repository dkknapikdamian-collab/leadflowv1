# CloseFlow / LeadFlow - STAGE222 R4 lead/client operational badges

Data: 2026-06-04
Typ wpisu: etap local-only / operacyjne dopiski przy rekordach
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — STAGE222 R4
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE222_R4_LEAD_CLIENT_OPERATIONAL_BADGES
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Cisza 7/14 dni i brak danych kontaktowych są bardziej przydatne przy rekordzie niż w panelu Today.
- Dodano jeden helper `record-operational-badges.ts`.
- Lead/Client listy używają istniejących `cf-status-pill` i `data-cf-status-tone`.
- Nie dodano nowego CSS.
- Today nie jest ruszany w tym etapie.

## DECYZJE DAMIANA

- Pokazywać dopiski przy leadach i klientach.
- Brak danych kontaktowych przy leadzie/kliencie, nie w głównym Today.
- Wysoka wartość / ryzyko może później agregować sprawy/pieniądze bez ruchu.
- Nie pushować bez akceptacji.

## TESTY

```powershell
node scripts/check-stage222-r4-lead-client-operational-badges.cjs
node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
npm run build
git diff --check
```

## NASTĘPNY KROK

Sprawdzić `/leads` i `/clients`. Jeśli UI jest czytelne, potem dopiero projektować agregację `Wysoka wartość / ryzyko`.
