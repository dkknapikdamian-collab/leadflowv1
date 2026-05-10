# CLOSEFLOW FIN-8 SurfaceCard dedup REPAIR3 2026-05-10

Cel: usunąć regresję TypeScript `Duplicate identifier 'SurfaceCard'` w `src/components/finance/FinanceSnapshot.tsx` po zbiorczej integracji wizualnej finansów.

Zakres:
- dokładnie jeden import `SurfaceCard` z `../ui-system`,
- brak bezpośredniego importu z `../ui-system/SurfaceCard`,
- zachowanie zmian FIN-8/FIN-6 w plikach finansowych,
- pełne bramki: FIN-8, FIN-6, FIN-7, FIN-5, API-0, runtime data-contract, import-boundary, TypeScript i build.
