# Stage A28 — Digest, powiadomienia, PWA i funkcje wartości

## Cel

Domknięcie praktycznych elementów V1 bez dokładania ciężkiego dashboardu:

- dzienny digest,
- raport tygodniowy,
- logi `digest_logs` w Supabase,
- PWA z ikonami i install promptem,
- ostrożny service worker bez agresywnego cache API.

## Zakres wdrożenia

- Daily digest dalej czyta dane z Supabase i dopina: zadania na dziś, wydarzenia na dziś, zaległe, leady bez akcji, sprawy bez akcji i szkice do sprawdzenia.
- Weekly report agreguje: nowe leady, przeniesione do spraw, wykonane zadania, zaległe, blokery spraw, szkice i następny tydzień.
- `digest_logs` zapisuje `report_type = daily | weekly`, `sent_for_date`, `status`, `error`, `summary_json`.
- PWA ma PNG 192/512, `display: standalone`, service worker i prompt instalacji z fallbackiem dla iOS.

## Nie zmieniono

- Nie dodano dużego dashboardu.
- Nie zmieniono flow lead → sprawa.
- Nie dodano Firestore.
- Nie zmieniono modelu płatności.

## Weryfikacja

- `npm run check:a28-digest-notifications-pwa`
- `npm run check:polish-mojibake`
- `npm run test:critical`
- `npm run build`


## Hotfix A28c

Skrypt wdrożeniowy nie patchuje już `api/system.ts`. `api/weekly-report.ts` działa jako osobny endpoint Vercel, a `vercel.json` dodaje cron na `/api/weekly-report`.
