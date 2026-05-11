# CloseFlow — CaseDetail no partial loading quiet gate fix — 2026-05-11

## Problem

Poprzedni hotfix poprawnie dodał guard dla częściowego renderowania CaseDetail, ale zmienił skrypt `verify:closeflow:quiet` w `package.json`.

Istniejący test release gate wymaga, żeby `verify:closeflow:quiet` pozostał dokładnie:

```text
node scripts/closeflow-release-check-quiet.cjs
```

Przez to `npm run verify:closeflow:quiet` kończył się błędem na teście `tests/closeflow-release-gate-quiet.test.cjs`, mimo że sam build przechodził.

## Naprawa

1. Przywrócono `package.json -> scripts.verify:closeflow:quiet` do wymaganego kontraktu.
2. Guard `scripts/check-closeflow-case-detail-no-partial-loading.cjs` został podpięty wewnątrz `scripts/closeflow-release-check-quiet.cjs`, bez łamania kontraktu package.json.
3. Dzięki temu release gate nadal ma jedno wejście, a nowy guard CaseDetail jest częścią quiet verification.

## Weryfikacja

Po paczce należy uruchomić:

```powershell
npm.cmd run verify:closeflow:quiet
```

Oczekiwane: test `package exposes quiet CloseFlow release verification script` przechodzi, a guard częściowego ładowania CaseDetail uruchamia się z quiet gate.
