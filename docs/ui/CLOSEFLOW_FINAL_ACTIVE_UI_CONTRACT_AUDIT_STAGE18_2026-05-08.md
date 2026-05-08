# CLOSEFLOW_FINAL_ACTIVE_UI_CONTRACT_AUDIT_STAGE18_2026_05_08

## Cel

Stage18 jest koncowym audytem aktywnego UI po Stage16A, Stage16B i Stage17.

Ten etap nie zmienia wygladu, danych, API, Supabase, auth, billing, AI, routingu ani zachowania klikniec. To jest bramka porzadkujaca: jeden dokument mowi, co jest domkniete, co jest swiadomym wyjatkiem, a co zostaje jako przyszly debt.

## Werdykt

Aktywny UI ma zdefiniowane zrodla prawdy dla glownych kategorii stylu. Legacy `Today.tsx` jest poza aktywnym UI debt, bo aktywne trasy `/` i `/today` ida przez `TodayStable`.

Najwiekszy realny visual debt po Stage16B zostaje tylko w obszarze screenshot-driven repair:

- `/tasks`
- `/cases`

Nie nalezy ruszac pozostalych ekranow bez screenshotu albo konkretnego bledu kontraktu.

## Zrodla prawdy aktywnego UI

| Obszar | Status | Zrodlo prawdy | Uwagi |
|---|---|---|---|
| metrics | DOMKNIETE | `src/components/StatShortcutCard.tsx`, `src/styles/closeflow-metric-tiles.css` | Stage16A blokuje lokalne rozjazdy top metric tiles i lamanie krotkich labeli. |
| page hero | DOMKNIETE | `src/styles/closeflow-page-header.css` | Wspolny kontrakt dla hero/header. |
| surface/right-card | DOMKNIETE | `src/styles/closeflow-surface-tokens.css` | Right-card i surface tokens sa wspolnym zrodlem prawdy dla paneli bocznych. |
| list row | DOMKNIETE | `src/styles/closeflow-list-row-tokens.css` | Meta, contact/value/client oraz row pill tokens. |
| status/progress | DOMKNIETE | `src/styles/closeflow-list-row-tokens.css` | `cf-status-pill`, `cf-progress-pill`, `cf-progress-bar`. |
| alert/severity | DOMKNIETE | `src/styles/closeflow-alert-severity.css` | `cf-alert-*`, `cf-severity-*`; nie mieszac z entity type ani session action. |
| action/danger | DOMKNIETE | `src/styles/closeflow-action-tokens.css`, `src/components/entity-actions.tsx` | Delete/destructive action zostaje w entity action danger. |
| session action | DOMKNIETE | `src/styles/closeflow-action-tokens.css`, `data-cf-session-action="logout"` | Logout nie jest delete. To oddzielna kategoria po Stage17. |
| action placement | DOMKNIETE | `src/styles/closeflow-action-clusters.css` | `cf-entity-action-cluster`, `cf-panel-header-actions`, `cf-danger-action-zone`. |
| form/footer | DOMKNIETE | `src/styles/closeflow-form-actions.css` | `cf-form-actions`, `cf-modal-footer`. |
| card readability | DOMKNIETE | `src/styles/closeflow-card-readability.css` | Czytelnosc kart, paneli i empty state. |
| entity type | DOMKNIETE | `src/styles/closeflow-entity-type-tokens.css` | Calendar Lead/Event/Task to entity type, nie severity. |

## Zakazane nowe lokalne systemy

Aktywne pliki `src` nie powinny wprowadzac nowych lokalnych nazw ani obejsc typu:

- `metric-fix`
- `tile-v2`
- `action-repair`
- `severity-fix`
- `page-head-v2`

Wyjatek: `src/pages/Today.tsx` jest legacy inactive i nie miesza sie z aktywnym UI debt.

## Today legacy inactive

`src/pages/Today.tsx` zostaje traktowany jako legacy inactive. Aktywny ekran Dzisiaj to `TodayStable`:

- `src/App.tsx` importuje `./pages/TodayStable` jako aktywny `Today`,
- trasy `/` i `/today` uzywaja tego aktywnego komponentu,
- `Today.tsx` moze miec historyczne czerwienie/amber/rose i nie jest klasyfikowany jako aktywny UI debt.

Nie ruszac `Today.tsx` bez osobnego etapu archiwizacji/usuniecia.

## Wygenerowane mapy

Mapy musza byc aktualizowane komendami:

```bash
npm run audit:closeflow-ui-map
npm run audit:closeflow-style-map
```

Pliki kontrolne:

- `docs/ui/CLOSEFLOW_UI_MAP.generated.md`
- `docs/ui/closeflow-ui-map.generated.json`
- `docs/ui/CLOSEFLOW_STYLE_MAP.generated.md`
- `docs/ui/closeflow-style-map.generated.json`

## Swiadome wyjatki

| Obszar | Status | Decyzja |
|---|---|---|
| `/tasks` visual parity | PRZYSZLY_DEBT | Stage16B wskazal `WYMAGA_STAGE16C`. Naprawiac tylko screenshot-driven. |
| `/cases` visual parity | PRZYSZLY_DEBT | Stage16B wskazal `WYMAGA_STAGE16C`. Naprawiac tylko screenshot-driven. |
| `Today.tsx` | POZA_AKTYWNYM_UI_DEBT | Legacy inactive. Nie miesza sie z aktywnym UI debt. |
| Calendar/notifications contrast | DO_POTWIERDZENIA_SCREENSHOTEM | Osobny temat, jesli pojawi sie screenshot lub blad kontrastu. |

## Co jest domkniete

- metrics
- page hero
- surface/right-card
- list row
- status/progress
- alert/severity
- action/danger
- session action
- action placement
- form/footer
- card readability
- entity type
- Today legacy inactive handling
- generated map refresh process

## Co zostaje jako przyszly debt

1. Stage16C: screenshot-driven repair tylko dla `/tasks` i `/cases`.
2. Osobny etap archiwizacji `Today.tsx`, jesli zapadnie decyzja o usunieciu legacy pliku.
3. Osobny contrast/readability repair dla `/notifications` albo `/calendar` tylko po konkretnym screenshocie lub bledzie.

## Weryfikacja

```bash
npm run check:closeflow-final-active-ui-contract-audit
npm run audit:closeflow-ui-map
npm run audit:closeflow-style-map
npm run build
```

## Kryterium zakonczenia

- dokument Stage18 istnieje,
- kazdy glowny obszar stylu ma zrodlo prawdy,
- aktywny `src` nie tworzy nowych lokalnych systemow `metric-fix`, `tile-v2`, `action-repair`, `severity-fix`, `page-head-v2`,
- `Today.tsx` jest legacy inactive i nie blokuje aktywnego UI debt,
- mapy UI/style sa aktualizowane,
- build przechodzi,
- commit i push ida na `dev-rollout-freeze` dopiero po zielonych checkach.
