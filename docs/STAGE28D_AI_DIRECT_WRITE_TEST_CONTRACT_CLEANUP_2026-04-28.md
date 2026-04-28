# Stage28d - AI direct write test contract cleanup

## Cel

Domkniecie Stage28 po ratunkowym V28c. Kod bezposredniego zapisu AI jest zachowany, ale kontrakty testowe zostaly dopasowane do bezpiecznego aliasu funkcji zapisu leada.

## Zakres

- poprawiono test bramki bezpieczenstwa AI,
- poprawiono test Stage28 tak, aby nie uzywal kruchych regexow dla znakow specjalnych,
- bez zmian SQL,
- bez zmian w bazie,
- bez zmian w UI poza stanem juz nalozonym przez V28b/V28c.

## Oczekiwany wynik

Po wdrozeniu powinny przejsc:

```powershell
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
npm.cmd run build
node tests/ai-safety-gates-direct-write.test.cjs
node tests/ai-direct-write-respects-mode-stage28.test.cjs
```
