# OBSIDIAN UPDATE - STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
Status: DO SYNCHRONIZACJI DO OBSIDIANA

## Decyzja / kierunek

Zakładka `Dziś` ma być prawdziwym centrum decyzji operacyjnej właściciela, a nie workiem rekordów.

Każdy kafelek musi mieć:

- jawny selektor danych,
- licznik zgodny z sekcją,
- nazwę zgodną z tym, co faktycznie liczy,
- jasne rozróżnienie: dzisiaj / zaległe / wymaga ruchu / najbliższe 7 dni / szkice.

## Najważniejszy problem

Kafelek `Co masz zrobić dzisiaj` w aktywnym `TodayStable` liczy pełne `ownerControlBaseline.items.length`.

To oznacza, że może pokazać np. 129 wpisów, bo nie jest to wyłącznie kalendarz dnia, tylko pełna lista Owner Control: leady, sprawy, zadania i wydarzenia wymagające ruchu.

## Rekomendacja produktowa

Nie zawężać tej listy na siłę tylko do dnia, bo produkt ma pokazywać też brak next stepu, ciszę, zaległości i tematy bez bezpiecznego ruchu.

Lepszy kierunek R1:

```txt
Zmienić nazwę `Co masz zrobić dzisiaj` na `Wymaga ruchu` albo `Do obsługi`.
```

Dodać helper:

```txt
To nie jest kalendarz. To lista tematów, które wymagają decyzji/ruchu.
```

## Etap zapisany w repo

Centralna kolejka etapów:

```txt
_project/04_ETAPY_ROZWOJU_APLIKACJI.md
```

Run report / audyt:

```txt
_project/runs/STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH.md
```

Kierunek produktu:

```txt
_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md
```

## Kontrakt kafelków

1. `Leady bez najbliższej akcji`
   - Źródło: Owner Control tylko leady z sygnałem `Brak następnego kroku`.

2. `Wysoka wartość / ryzyko`
   - Źródło: Owner Control z wysoką wartością oraz realnym ryzykiem/ruchiem.

3. `Leady czekające`
   - Źródło: realna cisza/contact truth >= próg warningDays.

4. `Wymaga ruchu` / `Do obsługi`
   - Źródło: pełny Owner Control backlog.
   - Nie nazywać tego `Co masz zrobić dzisiaj`, jeśli liczy pełne `ownerControlBaseline.items`.

5. `Zadania do obsługi`
   - Źródło: otwarte taski z datą `<= dzisiaj`.
   - Ma odróżniać zaległe od dzisiejszych.

6. `Wydarzenia dziś`
   - Źródło: otwarte eventy z datą `== dzisiaj`.

7. `Najbliższe 7 dni`
   - Źródło: przyszłe tasks/events/leads w zakresie 7 dni.
   - Jeśli lista jest ucięta do top 10, UI musi mówić `pokazano 10 z X`.

8. `Szkice AI do sprawdzenia`
   - Źródło: drafts ze statusem `draft`.

## Guardy/testy do wdrożenia

```txt
node scripts/check-stage232b-today-owner-control-tiles.cjs
node --test tests/stage232b-today-owner-control-tiles.test.cjs
npm run build
npm run verify:closeflow:quiet
```

Jeżeli `verify:closeflow:quiet` blokują historyczne niezwiązane guardy, developer ma zapisać jawny SKIP z dowodem i uruchomić dedykowane guardy etapu + build + git diff --check.

## Test ręczny Damiana

1. Wejść w `/today`.
2. Sprawdzić każdy kafelek i kliknięcie w sekcję.
3. Porównać licznik kafelka z licznikiem nagłówka sekcji.
4. Potwierdzić, że duży licznik Owner Control jest nazwany `Wymaga ruchu` / `Do obsługi`, nie udaje samego dnia.
5. Potwierdzić, że zadania zaległe są jasno opisane.
6. Potwierdzić, że `Najbliższe 7 dni` odróżnia full count od preview.
7. Oznaczyć task/event jako zrobiony i zrobić hard refresh.

## Ryzyko

Jeśli tego nie zrobimy, `Dziś` będzie wyglądało jak ekran z dużą liczbą funkcji, ale bez zaufania: użytkownik nie będzie wiedział, czy patrzy na dzisiejsze terminy, zaległości, brak next stepu, czy pełny backlog ryzyk.
