# STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

- data i godzina: 2026-06-18 00:25 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- Owner Control: NIE

## Przyczyna R2

R1 po fast-forward zatrzymal sie na nieaktualnym markerze STAGE228R16 w ClientDetail. R2 usuwa zaleznosc od tego konkretnego markera i patchuje po aktualnych strukturach: import block, clientMissingItemsStage227C3B i section class.

## Zmiana

## 2026-06-18 00:25 Europe/Warsaw - STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Zakres:
- ClientDetail agreguje directClientMissingItems, leadMissingItems i caseMissingItems.
- Kazdy aktywny Brak/Blokada ma source badge: [Klient], [Lead], [Sprawa].
- Filtry: Wszystkie / Klient / Leady / Sprawy / Blokady / Braki.
- Resolve/delete dziala na zrodlowym missing_item task/work item przez istniejace handlery po item.id.
- Historia nie jest aktywnym zrodlem listy.
- Bez SQL i bez Owner Control runtime.
