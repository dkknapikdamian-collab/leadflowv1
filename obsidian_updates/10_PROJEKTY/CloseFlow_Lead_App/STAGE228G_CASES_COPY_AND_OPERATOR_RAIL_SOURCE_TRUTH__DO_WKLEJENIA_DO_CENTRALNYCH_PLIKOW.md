# STAGE228G - Cases copy cleanup + operator rail source truth

Data: 2026-06-07 19:05 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Wpis do historii zmian
- /cases: usunięto opis typu „Brakuje wymaganych rzeczy od klienta...” i dopisek liczby działań z listy spraw.
- /cases: górne kafelki statystyk mają jawny marker jednego wiersza na desktopie.
- /cases: Operacyjne skróty przeniesione na shared SimpleFiltersCard.
- Operator rail: SimpleFiltersCard, TopValueRecordsCard i cases risk links używają wspólnego source truth koloru/tone.

## Testy
- node scripts/check-stage228g-cases-copy-and-operator-rail-source-truth.cjs
- npm run build
- git diff --check

## Ryzyka
- Kolory są mapowane po key/label. Przy niejednoznacznej nazwie item powinien dostać explicit tone.
- Shared CSS dotyka operator rail cards globalnie, więc ręcznie sprawdzić /cases, /leads, /clients.
