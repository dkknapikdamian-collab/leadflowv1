# STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH

Status: PUSHED / NEEDS_LOCAL_VERIFICATION

## Zakres

- Zmieniono `/today` w `src/pages/TodayStable.tsx`.
- Zrodlo prawdy sekcji Today: `todaySectionCards` -> `visibleSectionCards` -> jeden grid `data-stage232t-r1c-today-section-grid="true"`.
- `Najblizsze 7 dni` jest zwykla karta w tym samym gridzie, bez osobnego full-width wrappera.
- Usunieto widoczne techniczne copy zaczynajace sie od `Ruch:`.
- Task/event nadal renderuja sie przez `WorkItemCard`.
- Widok/visibility nadal korzysta z `closeflow:today:view-sections:v1`.
- Odświeżanie nadal uzywa `manualRefreshing` i `refreshData({ manual: true, force: true, reason: 'manual' })`.
- Scoped CSS R1C jest w `src/styles/closeflow-canvas-runtime-source-truth-stage211j.css`.
- CF-RUNTIME-00 allowlista zostala rozszerzona o deliverables R1C, zeby wymagany guard znal biezacy zakres.

## Co w opisie etapu bylo niespojne z kodem

- Opis zakladal, ze R1B CSS moze wystarczac. Realny kod nadal mial trzy sprzeczne zrodla layoutu: pierwsza grupa `xl:grid-cols-3`, druga grupa `xl:grid-cols-2` i osobny wrapper dla `upcoming`.
- R1B CSS probowal ograniczac osobny direct-child `div`, ale prawdziwa przyczyna fosy byla w strukturze JSX, nie w samej regule CSS.

## Wybrane rozwiazanie

- Wybralem jedna tablice sekcji i jeden grid w aktywnym komponencie `TodayStable.tsx`.
- CSS zostal uproszczony do kontraktu nowego gridu R1C: desktop 3 kolumny, tablet 2, mobile 1.
- Nie dodalem nowego komponentu ani drugiego helpera layoutu.

## Dlaczego to lepsze

- Jedna mapa sekcji usuwa rozjazd miedzy grupami layoutu.
- Widok i kafle bazuja na tych samych kluczach `TodaySectionKey`.
- Upcoming nie wymaga specjalnego CSS ani max-width obejscia.
- Zmiana jest ograniczona do `/today` i scoped CSS pod `data-p0-today-stable-rebuild="true"`.

## Pliki dotkniete

- `src/pages/TodayStable.tsx`
- `src/styles/closeflow-canvas-runtime-source-truth-stage211j.css`
- `scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs`
- `tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs`
- `scripts/check-cf-runtime-00-source-truth.cjs`
- `_project/runs/STAGE232T_R1C_TODAY_PRODUCTION_UI_CLEANUP_AND_SOURCE_TRUTH.md`

## Czego nie dotknieto

- Obsidian
- SQL / RLS / migracje
- billing
- finance / commission
- Calendar runtime
- LeadDetail
- ClientDetail
- CaseDetail
- globalny layout aplikacji poza scoped Today CSS

## Testy

- guard R1C: PASS (`node scripts/check-stage232t-r1c-today-production-ui-cleanup-and-source-truth.cjs`)
- node test R1C: PASS (`node --test tests/stage232t-r1c-today-production-ui-cleanup-and-source-truth.test.cjs`)
- CF-RUNTIME-00: PASS (`node scripts/check-cf-runtime-00-source-truth.cjs`)
- build: PASS (`npm run build`)
- verify quiet: PASS (`npm run verify:closeflow:quiet`)
- diff-check: PASS (`git diff --check`)

## Manual smoke

MANUAL_UI_NOT_EXECUTED

Do sprawdzenia lokalnie przez Damiana:

- Odśwież pokazuje stan odświeżania i aktualizuje ostatni odczyt.
- Widok chowa kafel i cala karte/listę sekcji.
- Klik kafla otwiera wlasciwa sekcje bez fosy.
- Otworz prowadzi do wlasciwego zrodla.
- Zrobione jest widoczne tylko dla task/event z realna akcja.
- Kosz usuwa/archiwizuje tylko tam, gdzie istnieje handler.

## Ryzyko

- Pozostaje ryzyko wizualne wymagajace klikowego smoke na realnych danych `/today`.
- Nie zmienialem backendu akcji, wiec testy statyczne/build potwierdzaja kontrakt UI, ale nie potwierdzaja produkcyjnych rekordow Damiana po kliknieciu.

## Jak sprawdzono

- Statyczny guard R1C sprawdzil marker, jedno zrodlo sekcji, brak `Ruch:`, brak osobnego upcoming wrappera, grid 3/2/1, refresh, visibility storage oraz brak zmian SQL/finance/calendar.
- Node test R1C sprawdzil te same krytyczne regresje jako test runner.
- CF-RUNTIME-00 potwierdzil scope source truth po aktualizacji allowlisty.
- Build i quiet verify przeszly.
