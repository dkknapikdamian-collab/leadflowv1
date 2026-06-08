# 2026-06-08 - Stage228R17 - Brak delete contract

- data i godzina: 2026-06-08 20:45 Europe/Warsaw
- projekt: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: BUGFIX / AUDYT RYZYK / TEST

## Objaw

Kliknięcie `Usuń` przy wpisie `Brak` usuwało wpis natychmiast z UI, ale po refetchu/odświeżeniu aplikacji wpis wracał.

## Decyzja

Zostawić dobry UX natychmiastowego znikania, ale naprawić kontrakt danych:

`Usuń -> optimistic remove -> backend soft-delete -> nie ustawiaj deleted/missing_item jako next_action -> silent refresh -> po hard refresh wpis nie wraca`.

## Zmienione obszary

- `src/pages/LeadDetail.tsx`
- `src/server/task-route-stage124f.ts`
- `src/lib/supabase-fallback.ts` używany przez `softDeleteTaskInSupabase`
- `scripts/check-stage228r17-missing-item-delete-contract.cjs`
- `tests/stage228r17-missing-item-delete-contract.test.cjs`
- `_project/*`

## Testy

Automatyczne:

```powershell
node scripts/check-stage228r17-missing-item-delete-contract.cjs
node --test tests/stage228r17-missing-item-delete-contract.test.cjs
npm run build
git diff --check
```

Ręczne:

1. Lead -> dodaj `Brak`.
2. Odśwież stronę i potwierdź, że `Brak` istnieje.
3. Kliknij `Usuń`.
4. Wpis ma zniknąć natychmiast bez dużego loadera.
5. Poczekaj 2-3 sekundy.
6. Zrób hard refresh.
7. `Brak` nie może wrócić.
8. `Następny krok` nie może wskazywać usuniętego `Braku`.

## Audyt ryzyk

- Nie wykonano hard delete z bazy. To celowe: repo ma kierunek soft-delete tasków.
- Zmiana dotyka task route i next_action leada; trzeba sprawdzić zwykłe zadanie/follow-up, żeby nie zepsuć normalnego planowania następnego kroku.
- Stare dane, gdzie `next_action_item_id` już wskazuje na stary `missing_item`, mogą wymagać osobnego cleanupu danych tylko jeśli nie zostaną kliknięte/usunięte przez UI.
- Nie ruszano UI layoutu ani styli kafelków.

## Status

Do wykonania lokalnie z ZIP-a, potem manual PASS, potem selektywny commit/push repo i osobny commit/push Obsidiana.
