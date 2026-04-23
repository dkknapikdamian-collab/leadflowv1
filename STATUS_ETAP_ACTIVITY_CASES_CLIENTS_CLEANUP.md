# Etap: czyszczenie Activity, cases i clients z resztek Firestore

## Co robi ta paczka
- `src/lib/cases.ts`
  - usuwa fallback kasowania sprawy przez Firestore
  - kasowanie sprawy wymaga już Supabase
- `src/pages/Activity.tsx`
  - usuwa fallback listy aktywności przez Firestore `onSnapshot`
  - ekran aktywności działa w modelu Supabase-first
- `src/lib/clients.ts`
  - usuwa import typu `Timestamp` z `firebase/firestore`
  - helpery klienta używają lokalnego typu daty

## Efekt
- mniej zależności od `firebase/firestore`
- prostszy tor dalszego wycinania Firebase
- kolejny kawałek aplikacji jest spójny z kierunkiem Supabase

## Co dalej
- dalej największy klocek: `LeadDetail.tsx`
- potem `ClientPortal.tsx` i pełne zejście z Firebase auth/storage
