# OBSIDIAN UPDATE MANIFEST - STAGE220A33

- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- type: UI bugfix / runtime reload guard

## Do zapisania
STAGE220A33 usuwa czerwoną plamę/pigułkę za akcją `Usuń sprawę` i wzmacnia runtime guard przed twardym odświeżeniem aplikacji po przełączeniu kart przeglądarki. Celem jest ochrona otwartych modalów, aktywnych formularzy i niezapisanych wpisów. Hard reload zostaje tylko jako awaryjna ścieżka po sprawdzeniu, że nie ma aktywnego stanu użytkownika ani kontekstu tab-return.

## Testy
- `node scripts/check-stage220a33-no-tab-switch-reload-delete-blob.cjs`
- `npm run build`

## Następny krok
Ręczny test przełączania kart przeglądarki na otwartym modalu i z wpisanym tekstem.
