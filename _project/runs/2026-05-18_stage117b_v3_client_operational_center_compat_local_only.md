# Stage117B v3 - ClientDetail operational center compat local-only

## Status
LOCAL-ONLY / DO TESTU.

## Problem
Stage117B v2 poprawił ClientDetail pod decyzję: klient nie ma aktywnego widoku leadów. Focused guardy, kontrakt relacji klienta i finalny operating model przeszły, ale pełny quiet release gate zatrzymał się na starym teście `client-detail-v1-operational-center.test.cjs`.

## Przyczyna
Stary test wymagał route do sprawy przez `lead.linkedCaseId`, czyli starego modelu lead-cockpit w kartotece klienta. To kłóci się z decyzją Stage117B: klient pokazuje sprawy i historię pozyskania, ale nie aktywny widok leadów.

## Decyzja
Nie przywracać widoku leadów. Zaktualizować tylko stary kontrakt V1 operational center, żeby wymagał:
- route do aktualnych spraw klienta,
- braku legacy `/case/...`,
- braku linków i CTA `Otwórz lead`,
- obecności markeru `STAGE117B_CLIENT_DETAIL_NO_LEAD_VIEW_CONTRACT`.

## Pliki
- `tests/client-detail-v1-operational-center.test.cjs`
- `tools/patch-stage117b-v3-client-operational-center-compat-local-only.cjs`
- `_project/runs/2026-05-18_stage117b_v3_client_operational_center_compat_local_only.md`

## Testy automatyczne w paczce
- `node --check tools/patch-stage117b-v3-client-operational-center-compat-local-only.cjs`
- `node tools/patch-stage117b-v3-client-operational-center-compat-local-only.cjs`
- `node --test tests/client-detail-v1-operational-center.test.cjs`
- `node --test tests/stage117b-client-detail-no-lead-view-contract.test.cjs`
- `node --test tests/client-relation-command-center.test.cjs`
- `node --test tests/client-detail-final-operating-model.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## Git
Bez commita i bez pusha.

## Test ręczny
- Otworzyć kartotekę klienta.
- Sprawdzić, że główna praca idzie przez sprawy.
- Sprawdzić, że nie ma aktywnego widoku leadów ani CTA `Otwórz lead`.
- Sprawdzić, że informacja o źródle pozyskania została jako historia/sygnał, nie jako osobny cockpit.
