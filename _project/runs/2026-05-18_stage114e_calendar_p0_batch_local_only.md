# Stage114E - Calendar P0 batch local-only

## Status
DO WDROŻENIA LOKALNIE / BEZ PUSHA.

## Cel
Zamknąć nierozliczony Stage114 w wąskim zakresie:
- hard refresh `/calendar` nie może publikować pustego kalendarza przed `workspaceReady`,
- `+1D` i `+1W` muszą zapisywać pola daty taska czytane przez kalendarz,
- modal edycji/tworzenia wpisu musi mieścić się w viewport i zachować opis Radix,
- Calendar nie może zawierać mojibake.

## Zakres plików
- `src/pages/Calendar.tsx`
- `src/styles/visual-stage22-event-form-vnext.css`
- `tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs`
- `tests/stage114-calendar-shift-persistence-contract.test.cjs`
- `tests/stage114-calendar-modal-viewport-contract.test.cjs`
- `scripts/check-stage114-calendar-mojibake.cjs`
- `tools/patch-stage114e-calendar-p0-batch-local-only.cjs`

## Decyzja
Nie ruszać szeroko month grid ani selected-day visual. Punkt 5 z testu Damiana ma zostać nietknięty poza skutkami ubocznymi koniecznymi dla danych i modali.

## Co poprawia patch
1. Loader danych:
   - czeka na `workspaceReady`, `workspace?.id` i `requireWorkspaceId(workspace)`,
   - nie ustawia pustych tablic jako finalnego stanu przed gotowością workspace,
   - robi natychmiastowy load i retry po `250/900/1800 ms` po gotowości workspace.
2. Shift tasków:
   - używa fallbacku `entry.sourceId || entry.raw?.id || entry.id`,
   - przekazuje `date`, `scheduledAt`, `dueAt`, `time`,
   - robi `await refreshSupabaseBundle()` po update.
3. Modal:
   - `max-height: calc(100vh - 64px)`,
   - body formularza scrolluje,
   - footer jest sticky i nie przykrywa pól,
   - opis Radix zostaje kompatybilny ze Stage114D/Stage116.
4. Mojibake:
   - usuwa typowe `U+0139`, `U+00C4`, `U+0102`, `U+00C2`, `U+00E2`, `U+FFFD` z Calendar i wzmacnia guard.

## Testy automatyczne w paczce
- `node scripts/check-stage114-calendar-mojibake.cjs`
- `node --test tests/stage114-calendar-hard-refresh-data-load-contract.test.cjs`
- `node --test tests/stage114-calendar-shift-persistence-contract.test.cjs`
- `node --test tests/stage114-calendar-modal-viewport-contract.test.cjs`
- `node --test tests/stage116-dialog-description-accessibility-contract.test.cjs`, jeśli istnieje
- `npm run build`
- `npm run verify:closeflow:quiet`

## Tryb pracy
Local-only. Brak commit, brak push. Batch ma zostać oceniony po lokalnym wyniku testów.

## Test ręczny po wdrożeniu
- `/calendar` hard refresh pokazuje wpisy bez przechodzenia na inny ekran.
- `+1D` i `+1W` realnie przesuwają task po odświeżeniu.
- Modal create/edit nie jest ucięty od góry/lewej, formularz scrolluje, footer nie przykrywa pól.
- Konsola bez Radix warning.
- Month grid / selected day bez szerokich zmian wizualnych.
