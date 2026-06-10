# VISUAL SOURCE OF TRUTH — CloseFlow / LeadFlow

Marker: STAGE231D0A_VISUAL_SOURCE_TRUTH_CONSISTENCY
Status: ACTIVE_REPO_SOURCE_OF_TRUTH
Data: 2026-06-10 17:10 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## VISUAL SOURCE OF TRUTH MAP

### Cards:
- Client/detail cards: `src/styles/visual-stage12-client-detail-vnext.css` + shared canvas from `src/styles/closeflow-unified-page-canvas-stage211c.css`.
- Record list cards: `src/styles/closeflow-record-list-source-truth.css` for `/leads` and `/clients`; `/cases` imports the same list source and must stay aligned with it.
- Shared card primitive: `src/components/ui-system/SurfaceCard.tsx`.
- Metric/status tiles: `src/components/ui-system/MetricTile.tsx` backed by `OperatorMetricTiles`.
- Finance cards and rows: `src/components/finance/FinanceMiniSummary.tsx` + `src/styles/finance/closeflow-finance.css`.

### Buttons:
- Primary/secondary/outline/danger primitive: `src/components/ui/button.tsx` and `buttonVariants`.
- Entity-level actions: `src/components/entity-actions.tsx`.
- Delete/trash action: `EntityTrashButton`, `trashActionButtonClass`, `trashActionIconClass` in `src/components/entity-actions.tsx`.
- Modal/form action row: `formActionsClass`, `modalFooterClass` in `src/components/entity-actions.tsx`.

### Badges:
- Main status badge primitive: `src/components/ui-system/StatusPill.tsx`.
- Finance status badge: `StatusPill` consumed by `src/components/finance/FinanceMiniSummary.tsx`.
- Legacy page badges may still exist, but new UI work should prefer `StatusPill` or document why the old local class is still required.

### Icons:
- Entity icon map: `src/components/ui-system/icon-registry.ts`.
- Entity icon component: `src/components/ui-system/EntityIcon.tsx`.
- Current semantic map from repo scan:
  - client -> `UserRound`
  - case -> `Briefcase`
  - lead -> `Target`
  - task -> `ClipboardList`
  - event -> `Calendar`
  - payment/finance -> `Wallet`
  - commission -> `BadgeDollarSign`
  - note/template -> `FileText`
  - activity/history -> `Activity`
  - AI -> `Sparkles`
- Rule: do not import random entity icons page-locally when `EntityIcon` or `ENTITY_ICON_MAP` can express the same thing.

### Finance rows:
- Main finance source: `src/components/finance/FinanceMiniSummary.tsx`.
- Required shared labels:
  - Prowizja należna
  - Wpłacono prowizji
  - Do zapłaty prowizji
  - Koszty poniesione
  - Koszty do zwrotu
  - Koszty zwrócone
  - Razem do pobrania
- D0A confirms current commission rows exist. Cost rows are planned for D1-D3 and must use the same finance language instead of page-local labels.

### Typography:
- Card title pattern: `SurfaceCard` title uses `text-base font-black tracking-tight`.
- Record row title pattern: `closeflow-record-list-source-truth.css` uses compact row title sizing.
- Finance number pattern: `FinanceMiniSummary` uses `cf-finance-mini-summary__value` and `cf-finance-metric`.
- Do not introduce arbitrary local `font-size: 13px/17px/19px` in new UI without tying it to an existing source or documenting a scoped exception.

### Spacing:
- Shared page canvas: `src/styles/closeflow-unified-page-canvas-stage211c.css` with `--cf-page-canvas-*` variables.
- Record list grid/row spacing: `src/styles/closeflow-record-list-source-truth.css`.
- Detail page shell spacing: `--cf-detail-shell-*` and `--cf-page-canvas-*` in unified canvas CSS.
- Entity action gaps/regions: `src/components/entity-actions.tsx`.

### Colors:
- Primary blue: currently used in `buttonVariants`/header/action styles.
- Finance positive/commission: `StatusPill` green/amber/red tone plus finance CSS.
- Cost warning/red/orange: planned for D1-D3; must be added through finance source, not a local green/red block in ClientDetail.
- Warning amber: `StatusPill` amber and SurfaceCard warning tone.
- Muted gray: `SurfaceCard` muted tone, shared row styles, canvas variables.
- Danger red: `Button` destructive variant and `EntityTrashButton` source.

## Zasada robocza dla kolejnych etapów UI

Jeżeli istnieje komponent/wzorzec, developer ma go użyć. Jeżeli nie istnieje, developer ma zaproponować jedno źródło prawdy, ale nie tworzyć lokalnego stylu tylko dla jednej strony.

## Ryzyka:
- W repo nadal istnieją historyczne style page-local; nie wolno ich powielać jako nowych wzorców.
- D0/D1-D3 mogą kusić lokalnym CSS dla kart spraw/finansów w kliencie. To ma być blokowane przez guard D0A i raport VST.
- Ikony są częściowo centralne, ale starsze importy `lucide-react` na stronach nadal istnieją. Nowe entity icons powinny iść przez `EntityIcon`.

## Następny krok:
D0 ma przebudowywać klienta i sprawy na bazie tej mapy, bez tworzenia drugiego systemu kart, przycisków, badge'y, ikon i finance rows.
