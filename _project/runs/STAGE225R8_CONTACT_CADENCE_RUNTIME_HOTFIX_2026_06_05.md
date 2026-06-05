# STAGE225R8 Contact Cadence Runtime Hotfix

Data: 2026-06-05 18:55 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY
- R7 został zablokowany przez walidację helpera: pozostał token ASCII `Minal`.
- R8 przywraca pliki Stage225 z HEAD przed patchowaniem, żeby usunąć częściowe lokalne skutki R7.
- R8 naprawia kolejność memo w `src/pages/Leads.tsx`: `relatedRecordsByLeadId` -> `contactCadenceGrid` -> `filteredLeads`.
- R8 naprawia mapowanie `relatedRecordsById: relatedRecordsByLeadId`.
- R8 naprawia regex liczbowy w helperze: `replace(/\s+/g, '')`.
- R8 przywraca normalne polskie etykiety w helperze.
- R8 wzmacnia guard Stage225 o TDZ, mapowanie, regex i ASCII-copy.

## TESTY DO WYKONANIA
```powershell
node scripts/check-stage225-contact-cadence-grid.cjs
node --test tests/stage225-contact-cadence-grid.test.cjs
node --test tests/stage223r3-last-contact-intake.test.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short
```

## AUDYT RYZYK
- Ryzyko TDZ w `/leads` powinno być zamknięte przez kolejność memo i guard.
- Ryzyko niezdefiniowanego `relatedRecordsById` powinno być zamknięte przez jawne mapowanie i guard.
- Ryzyko ponownego mojibake ograniczone przez guard bez literalnych tokenów mojibake.
- Nie ruszano Lost Lead Rescue UI, Today jako dużego panelu, Supabase ani Owner Digest.
