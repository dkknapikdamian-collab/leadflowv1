# A14 hotfix — Stage01 nav groups

## Cel

Domknąć `npm.cmd run lint` po A14 business types hardening.

## Problem

`check-visual-stage01-shell.cjs` wymagał w `Layout.tsx` starych kontraktów menu:

- `caption: 'Start pracy'`
- `caption: 'Czas i obowiązki'`
- `caption: 'System'`

Aktualny `Layout.tsx` miał jedną grupę `Panel operatora`, więc guard Stage01 blokował lint.

## Zmiana

- przywrócono trzy grupy nawigacji w `src/components/Layout.tsx`,
- dodano brakujące aktywne pozycje:
  - `Szkice AI`,
  - `Powiadomienia`,
  - `Pomoc`,
- nie zmieniono routingu aplikacji,
- nie ruszono UI ekranów ani logiki biznesowej.

## Weryfikacja

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run check:a14-business-types
npm.cmd run test:critical
npm.cmd run lint
npm.cmd run build
```
