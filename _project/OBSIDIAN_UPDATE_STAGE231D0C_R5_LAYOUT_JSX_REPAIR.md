# STAGE231D0C-R5 - Layout JSX repair

- data i godzina: 2026-06-10 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: hotfix build po STAGE231D0C-R4
- decyzja: marker trial top-card ma być na kontenerze access warning, nie na zamykającym tagu p.
- testy: D0B guard, D0C guard, D0C-R4 guard, git diff --check, build.
- audyt ryzyk: guard R4 przeszedł przed buildem mimo uszkodzonego JSX; R5 dodaje defensywną kontrolę na closing p tag z className.
- następny krok: sprawdzić /clients screenshot i dopiero push.
