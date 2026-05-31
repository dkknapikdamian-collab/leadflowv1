# STAGE132 PWA Install Prompt Copy Cleanup — raport

Data: 2026-05-22  
Projekt: CloseFlow / LeadFlow  
Zakres: microcopy / PWA install prompt / UI polish

## Cel

Usunąć techniczne i dziwnie brzmiące teksty z okienka „Dodaj CloseFlow do ekranu głównego telefonu”.

## FAKTY

W `src/components/PwaInstallPrompt.tsx` znajdowały się teksty o service workerze, cache, API, auth i danych biznesowych. To jest język techniczny, nie produkcyjny microcopy dla użytkownika.

## DECYZJA

Zostaje tylko:

- `Dodaj CloseFlow do ekranu głównego telefonu`
- `Otwieraj aplikację jak zwykłą apkę.`
- `Dodaj do ekranu`
- `Nie teraz`

Usunięto:
- tekst o service workerze,
- tekst o cache,
- tekst o danych klienta,
- manualny komunikat iOS/przeglądarki,
- ikonę ShieldCheck.

## Dodatkowo

Skrypt usuwa ewentualne resztki Stage131 z `src/App.tsx` i dodane pliki Stage131, jeśli zostały po przerwanym wdrożeniu.

## Testy

```powershell
node scripts/check-stage132-pwa-install-copy-cleanup.cjs
npm.cmd run build
```

## Czego nie ruszano

- Supabase
- Google OAuth
- Stripe
- AI
- routing
- dane
- Vercel deploy
- push

## Następny krok

Odpalić lokalnie `npm.cmd run dev`, sprawdzić popup PWA i przejść do kolejnego elementu UI.
