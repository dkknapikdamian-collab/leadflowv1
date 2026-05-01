# FIREBASE DECOMMISSION PLAN

Data: 2026-05-01
Status: execution plan for removing Firebase/Firestore from runtime.

## Cel

Usunąć hybrydę Firebase/Supabase. Docelowo runtime działa wyłącznie na:

1. Supabase Auth
2. Supabase Postgres
3. Supabase RLS
4. Supabase Storage

Firebase zostaje tylko chwilowo jako legacy lockdown (bez nowych funkcji i bez nowych danych biznesowych).

## Aktualne miejsca użycia Firebase (runtime)

### Auth

- `src/firebase.ts`
  - Użycie: `getAuth`, provider Google, eksport `auth`.
  - Decyzja: **usunąć** po przepięciu logowania na Supabase Auth.
- `src/hooks/useFirebaseSession.ts`
  - Użycie: `onAuthStateChanged` z Firebase Auth.
  - Decyzja: **przenieść do Supabase** (`onAuthStateChange` z Supabase client), potem usunąć.
- `src/pages/Calendar.tsx`
- `src/pages/Today.tsx`
- `src/pages/Tasks.tsx`
- `src/pages/Settings.tsx`
- `src/pages/SupportCenter.tsx`
- `src/components/Layout.tsx`
- `src/components/quick-lead/QuickLeadCaptureModal.tsx`
  - Użycie: import `auth` z `src/firebase.ts`.
  - Decyzja: **przenieść do Supabase** (sesja/user z `supabase-auth`), potem usunąć importy Firebase.

### Data (Firestore)

- `src/pages/Dashboard.tsx`
  - Użycie: `firebase/firestore` (`collection`, `query`, `onSnapshot`, `addDoc`, `serverTimestamp`).
  - Decyzja: **przenieść do Supabase** (API + realtime opcjonalnie), potem usunąć Firestore flow.
- `src/components/sidebar-mini-calendar.tsx`
  - Użycie: `onSnapshot` dla `tasks/events`.
  - Decyzja: **przenieść do Supabase** (odczyt przez API i kontrakt DTO), usunąć Firestore snapshoty.
- `src/lib/firebase-utils.ts`
  - Użycie: legacy helpery Firestore.
  - Decyzja: **usunąć** po zakończeniu migracji danych.

### Storage

- `src/firebase.ts`
  - Użycie: `getStorage`.
  - Decyzja: **usunąć** po przepięciu uploadów i odczytu na Supabase Storage.
- `api/storage-upload.ts`, `api/case-items.ts`
  - Użycie: już idą przez Supabase Storage API.
  - Decyzja: **zostawić** (to jest docelowy kierunek).

### Portal klienta

- Legacy model tokenów w Firestore był historycznie używany.
  - Decyzja: **przenieść do Supabase** (token hash + backendowa walidacja + portal session).
  - Aktualny kierunek: `api/client-portal-session.ts`, `api/client-portal-tokens.ts`, `src/server/_portal-token.ts`.

### Templates

- Ryzyko legacy odczytu z Firestore w starszych ekranach.
  - Decyzja: **przenieść do Supabase** (API `/api/response-templates` i checklist templates w tabelach SQL).

### Legacy fallback / kompatybilność

- `src/lib/supabase-fallback.ts`
  - Użycie: warstwa fetch do `/api/*` + normalizatory.
  - Decyzja: **zostawić chwilowo** (to nie jest Firebase runtime), stopniowo upraszczać po domknięciu kontraktu DTO.
- `api/me.ts`, `api/system.ts`, `src/server/_request-scope.ts`
  - Użycie: pola kompatybilności typu `firebase_uid`.
  - Decyzja: **zostawić chwilowo jako compatibility-only**, docelowo usunąć po pełnym przejściu na Supabase UID.

## Lockdown-only (tymczasowo do czasu całkowitego usunięcia)

- `firestore.rules`
- `storage.rules`

Decyzja: **zostawić chwilowo jako lockdown-only**.
Zasada: żadnych nowych kolekcji, żadnych nowych feature’ów, zero publicznych reguł.

Komentarz wymagany w rules:

`Firebase is legacy. Do not add new business data here.`

## Migracja danych: opcje

### Opcja A (rekomendowana): clean start

Kiedy wybrać:
- gdy dane w Firestore są testowe/niekrytyczne,
- gdy brak pewności co do jakości i spójności danych legacy.

Kroki:
1. Zamrozić zapis do Firestore (tylko odczyt awaryjny, jeśli potrzebny).
2. Włączyć wyłącznie API Supabase dla nowych zapisów.
3. Po okresie obserwacji usunąć importy Firebase z runtime.
4. Na końcu usunąć dependency `firebase` z `package.json`.

### Opcja B: jednorazowa migracja

Kiedy wybrać:
- gdy trzeba zachować dane historyczne.

Kroki:
1. Eksport Firestore do plików snapshot.
2. Jednorazowy skrypt mapujący legacy pola do kontraktu Supabase DTO.
3. Import do Supabase tabel docelowych.
4. Weryfikacja rekordów i relacji.
5. Wyłączenie runtime Firestore.

## Plan wykonania (bez rozwalania produkcji)

1. Przepiąć auth na Supabase w UI (usunąć zależność od `src/firebase.ts`).
2. Przepiąć ostatnie odczyty/zapisy Firestore (`Dashboard`, `sidebar-mini-calendar`) na API Supabase.
3. Utrzymać Firestore/Storage rules tylko jako blokadę legacy.
4. Usunąć `src/firebase.ts`, `src/hooks/useFirebaseSession.ts`, `src/lib/firebase-utils.ts`.
5. Usunąć `firebase` z `package.json` i niewykorzystane env.
6. Uruchomić pełny smoke test i rollout.

## Kontrole po wdrożeniu

Polecenia:

```powershell
rg -n "firebase|firestore" src api
rg -n "from 'firebase|from \"firebase" src api
```

Warunek zaliczenia:
- trafienia tylko w dokumentacji legacy/decommission albo brak trafień w runtime.

Dodatkowo:
- aplikacja działa bez Firebase env po cleanupie,
- auth/data/storage działają przez Supabase.
