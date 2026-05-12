# CLOSEFLOW STAGE14C REPAIR1 ACTUAL CASE DETAIL PATCH 2026-05-12

Cel: naprawić poprzedni etap 14C, który zainstalował guardy, ale nie zmienił `src/pages/CaseDetail.tsx`.

Zakres:
- twardo wymaga realnej zmiany `src/pages/CaseDetail.tsx`,
- usuwa użycie roadmapy sprawy z widoku `/cases/:id`,
- usuwa lokalny import `ActivityRoadmap` oraz `buildCaseActivityRoadmap`,
- usuwa panel portalu/źródeł z prawego raila, jeśli występuje w aktualnym JSX,
- upraszcza breadcrumb/header, żeby nie dublować nazwy sprawy/statusu,
- nie usuwa backendu portalu, zadań, wydarzeń ani rozliczeń.

Kryterium: commit musi zawierać `src/pages/CaseDetail.tsx`. Inaczej etap jest niewdrożony.
