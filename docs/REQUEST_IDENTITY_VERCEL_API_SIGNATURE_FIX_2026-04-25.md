# Request identity Vercel API signature fix

Data: 2026-04-25

## Problem

Vercel typecheck pokazal bledy:

- api/support.ts: Expected 1 arguments, but got 2
- api/system.ts: Expected 1 arguments, but got 2
- api/system.ts: Property 'fullName' does not exist

Powod: helper getRequestIdentity po odtworzeniu w src/server/_request-scope.ts przyjmowal tylko req i zwracal userId/email/workspaceId. Istniejace endpointy API wolaja go tez jako getRequestIdentity(req, body) i czytaja identity.fullName.

## Poprawka

Zmieniono sygnature:

getRequestIdentity(req: any, bodyInput?: any)

oraz dodano fullName do zwracanego obiektu.

## Kryterium zakonczenia

- npm.cmd run verify:closeflow:quiet przechodzi
- Vercel nie pokazuje TS2554 dla getRequestIdentity
- Vercel nie pokazuje TS2339 dla identity.fullName
