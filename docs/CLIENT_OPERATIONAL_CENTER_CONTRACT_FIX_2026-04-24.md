# Client operational center contract fix

Data: 2026-04-24

## Problem

Po wdrożeniu Client Detail V1 operational center stary test kontraktowy nadal oczekiwał starej trasy `/case/:id` oraz nie przechodził przez błędnie zapisane polskie znaki w `ClientDetail.tsx`.

## Decyzja

- aktualna trasa sprawy to `/cases/:id`,
- test kontraktowy sprawdza aktualny routing,
- teksty widoczne w panelu klienta zostały poprawione na czytelne polskie znaki,
- nie cofamy wdrożonego centrum operacyjnego klienta.

## Zakres

- `src/pages/ClientDetail.tsx`
- `tests/client-relation-command-center.test.cjs`
