# Right rail import doctor stage 4 v14

Zakres:
- naprawa strukturalnie sklejonych importów w Leads.tsx i Clients.tsx,
- utrzymanie aktywnych guardów bez usuwania testów,
- brak użycia rg,
- brak commit/push.

Zasada:
Operator rail barrel może importować tylko komponenty raila. Hooki Reacta, routing i ikony wracają do właściwych modułów.
