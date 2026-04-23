# Etap: odpięcie warstwy API od Firebase auth

## Co robi ta paczka
- dodaje `src/lib/client-auth.ts`
- `src/lib/supabase-fallback.ts` nie czyta już `auth.currentUser` bezpośrednio z Firebase
- `src/App.tsx` zapisuje snapshot zalogowanego użytkownika do lekkiej warstwy klienckiej

## Co to daje
- warstwa API pod Supabase przestaje zależeć bezpośrednio od `src/firebase.ts`
- to jest etap pośredni przed pełnym wycięciem Firebase auth
- łatwiej później przepiąć logowanie bez rozlewania zmian po całej aplikacji

## Co jeszcze zostało
- `useAuthState(auth)` nadal działa przez Firebase
- `src/firebase.ts` nadal istnieje
- `LeadDetail.tsx` nadal wymaga przebudowy bez `MutationObserver`
