# CloseFlow Entity Icon Registry

**Data:** 2026-05-09  
**Etap:** VS-2B — Entity icon registry  
**Status:** centralny rejestr ikon encji, bez masowego przepinania ekranów

## Cel

Zmiana ikonki albo stylu encji ma po migracji odbywać się w jednym miejscu. To dotyczy encji domenowych, np. klient, lead, sprawa, zadanie, wydarzenie, płatność, billing.

Ten etap buduje rejestr. Nie przepina jeszcze wszystkich ekranów.

## Pliki źródłowe

- `src/components/ui-system/icon-registry.ts`
- `src/components/ui-system/EntityIcon.tsx`
- `src/styles/design-system/closeflow-icons.css`
- `scripts/check-closeflow-entity-icon-registry.cjs`

## Minimalne API

```tsx
<EntityIcon
  entity="client"
  size="md"
  tone="soft"
/>
```

```ts
entity: keyof typeof ENTITY_ICON_MAP
size?: 'sm' | 'md' | 'lg'
tone?: 'default' | 'soft' | 'strong'
```

## Encje objęte rejestrem

| Encja | Użycie |
|---|---|
| `client` | `<EntityIcon entity="client" />` |
| `lead` | `<EntityIcon entity="lead" />` |
| `case` | `<EntityIcon entity="case" />` |
| `task` | `<EntityIcon entity="task" />` |
| `event` | `<EntityIcon entity="event" />` |
| `activity` | `<EntityIcon entity="activity" />` |
| `payment` | `<EntityIcon entity="payment" />` |
| `commission` | `<EntityIcon entity="commission" />` |
| `ai` | `<EntityIcon entity="ai" />` |
| `template` | `<EntityIcon entity="template" />` |
| `notification` | `<EntityIcon entity="notification" />` |
| `settings` | `<EntityIcon entity="settings" />` |
| `billing` | `<EntityIcon entity="billing" />` |

## Jak zmienić ikonę klienta globalnie

1. Otwórz `src/components/ui-system/icon-registry.ts`.
2. Zmień tylko wartość przy kluczu `client` w `ENTITY_ICON_MAP`.

Przykład:

```ts
export const ENTITY_ICON_MAP = {
  client: UserRound,
  // ...
}
```

na przykład na:

```ts
export const ENTITY_ICON_MAP = {
  client: UsersRound,
  // ...
}
```

3. Nie zmieniaj ekranów jeden po drugim.
4. Nie twórz lokalnego importu ikony klienta w page/component, jeśli komponent może użyć `EntityIcon`.

## Jak zmienić kolor/styl klienta globalnie

Kolor encji klienta jest w `src/styles/design-system/closeflow-icons.css`:

```css
--cf-entity-icon-client: var(--cf-icon-client, #2563eb);
```

Style rozmiaru i tonu kontrolują klasy:

- `.cf-entity-icon-size-sm`
- `.cf-entity-icon-size-md`
- `.cf-entity-icon-size-lg`
- `.cf-entity-icon-tone-default`
- `.cf-entity-icon-tone-soft`
- `.cf-entity-icon-tone-strong`

## Czego nie robi VS-2B

- Nie przepina wszystkich aktywnych ekranów.
- Nie usuwa lokalnych ikon z istniejących ekranów.
- Nie wprowadza rejestru ikon akcji.
- Nie zmienia ikon typu `Plus`, `Search`, `Trash2`, `Pencil`, `Save`.

Ikony akcji to osobny etap, np. VS-2C.

## Weryfikacja

```bash
npm run check:closeflow-entity-icon-registry
npm run build
```

## Kryterium zakończenia

VS-2B jest zakończony, gdy:

1. `ENTITY_ICON_MAP` istnieje i zawiera encje minimum,
2. `EntityIcon` przyjmuje `entity`, `size`, `tone`,
3. CSS zawiera klasy rozmiaru, tonu i encji,
4. `ui-system/index.ts` eksportuje `EntityIcon` i `icon-registry`,
5. dokument mówi, jak zmienić ikonę klienta globalnie,
6. check i build przechodzą.
