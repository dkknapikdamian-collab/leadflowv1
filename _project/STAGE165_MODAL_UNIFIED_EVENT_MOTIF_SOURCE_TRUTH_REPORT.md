# STAGE165 Modal Unified Event Motif Source Truth — raport

Data: 2026-05-23  
Projekt: CloseFlow / LeadFlow  
Zakres: UI / modal source truth / Lead + Task + Event

## Cel

Naprawić problem: każde okienko wygląda inaczej.

Użytkownik wskazał:
- najlepszy motyw ma okno wydarzenia,
- okno wydarzenia jest za duże,
- pozostałe okna są rozjechane,
- wszystkie mają być podpięte pod jedno źródło prawdy wizualne.

## FAKTY

- `src/components/ui/dialog.tsx` jest realnym wspólnym źródłem modalnych okien.
- `DialogContent` ma `data-closeflow-modal-visual-system="true"` oraz klasę `cf-modal-surface`.
- Wcześniejsze Stage158-164 nadpisywały objawy i doprowadziły do różnic między modalami.
- Stage165 ma być ostatnią warstwą, która łapie wspólny atrybut komponentu, nie pojedyncze podokienko.

## DECYZJE DAMIANA

- Motyw: jak wydarzenie, ale mniejsze.
- Wszystkie modalne okna mają wyglądać tak samo.
- Jedno źródło prawdy dla lead/task/event.
- Lokalnie, bez pusha/deploya do akceptacji.

## HIPOTEZY AI

- Problem nie jest już w położeniu jednego modala, ale w braku wspólnego kontraktu wizualnego.
- Poprawka powinna celować w `data-closeflow-modal-visual-system`, bo to jest realny wspólny marker z `DialogContent`.
- Najlepiej odciąć wpływ starych modal-stage CSS przez finalny import Stage165 po Stage164.

## Pliki

- `src/styles/closeflow-modal-unified-event-motif-source-truth-stage165.css`
- `scripts/apply-stage165-modal-unified-event-motif.cjs`
- `scripts/check-stage165-modal-unified-event-motif.cjs`
- `docs/ui/CLOSEFLOW_STAGE165_MODAL_UNIFIED_EVENT_MOTIF_SOURCE_TRUTH.md`
- `docs/ui/CLOSEFLOW_STAGE165_RUNTIME_MODAL_AUDIT.js`
- `_project/STAGE165_MODAL_UNIFIED_EVENT_MOTIF_SOURCE_TRUTH_REPORT.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/2026-05-23 - CloseFlow Stage165 modal unified event motif source truth.md`

## Testy automatyczne

```powershell
node scripts/check-stage165-modal-unified-event-motif.cjs
npm.cmd run build
```

## Testy ręczne

- `/calendar` → `+ Wydarzenie`
- `/leads` → `+ Lead`
- `/tasks` → `+ Zadanie`
- sprawdzić: ten sam motyw, mniejszy modal, brak ucięcia góry, footer nie zasłania treści.

## Czego nie ruszano

- dane
- auth
- Supabase
- Google Calendar
- Stripe
- AI
- routing
- deployment
- push
