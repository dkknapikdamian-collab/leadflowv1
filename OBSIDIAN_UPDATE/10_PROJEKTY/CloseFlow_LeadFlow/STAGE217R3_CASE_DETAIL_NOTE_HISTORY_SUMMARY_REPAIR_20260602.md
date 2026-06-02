# Stage217 R3 - CaseDetail note history summary repair

## FAKTY
- Stage217 R2 zmienił `src/pages/CaseDetail.tsx`, dodał CSS i raporty, ale guard zatrzymał etap na `Stage217 note history summary missing`.
- Build po R2 przeszedł, lecz guard Stage217 nie przeszedł.

## DECYZJE DAMIANA
- Zakładka Sprawy ma być kokpitem operacyjnym sprawy.
- Notatki i historia nie mogą być mieszane.

## HIPOTEZY AI
- R2 dodał panele, ale nie trafił w dokładny fragment historii notatek przez rozjazd istniejącego kodu.

## ZAKRES R3
- Naprawa skrótu notatki w historii aktywności.
- Pełna treść notatek zostaje w panelu Notatki sprawy.

## TESTY
- `node scripts/check-stage217-case-detail-operation-workspace.cjs`
- `npm run build`
- ręcznie sprawdzić widok szczegółu sprawy.

## RYZYKA
- Repo ma równolegle brudne zmiany Stage216, więc nie pushować bez świadomej selekcji plików.

## NASTĘPNY KROK
Uruchomić Stage217 R3, sprawdzić guard/build, potem obejrzeć ekran Sprawy.
