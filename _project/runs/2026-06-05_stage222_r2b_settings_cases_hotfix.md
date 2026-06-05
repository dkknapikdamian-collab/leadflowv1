# STAGE222 R2B - Settings/Cases hotfix after partial push

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: hotfix local-only, push po testach

## FAKTY

- Commit `7ff0bc08` został wypchnięty na `dev-rollout-freeze`.
- Przed commitem Stage222 guard/test były czerwone:
  - `Settings missing risk threshold section`
  - test nie znalazł tekstu `Progi ryzyka sprzedaży`.
- Build przeszedł.
- Push zakończył się sukcesem.
- Problem nie wymaga rollbacku, tylko domknięcia brakujących zmian Settings/Cases.

## PRZYCZYNA

Pierwszy combined command nie uruchomił apply scriptu poprawnie. PowerShell dostał ścieżkę do `.ps1` jako tekst, a nie przez operator `&`.
Efekt: część plików istniała, ale patch Settings/Cases nie został wykonany.

## ZAKRES HOTFIXA

- Dopiąć importy i stan owner risk settings w `src/pages/Settings.tsx`.
- Dodać sekcję `Progi ryzyka sprzedaży`.
- Dopiąć case badge w `src/pages/Cases.tsx`.
- Upewnić się, że package scripts są ustawione.
- Dopisać pamięć `_project` i Obsidian update.

## TESTY

```powershell
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
git diff --check
```

## RYZYKA

- R4 files mogły zostać lokalnie niecommitnięte po wcześniejszym etapie. Przed commitem trzeba zobaczyć `git status --short` i dodać selektywnie, jeśli chcemy domknąć też R4.

## NASTĘPNY KROK

Po zielonych testach commit:
`STAGE222 R2B owner risk settings cases hotfix`
