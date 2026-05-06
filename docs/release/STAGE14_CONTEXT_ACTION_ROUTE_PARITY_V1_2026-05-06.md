# STAGE14_CONTEXT_ACTION_ROUTE_PARITY_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Utrzymac jednolite sciezki akcji dla przyciskow typu zadanie / wydarzenie / notatka na ekranach leada, klienta i sprawy.

## Teza

The same action opens the same shared dialog and writes through the same relation-aware save path.

## Co jest pilnowane

- `ContextActionDialogs.tsx` jest jednym hostem dla `task`, `event`, `note`.
- Ekrany `LeadDetail`, `ClientDetail`, `CaseDetail` uzywaja `openContextQuickAction` zamiast importowac lokalnie `TaskCreateDialog` albo `EventCreateDialog`.
- `TaskCreateDialog` zapisuje przez `insertTaskToSupabase` i przekazuje `leadId`, `caseId`, `clientId`, `workspaceId`.
- `EventCreateDialog` zapisuje przez `insertEventToSupabase` i przekazuje `leadId`, `caseId`, `clientId`, `workspaceId`.
- Event zapisuje `scheduledAt: form.startAt`, zeby widok kalendarza i widoki powiazane mialy ten sam punkt czasu.

## Czego nie zmienia

- Brak przebudowy wizualnej.
- Brak nowych modalow.
- Brak zmiany layoutu.
- Brak nowej funkcji Vercel API.

## Kryterium zakonczenia

- `npm.cmd run check:stage14-context-action-route-parity-v1` przechodzi.
- `npm.cmd run test:stage14-context-action-route-parity-v1` przechodzi.
- `npm.cmd run build` przechodzi przed commitem i pushem.

## Ryzyko ograniczone

Ten guard ma zatrzymac regresje, w ktorej jeden przycisk wydarzenia otwiera inny modal, zapisuje w innym miejscu albo gubi relacje do leada/sprawy/klienta.
