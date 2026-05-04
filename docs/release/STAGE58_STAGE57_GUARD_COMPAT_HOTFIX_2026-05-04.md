# STAGE58_STAGE57_GUARD_COMPAT_HOTFIX

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel

Naprawia kompatybilnosc guarda Stage57 po dodaniu Stage58 do `verify:case-operational-ui`.

## Przyczyna

Stage58 poprawnie dopisal sie miedzy:

- `check:stage57-case-create-action-hub`
- `verify:client-detail-operational-ui`

Stary guard Stage57 sprawdzal jednak dokladny, sasiedni fragment lancucha bez Stage58, wiec blokowal prawidlowy nowy stan.

## Zmiana

`check-stage57-case-create-action-hub.cjs` akceptuje teraz lancuch:

```text
check:stage57-case-create-action-hub && npm.cmd run check:stage58-case-recent-moves-panel && npm.cmd run verify:client-detail-operational-ui
```

## Zakres

Nie zmienia UI, API, modelu danych ani logiki Stage58.

## Weryfikacja

Uruchomic:

```powershell
npm.cmd run check:stage57-case-create-action-hub
npm.cmd run check:stage58-case-recent-moves-panel
npm.cmd run test:stage58-case-recent-moves-panel
npm.cmd run verify:case-operational-ui
npm.cmd run build
```
