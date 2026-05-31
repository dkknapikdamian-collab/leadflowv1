# STAGE176 TopValueRecordsCard duplicate import hotfix — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: build/runtime blocker / operator rail import

## Cel

Naprawić błąd Vite przy wejściu w lead/klient:

`Identifier 'OperatorSideCard' has already been declared`

## FAKTY

- Błąd wskazuje `src/components/operator-rail/TopValueRecordsCard.tsx`.
- W pliku istnieje import z barrela `../components/operator-rail`.
- W tym samym pliku istnieje też bezpośredni import `OperatorSideCard` z `./OperatorSideCard`.
- To powoduje redeklarację i crash parsera Babel/Vite.

## DECYZJE DAMIANA

- Naprawić lokalnie.
- Każda poprawka ma mieć guard.
- Nie pushować bez akceptacji.

## TESTY

```powershell
node scripts/check-stage176-top-value-records-card-duplicate-import-hotfix.cjs
npm.cmd run build
```

## Test ręczny

- Otworzyć `/leads`.
- Wejść w leada.
- Otworzyć `/clients`.
- Wejść w klienta.
