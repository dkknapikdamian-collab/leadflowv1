# CloseFlow / LeadFlow - Stage223R3-A Last Contact Intake

Data: 2026-06-05
Typ wpisu: etap wdrożeniowy / last contact intake
Status zapisu: przygotowano w ZIP

## Routing

- nazwa / alias wejściowy: CloseFlow / LeadFlow — Stage223R3-A Last Contact Intake
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- report_id: STAGE223R3_A_LAST_CONTACT_INTAKE
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

- Brakowało pola `Ostatni kontakt` w tworzeniu leadów i klientów.
- Brakowało payloadu `lastContactAt` przy tworzeniu leadów i klientów.
- `activity-truth.ts` i `next-move-contract.ts` istnieją po Stage223.
- R3A dodaje intake oraz SQL dla `last_contact_at`.

## DECYZJE

- Datę zapisujemy jako noon ISO.
- Data przyszła jest blokowana.
- SQL jest wymagany dla trwałego zapisu.
- Nie przenosimy automatycznie daty kontaktu do sprawy startowej.

## TESTY

```powershell
node scripts/check-stage223r3-last-contact-intake.cjs
node --test tests/stage223r3-last-contact-intake.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## AUDYT RYZYK

- Bez migracji Supabase zapis może zostać pominięty przez fallback.
- Fallback select chroni przed awarią list przed migracją.
- Po wdrożeniu ręcznie sprawdzić lead/klient z datą 20 dni temu.

## NASTĘPNY KROK

Uruchomić SQL, zastosować ZIP, test ręczny, push po akceptacji.
