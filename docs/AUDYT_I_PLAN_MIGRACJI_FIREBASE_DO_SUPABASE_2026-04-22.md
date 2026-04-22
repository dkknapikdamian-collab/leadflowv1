# Audyt i plan migracji Firebase do Supabase

## Cel
Domknąć produkt na jednym backendzie danych i auth. Docelowy kierunek to:
- Supabase jako źródło prawdy dla danych aplikacji
- Supabase jako docelowy auth
- brak mieszania Firestore i Supabase w logice produktu
- brak równoległych ścieżek fallback, poza krótkim okresem kontrolowanego przejścia

To nie jest luźna notatka. To jest plan wykonawczy pod kolejne pakiety wdrożeniowe.

---

## Stan na dziś

### 1. Firebase nadal siedzi w rdzeniu sesji i części bootstrapu
Najważniejsze miejsca:
- `src/firebase.ts` – inicjalizacja Firebase App, Auth, Firestore, Storage
- `src/App.tsx` – `useAuthState(auth)`, subskrypcja profilu w Firestore, globalne wylogowanie, synchronizacja e-maila, `seedTemplates()`
- `src/pages/Login.tsx` – logowanie e-mail/hasło, Google login, reset hasła, rejestracja, wstępne zakładanie `profiles` i `workspaces` w Firestore
- `src/hooks/useWorkspace.ts` – tryb mieszany: najpierw Supabase, ale nadal ma pełny fallback Firestore
- `src/lib/workspace.ts` – Firestore-only bootstrap workspace/profile
- `src/lib/firebase-utils.ts` – seed szablonów i diagnostyka Firestore

### 2. Supabase przejął już dużą część danych aplikacji
To już jest wdrożone i działa jako kierunek docelowy dla danych:
- leady
- sprawy
- zadania
- wydarzenia
- aktywności
- billing/access
- support center

### 3. Obecny problem architektoniczny
Nie mamy już problemu „czy iść w Supabase”. To jest ustalone.
Problemem jest to, że aplikacja nadal ma dwa światy naraz:
- auth i część bootstrapu w Firebase
- dane domenowe w Supabase

To rodzi skutki uboczne:
- podwójne źródła prawdy
- trudniejszy onboarding nowych userów
- cięższy bundle przez `firebase` i `react-firebase-hooks`
- więcej miejsc awarii
- trudniejsze debugowanie uprawnień
- większy koszt utrzymania

---

## Co ma zostać po migracji

## Docelowa architektura

### Auth
Supabase Auth:
- login e-mail/hasło
- rejestracja
- reset hasła
- zmiana e-maila
- Google OAuth
- sesja użytkownika
- wylogowanie globalne

### Profil i workspace
Supabase jako źródło prawdy dla:
- `profiles`
- `workspaces`
- planu
- trialu
- statusu subskrypcji
- flag admina / roli

### Dane domenowe
Zostają w Supabase i tylko porządkujemy spójność:
- leady
- sprawy
- zadania
- wydarzenia
- aktywności
- support
- portal klienta
- szablony

### Usunąć po migracji
- `src/firebase.ts`
- `firebase-applet-config.json`
- `react-firebase-hooks`
- `firebase`
- `firebase-admin` jeśli nie będzie już potrzebny nigdzie po API
- stare fallbacki Firestore w hookach i helperach

---

## Zasada wdrożenia
Nie robimy wielkiego skoku jednym ruchem.
Robimy to w pakietach, gdzie każdy pakiet:
- ma swój zakres
- ma własne kryterium zakończenia
- nie miesza kilku ryzyk naraz
- po wdrożeniu przechodzi build i test ręczny

---

# Pakiet 1
## Cel
Oddzielić aplikację od bezpośrednich wywołań Firebase Auth i przygotować warstwę pośrednią auth.

## Pliki do sprawdzenia
- `src/firebase.ts`
- `src/App.tsx`
- `src/pages/Login.tsx`
- `src/hooks/useWorkspace.ts`
- `package.json`

## Zmień
1. Dodać warstwę `src/lib/auth-provider.ts` albo podobną, która wystawia jednolite funkcje:
   - `getCurrentSessionUser()`
   - `observeAuthState()`
   - `signInWithEmail()`
   - `registerWithEmail()`
   - `signInWithGoogle()`
   - `sendResetPassword()`
   - `signOutCurrentUser()`
   - `getAccessToken()`
2. Na tym etapie ta warstwa może jeszcze pod spodem używać Firebase, ale UI ma już przestać importować Firebase bezpośrednio.
3. `App.tsx`, `Login.tsx`, `useWorkspace.ts` mają używać tylko tej nowej warstwy.
4. Nie ruszać jeszcze samego providera logowania na Supabase. Najpierw abstrahujemy interfejs.

## Nie zmieniaj
- danych domenowych
- supportu
- kalendarza
- leadów
- spraw
n
## Po wdrożeniu sprawdź
- login e-mail
- login Google
- reset hasła
- rejestracja
- wylogowanie
- odświeżenie sesji

## Kryterium zakończenia
Żaden ekran produktu nie importuje już bezpośrednio `firebase/auth` poza nową warstwą auth.

---

# Pakiet 2
## Cel
Przenieść bootstrap profilu/workspace z Firestore do Supabase.

## Pliki do sprawdzenia
- `src/hooks/useWorkspace.ts`
- `src/lib/workspace.ts`
- `src/pages/Login.tsx`
- `src/App.tsx`
- `src/lib/supabase-fallback.ts`
- migracje Supabase dla `profiles` i `workspaces`, jeśli czegoś brakuje

## Zmień
1. `ensureWorkspaceForUser` przepisać na Supabase.
2. `Login.tsx` po rejestracji/logowaniu ma zakładać rekordy tylko w Supabase.
3. `App.tsx` ma czytać profil/workspace tylko z Supabase.
4. `useWorkspace.ts` usunąć fallback Firestore i zostawić jeden tryb.
5. Ujednolicić trial na 14 dni w jednym miejscu. Teraz to jest historycznie niespójny obszar.

## Nie zmieniaj
- samej logiki auth providera
- supportu
- pozostałych danych domenowych

## Po wdrożeniu sprawdź
- nowy user
- istniejący user
- trial 14 dni
- admin override
- profile update po zmianie maila

## Kryterium zakończenia
`useWorkspace.ts` i `src/lib/workspace.ts` nie korzystają już z Firestore.

---

# Pakiet 3
## Cel
Przenieść auth z Firebase Auth na Supabase Auth.

## Pliki do sprawdzenia
- nowa warstwa auth z Pakietu 1
- `src/pages/Login.tsx`
- `src/App.tsx`
- `src/pages/Settings.tsx`
- konfiguracja OAuth / redirectów

## Zmień
1. Podmienić implementację warstwy auth z Firebase na Supabase.
2. Skonfigurować:
   - e-mail/hasło
   - reset hasła
   - zmiana maila
   - Google OAuth
3. Zachować obecne UX i teksty tam, gdzie nie ma potrzeby zmian.
4. Dodać mapowanie starego `uid` do nowego modelu użytkownika, jeśli istniejące rekordy wymagają zgodności.
5. Sprawdzić, czy `ownerId` i relacje w danych nadal są spójne po przełączeniu auth.

## Ryzyko
To jest pierwszy naprawdę wrażliwy etap. Nie łączyć go z niczym innym.

## Po wdrożeniu sprawdź
- logowanie desktop
- logowanie mobile
- Google redirect
- reset hasła
- zmiana e-maila
- zmiana hasła
- wylogowanie ze wszystkich urządzeń

## Kryterium zakończenia
Aplikacja loguje i utrzymuje sesję bez Firebase Auth.

---

# Pakiet 4
## Cel
Wyciąć resztki Firestore helperów i seedów.

## Pliki do sprawdzenia
- `src/lib/firebase-utils.ts`
- `src/App.tsx`
- `src/lib/workspace.ts`
- wszystkie importy z `firebase/firestore`

## Zmień
1. `seedTemplates()` przenieść na Supabase albo zastąpić seedem SQL / endpointem adminowym.
2. Usunąć debug helpery Firestore.
3. Usunąć subskrypcje Firestore z `App.tsx`.
4. Wyczyścić wszystkie importy `db`, `doc`, `onSnapshot`, `collection`, `addDoc`, itd.

## Kryterium zakończenia
W kodzie aplikacji nie ma już aktywnego użycia Firestore.

---

# Pakiet 5
## Cel
Wyczyścić zależności i konfigurację repo.

## Pliki do sprawdzenia
- `package.json`
- `package-lock.json`
- `src/firebase.ts`
- `firebase-applet-config.json`
- README i docs

## Zmień
1. Usunąć pakiety:
   - `firebase`
   - `firebase-admin`
   - `react-firebase-hooks`
2. Usunąć pliki:
   - `src/firebase.ts`
   - `firebase-applet-config.json`
3. Zaktualizować README i docs pod finalny model Supabase-only.

## Kryterium zakończenia
Repo nie ma już zależności od Firebase.

---

## Kolejność wdrożeń
1. Pakiet 1 – warstwa auth
2. Pakiet 2 – bootstrap profile/workspace na Supabase
3. Pakiet 3 – przełączenie auth na Supabase Auth
4. Pakiet 4 – wycięcie helperów Firestore
5. Pakiet 5 – czyszczenie repo i zależności

Nie przeskakiwać tej kolejności.

---

## Co jest najbardziej ryzykowne
- Google login mobile po przejściu na Supabase Auth
- mapowanie obecnych userów i ich `ownerId`
- zachowanie globalnego wylogowania
- zachowanie spójności `profile.email`, `workspace.ownerId`, ról i admin override

---

## Co można zrobić szybko już teraz
Bezpieczne ruchy jeszcze przed właściwą migracją auth:
- usunąć bezpośrednie importy Firebase z UI przez warstwę auth
- przenieść `seedTemplates()` z Firestore do Supabase
- zacząć porządkować nazwy helperów, żeby nie sugerowały już fallbacku tam, gdzie fallback ma zniknąć

---

## Kryterium końcowe całego programu migracji
Cała aplikacja działa na jednym backendzie operacyjnym:
- Supabase Auth
- Supabase database
- brak Firestore
- brak Firebase SDK w bundle
- prostsze debugowanie
- mniejszy bundle
- mniej punktów awarii
