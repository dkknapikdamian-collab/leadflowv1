# Co robi ta paczka

## Wdrożone teraz
- `src/App.tsx`
  - usunięty fallback profilu i workspace przez Firestore
  - aplikacja traktuje Supabase jako główne źródło profilu
- `src/pages/Cases.tsx`
  - usunięty fallback listy spraw przez Firestore `onSnapshot`
  - ekran spraw czyta już tylko z Supabase API

## Czego ta paczka jeszcze nie kończy
- auth nadal idzie przez Firebase
- `src/firebase.ts` nadal istnieje
- `src/lib/supabase-fallback.ts` nadal pobiera użytkownika z `auth.currentUser`
- `LeadDetail.tsx` nadal ma ciężki hack DOM zamiast czystego renderowania pod status „temat w obsłudze”

## Następny etap
- wyciąć Firebase z auth/session
- przepisać `LeadDetail.tsx` bez `MutationObserver`
