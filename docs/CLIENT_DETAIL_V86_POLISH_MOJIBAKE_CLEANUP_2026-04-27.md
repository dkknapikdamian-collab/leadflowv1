# Client detail V86: czyszczenie polskich znaków

Cel:
- usunąć rozsypane polskie znaki po lokalnych poprawkach widoku klienta,
- utrzymać finalny model klienta: Kartoteka, Relacje, Historia, Więcej,
- nie zmieniać logiki działania widoku klienta.

Zakres:
- `src/pages/ClientDetail.tsx`,
- dokumenty V82, V83 i V85 związane z przebudową widoku klienta.

Weryfikacja:
- `node scripts/check-polish-mojibake.cjs --repo . --check`,
- `npm.cmd run lint`,
- `npm.cmd run verify:closeflow:quiet`.
