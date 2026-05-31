# CloseFlow Stage176 — TopValueRecordsCard duplicate import hotfix

Data: 2026-05-23  
Status: przygotowano ZIP lokalny  
Typ: blocker / Vite / operator rail duplicate import

## FAKTY

- Przy wejściu w lead/klient pojawia się Vite/Babel blocker.
- Błąd: `Identifier 'OperatorSideCard' has already been declared`.
- Plik: `src/components/operator-rail/TopValueRecordsCard.tsx`.
- Przyczyna: import z własnego barrela `../components/operator-rail` oraz bezpośredni import `OperatorSideCard`.

## DECYZJE DAMIANA

- Naprawić teraz lokalnie.
- Każda poprawka ma mieć guard.
- Bez pusha/deploya przed akceptacją.

## TESTY

```powershell
node scripts/check-stage176-top-value-records-card-duplicate-import-hotfix.cjs
npm.cmd run build
```
