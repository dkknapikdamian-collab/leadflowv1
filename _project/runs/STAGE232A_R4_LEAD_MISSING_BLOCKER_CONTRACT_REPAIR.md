# STAGE232A_R4_LEAD_MISSING_BLOCKER_CONTRACT_REPAIR

Data: 2026-06-15 23:35 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA

## Zakres
- Naprawiono po nieudanych R1/R2/R3 klasę kruchych patchy i częściowych zmian.
- Kontrakt Brak/Blokada ma missingKind, blocksProgress i blockScope.
- Modal Brak ma typ braku, checkbox blokady i pole co blokuje.
- ContextActionDialogs zapisuje metadata do payloadu historii i lokalnego no-flicker recordu.
- Guard blokuje duplikat <input> z R3.

## Testy
- node scripts/check-stage232a-lead-missing-blocker-contract.cjs
- node --test tests/stage232a-lead-missing-blocker-contract.test.cjs
- npm run build

## Ryzyka
- Bez testu hard refresh nie wiadomo, czy metadata taska utrwala API, czy tylko payload historii.
- verify:closeflow:quiet moze dalej padac na stary CaseDetail guard.
