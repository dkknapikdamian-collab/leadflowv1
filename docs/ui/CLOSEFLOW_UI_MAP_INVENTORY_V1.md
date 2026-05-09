# CloseFlow UI Map Inventory v1

Cel etapu: zmapować każdą standardową ikonę, każdy kafelek/metrikę oraz położenie sekcji UI przed refaktorem.

Ten etap nie naprawia jeszcze wyglądu. To jest skan i dokumentacja, żeby kolejny etap nie był zgadywaniem.

## Zakres mapy

- importy ikon z `lucide-react`, z przypisaniem do roli semantycznej,
- użycia `StatShortcutCard`,
- lokalne komponenty typu `InfoRow`, `InfoLine`, `StatCell`, lokalne action buttony,
- regiony `data-ui-*` i `data-cf-*`,
- reguły layoutu: shell, rail, grid, media query, pozycje desktop/mobile,
- miejsca, gdzie widać hotfixy, `!important` i lokalne override'y.

## Dlaczego to robimy

Nie da się dobrze ujednolicić UI bez mapy. Jeśli od razu przepniemy tylko `ClientDetail`, zostawimy inne wyspy stylu. Mapa ma pokazać, gdzie są wszystkie źródła rozjazdów.

## Kryterium zakończenia

- istnieje `docs/ui/CLOSEFLOW_UI_MAP.generated.json`,
- istnieje `docs/ui/CLOSEFLOW_UI_MAP.generated.md`,
- działa `npm run audit:closeflow-ui-map-inventory-v1`,
- działa `npm run check:closeflow-ui-map-inventory-v1`,
- build aplikacji przechodzi.

## Następny etap

Po zatwierdzeniu mapy: `CloseFlow UI Contract v1`, czyli SemanticIcon, EntityInfoRow, EntityNoteCard, EntityDetailShell i guard blokujący nowe lokalne rozjazdy.
