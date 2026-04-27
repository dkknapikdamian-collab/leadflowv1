# V87 — suma lejka z leadów i klientów

## Cel

Naprawia kafelek / wskaźnik wartości lejka w widoku Leadów.

Lejek ma pokazywać realną sumę z:

- aktywnych leadów,
- klientów.

Sprawy nadal mogą pojawiać się jako kontekst w sekcji najcenniejszych relacji, ale nie podbijają głównej sumy lejka.

## Zmienione pliki

- `src/lib/relation-value.ts`
- `src/pages/Leads.tsx`
- `api/clients.ts`
- `tests/relation-funnel-value.test.cjs`

## Logika po poprawce

- `buildRelationValueEntries(...)` zostaje do listy najcenniejszych relacji.
- `buildRelationFunnelValue({ leads: activeLeads, clients })` liczy główną sumę lejka.
- API klientów przepuszcza pola wartości, jeśli są dostępne w bazie, np. `clientValue`, `contractValue`, `totalValue`, `totalRevenue`, `lifetimeValue`.

## Sprawdzenie po wdrożeniu

```powershell
node tests/relation-funnel-value.test.cjs
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```
