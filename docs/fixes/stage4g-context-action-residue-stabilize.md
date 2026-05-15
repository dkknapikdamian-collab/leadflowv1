# Stage 4G — ContextActionButton residue stabilize

Cel: ustabilizować repo po nieudanej automatycznej migracji quick actions z etapów 4 / 4B / 4C oraz nieudanym cleanupie 4E / 4F.

Ten etap nie domyka pełnej unifikacji quick actions. Przywraca bezpieczny komponent kompatybilności, jeśli `ClientDetail.tsx` nadal zawiera nietrywialne użycia `ContextActionButton`, których nie da się usunąć bez ryzyka utraty logiki kliknięcia.

## Zakres

- przywraca `src/components/ContextActionButton.tsx`,
- przywraca `src/styles/context-action-button-source-truth.css`,
- pilnuje importu komponentu w `ClientDetail.tsx`, jeśli występuje użycie,
- usuwa stare guardy cleanupu, które zakładały całkowite usunięcie komponentu,
- dodaje nowy guard stabilizacyjny.

## Czego nie robi

- nie zmienia API,
- nie zmienia formularzy,
- nie robi commita,
- nie robi pusha,
- nie robi deployu,
- nie uznaje pełnego Etapu 4 za funkcjonalnie zamknięty.
