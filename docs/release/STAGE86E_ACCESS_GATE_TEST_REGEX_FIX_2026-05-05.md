# STAGE86E - Access gate test regex fix - 2026-05-05

## Cel

DomkniÄ™cie faĹ‚szywie czerwonego testu Stage86B po Stage86D.

## Problem

Runtime w src/server/_access-gate.ts zawieraĹ‚ poprawne wywoĹ‚anie:

``ts
if (isBlockedBillingAccessStatus(status)) return false;
``

ale test uĹĽywaĹ‚ regexa:

``js
/isBlockedBillingAccessStatus(status)/
``

W JavaScript nawiasy w regexie sÄ… grupÄ…, a nie literalnym znakiem ( i ), wiÄ™c test nie Ĺ‚apaĹ‚ realnego tekstu.

## Zmiana

Test 	ests/stage86b-access-gate-billing-truth.test.cjs uĹĽywa teraz includes('isBlockedBillingAccessStatus(status)').

## Status

To jest poprawka testu/guardu, bez zmian runtime.

## Kryterium zakoĹ„czenia

- 
pm.cmd run test:stage86b-access-gate-billing-truth
- 
pm.cmd run check:stage86b-access-gate-billing-truth
- 
pm.cmd run check:stage86d-access-gate-block-call
- 
pm.cmd run test:stage86d-access-gate-block-call
- 
pm.cmd run check:p14-billing-production-validation
- opcjonalnie 
pm.cmd run build

## Odhaczenie

Po zielonych checkach moĹĽna oznaczyÄ‡ lokalnie:

- Billing access gate: kodowo domkniÄ™ty
- Stage86B/86D: testy spĂłjne z runtime

Nadal nie oznaczamy realnego Stripe/Google E2E jako potwierdzonego bez testu ENV/OAuth/webhook w aplikacji.
