# STAGE231D0B — Client List Card Visual Freeze run report

Data: 2026-06-10 Europe/Warsaw
Status: SUPERSEDED_BY_R8_MASS_ENCODING_RESCUE

## Problem

Pierwsza paczka STAGE231D0B została wypchnięta mimo FAIL guardu. W efekcie do branch dev-rollout-freeze trafiły uszkodzone polskie znaki w widocznym UI i w guardzie.

## Corrective action

Nie zamykać tego run reportu jako PASS. Finalny dowód naprawy jest w STAGE231D0B-R8.

## Expected UI after repair

- Brak Leady:
- Brak Aktywna sprawa
- Jest Sprawy:
- Jest Aktywna prowizja
- Jest Zarobione łącznie
- Najbliższa akcja w kafelku jest renderowana jako czysty nearestActionLabel.
