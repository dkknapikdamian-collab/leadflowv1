# CLOSEFLOW_ETAP6_CASES_CLEAN_LIST_TITLE_COMPLETENESS — 2026-05-11

## Cel

Na widoku `/cases` lista spraw ma być czysta:

- bez technicznego dopisku w tytule karty,
- bez tekstu typu `100% kompletności`, `0% kompletności`, `x% kompletności`,
- bez mojibake w renderowanym tytule.

## Co zmieniono

1. Dodano `cleanCaseListTitle(value)`.
2. Lista spraw renderuje tytuł przez `cleanCaseListTitle(record.title || record.clientName || 'Sprawa bez nazwy')`.
3. Nowe sprawy z kontekstu klienta nie dostają już technicznego sufiksu.
4. Nowe sprawy z podpowiedzi klienta nie dostają już technicznego sufiksu.
5. Z metadanych listy usunięto fallback `x% kompletności`.
6. Nie usunięto `completenessPercent` z modelu danych.
