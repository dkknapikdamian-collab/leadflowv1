# A14 — Firestore write/read decommission: Supabase only

## Cel

Usunąć aktywne użycie `firebase/firestore` z aplikacji.

Supabase jest źródłem prawdy dla danych aplikacji. Firestore nie może być już używany do zapisu ani odczytu danych operacyjnych, bo użytkownik nie ma docelowo dostępu do Firestore i późniejsza obsługa aplikacji przez inne osoby nie może zależeć od starego backendu.

## Zmienione pliki

- `src/pages/Dashboard.tsx`
- `src/components/sidebar-mini-calendar.tsx`
- `scripts/check-a13-critical-regressions.cjs`
- `tests/a13-critical-regressions.test.cjs`

## Zakres zmiany

### Dashboard

Usunięto:

- `db` z `../firebase`,
- importy z `firebase/firestore`,
- `onSnapshot`,
- `collection`,
- `query`,
- `where`,
- `orderBy`,
- `addDoc`,
- `serverTimestamp`.

Zastąpiono przez helpery Supabase:

- `fetchCasesFromSupabase`,
- `fetchCaseTemplatesFromSupabase`,
- `createClientInSupabase`,
- `createCaseInSupabase`,
- `insertCaseItemToSupabase`.

### SidebarMiniCalendar

Usunięto fallback Firestore. Mini kalendarz działa na danych Supabase z `fetchCalendarBundleFromSupabase`. Gdy Supabase nie jest skonfigurowany albo workspace nie istnieje, pokazuje pusty stan zamiast próbować czytać Firestore.

### Guard A13

Guard blokuje aktywne użycie Firestore w `src/` i `api/`:

- import `firebase/firestore`,
- `addDoc`,
- `setDoc`,
- `updateDoc`,
- `deleteDoc`,
- `writeBatch`,
- `runTransaction`,
- `onSnapshot`,
- `collection(db, ...)`.

## Nie zmieniono

- Nie usunięto Firebase Auth.
- Nie zmieniono routingu.
- Nie zmieniono modelu Supabase.
- Nie usunięto funkcji tworzenia klienta/sprawy/szablonów.

## Testy

Po wdrożeniu:

```powershell
npm.cmd run check:a13-critical-regressions
npm.cmd run test:critical
```

## Kryterium zakończenia

A13 nie pokazuje już aktywnych ścieżek Firestore w `src/` ani `api/`.
