# LeadFlow — wdrożenie (Firebase)

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

## Firestore
- wdroż aktualne reguły z `firestore.rules`,
- upewnij się, że w Firebase Auth jest włączone:
  - Email/Password,
  - Google,
  - Anonymous (wymagane przez portal klienta z sesją tokenową).
