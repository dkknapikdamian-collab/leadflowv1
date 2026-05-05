# Stage86O - Stripe subscription card-only safe patch

Data: 2026-05-05  
Branch: dev-rollout-freeze

## Problem

Poprzednia paczka Stage86N miaĹ‚a bĹ‚Ä…d parsera PowerShell przez kruche cytowanie w liniach `-replace`.

Realny problem Stripe nadal jest ten sam:

`The payment method blik cannot be used in subscription mode.`

## Decyzja

Dla odnawialnych planĂłw zostaje:

- `mode=subscription`
- `payment_method_types[0]=card`
- webhook jako ĹşrĂłdĹ‚o `paid_active`
- cancel/resume na subskrypcji

BLIK nie moĹĽe byÄ‡ uĹĽyty w tym flow. JeĹ›li BLIK wrĂłci, musi byÄ‡ osobnym flow `mode=payment`, czyli jednorazowy zakup dostÄ™pu na okres, nie klasyczna subskrypcja.

## Zmiany

- usuniÄ™to BLIK z checkouta subskrypcyjnego
- dodano marker `STAGE86O_STRIPE_SUBSCRIPTION_CARD_ONLY_SAFE_PATCH`
- Billing UI nie powinno obiecywaÄ‡ Stripe/BLIK dla subskrypcji
- P14 i Stage86M pilnujÄ…, ĹĽeby BLIK nie wrĂłciĹ‚ do `subscription`
- dodano check/test Stage86O

## Kryterium zakoĹ„czenia

- Stage86O PASS
- Stage86M PASS
- P14 PASS
- Stage86K PASS
- build PASS
- commit + push

## NastÄ™pny test rÄ™czny

Po deployu wejĹ›Ä‡ w `/billing` i ponownie uruchomiÄ‡ checkout.

Oczekiwane:
- bĹ‚Ä…d BLIK/subscription znika
- Stripe checkout otwiera siÄ™ z kartÄ…
