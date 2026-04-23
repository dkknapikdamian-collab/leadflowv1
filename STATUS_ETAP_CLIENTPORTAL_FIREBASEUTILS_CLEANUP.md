# Etap: ClientPortal i firebase-utils bez Firestore

## Co robi ta paczka
- `src/pages/ClientPortal.tsx`
  - usuwa fallback portalu klienta przez Firestore
  - portal działa już w trybie Supabase-first dla danych
  - zostawia tylko upload plików przez storage
- `src/lib/firebase-utils.ts`
  - czyści martwy helper z importów `firebase/firestore`
  - zostawia lekki moduł zgodności bez ciężkiej logiki

## Efekt
- kolejna duża część aplikacji nie opiera się już na Firestore
- mniej starych importów i mniej kodu przejściowego
- portal klienta jest bliżej docelowego kierunku produktu

## Co dalej
- dalej największy klocek: `LeadDetail.tsx`
- potem pełne odpinanie auth od Firebase
