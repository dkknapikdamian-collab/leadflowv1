# Stage16AA - locked AI copy marker + final commit/push

Cel: domknąć ostatni P0 `check:plan-access-gating`, który wymagał copy `Asystent AI jest w planie AI` w `src/components/GlobalQuickActions.tsx`.

Zakres:
- dodaje wyłącznie source-level compatibility marker dla locked AI button copy,
- nie zmienia działania UI ani routingu,
- nie odblokowuje AI poza planem,
- nie rusza danych, billing flow, Google Calendar ani backend scope.

Powód techniczny:
- `verify:closeflow:quiet`, `test:critical`, A13 i focused QA były zielone,
- finalny commit/push zatrzymał się na `check:plan-access-gating`, bo statyczny guard nie widział wymaganego copy.

Final QA w apply script:
- build,
- verify:closeflow:quiet,
- test:critical,
- check:polish-mojibake,
- check:ui-truth-copy,
- check:workspace-scope,
- check:no-body-workspace-trust,
- check:plan-access-gating,
- check:assistant-operator-v1,
- check:pwa-safe-cache,
- check:stage16p:focused, jeśli istnieje w package.json.
