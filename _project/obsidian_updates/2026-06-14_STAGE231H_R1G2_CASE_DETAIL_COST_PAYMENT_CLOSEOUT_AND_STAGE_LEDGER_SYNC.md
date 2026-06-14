# Obsidian update - STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC

- data i godzina: 2026-06-14 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- report_id: STAGE231H_R1G2_CASE_DETAIL_COST_PAYMENT_CLOSEOUT_AND_STAGE_LEDGER_SYNC
- status: DOCS_ONLY_CLOSEOUT / TECH_SYNC_READY / SERVER_UI_REQUIRED
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Wpis

R1G2 porzadkuje ledgery CaseDetail finance/cost/payment po R1B/R1C/R1F/R1F4/R1G. Nie zmienia runtime i nie rusza SQL. Manual UI nadal wymagany przed pelnym PASS produktu.

## Kolejka

1. R1D2 - przywrocenie dyktowania notatki bez kolizji z R1D finance modal compact.
2. R1E - oznaczanie kosztu jako zwrocony / czesciowo zwrocony.
3. Google Calendar closeout po CaseDetail UI closeout.

## Ryzyka

- R1C guard historycznie nie istnieje w repo i jest oznaczony jako SKIP.
- R1F4 guard wymaga frazy red-guard push repair, wiec run report zachowuje kompatybilna notke.
- R1G wymaga testu serwera.


## R5 repair note

R5 fixes R1F4 legacy guard compatibility by preserving exact RED_GUARD_PUSH_REPAIR token while keeping current status honest as TECH_PUSHED / SERVER_UI_REQUIRED. Runtime remains untouched.
