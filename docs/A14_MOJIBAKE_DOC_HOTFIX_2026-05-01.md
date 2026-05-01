# A14 — hotfix mojibake w dokumentacji

## Cel

Naprawić uszkodzone kodowanie polskich znaków w dokumencie `docs/A14_STAGE16_LINT_HOTFIX_2026-05-01.md`, które blokowało `npm.cmd run lint` przez `scripts/check-polish-mojibake.cjs`.

## Zakres

- Przepisano dokument w poprawnym UTF-8.
- Nie zmieniano logiki aplikacji.
- Nie zmieniano UI.
- Nie zmieniano typów poza wcześniej nałożonym A14.

## Powód

Poprzednia paczka zapisała dokument z uszkodzonym kodowaniem, co zostało wykryte jako:

```text
Polish mojibake detected. Fix encoding before commit.
```

## Kryterium zakończenia

`npm.cmd run lint` nie zatrzymuje się na mojibake w dokumentacji A14.
