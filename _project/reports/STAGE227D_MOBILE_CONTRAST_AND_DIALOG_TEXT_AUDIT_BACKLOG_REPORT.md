# STAGE227D — Mobile Contrast & Dialog Text Audit Backlog

Data: 2026-06-06 16:05 Europe/Warsaw
Status: FUTURE STAGE / DO WDROŻENIA PO AKTUALNYCH ETAPACH OPERACYJNYCH
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Powód

Damian zgłosił problem wizualny na mobile: w `Dodaj zadanie` oraz prawdopodobnie w innych formularzach/dialogach pojawiają się białe litery na białym albo zbyt jasnym tle. To może dotyczyć nie tylko jednego modala, ale całego wzorca pól, selectów, buttonów, placeholderów albo dialogów na mobile.

To trzeba dopisać do późniejszych etapów jako osobny audyt kontrastu, a nie łatać jednym przypadkowym CSS-em bez sprawdzenia wszystkich miejsc.

## Teza

Mobile forms/dialogs muszą mieć czytelny kontrast w jasnym i ciemnym shellu. Każdy modal dodawania/edycji ma być sprawdzony na realnym mobile viewport. Białe litery na białym tle są błędem blokującym użyteczność.

## Zakres przyszłego Stage227D

### 1. Audyt miejsc ryzyka

Sprawdzić na mobile minimum:

- `Dodaj zadanie`
- `Dodaj wydarzenie`
- `Dodaj lead`
- `Dodaj klienta`
- `Szybki szkic`
- `Inbox szkiców`, jeśli ma formularze/akcje
- dialogi z `ContextActionDialogs`
- `EventCreateDialog`
- `TaskCreateDialog`
- edycja task/event z LeadDetail
- edycja task/event z CaseDetail
- modal płatności/finansów, jeśli używa tych samych pól
- selecty, inputy, textarea, placeholdery, disabled state, hover/focus, validation/error text

### 2. Zasada wizualna

Nie robić jednorazowej poprawki tylko w jednym dialogu, jeśli źródło jest wspólne. Najpierw znaleźć source of truth dla:

- inputów,
- textarea,
- selectów,
- buttonów,
- dialog content,
- dialog header/footer,
- mobile form row,
- disabled state,
- focus state.

### 3. Naprawa

Naprawić przez wspólne klasy/tokens, nie przez losowe inline style.

Preferencja:

- jeden kontrakt dla czytelnych pól formularzy,
- jeden kontrakt dla dialogów mobile,
- guard, który pilnuje najważniejszych markerów i zakazu białego tekstu na jasnym tle.

## Pliki do przeczytania przy wdrożeniu

- `src/components/TaskCreateDialog.tsx`
- `src/components/EventCreateDialog.tsx`
- `src/components/ContextActionDialogs.tsx`
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Calendar.tsx`
- `src/styles/*`
- `src/index.css`
- `tailwind.config.*`, jeśli istnieje
- komponenty UI: `Input`, `Textarea`, `Select`, `Dialog`, `Button`

## Czego nie robić

- Nie poprawiać tylko jednego miejsca, jeśli problem wynika ze wspólnego tokenu.
- Nie zmieniać całego motywu aplikacji.
- Nie mieszać tego z Stage227A/B runtime logic.
- Nie robić redesignu wszystkich formularzy.
- Nie wprowadzać nowych bibliotek UI.
- Nie psuć desktopu dla naprawy mobile.

## Guard do dodania

Proponowany guard:

- `scripts/check-stage227d-mobile-contrast-dialogs.cjs`

Guard powinien sprawdzać:

- istnieje marker etapu w poprawionych dialogach/style source of truth;
- `TaskCreateDialog` i `EventCreateDialog` używają wspólnych czytelnych klas pól;
- nie ma klasy/kombinacji znanej z białego tekstu na jasnym tle w dialogach;
- select/input/textarea mają jawny kolor tekstu i tła w mobile dialog scope;
- disabled state nadal czytelny;
- focus state nadal widoczny;
- naprawa nie jest inline-only bez source of truth.

## Testy do dodania

Proponowany test:

- `tests/stage227d-mobile-contrast-dialogs.test.cjs`

Testy powinny potwierdzać:

1. `TaskCreateDialog` ma czytelny kontrakt klas input/select/textarea.
2. `EventCreateDialog` ma czytelny kontrakt klas input/select/textarea.
3. `ContextActionDialogs` nie wymusza białego tekstu na jasnym tle.
4. Komponenty form nie używają niebezpiecznego `text-white` bez ciemnego tła w modalach.
5. Disabled/focus/placeholder mają czytelne stany.

## Test ręczny

Na mobile viewport, np. 390x844 albo realny telefon:

1. Otworzyć `+ Zadanie`.
2. Sprawdzić każdy input, select, textarea, placeholder, disabled state.
3. Otworzyć `+ Wydarzenie`.
4. Sprawdzić każdy input, select, textarea, placeholder, disabled state.
5. Otworzyć dodawanie zadania/wydarzenia z LeadDetail.
6. Otworzyć dodawanie zadania/wydarzenia z CaseDetail.
7. Otworzyć `+ Lead`, `+ Klient`, `Szybki szkic`.
8. Sprawdzić jasne/ciemne tło, focus, validation errors.
9. Potwierdzić, że desktop nie został wizualnie popsuty.

## Kryteria akceptacji

- Na mobile nie ma białych liter na białym/jasnym tle w `Dodaj zadanie`.
- Na mobile nie ma białych liter na białym/jasnym tle w `Dodaj wydarzenie`.
- Główne dialogi dodawania/edycji mają czytelne inputy/selecty/textarea.
- Disabled, placeholder, focus i error states są czytelne.
- Poprawka idzie przez source of truth / wspólne klasy.
- Desktop nie jest pogorszony.
- Guard PASS.
- Test PASS.
- Build PASS.
- `verify:closeflow:quiet` PASS.
- Manual mobile smoke PASS.

## Ryzyko

Największe ryzyko to naprawić tylko `Dodaj zadanie`, a zostawić ten sam problem w `Dodaj wydarzenie`, dialogach kontekstowych albo edycji z LeadDetail/CaseDetail. Drugi problem to poprawić mobile kosztem desktopu. Dlatego etap ma być audytem kontrastu dialogów, nie jedną mikrołatką.

## Status

Ten plik jest notatką etapową/backlogiem. Nie zmienia runtime aplikacji.
