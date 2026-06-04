# OBSIDIAN UPDATE MANIFEST - STAGE220A34

- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- type: runtime audit / tab-return state preservation

## Do zapisania
STAGE220A34 naprawia problem przełączania kart przeglądarki: aplikacja nie może unmountować widoku ani zamykać modali/formularzy po token refresh, błędzie chunk load albo AppChunk fallbacku, jeżeli użytkownik ma aktywny modal, focus w formularzu albo wpisane dane. A33 chronił tylko chunk reload guard; A34 rozszerza ochronę na `AppChunkErrorBoundary` i deduplikuje `useSupabaseSession`, żeby identyczny użytkownik po refresh tokenu nie uruchamiał root `profileLoading`.

## Testy
- `node scripts/check-stage220a34-tab-return-state-preservation.cjs`
- `npm run build`
- ręczny test: modal + wpis + przełączenie karty + powrót bez zamknięcia modala.
