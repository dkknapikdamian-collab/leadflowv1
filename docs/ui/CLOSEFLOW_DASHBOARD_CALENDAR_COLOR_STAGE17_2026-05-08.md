# CLOSEFLOW_DASHBOARD_CALENDAR_COLOR_STAGE17_2026_05_08

## Cel

Stage17 zamyka dwa swiadome wyjatki zostawione po Stage16:

1. Dashboard logout action.
2. Calendar entity type color dla typu Lead.

Ten etap nie zmienia dzialania logout, routingu, sesji, auth, danych kalendarza, sync kalendarza, statusow ani progressu.

## Decyzja semantyczna

### Dashboard logout

Logout wyglada ostrzegawczo, ale nie jest usuwaniem rekordu. Logout nie jest delete i nie jest akcja kasowania rekordu.

Dlatego nie uzywamy:
- EntityActionButton danger,
- cf-entity-action-danger jako kategorii delete/destructive,
- lokalnych klas `text-red-500`, `hover:text-red-600`, `hover:bg-red-50`.

Logout dostaje osobna kategorie:

```text
cf-session-action-danger
data-cf-session-action="logout"
```

To jest session action, nie delete action. Innymi slowy: logout nie jest delete, nie jest danger/delete rekordu i nie powinien byc podpinany pod EntityActionButton danger.

### Calendar entity type

Pill typu wpisu w kalendarzu opisuje rodzaj encji:

- event,
- task,
- lead.

Kolor Lead moze byc amber, ale tylko jako entity type token, nie jako severity, alert, danger ani blad systemowy. Calendar entity type nie jest severity i nie jest cf-alert-error.

Dlatego Calendar dostaje:

```text
cf-entity-type-pill
data-cf-entity-type="lead"
```

Kolory sa w:

```text
src/styles/closeflow-entity-type-tokens.css
```

Nie uzywamy `cf-alert-error` i nie mieszamy entity type color z danger/severity.

## Pliki

- `src/pages/Dashboard.tsx`
- `src/pages/Calendar.tsx`
- `src/styles/closeflow-action-tokens.css`
- `src/styles/closeflow-entity-type-tokens.css`
- `src/index.css`
- `scripts/check-closeflow-dashboard-calendar-color-contract.cjs`
- `package.json`

## Kategorie

| Miejsce | Kategoria | Token | Czego nie uzywa |
|---|---|---|---|
| Dashboard logout | session action | `cf-session-action-danger` | `EntityActionButton danger`, `cf-entity-action-danger` |
| Calendar Lead pill | entity type | `cf-entity-type-pill[data-cf-entity-type="lead"]` | `cf-alert-error`, severity, local Tailwind amber classes |

## Kryterium zakonczenia

- lokalne kolory logout zostaja przeniesione do jawnego session action tokenu,
- lokalny kolor Lead w Calendar zostaje przeniesiony do entity type tokenu,
- danger audit nie powinien traktowac tego jako active unclassified debt,
- dokument wyjasnia, ze logout i entity type to osobne kategorie: logout nie jest delete, a entity type nie jest severity,
- `npm run check:closeflow-dashboard-calendar-color-contract` przechodzi,
- `npm run build` przechodzi.

## Weryfikacja

```bash
npm run check:closeflow-dashboard-calendar-color-contract
npm run check:closeflow-danger-style-contract
npm run build
```
