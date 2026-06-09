# CloseFlow / LeadFlow - STAGE230C R10 quick capture visual source truth

Data: 2026-06-09 Europe/Warsaw
Status: DO_APPLY_LOCAL_ONLY_AND_TEST
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App

## FAKTY
- Dublowanie dyktowania nie powtarza się na innym telefonie, więc nie traktujemy go jako błąd aplikacji.
- Nadal istnieje problem wizualny: biały tekst na białym tle oraz nieczytelne przyciski w szybkim szkicu.
- Źródło prawdy wizualnej dla formularzy to obecnie lead-form-vnext / visual-stage20-lead-form-vnext.css.

## DECYZJE
- R10 poprawia tylko wizualny kontrast i spójność z formularzami dodawania leada/klienta.
- Nie robimy deduplikacji ani zmian logiki zapisu.
- Quick capture ma być podpięty pod source truth formularzy, nie mieć osobnego przypadkowego stylu.

## TESTY
- Guardy Stage230B/Stage230C/R10
- Build
- git diff --check
- Manual QA telefonu: tekst, placeholder, przyciski, disabled state

## RYZYKA
- Docelowo warto wydzielić centralne tokeny formularzy, bo obecnie source truth siedzi w CSS stage20.
