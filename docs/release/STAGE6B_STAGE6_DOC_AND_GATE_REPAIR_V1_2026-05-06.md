# STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Naprawić proces po Stage6, bo oryginalny check wykrył brak dwóch fraz w dokumencie release, ale apply-script kontynuował build, commit i push.

## Naprawa

- Uzupełnia `docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md` o dokładne frazy wymagane przez guarda:
  - `Nie odpowiada z pustego prompta`
  - `Nie zmyśla przy pustym kontekście`
- Dodaje własny guard Stage6B.
- Dodaje test Stage6B.
- Apply-script używa twardego gate: każdy niezerowy exit code kończy proces przed buildem, commitem i pushem.
- STAGE6D_STAGE6B_GATE_PHRASE_ASCII_REPAIR_V1 dopisał dokładną frazę testową: `buildem, commitem i pushem`.

## Kryterium zakończenia

- `npm.cmd run check:stage6-ai-no-hallucination-data-truth-v1` przechodzi.
- `npm.cmd run test:stage6-ai-no-hallucination-data-truth-v1` przechodzi.
- `npm.cmd run check:stage6b-stage6-doc-and-gate-repair-v1` przechodzi.
- `npm.cmd run test:stage6b-stage6-doc-and-gate-repair-v1` przechodzi.
- `npm.cmd run build` przechodzi przed buildem, commitem i pushem.

## Gate

FAIL w checku blokuje commit/push. Nie ma dalszego wdrożenia po czerwonym checku. Kontrola działa przed buildem, commitem i pushem.
