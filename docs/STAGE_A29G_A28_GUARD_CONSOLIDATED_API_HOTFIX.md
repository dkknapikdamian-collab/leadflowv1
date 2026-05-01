# A29G - A28 guard accepts consolidated API

## Cel

Kontynuować A29F bez cofania zmian.

A29F konsoliduje endpointy `daily-digest`, `weekly-report` i `response-templates` przez `api/system.ts`, żeby nie tworzyć zbędnych osobnych funkcji Vercel.

Stary guard A28 nadal wymagał fizycznych plików:

- `api/daily-digest.ts`,
- `api/weekly-report.ts`.

To blokowało wdrożenie mimo poprawnego kierunku.

## Zmiana

`check:a28-digest-notifications-pwa` akceptuje teraz oba warianty:

1. starszy: osobny plik API facade,
2. nowszy: `vercel.json` rewrite do `api/system.ts` + handler w `api/system.ts`.

W aktualnej architekturze oczekiwany jest wariant 2.

## Nie zmieniono

- Nie cofnięto A26/A27/A28/A29.
- Nie przywrócono zbędnych endpointów Vercel.
- Nie zmieniono UI.
- Nie zmieniono Supabase schema.

## Kryterium

A29F może przejść z aktualnym `HEAD`, zachowując wszystkie etapy i poprawiając deploy shape pod Vercel.
