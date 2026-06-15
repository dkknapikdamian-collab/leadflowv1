# Obsidian payload - STAGE232B Today Owner Control Tile Source of Truth R5

Data: 2026-06-15 21:45 Europe/Warsaw
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Typ wpisu

Etap wdrozeniowy / poprawka zrodla prawdy kafelkow zakladki Dzis.

## Co zostalo wdrozone technicznie

- Kafelek Co masz zrobic dzisiaj zostal przepiety na prawdziwy kontrakt Wymaga ruchu.
- Lista/kafelek uzywa jawnej kolekcji ctionRequiredRows.
- R6: usunieto z UI odrzucony dopisek techniczny spod kafelka `Wymaga ruchu`; nie wymagac go w testach recznych.
- Najblizsze 7 dni rozdziela full count od preview top 10.
- UI pokazuje pokazano 10 z X, gdy lista jest przycieta.
- Etykieta zadan jest dynamiczna: Zadania dzis i zalegle, Zalegle zadania, Zadania dzis albo Zadania do obslugi.
- Legacy src/pages/Today.tsx nie jest aktywnym UI; aktywna trasa idzie przez src/pages/TodayStable.tsx.

## Status testow technicznych

- Dedicated guard: PASS
- Dedicated node test: PASS
-
pm run build: PASS
-
pm run verify:closeflow:quiet: SKIP_UNRELATED/DO_ANALIZY, bo blokuje stary guard CaseDetail niezwiÄ…zany z /today.
- git diff --check: R4 wykryl trailing whitespace w dokumentach; R5 usuwa whitespace i wymaga ponownego PASS.

## Status produktu

Do sprawdzenia przez Damiana w aplikacji na /today.

Manualny test:
1. Otworz /today.
2. Sprawdz, czy kafelek ma nazwe Wymaga ruchu, a nie Co masz zrobic dzisiaj.
3. Sprawdz, czy pod kafelkiem jest helper wyjasniajacy, ze to nie jest kalendarz.
4. Sprawdz, czy Najblizsze 7 dni pokazuje pelny licznik i przy preview tekst pokazano 10 z X, jesli jest wiecej niz 10 rekordow.
5. Sprawdz, czy zadania nie obiecuja tylko dzis, jezeli obejmuja zalegle.

## Wpis do 04_KIERUNEK_DO_WDROZENIA / 04_ETAPY

STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH:
Status: WDROZONE_TECHNICZNIE_DO_SPRAWDZENIA / TEST_RECZNY_DAMIANA.
Nie zamykac jako PRODUCT_PASS bez potwierdzenia Damiana.

## Ryzyka po etapie

- Wymaga ruchu moze nadal miec wysoki licznik, ale teraz jest to zgodne z kontraktem produktu.
- erify:closeflow:quiet nadal ma niezwiÄ…zany problem CaseDetail do osobnego etapu, nie do mieszania z STAGE232B.
- Po akceptacji manualnej trzeba ewentualnie uporzadkowac stary guard CaseDetail jako osobny stage.
