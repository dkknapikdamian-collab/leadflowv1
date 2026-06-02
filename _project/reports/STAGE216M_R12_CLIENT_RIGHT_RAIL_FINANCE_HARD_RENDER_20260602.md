# STAGE216M-R12 - ClientDetail right rail finance hard render

## Cel
Domknąć prawą szynę klienta po R11: finanse klienta mają być realnie widoczne po prawej stronie, a pomocnicze opisy w notatkach i działaniach mają zniknąć.

## Fakty
- R11 był głównie CSS-lockiem.
- `ClientDetail.tsx` ma już kartę `Finanse klienta`, ale ekran nadal jej nie pokazywał stabilnie.
- W `ClientDetail.tsx` nadal były pomocnicze opisy:
  - opis w sekcji `Notatki`,
  - opis w karcie `Najbliższe działania`.

## Zakres
- `ClientDetail.tsx`: usunięcie opisów po strukturze/class, nie po polskim tekście.
- `ClientDetail.tsx`: dodanie markera hard-render do karty finansów klienta.
- CSS R12: mocny, wspólny kontrakt prawej szyny i widoczności finansów.
- Guard R12: sprawdza import, marker, brak opisów i CSS hard-render.

## Poza zakresem
- API.
- Supabase.
- Backend płatności.
- Dane produkcyjne.
- Stage216D.

## Testy
- `node tests/stage216m-r12-client-right-rail-finance-hard-render-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Następny krok
Po deployu sprawdzić ekran klienta: prawa szyna powinna pokazać `Najbliższe działania`, `Główna sprawa`, `Finanse klienta`. Jeśli nadal nie pokaże finansów, kolejny etap musi przenieść kartę finansów w TSX na wcześniejszą pozycję w railu albo zrobić wspólny komponent `ClientRightRail`.
