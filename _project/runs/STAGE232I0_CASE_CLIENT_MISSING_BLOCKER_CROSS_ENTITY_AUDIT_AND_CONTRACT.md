# STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT

- data i godzina: 2026-06-17 17:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- status: DO_APPLY_ZIP / AUDIT_CONTRACT_ONLY
- runtime: NIE
- SQL: NIE

## AUDYT PRZED ETAPEM

Przeczytano routing i źródła z listy STAGE232I0. Aktywny queue-sync wskazuje, że STAGE232D_R1 jest zamknięty, a następnym etapem jest STAGE232I0.

## FAKTY Z KODU

- ContextActionDialogs wspiera recordType lead/client/case.
- Case path używa insertCaseItemToSupabase + activity item_added.
- Lead/client path używa insertTaskToSupabase + activity missing_item_created.
- Missing modal contract ma persistence target: case -> case_items, lead/client -> task_activity_missing_item.

## DECYZJA

STAGE232I0 nie wdraża runtime. Zamraża kontrakt i mapę źródeł, żeby STAGE232I1/I2/I3 nie były chaotycznym kopiuj-wklej z leada.

## AUDYT PO ETAPIE

Ryzyka: case_items jako drugie źródło prawdy; ClientDetail bez badge źródła; Owner Control przed stabilizacją I1/I2.
