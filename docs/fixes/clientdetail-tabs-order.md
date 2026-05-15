# CloseFlow — ClientDetail tabs order guard

## Zakres

Naprawa dotyczy wyłącznie kolejności zakładek na ekranie szczegółów klienta.

Wymagana kolejność w `ClientDetail`:

1. `Sprawy`
2. `Podsumowanie`
3. `Historia`
4. pozostałe zakładki bez zmiany logiki

## Powód

Zgłoszenie z feedbacku admina mówi, że na karcie klienta `Sprawy` mają być przed `Podsumowaniem`.

## Pliki dodawane do repo

- `tools/repair-clientdetail-tabs-order.cjs`
- `tests/clientdetail-tabs-order.test.cjs`
- `docs/fixes/clientdetail-tabs-order.md`

## Czego nie zmieniać

- nie zmieniać routingu,
- nie zmieniać logiki zakładek,
- nie zmieniać stylu wizualnego,
- nie przebudowywać całego `ClientDetail`,
- nie ruszać miesięcznego kalendarza ani finansów.

## Weryfikacja

```powershell
node .\tests\clientdetail-tabs-order.test.cjs
npm.cmd run verify:closeflow:quiet --if-present
npm.cmd run build --if-present
```
