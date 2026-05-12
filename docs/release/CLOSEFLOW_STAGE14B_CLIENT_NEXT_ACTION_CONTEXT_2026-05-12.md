# CloseFlow Stage14B — ClientDetail: najbliższa akcja z kontekstem sprawy

## Cel

Na kafelku **Najbliższa zaplanowana akcja** przy kliencie dopisujemy kontekst, czego dotyczy akcja:

- jeśli akcja jest powiązana ze sprawą, pokazujemy `Sprawa: {caseTitle}`,
- jeśli akcja jest powiązana z leadem i nie ma sprawy, pokazujemy `Lead: {leadTitle}`,
- jeśli nie ma kontekstu, nie pokazujemy pustej ani fałszywej linii.

## Zakres zmiany

- `src/pages/ClientDetail.tsx`
- `src/styles/visual-stage12-client-detail-vnext.css`
- `scripts/check-stage14b-client-next-action-context.cjs`
- `scripts/repair-stage14b-client-next-action-context.cjs`

## Nie zmieniono

- Nie zmieniono logiki wyboru najbliższej akcji.
- Nie dodano endpointów.
- Nie przeniesiono zadań sprawy do klienta.
- Nie ruszono backendu ani kontraktu `getNearestPlannedAction`.

## Weryfikacja automatyczna

```powershell
node scripts/check-stage14b-client-next-action-context.cjs
npm.cmd run build
```

## Weryfikacja ręczna

1. Otwórz klienta, który ma sprawę.
2. Dodaj zadanie albo wydarzenie powiązane z tą sprawą.
3. Wejdź w kartotekę klienta.
4. Na kafelku **Najbliższa zaplanowana akcja** sprawdź, czy pod tytułem/terminem jest linia `Sprawa: ...`.
5. Otwórz klienta z akcją bez sprawy i potwierdź, że nie ma `Sprawa: undefined`, `Sprawa: brak` ani pustej linii.

## Kryterium zakończenia

Użytkownik po wejściu w klienta widzi nie tylko najbliższą akcję, ale też od razu wie, której sprawy albo leada ta akcja dotyczy.
