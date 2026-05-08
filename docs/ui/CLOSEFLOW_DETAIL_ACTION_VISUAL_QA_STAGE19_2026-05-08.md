# CLOSEFLOW_DETAIL_ACTION_VISUAL_QA_STAGE19_2026_05_08

## Cel

Stage19 sprawdza wizualna logike rozmieszczenia akcji na stronach szczegolu:

- LeadDetail
- ClientDetail
- CaseDetail

Ten etap nie zmienia danych, API, Supabase, auth, billing, AI, routingu ani zachowania klikniec. To jest QA + mapa rozmieszczenia. Drobne poprawki po tym etapie wolno robic tylko przez istniejace kontrakty:

- `src/components/entity-actions.tsx`
- `src/styles/closeflow-action-clusters.css`

## Zakres

- `src/pages/LeadDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/components/entity-actions.tsx`
- `src/styles/closeflow-action-clusters.css`

## Zrodlo prawdy

Wspolne zrodlo prawdy dla logicznych regionow akcji to:

```text
ENTITY_DETAIL_ACTION_PLACEMENT_CONTRACT
```

oraz per-page kontrakty:

```text
CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_LEAD
CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CLIENT
CLOSEFLOW_ENTITY_ACTION_PLACEMENT_CONTRACT_CASE
```

## Mapa PRZED Stage19

| Akcja | LeadDetail | ClientDetail | CaseDetail | Werdykt |
|---|---|---|---|---|
| Dodaj notatke | `activity-panel-header` | `activity-panel-header` | `activity-panel-header` | OK_CONTRACT |
| Dyktuj notatke | `activity-panel-header` | `activity-panel-header` | `activity-panel-header` | OK_CONTRACT |
| Dodaj zadanie | `tasks-panel-header` | `tasks-panel-header` | `tasks-panel-header` | OK_CONTRACT |
| Dodaj wydarzenie | `events-panel-header` | `events-panel-header` | `events-panel-header` | OK_CONTRACT |
| Edytuj | `entity-header-action-cluster` | `entity-header-action-cluster` | `entity-header-action-cluster` | OK_CONTRACT |
| Usun | `danger-action-zone` | `danger-action-zone` | `danger-action-zone` | OK_CONTRACT |
| Kopiuj / akcje inline | `info-row-inline-action` | `info-row-inline-action` | `info-row-inline-action` | OK_CONTRACT |

## Mapa PO Stage19

| Akcja | Docelowe miejsce | Klasa/kontrakt | Decyzja |
|---|---|---|---|
| Dodaj notatke | header panelu aktywnosci / notatek | `cf-panel-header-actions` | ZOSTAWIC |
| Dodaj zadanie | wiersz akcji panelu zadan / pracy | `cf-panel-action-row` | ZOSTAWIC |
| Dodaj wydarzenie | wiersz akcji panelu wydarzen / kalendarza | `cf-panel-action-row` | ZOSTAWIC |
| Edytuj | header encji / glowne akcje rekordu | `cf-entity-action-cluster` | ZOSTAWIC |
| Usun | strefa danger / akcja drugorzedna | `cf-danger-action-zone` | ZOSTAWIC |
| Mobile | wspolne zawijanie regionow akcji | `@media (max-width: 640px)` w `closeflow-action-clusters.css` | ZOSTAWIC |

## QA wizualne do wykonania po deployu

Sprawdzic screenshotowo:

1. `Dodaj notatke` jest w tym samym logicznym miejscu w Lead, Client i Case.
2. `Dodaj zadanie` jest w tym samym logicznym miejscu w Lead, Client i Case.
3. `Dodaj wydarzenie` jest w tym samym logicznym miejscu w Lead, Client i Case.
4. `Edytuj` jest w header/action cluster, a nie w przypadkowym miejscu panelu.
5. `Usun` jest w danger/secondary area, nie jako glowne CTA.
6. Mobile uklada akcje czytelnie, bez rozjechania przyciskow poza kontener.

## Decyzja Stage19

Stage19 nie robi zmian wizualnych na slepo. Kod ma wspolny kontrakt rozmieszczenia akcji. Drobne naprawy nalezy robic dopiero po screenshocie, i tylko przez:

- `cf-entity-action-cluster`
- `cf-panel-header-actions`
- `cf-panel-action-row`
- `cf-danger-action-zone`
- `cf-inline-secondary-action`

## Wyjatki i future debt

| Obszar | Status | Decyzja |
|---|---|---|
| Rzeczywisty screenshot parity | DO_POTWIERDZENIA_SCREENSHOTEM | Ten etap tworzy mape i check. Jesli screenshot pokaze rozjazd, robic Stage19B. |
| Per-page custom CSS w detail pages | PRZYSZLY_DEBT | Nie ruszac bez dowodu. Jezeli nadpisuje regiony akcji, naprawic przez istniejace kontrakty. |
| Delete/destructive | ZAMKNIETE_KONTRAKTEM | `Usun` ma zostac w `danger-action-zone`, nie jako glowne CTA. |

## Kryterium zakonczenia

- dokument Stage19 istnieje,
- check Stage19 przechodzi,
- LeadDetail, ClientDetail i CaseDetail maja zgodne mapy regionow akcji,
- `entity-actions.tsx` nadal definiuje wspolny placement contract,
- `closeflow-action-clusters.css` nadal odpowiada za desktop i mobile layout regionow,
- build przechodzi,
- commit i push ida na `dev-rollout-freeze` dopiero po zielonych checkach.

## Weryfikacja

```bash
npm run check:closeflow-detail-action-visual-qa
npm run build
```
