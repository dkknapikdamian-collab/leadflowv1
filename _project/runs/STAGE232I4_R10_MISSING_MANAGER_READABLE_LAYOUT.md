# STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT

- Data/czas: 2026-06-19 13:25 Europe/Warsaw
- Projekt: CloseFlow / LeadFlow
- Repo: dkknapikdamian-collab/leadflowv1
- Branch: dev-rollout-freeze
- Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Stage: STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT

## Cel

Po R9 zapis braków działa i brak pojawia się w kafelku oraz w managerze. Pozostały problem wizualny: okno `Braki / Blokady` było mało czytelne, tekst mieszał się z tłem, a akcje w wierszu były zbyt ściśnięte.

## Zakres

- `src/components/detail/MissingItemsManagerDialog.tsx`
- nowy guard: `scripts/check-stage232i4-r10-missing-manager-readable-layout.cjs`
- nowy test: `tests/stage232i4-r10-missing-manager-readable-layout.test.cjs`

## Decyzja UI

Manager braków ma być czytelnym modalem w stylu aplikacji: ciemne tło, jasny tekst, wyraźny header, formularz w osobnej sekcji, lista jako oddzielone karty z przewijaniem, a akcje wiersza w osobnym pasku z odstępami i zawijaniem.

## Guard/test

Do wykonania:

```powershell
node scripts/check-stage232i4-r10-missing-manager-readable-layout.cjs
node --test tests/stage232i4-r10-missing-manager-readable-layout.test.cjs
node scripts/check-stage232i4-r14-client-lead-missing-tile-modal-parity.cjs
node --test tests/stage232i4-r14-client-lead-missing-tile-modal-parity.test.cjs
node scripts/check-stage232i4-r14-r6-runtime-smoke-fix.cjs
node scripts/check-stage232i4-r9-work-items-status-domain-safe.cjs
node --test tests/stage232i4-r9-work-items-status-domain-safe.test.cjs
npm run build
git diff --check
```

## Ryzyka

- Zmiana jest wizualna, ale dotyka wspólnego dialogu Lead/Client, więc manual smoke musi sprawdzić oba miejsca.
- R10 nie zmienia SQL ani backendu.

## Manual smoke

1. Klient → `Braki / Blokady` → `Zobacz wszystkie braki`.
2. Dodać 2-3 braki, w tym blokujący.
3. Sprawdzić: tekst czytelny, wiersze oddzielone, akcje nie nachodzą na tytuł, lista się przewija.
4. Lead → `Zobacz wszystkie braki` i ten sam styl.
