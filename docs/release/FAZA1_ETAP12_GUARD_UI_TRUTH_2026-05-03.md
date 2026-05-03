# FAZA 1 - Etap 1.2 - Guard UI Truth

## Cel

ZablokowaÄ‡ powrĂłt faĹ‚szywych obietnic w UI, copy i publicznych tekstach produktu.

Ten etap nie dodaje nowej funkcji. Dodaje straĹĽnikĂłw, ktĂłrzy majÄ… zatrzymaÄ‡ build, jeĹ›li aplikacja znowu zacznie obiecywaÄ‡ rzeczy bez pokrycia.

## Zakres guardĂłw

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

Guardy majÄ… blokowaÄ‡ miÄ™dzy innymi:

- `SOC 2 certified`
- `SOC2 certified`
- `Google Calendar connected`
- `Google Calendar sync active`
- `AI saved`
- automatyczny finalny zapis przez AI bez potwierdzenia
- natywna aplikacja z App Store / Google Play
- digest jako dziaĹ‚ajÄ…cy bez konfiguracji mail providera
- `cancel anytime` jako miÄ™kka obietnica bez spiÄ™cia z realnym billingiem

## Wymagane statusy z Etapu 1.1

Etap 1.2 wymaga, ĹĽeby `src/lib/product-truth.ts` nadal zawieraĹ‚:

- Stripe / BLIK / subskrypcje: `requires_config`
- Poranny digest e-mail: `requires_config`
- Google Calendar: `coming_soon`
- Asystent AI: `beta`
- Admin AI: `internal_only`
- PWA / telefon: `active`

## Kryterium zakoĹ„czenia

Etap jest zakoĹ„czony, gdy przechodzÄ…:

- `npm run check:ui-truth`
- `npm run check:public-security-claims`
- `npm run check:integration-status-copy`
- `npm run check:faza1-etap12-guard-ui-truth`
- `npm run check:faza1-etap11-ui-copy-legal-truth`
- `npm run build`

## NastÄ™pny etap

Po tym etapie roadmapa bezpieczeĹ„stwa prowadzi do:

**FAZA 2 - Etap 2.1 - Workspace isolation i request scope**

Google Calendar Sync V1 jest sensownÄ… funkcjÄ… produktowÄ…, ale powinien wejĹ›Ä‡ jako osobny etap po zabezpieczeniu truth guardĂłw.
