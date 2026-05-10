# CloseFlow Action Icon Registry

**Data:** 2026-05-09  
**Etap:** VS-2C â€” Action icon registry  
**Status:** centralny rejestr ikon akcji, osobny od ikon encji

## Cel

Ikony akcji majÄ… jedno ĹşrĂłdĹ‚o prawdy. Rejestr akcji jest osobny od rejestru encji.

Encje typu `client`, `lead`, `case`, `billing` zostajÄ… w:

```text
src/components/ui-system/icon-registry.ts
```

Akcje typu plus, kosz, search, edit, save, refresh zostajÄ… w:

```text
src/components/ui-system/action-icon-registry.ts
```

## Zasada gĹ‚Ăłwna

Zmiana ikony kosza, plusa, wyszukiwania, edycji albo zapisu ma odbywaÄ‡ siÄ™ w jednym miejscu:

```ts
export const ACTION_ICON_MAP = {
  delete: Trash2,
  add: Plus,
  search: Search,
  edit: Pencil,
  save: Save,
}
```

Nie przepinamy jeszcze wszystkich ekranĂłw. To jest tylko registry.

## Pliki ĹşrĂłdĹ‚owe

- `src/components/ui-system/action-icon-registry.ts`
- `src/components/ui-system/ActionIcon.tsx`
- `docs/ui/CLOSEFLOW_ACTION_ICON_REGISTRY_2026-05-09.md`
- `scripts/check-closeflow-action-icon-registry.cjs`

## Minimalne uĹĽycie

```tsx
<ActionIcon action="delete" />
<ActionIcon action="add" />
<ActionIcon action="search" />
```

`ActionIcon` przyjmuje:

```ts
action: keyof typeof ACTION_ICON_MAP
size?: 'sm' | 'md' | 'lg'
tone?: 'default' | 'soft' | 'strong' | 'danger'
```

## Akcje minimum

| Akcja | Znaczenie | Ikona domyĹ›lna |
|---|---|---|
| `add` | dodaj / utwĂłrz | `Plus` |
| `edit` | edytuj | `Pencil` |
| `delete` | usuĹ„ / kosz | `Trash2` |
| `restore` | przywrĂłÄ‡ | `RotateCcw` |
| `search` | szukaj | `Search` |
| `save` | zapisz | `Save` |
| `cancel` | anuluj / zamknij | `X` |
| `back` | wrĂłÄ‡ | `ArrowLeft` |
| `copy` | kopiuj | `Copy` |
| `open` | otwĂłrz / przejdĹş | `ExternalLink` |
| `archive` | archiwizuj | `Archive` |
| `filter` | filtruj | `Filter` |
| `settings` | ustawienia akcji / konfiguracji | `Settings` |
| `refresh` | odĹ›wieĹĽ / ponĂłw | `RefreshCw` |
| `calendar` | kalendarz / termin | `Calendar` |
| `note` | notatka | `StickyNote` |
| `task` | zadanie | `ClipboardList` |

## Jak zmieniÄ‡ ikonÄ™ kosza globalnie

1. OtwĂłrz:

```text
src/components/ui-system/action-icon-registry.ts
```

2. ZmieĹ„ tylko wpis w `ACTION_ICON_MAP`:

```ts
delete: Trash2,
```

na przykĹ‚ad na:

```ts
delete: ArchiveX,
```

3. Nie zmieniaj ekranĂłw jeden po drugim.
4. Nie mieszaj tego z `ENTITY_ICON_MAP`, bo to jest rejestr encji.

## Czego nie robi VS-2C

- Nie przepina masowo aktywnych ekranĂłw.
- Nie usuwa bezpoĹ›rednich importĂłw ikon akcji z istniejÄ…cych ekranĂłw.
- Nie miesza ikon akcji z ikonami encji.
- Nie zmienia wyglÄ…du przyciskĂłw.
- Nie zmienia `EntityIcon` ani `ENTITY_ICON_MAP`.

## Weryfikacja

```bash
npm run check:closeflow-action-icon-registry
npm run build
```

## Kryterium zakoĹ„czenia

VS-2C jest zakoĹ„czony, gdy:

1. `ACTION_ICON_MAP` istnieje,
2. zawiera wszystkie akcje minimum,
3. `ActionIcon` istnieje i korzysta z `ACTION_ICON_MAP`,
4. `src/components/ui-system/index.ts` eksportuje `ActionIcon` i `action-icon-registry`,
5. dokument mĂłwi, jak zmieniÄ‡ ikonÄ™ kosza/plusa/search globalnie,
6. check i build przechodzÄ….