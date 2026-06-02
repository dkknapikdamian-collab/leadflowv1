# STAGE216M_R6_R3_CLIENT_DATA_CARD_VISUAL_LOCK_20260601

## FAKTY
- Pracujemy nad CloseFlow / LeadFlow.
- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Damian wskazał, że po R6-R2 przycisk `Edytuj dane` nadal jest biały i karta `Dane klienta` nadal nie wygląda jak `Dane leada`.

## DECYZJE DAMIANA
- Odkładamy prawą stronę.
- Teraz poprawiamy tylko kartę `Dane klienta`.
- Przycisk `Edytuj dane` ma być niebieski.
- Karta ma mieć szerokość/wysokość/rytm jak karta `Dane leada`.

## HIPOTEZY AI
- Problem wynika z kolizji starszych stylów i zbyt słabego targetowania przycisku.
- Wystarczy CSS-only hard lock, bo TSX ma już marker `data-stage216m-r6-client-data-edit-action`.

## TESTY
- `node tests/stage216m-r6-r3-client-data-card-visual-lock-contract.test.cjs`
- `git diff --check`
- `npm run build`

## NASTĘPNY KROK
Apply, selektywny commit/push, screenshot po deployu.
