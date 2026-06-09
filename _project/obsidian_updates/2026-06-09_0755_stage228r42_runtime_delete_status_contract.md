# Obsidian update - Stage228R42 runtime delete status contract

Data: 2026-06-09 07:55 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Status
Po teĹ›cie runtime bug zostaĹ‚ zawÄ™ĹĽony do backendowego status normalizer contract.

## FAKT
- PATCH /api/tasks z status=deleted wracaĹ‚ jako status=todo.
- Wpisy wracaĹ‚y, bo backend nie zachowywaĹ‚ intencji deleted.

## Zmiana do zapisania
- Stage228R42 dopuszcza deleted jako status techniczny dla task/event work_items.
- Dodano guard/test Stage228R42.

## Test po deployu
- DodaÄ‡ CF_DEL_TEST_3 w leadzie.
- UsunÄ…Ä‡ normalnie z UI.
- OdĹ›wieĹĽyÄ‡ stronÄ™ i sprawdziÄ‡ czy wpis nie wraca.
- W razie powrotu sprawdziÄ‡ Network/console czy PATCH zwraca bĹ‚Ä…d constraintu albo dalej status todo.

## Ryzyka
- Potencjalny DB constraint na status work_items.
- Potencjalne widoki bez filtra deleted.
