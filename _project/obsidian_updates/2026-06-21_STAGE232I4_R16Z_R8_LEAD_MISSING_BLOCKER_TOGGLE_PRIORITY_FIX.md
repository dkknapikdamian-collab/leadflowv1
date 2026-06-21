# 2026-06-21 - STAGE232I4_R16Z_R8_LEAD_MISSING_BLOCKER_TOGGLE_PRIORITY_FIX

Zapis do Obsidiana

- date/time: 2026-06-21 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- project_id: closeflow_lead_app
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Wpis

Manual smoke R16Z_R5 wykazał błąd w LeadDetail: odznaczenie checkboxa Blokuje w managerze Braki/Blokady pokazywało komunikat sukcesu, ale po odświeżeniu / silent reload checkbox wracał jako zaznaczony. Przyczyna: LeadDetail zapisywał missing_item z priority high niezależnie od stanu blokady, a wspólny manager uznaje priority high za source truth blokady.

Naprawa R16Z_R8: LeadDetail zapisuje i przełącza status, priority, blocksProgress oraz payload razem. Odznaczenie Blokuje ustawia priority medium, zaznaczenie priority high.

## Testy

- guard R16Z_R8: do wykonania
- node test R16Z_R8: do wykonania
- R16Z_R5 close guard: do wykonania
- build: do wykonania
- verify:closeflow:quiet: do wykonania
- git diff --check: do wykonania
- owner smoke Lead toggle F5: do wykonania

## Ryzyka

Nie przechodzić do STAGE232K, dopóki Lead smoke nie potwierdzi:
- odznaczony Blokuje zostaje odznaczony po F5,
- ponowne zaznaczenie zostaje zaznaczone po F5,
- Uzupełnij/Usuń dalej działa.

## Status

PENDING_LOCAL_APPLY_AND_SMOKE.
