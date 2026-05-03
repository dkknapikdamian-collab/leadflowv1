# FAZA 1 - Etap 1.2 - Guard UI Truth

## Cel

Zablokować powrót fałszywych obietnic w UI, copy i publicznych tekstach produktu.

Ten etap nie dodaje nowej funkcji. Dodaje strażników, którzy mają zatrzymać build, jeśli aplikacja znowu zacznie obiecywać rzeczy bez pokrycia.

## Zakres guardów

Dodane skrypty:

- `scripts/check-ui-truth-claims.cjs`
- `scripts/check-public-security-claims.cjs`
- `scripts/check-integration-status-copy.cjs`
- `scripts/check-faza1-etap12-guard-ui-truth.cjs`

Dodane komendy:

- `npm run check:ui-truth`
- `npm run check:public-security-claims`
- `npm run check:integration-status-copy`
- `npm run check:faza1-etap12-guard-ui-truth`

## Blokowane claimy

Guardy mają blokować między innymi:

- `SOC 2 certified`
- `SOC2 certified`
- `Google Calendar connected`
- `Google Calendar sync active`
- `AI saved`
- automatyczny finalny zapis przez AI bez potwierdzenia
- natywna aplikacja z App Store / Google Play
- digest jako działający bez konfiguracji mail providera
- `cancel anytime` jako miękka obietnica bez spięcia z realnym billingiem

## Wymagane statusy z Etapu 1.1

Etap 1.2 wymaga, żeby `src/lib/product-truth.ts` nadal zawierał:

- Stripe / BLIK / subskrypcje: `requires_config`
- Poranny digest e-mail: `requires_config`
- Google Calendar: `coming_soon`
- Asystent AI: `beta`
- Admin AI: `internal_only`
- PWA / telefon: `active`

## Kryterium zakończenia

Etap jest zakończony, gdy przechodzą:

- `npm run check:ui-truth`
- `npm run check:public-security-claims`
- `npm run check:integration-status-copy`
- `npm run check:faza1-etap12-guard-ui-truth`
- `npm run check:faza1-etap11-ui-copy-legal-truth`
- `npm run build`

## Następny etap

Po tym etapie roadmapa bezpieczeństwa prowadzi do:

**FAZA 2 - Etap 2.1 - Workspace isolation i request scope**

Google Calendar Sync V1 jest sensowną funkcją produktową, ale powinien wejść jako osobny etap po zabezpieczeniu truth guardów.
