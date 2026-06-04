# CloseFlow LeadFlow - wizualne źródło prawdy kolorów i akcji

Status: aktywne źródło prawdy
Stage: STAGE220A16
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## Decyzja Damiana

Kolory, tła, obramowania, ikonki, przyciski, modale, kafelki, liczby na kafelkach i powtarzalne typy akcji mają być podpięte do jednego źródła prawdy. Nie dopisujemy już kolorów ręcznie w każdym widoku.

## Źródła techniczne

- CSS tokeny: `src/styles/closeflow-visual-source-truth.css`
- Mapa TS: `src/lib/closeflow-visual-source-truth.ts`
- Guard: `scripts/check-stage220a16-visual-source-truth.cjs`
- Import globalny: `src/App.tsx`

## Mapa semantyczna

| Znaczenie | Kolor | Token | Ikona / copy |
|---|---:|---|---|
| Notatka | niebieski | `--cf-vst-color-note` | StickyNote / Notatka |
| Zadanie | zielony | `--cf-vst-color-task` | ListChecks / Zadanie |
| Wydarzenie, kalendarz | pomarańczowy | `--cf-vst-color-event` | CalendarClock / Wydarzenie |
| Wpłata, finanse | fioletowy | `--cf-vst-color-payment` | Paperclip / Wpłata |
| Status, system | szary/granat | `--cf-vst-color-status` | CheckCircle2 / Status |
| Element sprawy, brak, dokument | morski | `--cf-vst-color-case-item` | dokument/brak |
| Usuń, kasowanie, destrukcja | czerwony | `--cf-vst-color-delete` | Trash2 / Usuń, Usuń sprawę |
| Główna akcja, zapisz, dodaj | niebieski | `--cf-vst-color-primary` | Dodaj, Zapisz |
| Sukces, wykonane, zaakceptowane | zielony | `--cf-vst-color-success` | Wykonane, Akceptuj |
| Ostrzeżenie, termin, uwaga | bursztyn | `--cf-vst-color-warning` | Wymaga uwagi |
| Błąd, blokada, odrzucone | czerwony | `--cf-vst-color-danger` | Odrzuć, Zablokowane |

## Zasady dla UI

1. Kalendarz i wydarzenia używają semantyki `event/calendar`.
2. Zadania używają semantyki `task`.
3. Notatki używają semantyki `note`.
4. Finanse i wpłaty używają semantyki `payment/finance`.
5. Usuwanie zawsze ma czerwony token, ikonę kosza i jawny tekst, np. `Usuń sprawę`.
6. Modale tworzenia, np. nowy lead, nowe zadanie, nowe wydarzenie, mają korzystać z `cf-vst-dialog` i tokenów semantycznych nagłówka/akcji.
7. Kafelki i liczby mają korzystać z `cf-vst-card` i `cf-vst-metric-number`.
8. Zmiana koloru w jednym tokenie ma docelowo zmienić wszystkie podpięte miejsca.

## Etapy przepięcia

- A16: utworzyć źródło prawdy, import, dokumentację i guard.
- A17: przepiąć historię sprawy i przycisk usuwania sprawy na source of truth.
- A18: przepiąć modale i dialogi tworzenia/edycji.
- A19: przepiąć kafelki, liczby i pigułki statusów.
- A20: przepiąć kalendarz/wydarzenia i wspólne listy.
## STAGE220A16B - pełniejsze fundamenty UI

Oprócz kolorów mapujemy też parametry, które muszą być spójne w całej aplikacji.

### Typografia

| Rola | Token / klasa | Zastosowanie |
|---|---|---|
| Tytuł strony | `--cf-vst-font-size-page-title`, `cf-vst-text-page-title` | nagłówki główne widoków |
| Tytuł sekcji | `--cf-vst-font-size-section-title`, `cf-vst-text-section-title` | sekcje w panelach |
| Tytuł kafelka | `--cf-vst-font-size-card-title`, `cf-vst-text-card-title` | kafelki górne, boczne, dolne |
| Body | `--cf-vst-font-size-body`, `cf-vst-text-body` | opisy i zwykłe teksty |
| Meta / data | `--cf-vst-font-size-meta`, `cf-vst-text-meta` | daty, podpisy, małe opisy |
| Liczby | `--cf-vst-font-size-metric`, `cf-vst-metric-number` | liczby na kafelkach |

### Powierzchnie

| Miejsce | Token / klasa |
|---|---|
| Karta | `cf-vst-card` |
| Shell strony | `cf-vst-shell` |
| Panel boczny | `cf-vst-right-rail` |
| Wiersz listy | `cf-vst-row` |
| Modal | `cf-vst-dialog` |
| Liczba | `cf-vst-metric-number` |

### Przyciski i akcje

| Typ | Kolor / zasada |
|---|---|
| Główna akcja: dodaj, zapisz, utwórz | primary / niebieski |
| Akcja neutralna: edytuj, pokaż, przejdź | jasny, neutralny |
| Sukces: wykonane, zaakceptuj | zielony |
| Ostrzeżenie: wymaga uwagi, termin | bursztyn |
| Usuń / kasowanie | czerwony, kosz, jawny tekst |

### Formularze i modale

- `Nowy lead`, `Nowe zadanie`, `Nowe wydarzenie`, `Dodaj notatkę`, `Dodaj wpłatę` docelowo korzystają z `cf-vst-dialog`.
- Inputy, selecty i textarea mają korzystać z `cf-vst-input`.
- Footer modala ma mieć jeden rytm odstępów i wysokości przycisków.
- Nie mieszamy zielonego jako domyślnego CTA. Domyślne CTA idzie w niebieski. Zielony zostaje dla sukcesu/wykonania.

### Layout

- Jedna maksymalna szerokość strony: `--cf-vst-layout-page-max`.
- Jedna szerokość panelu bocznego: `--cf-vst-layout-right-rail`.
- Jeden gap między kolumnami: `--cf-vst-layout-gap`.
- Jeden system paddingów kart, paneli, wierszy i modali.

### Kolejność realnego przepinania

1. Historia sprawy + Usuń sprawę.
2. Modale: nowy lead, nowe zadanie, nowe wydarzenie, notatka, wpłata.
3. Kafelki górne, boczne, dolne i liczby.
4. Statusy, badge i pigułki.
5. Kalendarz i wydarzenia.
6. Listy rekordów i panele boczne.
## STAGE220A17 - pierwsze realne przepięcie na source of truth

Podpięte miejsca:
- `CaseDetail` / przycisk `Usuń sprawę` używa `cf-vst-button`, `cf-vst-button-delete` i `data-cf-vst-kind="delete"`.
- `ConfirmDialog` używa `cf-vst-dialog`.
- `Historia sprawy` używa `data-cf-vst-kind` dla typów: note, task, event, payment, status, case-item.
- Wpis `Zadanie wykonane` nie może pokazywać technicznego statusu `done` jako treści.
## STAGE220A18 - wspólne modale i formularze

Podpięte wspólne komponenty UI:
- `DialogContent` używa `cf-vst-dialog`.
- `DialogOverlay` używa `cf-vst-overlay`.
- `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` mają klasy `cf-vst-*`.
- `Input` używa `cf-vst-input`.
- `Textarea` używa `cf-vst-input cf-vst-textarea`.
- `SelectTrigger` używa `cf-vst-input cf-vst-select-trigger`.
- `SelectContent` używa `cf-vst-select-content cf-vst-card`.
- `Button` używa `cf-vst-button`; wariant domyślny dostaje `cf-vst-button-primary`, a destructive `cf-vst-button-delete`.

Decyzja:
- Domyślne CTA idzie w niebieski.
- Zielony zostaje dla sukcesu/wykonania, nie dla każdego głównego przycisku.
- Usuwanie zostaje czerwone i destrukcyjne.
## STAGE220A19 - kafelki, liczby i pigułki statusów

Podpięte wspólne komponenty:
- `Card` używa `cf-vst-card`.
- `CardHeader`, `CardContent`, `CardFooter` używają tokenów spacingu.
- `CardTitle` używa `cf-vst-text-card-title`.
- `CardDescription` używa `cf-vst-text-meta`.
- `Badge` używa `cf-vst-badge cf-vst-pill`.
- `Badge destructive` używa czerwonego źródła prawdy.
- `Badge secondary/outline` używa semantyki statusu.
- Domyślny `Badge` używa semantyki primary.
- Liczby i metryki mają korzystać z `cf-vst-metric-number`, `cf-vst-metric-label`, `cf-vst-metric-card`.

Zasada:
- Kafelki, liczby, badge, chipy i małe liczniki nie mają mieć własnych losowych kolorów ani rozmiarów.
- Nowe widoki mają brać klasy z `cf-vst-*`.
## STAGE220A20 - kalendarz, wydarzenia i statusy terminów

Podpięte miejsca:
- wpis tygodniowy kalendarza używa `cf-vst-card` i `cf-vst-calendar-entry-card`,
- wpis wybranego dnia używa `cf-vst-card` i `cf-vst-calendar-entry-card`,
- typ wpisu: event/task/lead używa `data-cf-vst-kind`,
- status wpisu używa `data-cf-vst-kind`,
- godzina/termin używa semantyki terminu,
- akcja `Zrobione` używa semantyki sukcesu,
- akcja `Usuń` używa semantyki delete.

Mapa:
- wydarzenie/kalendarz: event,
- zadanie: task,
- lead/inny rekord: case-item,
- wykonane: success,
- zaległe: danger,
- anulowane/systemowe: status,
- w toku: primary,
- usuń: delete.
## STAGE220A21 - listy rekordów i panele boczne

Podpięte stare źródła prawdy pod nowe tokeny:
- `closeflow-record-list-source-truth.css`
- `closeflow-right-rail-source-truth.css`

Zasada:
- listy rekordów dalej mają własny plik układu,
- panele boczne dalej mają własny plik układu,
- ale kolory, tła, obramowania, radiusy, shadow, tekst, meta, pigułki i destructive actions idą przez `cf-vst-*`.

Podpięte semantyki:
- rekord/list row: `cf-vst-record-row`,
- karta listy: `cf-vst-record-list-card`,
- panel boczny: `cf-vst-right-rail-card`,
- wiersz panelu bocznego: `cf-vst-right-rail-row`,
- tytuł: `cf-vst-text-strong`,
- meta: `cf-vst-text-muted`,
- sukces: `cf-vst-color-success`,
- ostrzeżenie/delete: `cf-vst-color-delete`.
## STAGE220A22 - spójny numer wiersza i chevron w Klientach/Sprawach

Decyzja:
- numer wiersza w `Klienci` i `Sprawy` ma mieć ten sam kolor, tło, border i font,
- `Klienci` używa chevrona `>` jako wskaźnika otwarcia rekordu, tak jak `Sprawy`,
- ikonka klienta przy koszu w liście klientów nie jest używana jako akcja otwarcia, bo miesza język ikon.

Podpięcie:
- `Clients.tsx`: `data-stage220a22-client-chevron="true"`,
- `Cases.tsx`: importuje `closeflow-record-list-source-truth.css`,
- `closeflow-record-list-source-truth.css`: wspólne tokeny dla index pill i client chevron.
## STAGE220A23 - produkcyjne komunikaty zadań

Decyzja:
- nie używamy natywnego `window.confirm` ani `window.prompt` w aktywnych flow zadań,
- usuwanie zadania używa `ConfirmDialog`,
- kolejny krok po oznaczeniu zadania jako zrobione używa modala `cf-vst-dialog`,
- modal kolejnego kroku używa `cf-vst-input`, `cf-vst-dialog-footer` i tokenów VST.

Powód:
- natywne alerty pokazują techniczny nagłówek domeny, np. Vercel, i nie dają się ostylować produkcyjnie.
## STAGE220A23B - aktywny ekran zadań TasksStable

Poprawka do A23:
- aktywny ekran zadań działa przez `TasksStable.tsx`,
- `TasksStable.tsx` nie może używać natywnego `window.confirm`,
- usuwanie zadania używa `ConfirmDialog`,
- modal `Edytuj zadanie` używa `cf-vst-dialog`,
- modal `Ustaw kolejny krok` używa `cf-vst-dialog`,
- zielone CTA w tych modalach zastąpione jest primary z VST,
- selecty w tych modalach używają `cf-vst-input`.

Powód:
A23 poprawił starszy `Tasks.tsx`, ale widoczny produkcyjnie ekran zadań korzysta z `TasksStable.tsx`.
## STAGE220A24 - klient, stare modale i układ panelu danych

Poprawki:
- lista klientów nie używa natywnego `window.confirm` przy przenoszeniu do kosza ani przywracaniu,
- klient kosz/przywrócenie używa `ConfirmDialog`,
- globalne dialogi Radix/app mają wymuszony jasny VST surface,
- textarea/input/select w dialogach mają czytelny tekst i zaznaczenie,
- zielone CTA w starych modalach jest nadpisane przez primary VST,
- `ClientDetail` ukrywa stare lewostronne kafle informacyjne, żeby panel `Dane klienta` startował jak w `LeadDetail`.

Decyzja:
- w aktywnym UI nie wolno zostawiać natywnych komunikatów przeglądarki z domeną aplikacji,
- klient i lead mają mieć ten sam język panelu danych.
## STAGE220A25 - finanse sprawy, klienta i wpłat

Decyzje:
- formularz nowego klienta może utworzyć sprawę startową,
- wartość wpisana przy sprawie startowej zapisuje się do sprawy jako `contractValue` i `expectedRevenue`,
- klient nie jest źródłem wartości sprawy; klient sumuje wartości spraw,
- sprawa ma własne finanse jednej sprawy,
- wpłaty są źródłem prawdy dla opłacono/do domknięcia,
- `CaseDetail` używa jednego efektywnego źródła płatności dla kafelków i prawego panelu.

Zakres:
- bez zmian SQL,
- bez zmian RLS,
- bez zmian schema danych.
## STAGE220A26 - finanse sprawy: źródło wyświetlania i modale

Audyt po A25:
- A25 poprawił zapis i effective payments, ale widok sprawy nadal czytał pola z niewłaściwego adaptera.
- Dla kafelków i prawego panelu używany jest `caseFinanceSourceStage220A26`.
- Źródło: `getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)`.
- Usunięto runtime-risk użycia `getCaseFinanceSummary(...)` w `CaseDetail`, bo w tym pliku helper jest importowany jako alias `getCaseFinanceSourceSummary`.
- Modale finansów sprawy są spięte z `cf-vst-dialog`.
- Selecty finansów sprawy używają `cf-vst-input`.

Reguła:
- finanse sprawy pokazują jedną sprawę,
- finanse klienta sumują sprawy klienta,
- wpłaty aktualizują źródło płatności, a widok liczy z jednego efektywnego źródła.

## STAGE220A26 R4 - guard A13

A13 finance guard został zaktualizowany, bo A26 przenosi widok finansów sprawy z legacy `caseFinanceSummary.*` na `caseFinanceSourceStage220A26.*`.
Nie cofamy A26. Guard A13 akceptuje teraz:
- stary kontrakt legacy,
- nowy kontrakt A26: `getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)`.

## STAGE220A26 R5 - guard A14

A14 finance guard został zaktualizowany, bo A26 przenosi widok finansów sprawy z legacy `caseFinanceSummary.*` na `caseFinanceSourceStage220A26.*`.
Nie cofamy A26. Guard A14 akceptuje teraz:
- stary kontrakt legacy,
- nowy kontrakt A26: `getCaseFinanceSourceSummary(caseData, effectiveCasePaymentsStage220A25)` i zależność `[caseFinanceSourceStage220A26]`.

## STAGE220A26B - finance regression contract guard

Dodano guard po A25/A26.

Pilnowane kontrakty:
- wartość wpisana przy kliencie i sprawie startowej musi trafić do sprawy,
- sprawa pokazuje własną wartość i własne wpłaty,
- klient sumuje sprawy i wpłaty klienta,
- `CaseDetail` używa `effectiveCasePaymentsStage220A25`,
- `CaseDetail` używa `caseFinanceSourceStage220A26`,
- modale finansów sprawy zostają w VST,
- A13/A14 nie mogą cofać widoku do legacy `caseFinanceSummary.*`.

Następny etap biznesowy:
- A27: korekty finansowe/storno zamiast cichego kasowania pomyłek.

## STAGE220A27A - korekta wpłaty i historia wpłat

Decyzja:
- pomyłek we wpłatach nie cofamy przez ciche usuwanie rekordu,
- korekta wpłaty tworzy nową płatność typu `refund`,
- korekta ma datę, wartość i powód,
- historia wpłat pokazuje oryginał i korektę,
- finanse sprawy i klienta liczą korektę jako odjęcie od wpłat,
- historia aktywności dostaje `payment_correction_added`.

Uzasadnienie:
- pieniądze wymagają śladu operacyjnego,
- użytkownik musi widzieć, co było wpisane i co zostało skorygowane,
- obecny finance source już odejmuje `refund` od wpłat.
