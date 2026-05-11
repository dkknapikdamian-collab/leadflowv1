# CloseFlow panel link guard + ClientDetail diag repair4

## Stage

CLOSEFLOW_PANEL_LINK_GUARD_CLIENTDETAIL_DIAG_REPAIR4_2026_05_11

## Cel

Naprawia dwa problemy po paczkach repair1-repair3:

1. Test panel delete nie jest już kruchy na dokładny string `className="relative group/client-card"`.
2. Diagnostic ClientDetail ignoruje `return` wewnątrz callbacków i sprawdza tylko top-level hook order.
3. Nieudane lokalne repair tools są czyszczone przez apply script, żeby nie brudziły commita.

## Wynik patcha

- panel test changed: true
- diagnostic changed: true

## Weryfikacja

```powershell
node --check tools/diagnose-clientdetail-hook-order-2026-05-11.cjs
node tools/diagnose-clientdetail-hook-order-2026-05-11.cjs
node --test tests/panel-delete-actions-v1.test.cjs
npm.cmd run build
npm.cmd run verify:closeflow:quiet
```
