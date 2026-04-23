# Etap: odpięcie workspace i appearance od bezpośrednich fallbacków Firebase

## Co robi ta paczka
- dodaje `src/lib/client-auth.ts`
- `src/App.tsx` zapisuje snapshot usera do warstwy klienckiej
- `src/lib/supabase-fallback.ts` czyta kontekst usera z lekkiej warstwy zamiast z `auth.currentUser`
- `src/hooks/useWorkspace.ts`
  - nie używa już Firestore fallbacków
  - trzyma się kierunku Supabase-first
- `src/components/appearance-provider.tsx`
  - używa tego samego snapshotu usera

## Co to daje
- kolejna część aplikacji przestaje zależeć od Firestore jako planie B
- workspace i appearance są bliżej modelu Supabase-only
- łatwiej później odciąć Firebase auth bez rozjechania kontekstu usera

## Co jeszcze zostało
- `useAuthState(auth)` nadal siedzi na Firebase
- `src/firebase.ts` nadal istnieje
- `src/pages/Login.tsx` nadal wymaga przepięcia
- `src/pages/LeadDetail.tsx` nadal ma ciężki `MutationObserver` i ukrywanie DOM po fakcie
