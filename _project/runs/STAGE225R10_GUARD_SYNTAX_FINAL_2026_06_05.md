# STAGE225R10 — Guard Syntax Final Hotfix

Data: 2026-06-05 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY
- R8 naprawil runtime/order w `Leads.tsx` i helper `contact-cadence-grid.ts`.
- `npm run build` i `npm run verify:closeflow:quiet` przeszly po R8.
- Dedykowany guard `scripts/check-stage225-contact-cadence-grid.cjs` nadal mial blad skladni po R8.
- R10 wymienia tylko guard Stage225 i dopisuje dokumentacje hotfixa.

## ZAKRES R10
- Naprawa skladni guarda Stage225.
- Dodanie `node --check scripts/check-stage225-contact-cadence-grid.cjs` jako obowiazkowego smoke testu.
- Brak zmian w UI, helperze, Supabase i Today.

## TESTY DO WYKONANIA
```powershell
node --check scripts/check-stage225-contact-cadence-grid.cjs
node scripts/check-stage225-contact-cadence-grid.cjs
node --test tests/stage225-contact-cadence-grid.test.cjs
node --test tests/stage223r3-last-contact-intake.test.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short
```

## AUDYT RYZYK PO ETAPIE
- Ryzyko glowne: guard mogl byc martwy mimo zielonego release gate.
- R10 ma wykryc syntax error przez `node --check` przed commitem.
- Nie wolno przechodzic dalej, jesli dedykowany guard Stage225 nie przechodzi.
- `_LOCAL_CHECKS/` zostaje lokalnym backupiem i nie moze trafic do commita.

## CZEGO NIE RUSZANO
- UI `/leads` i `/clients`.
- Helper `contact-cadence-grid.ts`.
- Lost Lead Rescue.
- Finance Watchlist.
- Owner Digest.
- Supabase / migracje.
