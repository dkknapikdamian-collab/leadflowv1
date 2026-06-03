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
