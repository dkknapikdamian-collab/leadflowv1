# STAGE219-R6 - CaseDetail refresh after save + flat cards

## FAKTY
- Stage219-R5 ZIP nie skopiował plików `tools/` i `scripts/`, dlatego apply zgłosił `MODULE_NOT_FOUND`.
- Build po R5 przeszedł, ale working tree był czysty, więc R5 realnie nie wprowadził zmian.
- Na screenie wydarzenie po odświeżeniu widoku jest widoczne w kaflu, ale brak gwarancji odświeżenia zaraz po zapisie dialogu.

## DECYZJE DAMIANA
- Nie pchać bezpośrednio do GitHuba z czatu.
- Dostarczyć ZIP + komendy.
- Kafle mają być niższe i bez cienkich opisów.
- Nazwa sprawy/klienta w górnej belce ma być w jednym wierszu.

## ZAKRES
- `src/components/ContextActionDialogs.tsx`
- `src/pages/CaseDetail.tsx`
- `src/styles/closeflow-detail-view-source-truth-stage219.css`
- guard Stage219-R6
- raport i update Obsidian

## TESTY
- `node scripts/check-stage219r6-case-detail-refresh-flat-cards.cjs`
- `npm run build`
- `git diff --check`

## NASTĘPNY KROK
Po pushu sprawdzić w Vercel: dodać wydarzenie z poziomu sprawy i sprawdzić, czy bez ręcznego reloadu zmienia się najbliższy ruch/licznik aktywnych działań.
