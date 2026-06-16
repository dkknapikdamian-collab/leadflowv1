---
typ: obsidian_update_payload
status: committed_to_repo
scope: CloseFlow / LeadFlow
stage: STAGE232D + STAGE232I
data_i_godzina: 2026-06-16 Europe/Warsaw
commit_note: f97a6377932c766a90164bae461795cf2cc30ed4
---

# STAGE232D + STAGE232I - payload do Obsidiana

## Co zapisano

Utworzono plik:

```txt
10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md
```

## STAGE232D - Cisza / Kontakt wykonany

Zapisano kontrakt:

- `Kontakt wykonany` resetuje ciszę kontaktową od daty kliknięcia.
- Zwykła notatka nie resetuje ciszy kontaktowej.
- Follow-up przyszły jest następnym ruchem, nie kontaktem.
- Wydarzenie/spotkanie resetuje ciszę tylko po wykonaniu i tylko dla encji, do której jest jawnie przypięte.
- Wydarzenie ogólne albo spotkanie z innym leadem/klientem nie wpływa na aktualnego leada.

## STAGE232I - Braki/Blokady w sprawie i kartotece klienta

Zapisano plan:

- system `Brak / Blokada` z leada ma zostać wdrożony w CaseDetail i ClientDetail,
- nie wolno ślepo kopiować leadowego `blockScope`, bo sprawa i klient mają inne funkcje,
- case obecnie ma inną ścieżkę zapisu przez `case_items`, więc wymagany jest etap audytu I0,
- rekomendacja: źródło prawdy dla aktywnych braków to work item/task `missing_item` z `leadId/clientId/caseId`, a historia jest tylko dziennikiem,
- klient ma agregować braki własne, z leadów i ze spraw z badge źródła.

## Etapy do wdrożenia

```txt
STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX
STAGE232I0_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT
STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME
STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_RUNTIME
STAGE232I3_CROSS_ENTITY_OWNER_CONTROL_INTEGRATION
```

## Status

Docs/source-of-truth note committed to repo. Runtime not implemented yet.
