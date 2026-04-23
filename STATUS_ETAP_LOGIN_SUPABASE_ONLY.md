# Etap: Login bez fallbacku tworzenia workspace przez Firestore

## Co robi ta paczka
- `src/pages/Login.tsx`
  - usuwa fallback tworzenia profilu i workspace przez Firestore
  - po logowaniu i rejestracji inicjalizacja idzie już tylko przez Supabase API
  - zapisuje snapshot auth po stronie klienta

## Co to daje
- kolejny ekran przestaje tworzyć dane przez Firebase/Firestore
- ścieżka logowania jest bliżej modelu Supabase-first
- mniej starej logiki hybrydowej w wejściu do aplikacji

## Co jeszcze zostało
- samo logowanie nadal używa Firebase auth
- `src/firebase.ts` nadal istnieje
- `LeadDetail.tsx` nadal wymaga dużej przebudowy
