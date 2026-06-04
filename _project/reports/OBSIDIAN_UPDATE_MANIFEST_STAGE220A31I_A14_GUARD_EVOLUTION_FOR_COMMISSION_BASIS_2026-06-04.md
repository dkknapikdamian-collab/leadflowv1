# OBSIDIAN UPDATE MANIFEST - STAGE220A31I

- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- type: guard hotfix / finance product decision
- target note: CloseFlow project history / active decisions

## Do zapisania
STAGE220A31I aktualizuje guard A14, żeby nie blokował nowego modelu finansów sprawy po A31. Nowy model rozdziela wartość transakcji od prowizji należnej: przykład 100 000 PLN × 3% = 3 000 PLN prowizji. Build ma przejść po uruchomieniu guardów A14, A31, A31I i `npm run build`.
