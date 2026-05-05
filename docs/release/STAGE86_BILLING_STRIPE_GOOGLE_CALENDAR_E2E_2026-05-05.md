# Stage86 — Billing / Stripe + Google Calendar E2E readiness

Data: 2026-05-05  
Branch docelowy: `dev-rollout-freeze`  
Zakres: Etap 11 Billing / Stripe oraz Etap 12 Google Calendar.

## Werdykt

NIE SPRZEDAWAĆ PUBLICZNIE, dopóki nie ma ręcznego dowodu z aplikacji dla dwóch ścieżek:

1. `checkout → webhook → paid_active → access refresh → cancel/resume`
2. `Google Calendar: env → OAuth → status connected → event sync`

Ten etap domyka techniczny routing i guardy, ale prawdziwe potwierdzenie wymaga środowiska z ENV oraz testu w aplikacji.

## Co etap naprawia / zabezpiecza

### Billing / Stripe

- `/api/billing?route=checkout` kieruje do checkout handlera.
- `/api/billing?route=actions` kieruje do cancel/resume handlera.
- `/api/billing?route=webhook` przekazuje request do webhook handlera bez wcześniejszego czytania raw body.
- `/api/stripe-webhook` nie trzyma już starej wersji bez zapisu do workspace, tylko deleguje do `billing-webhook-handler`.
- Checkout działa jako subskrypcja, bo bez tego cancel/resume jest tylko atrapą.
- Webhook pozostaje jedynym źródłem prawdy dla `paid_active`.

### Google Calendar

- Brak ENV w UI jest traktowany jako `wymaga konfiguracji`, nie jako błąd użytkownika.
- Status ma dalej pokazywać `configured`, `missing`, `connected` i `connection`.
- Connect ma prowadzić do OAuth dopiero po konfiguracji ENV.
- Sync outbound/inbound zostaje testowany ręcznie po połączeniu konta.

## Ręczny test, który masz zrobić po wdrożeniu

### A. Billing / Stripe

1. Wejdź w `/billing` jako zwykły użytkownik na workspace testowym.
2. Kliknij plan Pro albo Basic.
3. W Stripe test mode wykonaj płatność testową.
4. Po powrocie do aplikacji kliknij `Odśwież status`.
5. Sprawdź, czy status zmienia się na `paid_active` / `Dostęp aktywny`.
6. Kliknij `Anuluj odnowienie`.
7. Sprawdź, czy UI pokazuje anulowanie na koniec okresu, a dostęp nie gaśnie od razu.
8. Kliknij `Wznów odnowienie`.
9. Sprawdź, czy `cancelAtPeriodEnd` wraca na `false`.

Wynik do odesłania mi: screen z Billing po płatności, screen po anulowaniu, screen po wznowieniu oraz ewentualny log błędu z terminala/Vercel.

### B. Google Calendar bez ENV

1. Tymczasowo uruchom środowisko bez Google ENV albo sprawdź preview, gdzie ich nie ma.
2. Wejdź w `Ustawienia`.
3. Sekcja Google Calendar ma mówić, że wymaga konfiguracji.
4. Kliknięcie connect nie może wyglądać jak błąd użytkownika.

Wynik do odesłania mi: screen z komunikatem konfiguracji.

### C. Google Calendar z ENV

Wymagane ENV w Vercel:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=https://TWOJ_ADRES/api/google-calendar?route=callback
GOOGLE_TOKEN_ENCRYPTION_KEY=
GOOGLE_OAUTH_STATE_SECRET=
```

1. Wejdź w `Ustawienia`.
2. Kliknij połączenie Google Calendar.
3. Przejdź OAuth i wróć callbackiem do aplikacji.
4. Status w UI ma pokazać `connected`.
5. Dodaj wydarzenie w CloseFlow.
6. Uruchom synchronizację outbound.
7. Sprawdź, czy wydarzenie pojawiło się w Google Calendar.
8. Rozłącz Google Calendar i sprawdź, czy status wraca na disconnected.

Wynik do odesłania mi: screen connected, screen wyniku sync oraz informacja, czy event pojawił się w Google.

## Kryterium zakończenia etapu

Etap uznajemy za domknięty dopiero, gdy:

- `npm.cmd run check:stage86-billing-google-e2e-readiness` przechodzi,
- `npm.cmd run test:stage86-billing-google-e2e-readiness` przechodzi,
- `npm.cmd run check:p14-billing-production-validation` przechodzi,
- Stripe test mode potwierdzi `paid_active` po webhooku,
- cancel/resume działa bez ręcznej zmiany w bazie,
- Google Calendar pokazuje brak ENV jako konfigurację,
- Google Calendar po ENV przechodzi OAuth i sync eventu.
