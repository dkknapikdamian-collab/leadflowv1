# STAGE223 R2AE - Quiet gate contract repair after R2AD

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

R2AD V4 zaaplikował się lokalnie:

- lokalny audyt TodayStable: OK,
- patch Today no-scroll trap: OK,
- R2AD guard: OK,
- Stage223 final guard: OK,
- Stage223 final runtime test: OK,
- build: OK.

Bloker pojawił się dopiero przy `verify:closeflow:quiet`.

Błąd:

```text
FAILED: case detail no partial loading
verify:closeflow:quiet musi zachować kontrakt quiet gate
```

Przyczyna: R2AD V4 dopisał w `package.json` dodatkowe `&& node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs` do `verify:closeflow:quiet`, a stary test wymaga dokładnie:

```text
node scripts/closeflow-release-check-quiet.cjs
```

## ZAKRES

R2AE:

- przywraca w `package.json` exact script:
  `verify:closeflow:quiet = node scripts/closeflow-release-check-quiet.cjs`,
- dopina R2AD guard wewnątrz `scripts/closeflow-release-check-quiet.cjs`,
- dodaje guard:
  `scripts/check-stage223-r2ae-quiet-gate-contract-repair.cjs`,
- nie zmienia runtime Today.

## TESTY

```powershell
node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
node scripts/check-stage223-r2ae-quiet-gate-contract-repair.cjs
node --test tests/closeflow-release-gate-quiet.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TEST RĘCZNY PO R2AE

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
npm run dev
```

Otwórz `/today` i kliknij wszystkie górne kafelki.

## AUDYT RYZYK

- To naprawa kontraktu testowego po R2AD, nie nowa funkcja.
- Guard Today ma być częścią quiet gate, ale nie przez zmianę package scriptu.
