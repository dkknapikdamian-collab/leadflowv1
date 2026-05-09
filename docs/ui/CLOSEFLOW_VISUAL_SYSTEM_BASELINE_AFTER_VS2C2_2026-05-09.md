# CloseFlow Visual System Baseline After VS-2C-2 — 2026-05-09

Marker: `CLOSEFLOW_VISUAL_SYSTEM_BASELINE_AFTER_VS2C2`

## Status

Baseline freeze po odłożeniu VS-2C-2.

To jest bezpieczny punkt startowy pod dalsze etapy Visual System. Ten etap nie migruje dużych stron legacy i nie dotyka runtime list pages.

## Shipped

- VS-0: Visual system inventory freeze
- VS-1: Design system token foundation
- VS-2: Component registry
- VS-2B: Entity icon registry
- VS-2C-mini: Action icon registry foundation
- VS-2C-1: Action icons in global components

## Deferred

- VS-2C-2: deferred

Powód: migracja ikon w list pages była zbyt ryzykowna, bo regexowe przepinanie importów w `Leads.tsx`, `Clients.tsx` i `Cases.tsx` destabilizowało importy React.

## Not started

- VS-2D: next
- Runtime adoption semantic visual registry
- Manual one-file-at-a-time migration of legacy page semantic colors
- Optional later adapter layer for list action icons

## Baseline checks

Przed kolejnym etapem uruchomić:

```bash
npm run check:closeflow-action-icon-registry
npm run check:closeflow-vs2c1-action-icons-components
npm run check:closeflow-entity-icon-registry
npm run check:closeflow-visual-system-baseline-after-vs2c2
npm run build
```

## Safety rules

- Nie ruszać ponownie VS-2C-2 bez ręcznej strategii plik po pliku.
- Nie robić hurtowych migracji wielu legacy pages.
- Jeśli etap dotyka legacy page, maksymalnie jeden plik na etap.
- Każdy etap ma mieć własny check.
- Jeśli koszt repairów rośnie, reset tylko dotkniętych plików i dokumentujemy deferred.
