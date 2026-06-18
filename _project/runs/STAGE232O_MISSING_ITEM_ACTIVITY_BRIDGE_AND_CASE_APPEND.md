# STAGE232O_MISSING_ITEM_ACTIVITY_BRIDGE_AND_CASE_APPEND

- data i godzina: 2026-06-18 05:35 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- SQL: NIE
- zakres: LeadDetail + CaseDetail missing_item activity bridge and saved-record append

## Audyt

Po STAGE232N etykiety w LeadDetail są poprawne tylko wtedy, gdy entry ma type/status/payload missing_item. Zrzut ekranu pokazuje jednak "Zadanie · Zaległe" w grupie "Braki i blokady". To oznacza, że wpis jest rozpoznawany jako missing przez activity bridge / grupę, ale sam timeline entry nie ma metadanych missing_item dla helpera etykiety.

W CaseDetail dodany Brak trafia do "Wszystkie aktywne" jako zadanie. Kod buildWorkItems klasyfikuje task jako missing tylko, gdy task ma type/status/payload missing_item. Jeśli API normalizuje task do zwykłego taska, CaseDetail nie używa jeszcze activity missing_item_created jako mostu klasyfikacji.

## Zmiana

- LeadDetail oznacza activeMissingItemEntriesStage232AR8 i leadActiveWorkPreviewEntries markerem stage232oMissingItem/displayKind/businessKind.
- isMissingItemTimelineEntry rozpoznaje aktywne braki także po stage232oMissingItem/displayKind/businessKind.
- ContextActionDialogs przekazuje do closeflow:context-action-saved wzbogacony rekord missing_item, nie surowy response task.
- CaseDetail buduje activity metadata dla missing_item_created i wzbogaca taski przed buildWorkItems.

## Ryzyka

- Jeśli po hard refreshu dalej będzie "Zadanie", API może nie zwracać ani payloadu taska, ani aktywności missing_item_created dla tej sprawy/leada.
- Stare legacy case_items/checklist nadal są osobnym tematem.
