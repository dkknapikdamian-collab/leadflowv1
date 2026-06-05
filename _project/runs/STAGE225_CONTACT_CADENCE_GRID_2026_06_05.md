# STAGE225 - Contact Cadence Grid - raport wdroĹĽenia lokalnego

## Routing
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Scan-first
Przed paczkÄ… sprawdzono zdalnie przez GitHub connector:
- package.json
- src/lib/owner-control/activity-truth.ts
- src/lib/owner-control/owner-risk-rules.ts
- src/pages/Leads.tsx
- src/pages/Clients.tsx

Nie mam bezpoĹ›redniego dostÄ™pu do lokalnego Obsidiana w tej rozmowie, wiÄ™c przygotowano wpisy w _project/obsidian_updates.

## FAKTY Z KODU
- activity-truth.ts ma buildActivityTruth i contactSilentDays.
- owner-risk-rules.ts ma SALES_SILENCE_THRESHOLDS_DAYS = [1, 2, 3, 5, 7, 14].
- Leads.tsx i Clients.tsx majÄ… lastContactAt po R3A/R3B.
- Klienci mieli sĹ‚absze filtrowanie ciszy niĹĽ leady.

## DECYZJE DAMIANA
- Siatka kontaktu ma byÄ‡ narzÄ™dziem pracy, nie spamem powiadomieĹ„.
- Nie robimy duĹĽego panelu Today.
- Lead/klient z lastContactAt 20 dni temu ma trafiaÄ‡ do 14+ dni ciszy.
- Stage225 przygotowuje Lost Lead Rescue, ale jeszcze go nie buduje.

## ZAKRES WDROĹ»ENIA
- Dodano src/lib/owner-control/contact-cadence-grid.ts.
- Dodano filtr Siatka kontaktu w /leads.
- Dodano filtr Siatka kontaktu w /clients.
- Dodano rescueCandidate i rescueReason w helperze.
- Dodano guard scripts/check-stage225-contact-cadence-grid.cjs.
- Dodano test tests/stage225-contact-cadence-grid.test.cjs.
- Dodano skrypty npm dla Stage225.

## CZEGO NIE RUSZANO
- Nie dodano /contact-cadence.
- Nie dodano Lost Lead Rescue UI.
- Nie przebudowano Today.
- Nie dodano migracji Supabase.
- Nie dodano email/SMS/AI scoringu.

## TESTY DO WYKONANIA
`powershell
node scripts/check-stage225-contact-cadence-grid.cjs
node --test tests/stage225-contact-cadence-grid.test.cjs
node --test tests/stage223r3-last-contact-intake.test.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short
`

## AUDYT RYZYK PO ETAPIE
- Ryzyko: UI /leads i /clients moĹĽe byÄ‡ gÄ™ste. Mitigacja: siatka jest kompaktowym filtrem, nie badge przy kaĹĽdym rekordzie.
- Ryzyko: rozjazd liczenia ciszy. Mitigacja: helper uĹĽywa buildActivityTruth i importuje progi z owner-risk-rules.
- Ryzyko: stare rekordy bez lastContactAt. Mitigacja: bucket unknown.
- Ryzyko: clients majÄ… mniej kontekstu niĹĽ leads. Mitigacja: filtr klienta dziaĹ‚a na lastContactAt; peĹ‚niejsze rescue z relacjami moĹĽna dopiÄ…Ä‡ w Lost Lead Rescue.
- Ryzyko: verify:closeflow:quiet moĹĽe wywaliÄ‡ stary kontrakt spoza Stage225. W raporcie trzeba oddzieliÄ‡ bĹ‚Ä…d regresyjny od zakresu tego etapu.

## NEXT STEP
Stage226 Lost Lead Rescue â€” dopiero po rÄ™cznym potwierdzeniu, ĹĽe siatka kontaktu dziaĹ‚a i UI nie jest za ciÄ™ĹĽkie.