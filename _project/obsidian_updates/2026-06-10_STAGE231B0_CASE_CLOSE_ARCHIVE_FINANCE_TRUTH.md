# Obsidian update — 2026-06-10 — STAGE231B0 CASE CLOSE / ARCHIVE / FINANCE TRUTH

folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
status: do przeniesienia / zsynchronizowania z Obsidianem po lokalnym PASS i pushu

## Decyzja produktowa
Zakończenie sprawy nie jest usunięciem. Sprawa ma dostać akcję "Zamknij sprawę", trafić do archiwum/historii przez status completed, a pieniądze/prowizje z tej sprawy mają dalej liczyć się do zarobków klienta.

## Zakres wdrożenia
- CaseDetail: "Zamknij sprawę".
- Confirm: "Sprawa zostanie zamknięta. Historia i rozliczenia zostaną zachowane."
- Update statusu: completed.
- Activity/history: "Sprawa zamknięta".
- Finanse: bez zerowania, bez usuwania płatności, bez modyfikowania CaseSettlementSection/Panel.
- Delete: zostaje awaryjnie, nie jako główny model zakończenia.

## Następny etap
STAGE231B1 — Client Lifetime Earnings Summary.
