# Stage 20 - Billing and test contract final fix

Etap naprawia dwa problemy po V19:

- stary test Billing nadal szuka znacznika Stripe/BLIK,
- test Stage18 mial bledny zapis regexu i nie parsowal sie w Node/TypeScript.

Nie zmienia logiki platnosci. Nie wykonuje SQL. Nie usuwa Stripe.
