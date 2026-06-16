---
typ: obsidian_update_payload
status: prepared
scope: CloseFlow / LeadFlow
stage: STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16
---

# STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16

## Decyzja

Nowe etapy CloseFlow nie moga zostawac tylko w czacie, payloadzie, run reportcie ani pojedynczym pliku `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE*.md`.

## Poprawne miejsce

Etapy maja byc wpisywane do obszaru `04`, przede wszystkim:

```txt
_project/04_ETAPY_ROZWOJU_APLIKACJI.md
_project/04_STAGE_QUEUE_PLACEMENT_SYNC_2026_06_16.md
_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md
10_PROJEKTY/CloseFlow_Lead_App/04_*.md jako dashboard note
```

## Aktualny sync

Dodano regule placementu i rekomendowana kolejnosc:

1. STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX
2. STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX
3. STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT
4. STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH
5. STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH
6. STAGE231H_R1D2_CASE_DETAIL_NOTE_DICTATION_RESTORE_RUNTIME

## Uwaga

Ze wzgledu na rozmiar i historie starego pliku `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`, nie przepisywac go recznie bez bezpiecznego lokalnego patcha. Najblizszy ZIP runtime ma zrobic safe mirror do glownego pliku albo zostawic jawny raport, jesli patch bylby ryzykowny.
