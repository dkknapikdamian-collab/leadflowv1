# Client Detail V83 - encoding safe test contract

Domyka przebudowę widoku klienta po V82. Test finalnego modelu operacyjnego używa stabilnych markerów ASCII, żeby nie wywalać się na mojibake typu `się` i `Więcej`.

Sprawdzenie:
```powershell
node tests/client-detail-final-operating-model.test.cjs
node tests/client-detail-simplified-card-view.test.cjs
node tests/client-relation-command-center.test.cjs
node tests/client-detail-v1-operational-center.test.cjs
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```
