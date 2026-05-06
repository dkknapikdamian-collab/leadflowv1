# STAGE20B_CONTEXT_ACTION_VERIFY_CHAIN_REPAIR_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Naprawic formalna niespojnosc w lancuchu verify po Stage15. Test Stage15 oczekuje dokladnego aliasu `verify:stage14-action-route-parity`, a rejestracja paczki Stage20 wpisala inny ciag verify.

## Naprawa

- Dodaje alias `verify:stage14-action-route-parity`.
- Ustawia `verify:stage15-context-action-contract`, zeby zawieral `verify:stage14-action-route-parity`.
- Nie zmienia UI.
- Nie dodaje endpointu API.
- Nie zmienia logiki dialogow.

## Kryterium zakonczenia

- Stage15 check przechodzi.
- Stage15 test przechodzi.
- Stage20B check/test przechodza.
- Build przechodzi przed commit/push.
