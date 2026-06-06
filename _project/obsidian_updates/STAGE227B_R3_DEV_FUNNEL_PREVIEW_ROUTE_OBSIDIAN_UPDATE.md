# STAGE227B R3 — dev-only funnel preview route

Data: 2026-06-06 16:10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Powód

Damian nie może ocenić `/funnel` lokalnie, bo standardowa trasa jest chroniona logowaniem i przekierowuje na ekran loginu.

## Decyzja

Dodać lokalną trasę developerską `/dev/funnel`, która w `import.meta.env.DEV` renderuje `SalesFunnel` bez logowania. Poza dev przekierowuje do `/login`. Nie dodawać tej trasy do sidebaru.

## Testy

- `node scripts/check-stage227b-dev-funnel-preview-route.cjs`
- `node scripts/check-stage227b-sales-funnel-decision-list.cjs`
- `node --test tests/stage227b-sales-funnel-decision-list.test.cjs`
- `npm run build`
- `git diff --check`

## Ryzyka

- Dev route nie może stać się publiczną produkcyjną furtką.
- Nie może trafić do menu produkcyjnego.
- To jest tylko narzędzie do lokalnej oceny UX, nie docelowy feature.
