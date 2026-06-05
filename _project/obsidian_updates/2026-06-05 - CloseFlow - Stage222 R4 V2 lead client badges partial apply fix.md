# CloseFlow / LeadFlow - STAGE222 R4 V2 lead/client operational badges partial apply fix

Data: 2026-06-05
Typ wpisu: hotfix paczki local-only / częściowy apply R4
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — STAGE222 R4 V2
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE222_R4_V2_LEAD_CLIENT_OPERATIONAL_BADGES
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- V1 R4 zatrzymał się na `Clients operational badges calculation`.
- Leady były częściowo spatchowane, klienci i package scripts nie.
- V2 naprawia ten stan bez rollbacku.
- Docelowy wariant: `Fundacja Lepsze Jutro / [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji]`.

## DECYZJE DAMIANA

- Utrzymać badge przy rekordzie.
- Nie robić nowego panelu Today.
- Push dopiero po akceptacji wizualnej.

## TESTY

```powershell
node scripts/check-stage222-r4-lead-client-operational-badges.cjs
node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
npm run build
git diff --check
```

## NASTĘPNY KROK

Sprawdzić `/leads` i `/clients`.
