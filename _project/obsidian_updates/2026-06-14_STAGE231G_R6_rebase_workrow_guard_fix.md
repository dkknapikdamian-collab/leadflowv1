
# STAGE231G R6 - rebase conflict + real work-row guard fix

Data: 2026-06-14 10:40 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Status: payload Obsidian

## Wpis

R6 naprawia problem po R5: guard był już poprawnie kodowany, ale wykazał brak realnych klas content/status/actions w LeadDetail. R6 dodaje realny layout work-row i rozwiązuje konflikt rebase w centralnym pliku etapów.

## Audyt ryzyk

- Nie pushować z konflikt markerami.
- Nie przywracać stash przed zakończeniem rebase i push STAGE231G.
- Po push dopiero przywrócić stash z obcymi lokalnymi zmianami.
