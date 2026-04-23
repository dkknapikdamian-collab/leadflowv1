# Etap: usunięcie Firestore z firebase.ts

## Co robi ta paczka
- `src/firebase.ts`
  - usuwa import `getFirestore`
  - usuwa eksport `db`
  - zostawia tylko `auth`, `storage` i `googleProvider`

## Efekt
- aplikacja nie ciągnie już Firestore przez główny moduł firebase
- to czyści ostatni centralny punkt konfiguracji pod stary model
- vendor Firebase powinien być lżejszy po buildzie

## Co dalej
- największy klocek nadal: `LeadDetail.tsx`
- potem pełne wyjście z `firebase/auth`
