# STAGE216M-R3-R1 - header actions repair

## Cel
Naprawić nieudany Stage216M-R3, który uszkodził JSX ClientDetail, oraz bezpiecznie wykonać decyzję Damiana dotyczącą headerów LeadDetail i ClientDetail.

## FAKTY
- Stage216M-R3 po apply dał PATCH_OK, ale guard wykrył pozostawione meta w headerze klienta.
- Build upadł na niepoprawnym JSX w ClientDetail.
- R3-R1 najpierw cofa tylko uszkodzone pliki R3 do HEAD, potem aplikuje bezpieczny patch Node.

## DECYZJE DAMIANA
- Edytuj ma zniknąć z headera leada i klienta.
- W obu headerach ma być Zapytaj AI.
- W kliencie zostaje Otwórz główną sprawę.
- Dane klienta nie są potrzebne w headerze, bo są niżej jak w leadzie.

## ZAKRES
- src/pages/LeadDetail.tsx
- src/pages/ClientDetail.tsx
- src/styles/page-adapters/page-adapters.css
- src/styles/stage216m-r3-r1-header-actions-repair.css
- tests/stage216m-r3-r1-header-actions-repair-contract.test.cjs

## CZEGO NIE RUSZANO
- Supabase
- API
- płatności
- dane
- Stage216D
- backup patchy

## TESTY
- node tests/stage216m-r3-r1-header-actions-repair-contract.test.cjs
- git diff --check
- npm run build

## NEXT STEP
Po apply i build wykonać selektywny commit/push Stage216M-R3-R1.
