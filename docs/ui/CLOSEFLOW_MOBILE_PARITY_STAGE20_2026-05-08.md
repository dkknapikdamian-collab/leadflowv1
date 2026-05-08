# CLOSEFLOW_MOBILE_PARITY_STAGE20_2026_05_08

## Cel

Stage20 sprawdza, czy aktywne kontrakty UI nie rozpadaja sie na mobile.

Ten etap nie zmienia danych, API, Supabase, auth, billing, AI, routingu ani zachowania klikniec. To jest mobile parity pass: dokument + guard. Nie udajemy pelnego screenshot testu bez screenshotow.

## Zakres ekranow

- `/today`
- `/tasks`
- `/leads`
- `/clients`
- `/cases`
- `/calendar`
- `/ai-drafts`
- `/notifications`

## Co sprawdzamy

1. Kafelki top metryk ukladaja sie w 1 kolumne na mobile.
2. Header/page hero nie rozjezdza buttonow.
3. Formularze i modal footery ukladaja akcje w stacku.
4. Danger action nie siedzi obok primary bez odstepu.
5. Panele right-card nie powinny tworzyc poziomego scrolla.
6. Dlugie nazwy nie powinny rozwalac kafelkow ani list.

## Zrodla prawdy mobile

| Obszar | Zrodlo prawdy | Mobile warunek |
|---|---|---|
| metric tiles | `src/styles/closeflow-metric-tiles.css` | `@media (max-width: 640px)` + `grid-template-columns: 1fr` |
| page hero/header | `src/styles/closeflow-page-header.css` | `@media (max-width: 720px)` + akcje headera w pelnej szerokosci |
| form/footer | `src/styles/closeflow-form-actions.css` | `@media (max-width: 640px)` + przyciski w stacku |
| danger/action placement | `src/styles/closeflow-action-clusters.css` | `@media (max-width: 640px)` + regiony akcji rozciagane czytelnie |
| right-card/surface | `src/styles/closeflow-surface-tokens.css` | wspolne surface tokens dla right-card i rail |
| list rows / long names | `src/styles/closeflow-list-row-tokens.css` | pill/meta maja `white-space: nowrap`, a kontenery musza zostac min-width safe |
| card readability | `src/styles/closeflow-card-readability.css` | czytelnosc kart bez lokalnego dark/black tlo debt |

## Mapa ekranow Stage20

| Ekran | Status | Decyzja |
|---|---|---|
| `/today` | OK_CONTRACT | Aktywny ekran to TodayStable. Mobile kontrakty sa obecne. |
| `/tasks` | WYMAGA_OSOBNEGO_ETAPU | Stage16B juz wskazal visual parity debt. Mobile sprawdzic razem ze Stage16C/Stage20B. |
| `/leads` | OK_CONTRACT | Korzysta z metric/page/list/card kontraktow. |
| `/clients` | OK_CONTRACT | Korzysta z metric/page/list/card kontraktow. |
| `/cases` | WYMAGA_OSOBNEGO_ETAPU | Stage16B juz wskazal visual parity debt. Mobile sprawdzic razem ze Stage16C/Stage20B. |
| `/calendar` | OK_CONTRACT | Page/header/right-card/form kontrakty sa obecne. |
| `/ai-drafts` | OK_CONTRACT | Page/header/card/form kontrakty sa obecne. |
| `/notifications` | OK_CONTRACT | Page/header/card/severity kontrakty sa obecne; top metric parity poza zakresem. |

## Decyzja

Stage20 zamyka mobile parity na poziomie kontraktow dla aktywnego UI, ale nie zamienia tego w falszywy screenshot test.

Najwazniejsze: `/tasks` i `/cases` zostaja oznaczone jako `WYMAGA_OSOBNEGO_ETAPU`, bo Stage16B wskazal je jako realny visual debt. Nie wolno tego lukrowac jako OK bez screenshotow.

## Future debt

| Obszar | Status | Co zrobic |
|---|---|---|
| `/tasks` mobile visual repair | PRZYSZLY_DEBT | Zrobic Stage16C albo Stage20B screenshot-driven. |
| `/cases` mobile visual repair | PRZYSZLY_DEBT | Zrobic Stage16C albo Stage20B screenshot-driven. |
| real device screenshot QA | DO_POTWIERDZENIA_SCREENSHOTEM | Sprawdzic po deployu na szerokosci ok. 390px i 430px. |
| horizontal scroll | DO_POTWIERDZENIA_SCREENSHOTEM | Jesli screen pokaze poziomy scroll, naprawiac konkretny ekran, nie caly system. |

## Kryterium zakonczenia

- dokument Stage20 istnieje,
- check Stage20 przechodzi,
- package.json ma `check:closeflow-mobile-parity-contract`,
- glowne kontrakty mobile sa obecne,
- `/tasks` i `/cases` sa jawnie oznaczone jako wymagajace osobnego etapu,
- build przechodzi,
- commit i push ida na `dev-rollout-freeze` dopiero po zielonych checkach.

## Weryfikacja

```bash
npm run check:closeflow-mobile-parity-contract
npm run build
```
