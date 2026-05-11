# CloseFlow Entity Icon Registry

**Data:** 2026-05-09  
**Etap:** VS-2B — Entity icon registry  
**Tryb:** centralny rejestr ikon encji, bez ikon akcji

## Cel

Zmiana ikony klienta, leada, sprawy albo innej encji ma odbywać się w jednym miejscu: `src/components/ui-system/icon-registry.ts`.

## Zasada

Aktywne ekrany nie importują bezpośrednio ikon encji z `lucide-react`. Używają:

```tsx
<EntityIcon entity="client" />
```

albo adapterów zgodnych z propsami ikon, np. `ClientEntityIcon`, gdy starszy komponent wymaga `icon={...}`.

## Encje objęte rejestrem

| Encja | Komponent |
|---|---|
| client | `<EntityIcon entity="client" />` |
| lead | `<EntityIcon entity="lead" />` |
| case | `<EntityIcon entity="case" />` |
| task | `<EntityIcon entity="task" />` |
| event | `<EntityIcon entity="event" />` |
| activity | `<EntityIcon entity="activity" />` |
| payment | `<EntityIcon entity="payment" />` |
| commission | `<EntityIcon entity="commission" />` |
| ai | `<EntityIcon entity="ai" />` |
| template | `<EntityIcon entity="template" />` |
| notification | `<EntityIcon entity="notification" />` |

## Co nie wchodzi do tego etapu

Ikony akcji zostają poza rejestrem encji, między innymi: plus, search, trash, edit, save. One idą do VS-2C.

## Pliki źródłowe

- `src/components/ui-system/icon-registry.ts`
- `src/components/ui-system/EntityIcon.tsx`
- `src/styles/design-system/closeflow-icons.css`
- `scripts/check-closeflow-entity-icon-registry.cjs`

## Kryterium zakończenia

- Rejestr zawiera wszystkie encje minimum.
- `EntityIcon` działa jako publiczny komponent UI systemu.
- `src/components/ui-system/index.ts` eksportuje rejestr i komponent.
- Aktywne ekrany nie importują bezpośrednio ikon encji z `lucide-react`.
- Akcje typu plus/search/trash/edit/save nie są przepinane w tym etapie.
