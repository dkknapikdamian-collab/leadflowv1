# STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Status: DO_WDROZENIA / AUDYT PRZED ETAPEM GOTOWY
Typ: product/data/UI guard stage
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## 1. Cel etapu

Urealnić zakładkę `Dziś` tak, żeby każdy kafelek liczył dokładnie to, co pokazuje po kliknięciu, a nazwa kafelka nie wprowadzała w błąd.

Największy zgłoszony objaw:

```txt
Kafelek `Co masz zrobić dzisiaj` pokazuje np. 129 wpisów i wygląda, jakby lądowało tam wszystko.
```

## 2. Scan proof

Repo files read:

- `AGENTS.md`
- `_project/00_PROJECT_MEMORY_PROTOCOL.md`
- `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`
- `src/App.tsx`
- `src/pages/Today.tsx`
- `src/pages/TodayStable.tsx`
- `src/lib/owner-control/owner-control-baseline.ts`
- `src/lib/owner-control/next-move-contract.ts`
- `src/lib/owner-control/activity-truth.ts`
- `package.json`

Obsidian local status:

- `OBSIDIAN_LOCAL_UNAVAILABLE` in this chat.
- Prepared payload: `_project/obsidian_updates/2026-06-15_STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH.md`.

Source-of-truth map:

- Active route source: `src/App.tsx` imports Today from `./pages/TodayStable`.
- Active Today screen: `src/pages/TodayStable.tsx`.
- Legacy/inactive Today screen: `src/pages/Today.tsx`.
- Owner Control engine: `src/lib/owner-control/owner-control-baseline.ts`.
- Next move classifier: `src/lib/owner-control/next-move-contract.ts`.
- Silence/activity truth: `src/lib/owner-control/activity-truth.ts`.
- Stage queue: `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.
- Product direction: `_project/04_KIERUNEK_ROZWOJU_APLIKACJI.md`.

## 3. FAKTY Z KODU / PLIKÓW

### 3.1 Aktywna trasa

`src/App.tsx` ładuje ekran `Today` przez:

```txt
const Today = lazyPage(() => import('./pages/TodayStable'), 'TodayStable');
```

Wniosek: aktywnym ekranem `/` i `/today` jest `TodayStable`, nie `Today.tsx`.

### 3.2 Legacy Today.tsx

`src/pages/Today.tsx` ma komentarz, że aktywne `/` i `/today` idą przez `TodayStable`, a plik jest legacy/inactive UI surface.

Wniosek: STAGE232B nie powinien refaktorować starego `Today.tsx` jako aktywnego UI. Może tylko dodać guard potwierdzający, że nie jest aktywną trasą.

### 3.3 Dane pobierane przez TodayStable

`loadStableTodayData()` pobiera:

- tasks,
- leads,
- events,
- cases,
- drafts.

Wniosek: ekran ma szerokie źródło danych i może produkcyjnie działać jako Owner Control dashboard, ale kafelki muszą jasno rozdzielać, co jest terminem dzisiejszym, co zaległością, a co portfelem ryzyk.

### 3.4 Kafelki i aktualne źródła liczników

Aktualny `todayTiles`:

```txt
Leady bez najbliższej akcji -> noActionLeads.length
Wysoka wartość / ryzyko -> highValueAtRiskRows.length
Leady czekające -> waitingLeadRows.length
Co masz zrobić dzisiaj -> ownerControlBaseline.items.length
Zadania do wykonania dziś -> operatorTasks.length
Wydarzenia dziś -> todayEvents.length
Najbliższe 7 dni -> upcomingRows.length
Szkice AI do sprawdzenia -> pendingDrafts.length
```

Najważniejszy problem: `Co masz zrobić dzisiaj` liczy pełne `ownerControlBaseline.items.length`, czyli pełną listę Owner Control, a nie wyłącznie dzisiejsze zadania/zdarzenia/leady.

### 3.5 Co zawiera ownerControlBaseline.items

`buildOwnerControlBaseline()` składa kandydatów z:

- leadów,
- spraw,
- zadań,
- wydarzeń.

Rekord trafia do baseline, jeżeli ma m.in. brak następnego kroku, zaległy ruch, ciszę, wysoką wartość bez bezpiecznego ruchu albo termin na dziś.

Wniosek: `ownerControlBaseline.items` nie jest listą `dzisiaj`; to lista `wymaga ruchu / wymaga decyzji`.

### 3.6 Zadania

`operatorTasks` filtruje otwarte zadania z datą `<= todayKey`.

Wniosek: ta lista zawiera zadania dzisiejsze oraz zaległe. Nazwa `Zadania do wykonania dziś` może być akceptowalna potocznie, ale produkcyjnie lepiej użyć dynamicznego tytułu `Zaległe zadania` / `Zadania do obsługi`, jeżeli są zaległe.

### 3.7 Wydarzenia

`todayEvents` filtruje otwarte eventy z datą `== todayKey`.

Wniosek: to jest czyste i dobrze nazwane.

### 3.8 Najbliższe 7 dni

`upcomingRows` buduje przyszłe tasks/events/leads w zakresie `> todayKey && <= todayKey+7`, ale na końcu robi `.slice(0, 10)`.

Wniosek: licznik `upcomingRows.length` pokazuje liczbę preview, nie pełną liczbę rzeczy w 7 dni. Jeśli rekordów jest więcej niż 10, kafelek zaniża rzeczywisty zakres.

## 4. DECYZJE DAMIANA

- Ekrany mają być produkcyjne, a nie „na pałę podpięte”.
- Każdy kafelek trzeba sprawdzić, czy liczy realne dane i pokazuje właściwą listę.
- `Dziś` ma być wartościowe biznesowo: użytkownik ma chcieć za to płacić, bo wie co zrobić i co stoi.
- Ważne informacje muszą trafić do centralnych etapów i Obsidiana/payloadu.

## 5. HIPOTEZY / PROPOZYCJE AI

### Teza

Kafelek `Co masz zrobić dzisiaj` nie powinien pozostać pod tą nazwą, jeżeli liczy `ownerControlBaseline.items.length`.

### Rekomendacja R1

Nie zawężać tej listy na siłę do samego dnia, bo Owner Control ma pokazywać również braki next stepu, ciszę i zaległości. Lepiej zmienić nazwę na:

```txt
Wymaga ruchu
```

albo:

```txt
Do obsługi
```

I dodać helper:

```txt
To nie jest kalendarz. To lista tematów, które wymagają decyzji/ruchu.
```

Poziom przekonania: 8/10.

Argument za: produkt CloseFlow ma mówić właścicielowi, co wymaga ruchu, a nie tylko co ma termin dzisiaj.
Argument przeciw: część użytkowników może oczekiwać, że zakładka `Dziś` pokaże wyłącznie dzień dzisiejszy.
Co zmieni zdanie: jeśli Damian chce, aby `Dziś` było literalnym kalendarzem dnia, wtedy `ownerControlBaseline.items` powinno być osobną zakładką `Kontrola` / `Wymaga ruchu`, a nie kafelkiem w Dziś.
Najkrótszy test: użytkownik patrzy na 129 wpisów i w 5 sekund rozumie, dlaczego to nie jest tylko kalendarz dnia.

## 6. AUDYT PRZED ETAPEM

### Ekran / trasa

- `/today`
- `/`
- nazwa w UI: `Dziś`

### Affected modules

- `src/pages/TodayStable.tsx`
- `src/App.tsx`
- `src/lib/owner-control/owner-control-baseline.ts`
- `src/lib/owner-control/next-move-contract.ts`
- `src/lib/owner-control/activity-truth.ts`
- tests/guards for TodayStable

### Current implementation map

1. App route ładuje `TodayStable`.
2. `TodayStable` pobiera tasks/leads/events/cases/drafts.
3. Owner Control baseline buduje pełną listę rzeczy wymagających ruchu.
4. Kafelki `todayTiles` pokazują liczniki.
5. Sekcje pod spodem renderują listy według tych samych lub podobnych kolekcji.
6. Click kafelka rozwija sekcję, ale bez scroll/reorder trap.

### Co już istnieje i jest dobre

- Aktywna trasa jest rozdzielona od legacy `Today.tsx`.
- Dane są pobierane z Supabase API collections, nie z mocków.
- Kafelki mają mapę sekcji i `aria-controls`.
- Lista zadań i eventów używa `WorkItemCard` jako wspólnego wzorca kart pracy.
- `TodayStable` odświeża po mutation bus.
- `TodayStable` ma TTL dla focus/visibility refresh, więc nie spamuje API na każde przełączenie okna.

### Realne problemy

1. `Co masz zrobić dzisiaj` liczy pełne `ownerControlBaseline.items`, więc nazwa jest nieprawdziwa lub źródło danych jest zbyt szerokie.
2. `Najbliższe 7 dni` liczy preview po `.slice(0,10)`, nie pełen zakres 7 dni.
3. `Wysoka wartość / ryzyko` może sugerować ryzyko, ale filtr opiera się tylko na `valuePln >= threshold` na wierszach Owner Control. Trzeba zachować wymóg realnego ryzyka albo zmienić nazwę na `Wysoka wartość w kontroli`.
4. `Zadania do wykonania dziś` zawiera zaległe zadania, bo filtruje `<= todayKey`. To może być dobre, ale wymaga prawdziwego tytułu dynamicznego.
5. Brak jednego jawnego kontraktu: tile count === section count albo full count + preview count.

### Podobne miejsca do sprawdzenia

- `TasksStable` — czy `Zrobione`, zaległe i dzisiejsze statusy są zgodne z Today.
- `Calendar` — czy wydarzenie oznaczone jako done znika z Today.
- `LeadDetail` — STAGE232A musi potem spiąć braki/blokady z Owner Control.
- `owner-control-baseline.ts` — czy nie liczy zamkniętych/moved_to_service rekordów.

### Czego nie ruszać

- SQL/Supabase schema,
- legacy `Today.tsx`,
- Google Calendar sync,
- LeadDetail STAGE232A,
- CaseDetail,
- globalny layout.

## 7. GUARDY / TESTY DO DODANIA

### Guard

```txt
node scripts/check-stage232b-today-owner-control-tiles.cjs
```

Ma sprawdzać:

- `src/App.tsx` używa `./pages/TodayStable`,
- `src/pages/Today.tsx` pozostaje legacy/inactive,
- `TodayStable.tsx` ma jawne kolekcje dla kafelków,
- kafelek o nazwie dzisiejszej nie liczy bezpośrednio pełnego `ownerControlBaseline.items.length`,
- `upcomingRows` ma full count albo preview count z tekstem wyjaśniającym,
- tile count i section header count używają tej samej kolekcji albo jawnego full/preview kontraktu.

### Test

```txt
node --test tests/stage232b-today-owner-control-tiles.test.cjs
```

Ma testować fixtures:

1. lead bez next step -> `Leady bez najbliższej akcji`, niekoniecznie `dzisiaj`,
2. task zaległy -> `Zadania do obsługi`, status `Zaległe`,
3. event dzisiaj -> `Wydarzenia dziś`,
4. 12 rekordów upcoming -> full count 12, preview 10,
5. pending draft -> `Szkice AI do sprawdzenia`,
6. owner-control full backlog -> nazwa `Wymaga ruchu` / `Do obsługi`, nie `Co masz zrobić dzisiaj`.

## 8. TEST RĘCZNY DLA DAMIANA

1. Wejdź w `/today`.
2. Sprawdź kafelki:
   - `Leady bez najbliższej akcji`,
   - `Wysoka wartość / ryzyko`,
   - `Leady czekające`,
   - `Wymaga ruchu` / `Do obsługi`,
   - `Zadania do obsługi`,
   - `Wydarzenia dziś`,
   - `Najbliższe 7 dni`,
   - `Szkice AI do sprawdzenia`.
3. Kliknij każdy kafelek.
4. Porównaj licznik kafelka z licznikiem sekcji.
5. Sprawdź, czy `Wymaga ruchu` może mieć dużą liczbę i czy UI tłumaczy, dlaczego.
6. Sprawdź, czy `Zadania` odróżniają zaległe od dzisiejszych.
7. Sprawdź, czy `Najbliższe 7 dni` przy >10 rekordach mówi `pokazano 10 z X`.
8. Oznacz zadanie/wydarzenie jako zrobione i zrób hard refresh.

## 9. AUDYT PO ETAPIE - DO UZUPEŁNIENIA PRZEZ DEVELOPERA

Po wdrożeniu developer ma dopisać:

```txt
AUDYT PO ETAPIE
- co mogło się zepsuć:
- co sprawdzono obok:
- podobne miejsca:
- nowe problemy wykryte:
- problemy świadomie nie ruszone:
- guard/test dowodzący:
- manual test dla Damiana:
- wpływ na Obsidian/_project:
- następny najlepszy krok:
```

## 10. WPŁYW NA OBSIDIANA

Payload do synchronizacji:

```txt
_project/obsidian_updates/2026-06-15_STAGE232B_TODAY_OWNER_CONTROL_TILE_SOURCE_OF_TRUTH.md
```

## 11. GIT / ZIP STATUS

- Docs stage zapisany w repo.
- Runtime code not changed.
- Dedicated ZIP not prepared in this docs-only action.
- Commit/push implementation only after developer stage, guards and Damian acceptance.
