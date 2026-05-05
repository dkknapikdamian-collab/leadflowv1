# Stage86G - package.json UTF-8 no BOM hotfix

Data: 2026-05-05  
Branch: dev-rollout-freeze  
Zakres: naprawa package.json po Stage86F.

## Cel

Stage86F poprawnie dodaĹ‚ skrypty Stage86D, ale zapisaĹ‚ package.json z UTF-8 BOM.  
Node/Vite traktowaĹ‚y plik jako niepoprawny JSON:

- Unexpected token 'ď»ż'
- build padaĹ‚ podczas czytania package.json
- P14 padaĹ‚ przed wĹ‚aĹ›ciwÄ… walidacjÄ… billing logic

## Zmiana

- usuniÄ™to UTF-8 BOM z package.json
- zapisano package.json jako UTF-8 bez BOM
- zachowano skrypty:
  - check:stage86d-access-gate-block-call
  - 	est:stage86d-access-gate-block-call

## Nie zmieniono

- runtime Stripe
- runtime Google Calendar
- access gate logic
- UI

## Weryfikacja

- JSON.parse(package.json)
- brak BOM na poczÄ…tku package.json
- Stage86B test/check
- Stage86D test/check
- P14 billing validation
- build, jeĹĽeli uruchomiono z -RunBuild

## Status

Billing access gate: kodowo domkniÄ™ty po Stage86D/86E/86G.  
Stripe i Google Calendar nadal wymagajÄ… realnego E2E z ENV i panelami zewnÄ™trznymi.