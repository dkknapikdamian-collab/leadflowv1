# LeadFlow

Ten pakiet działa na:
- Next.js
- TypeScript
- App Router
- Supabase Auth

## Co jest wdrożone teraz
- prosty shell aplikacji
- 6 głównych sekcji: Dziś / Leady / Zadania / Kalendarz / Billing / Ustawienia
- mobilny układ pod telefon i desktop
- pusty stan startowy zamiast domyślnego demo
- sekcje `Dziś` można zwijać i rozwijać
- kliknięcie licznika sekcji przenosi ją na górę i rozwija
- dodawanie / edycja / usuwanie leadów i działań
- drawer szczegółów leada
- snooze i oznaczanie jako zrobione
- logowanie Google
- logowanie e-mail + hasło
- potwierdzenie e-mail dla kont zakładanych hasłem
- ponowne wysyłanie potwierdzenia z cooldownem
- reset hasła i ustawienie nowego hasła
- callback OAuth i sesja na cookies httpOnly
- middleware odświeżające sesję i chroniące prywatne widoki
- warstwa sesji oddzielona od zwykłego store aplikacji
- lokalny cache danych rozdzielony per zalogowany użytkownik, żeby konto A nie widziało wpisów konta B na tym samym urządzeniu
- model ETAPU 3 rozpisany w kodzie i migracjach: profile, workspace, access status, settings, leads, work items
- idempotentny bootstrap danych startowych po pierwszym logowaniu po stronie SQL triggera
- centralna tabela `access_status` trzyma status dostępu, trial, płatność i użyty bonus
- centralna decyzja o dostępie w middleware na podstawie sesji auth i danych z bazy
- ekran blokady dla usera zalogowanego, ale bez aktywnego dostępu
- testy logiki auth helperów, modelu repozytorium i decyzji dostępowej

## Co domknięte względem ETAPU 2
- login Google działa przez callback OAuth
- login e-mail + hasło działa
- rejestracja e-mail + hasło działa z neutralnymi komunikatami
- resend confirmation ma limit i cooldown
- forgot password i ustawienie nowego hasła są spięte
- auth nie decyduje o dostępie w komponentach frontu
- prywatne widoki są chronione przez middleware i sesję serwerową

## Co domknięte względem ETAPU 3
- istnieje twardy model `profiles`, `workspaces`, `workspace_members`, `access_status`, `settings`, `leads`, `work_items`
- każdy rekord biznesowy jest przewidziany pod `workspace_id`
- bootstrap po pierwszym logowaniu tworzy profil, workspace, settings i trial
- bootstrap jest idempotentny
- są pola pod `signup_source` i `invited_by_user_id`
- `access_status` ma też miejsce na zapis użytego bonusu

## Co domknięte względem ETAPU 4
- user może być zalogowany, ale nadal zablokowany, jeśli nie ma aktywnego dostępu
- middleware centralnie sprawdza:
  - czy sesja istnieje,
  - czy e-mail jest potwierdzony,
  - czy istnieje rekord `access_status`,
  - czy trial albo plan jeszcze trwa
- `trial_active` z ważnym `trial_end` wpuszcza
- `paid_active` z ważnym `paid_until` wpuszcza
- brak ważnego triala albo planu blokuje normalną pracę i kieruje na wall dostępu

## Ważne ograniczenie aktualnego stanu
Auth jest już domknięty jak prawdziwa aplikacja, a model danych jest gotowy pod trial i billing.

Natomiast pełne przepięcie CRUD leadów, tasków, kalendarza i ustawień z local cache na bazę online to kolejny etap. Na teraz:
- sesja użytkownika jest prawdziwa,
- separacja użytkowników jest prawdziwa,
- model danych w Supabase jest gotowy,
- decyzja o dostępie jest centralna,
- ale główne dane robocze UI nie są jeszcze finalnie czytane i zapisywane do tych tabel.

## Pliki środowiskowe
Skopiuj `.env.example` do `.env.local` i uzupełnij wartości.

Najważniejsze pola na ten etap:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Supabase
Jeśli stawiasz nowy projekt od zera, uruchom kolejno:

```text
supabase/001_init.sql
supabase/002_workspace_access_model.sql
supabase/003_access_status_bonus.sql
```

Jeśli projekt już był stawiany na wcześniejszym etapie, dołóż teraz:

```text
supabase/003_access_status_bonus.sql
```

## Co sprawdzić po podpięciu kont
1. Rejestracja e-mail + hasło.
2. E-mail confirmation.
3. Login e-mail + hasło.
4. Forgot password.
5. Reset password.
6. Login przez Google.
7. Czy konto A i konto B nie mieszają lokalnych cache na tym samym urządzeniu.
8. Czy po wylogowaniu prywatne widoki odcinają dostęp.
9. Czy po pierwszym logowaniu istnieją rekordy w `profiles`, `workspaces`, `access_status`, `settings`.
10. Czy `access_status` ma komplet pól pod trial, płatność i bonus.
11. Czy user zalogowany, ale z wygasłym statusem, trafia na ekran blokady zamiast do pracy.
12. Czy tabele `leads` i `work_items` są gotowe pod następne przepięcie CRUD.
