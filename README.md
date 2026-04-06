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
- testy logiki i auth helperów

## Twarde zasady wdrożone na tym etapie
- jeden e-mail ma prowadzić do jednego konta użytkownika
- Google jest metodą logowania, a nie metodą nadawania dostępu
- auth user nie jest brany z `snapshot.user`, tylko z sesji auth
- komunikaty auth są neutralne i nie zdradzają publicznie, czy konto istnieje
- e-mail jest zawsze normalizowany przed użyciem: trim + lowercase + walidacja formatu
- wrażliwe akcje auth mają rate limiting po stronie aplikacji
- nowy użytkownik ma startować od pustego stanu, nie od dema
- dane demo nie ładują się automatycznie do produkcyjnego wejścia

## Ważne ograniczenie tego etapu
Ten etap domyka **ETAP 0–2**, czyli reguły, środowisko i pełny flow auth.

Biznesowe dane aplikacji są już odseparowane od sesji użytkownika i cache są rozdzielone per użytkownik, ale pełne przejście na **online source of truth dla leadów / tasków / kalendarza** jest następnym etapem po uruchomieniu projektu Supabase i tabel z `supabase/001_init.sql`.

## Pliki środowiskowe
Skopiuj `.env.example` do `.env.local` i uzupełnij wartości.

Najważniejsze pola na ten etap:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## Supabase
1. Utwórz projekt.
2. Włącz:
   - Google login,
   - email/password auth,
   - e-mail confirmation.
3. Uruchom SQL z pliku:

```text
supabase/001_init.sql
```

4. W Google Cloud ustaw redirect URL-e zgodne z:
- `http://localhost:3000/auth/callback`
- preview URL Vercel `/auth/callback`
- production URL `/auth/callback`

## Jak uruchomić zwykły start
Na Windows najlepiej:
- `start_leadflow.bat`

albo:
- `start_leadflow.ps1`

Po uruchomieniu:
- serwer dev startuje,
- przeglądarka otwiera się sama,
- log standardowy zapisuje się do `logs/app.log`,
- błędy zapisują się do `logs/error.log`.

## Jak uruchomić z testami
Na Windows:
- `start_leadflow_with_tests.bat`

albo:
- `start_leadflow_with_tests.ps1`

Ten tryb:
1. odpala testy,
2. zapisuje wynik do `logs/test.log`,
3. jeśli testy przejdą, uruchamia aplikację,
4. otwiera stronę automatycznie w przeglądarce.

## Uruchomienie ręczne
```bash
npm install
npm run test
npm run dev
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
