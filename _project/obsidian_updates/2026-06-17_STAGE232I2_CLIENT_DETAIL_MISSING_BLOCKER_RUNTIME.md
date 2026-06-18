# Obsidian update - STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

- data i godzina: 2026-06-18 00:25 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

## 2026-06-18 00:25 Europe/Warsaw - STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME

Status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD

Zakres:
- ClientDetail agreguje directClientMissingItems, leadMissingItems i caseMissingItems.
- Kazdy aktywny Brak/Blokada ma source badge: [Klient], [Lead], [Sprawa].
- Filtry: Wszystkie / Klient / Leady / Sprawy / Blokady / Braki.
- Resolve/delete dziala na zrodlowym missing_item task/work item przez istniejace handlery po item.id.
- Historia nie jest aktywnym zrodlem listy.
- Bez SQL i bez Owner Control runtime.
