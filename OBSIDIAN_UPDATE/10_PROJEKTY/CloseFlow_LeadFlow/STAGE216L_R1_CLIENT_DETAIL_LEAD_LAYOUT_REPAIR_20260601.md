# CloseFlow / LeadFlow - STAGE216L-R1 ClientDetail layout repair

typ: obsidian_update
status: przygotowano_zip
projekt: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## FAKTY

Stage216L pierwotnie nie uruchomił się, bo aplikujący skrypt PowerShell miał błąd parsera. R1 naprawia paczkę: PowerShell działa jako wrapper, a modyfikacje TSX wykonuje Node patcher.

## DECYZJE DAMIANA

- Notatki klienta mają być w centrum pracy, jak przy leadzie.
- Kafle klienta schodzą z góry strony do głównej kolumny.
- Awatar/inicjały klienta usuwamy.
- Nazewnictwo, ikonki i kolory będą osobnym etapem Stage216M.

## HIPOTEZY AI

ClientDetail powinien używać rytmu LeadDetail: lewa szyna danych, środek pracy, prawa szyna akcji/decyzji. Logika klienta nie może być skopiowana 1:1 z leada, bo klient agreguje sprawy, historię i finanse.

## TESTY

- `node tests/stage216l-client-detail-lead-layout-cumulative-contract.test.cjs`
- `git diff --check`
- `npm run build`

## RYZYKA

- CSS może wymagać drobnego polerowania po realnym screenshocie.
- Notatki klienta po przeniesieniu do centrum muszą pozostać edytowalne, usuwalne, przypinane i podglądane.

## NASTĘPNY KROK

Wdrożyć Stage216L-R1 lokalnie, wkleić wynik PowerShell i screenshot ClientDetail po zmianie. Potem przejść do Stage216M: wspólny słownik nazw, ikonek i kolorów dla kartoteki leada/klienta/sprawy.
