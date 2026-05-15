# STATUS PROJEKTU - CloseFlow lead app

Ostatnia aktualizacja pamięci: 2026-05-15 19:40 Europe/Warsaw

## Repo

- GitHub: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Lokalnie: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

## Status tej aktualizacji

To jest aktualizacja pamięci projektu, nie etap funkcjonalny aplikacji.

Zakres:
- `AGENTS.md`,
- `_project/`,
- Obsidian `10_PROJEKTY/CloseFlow_Lead_App`,
- guard `scripts/check-project-memory.cjs`,
- raport AI.

Poza zakresem:
- UI,
- routing,
- logika produktu,
- komponenty,
- API,
- style,
- refaktor.

## Obecny opis projektu

CloseFlow / Lead app to aplikacja operacyjna do leadów, klientów, spraw, zadań, kalendarza, follow-upów, szkiców AI i codziennego pilnowania ruchu.

Nie jest zwykłym CRM-em. Ma pokazywać użytkownikowi, co wymaga działania, czego nie wolno przegapić i które leady lub sprawy mogą uciec.

## Stan do weryfikacji w aktualnym repo

AI developer musi zweryfikować:
- aktualny branch,
- aktualny package.json,
- dostępne skrypty testowe,
- aktualne pliki `_project/`,
- czy istnieje `scripts/check-project-memory.cjs`,
- czy `npm run check:project-memory` istnieje,
- czy `npm run verify:closeflow:quiet` przechodzi,
- które moduły są realnie wdrożone, a które tylko opisane w dokumentach.

## Ryzyka

- Konflikt trial: starsze ustalenia 7 dni vs dokument planów 21 dni.
- Legacy `next step` vs aktualna decyzja `Najbliższa zaplanowana akcja`.
- Ryzyko, że część publicznego copy lub starych dokumentów nie odpowiada aktualnemu repo.
- Ryzyko, że AI / billing / integracje są częściowe i wymagają testów.

## Najbliższy krok

Utrwalić pełny mózg projektu w repo i Obsidianie, uruchomić guardy, zapisać raport AI i dopiero potem wrócić do kolejnych etapów napraw UI / działania aplikacji.
