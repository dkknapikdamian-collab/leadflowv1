# LeadFlow — wdrożenie (Supabase-first)

## Co jest wdrożone
- auth Firebase (email/hasło + Google + reset hasła),
- workspace + trial/subskrypcja,
- moduły: Dziś, Leady, Zadania, Kalendarz, Sprawy, Portal klienta, Billing, Ustawienia,
- PWA (manifest + service worker),
- bezpieczniejszy flow portalu klienta:
  - link oparty o token jawny tylko w URL,
  - w bazie trzymany wyłącznie `tokenHash`,
  - sesja klienta `client_portal_sessions`.

## Jak uruchomić
1. Uzupełnij konfigurację Firebase w `firebase-applet-config.json`.
2. Zainstaluj zależności:
   - `npm install`
3. Uruchom dev:
   - `npm run dev`
4. Build produkcyjny:
   - `npm run build`

## Firebase / Firestore legacy
- wdroż aktualne reguły z `firestore.rules`,
- upewnij się, że w Firebase Auth jest włączone:
  - Email/Password,
  - Google,
  - Anonymous (wymagane przez portal klienta z sesją tokenową).

<!-- closeflow-supabase-first-deployment -->
## Supabase-first / Firebase legacy

Ten plik wdrożeniowy należy czytać zgodnie z aktualną decyzją architektoniczną:

- Supabase jest docelowym źródłem prawdy dla danych biznesowych, auth, storage, billing, portalu klienta, AI drafts, szablonów i aktywności.
- Firebase / Firestore jest legacy i ma zostać wygaszony po migracji.
- Nie dopisujemy nowych funkcji do Firestore.
- Nie ufamy nagłówkom `x-user-id`, `x-user-email`, `x-workspace-id` z frontu jako źródłu autoryzacji.
- AI nie zapisuje finalnych danych bez potwierdzenia użytkownika.

Dokumenty źródłowe:

- `docs/SUPABASE_FIRST_ARCHITECTURE.md`
- `docs/DATA_SOURCE_MAP.md`
<!-- /closeflow-supabase-first-deployment -->
