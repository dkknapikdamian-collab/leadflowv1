# A13 — strict Firestore decommission guard

## Decyzja

Supabase jest źródłem prawdy dla danych aplikacji.
Firestore może zostać wyłącznie jako legacy do usunięcia, ale nie może być aktywną ścieżką zapisu w kodzie aplikacji.

## Co zmienia ten hotfix

Poprzedni pomysł z tolerowaniem starych śladów Firestore był zbyt miękki produktowo. Ten hotfix ustawia właściwą zasadę:

- zapis danych biznesowych ma iść do Supabase,
- `addDoc`, `setDoc`, `updateDoc`, `deleteDoc`, `writeBatch`, `runTransaction` z `firebase/firestore` są blokowane w kodzie aplikacji,
- wyjątki: dokumentacja, testy, archiwa i `src/firebase.ts` jako plik auth/init, o ile nie zawiera ścieżek zapisu danych biznesowych.

## Dlaczego

Użytkownik docelowo nie ma mieć zależności od Firestore ani potrzeby dostępu do Firestore przy obsłudze aplikacji przez innych ludzi. Jeśli jakiś moduł nadal zapisuje do Firestore, to jest ryzyko produkcyjne i trzeba go przepiąć na Supabase.

## Następny etap, jeśli guard pokaże błędy

Każdy wskazany plik przepiąć według schematu:

1. Zidentyfikować encję: lead, task, event, case, client, activity, ai_draft, template.
2. Znaleźć istniejący helper Supabase w `src/lib/supabase-fallback.ts` lub endpoint w `api/*`.
3. Zastąpić zapis Firestore zapisem Supabase.
4. Zachować workspace scope.
5. Nie usuwać UI ani funkcjonalności.
6. Dodać mały test/guard dla przepiętej ścieżki.

## Komendy po wdrożeniu

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run test:critical
```
