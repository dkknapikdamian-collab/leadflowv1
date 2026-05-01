# P0 — Today operator sections fix

## Problem

Diagnostyka produkcyjna pokazała, że aplikacja poprawnie pobiera dane:

- /api/tasks -> 55 rekordów
- /api/leads -> 4 rekordy
- /api/events -> 7 rekordów
- /api/cases -> 7 rekordów
- /api/system?kind=ai-drafts -> 4 rekordy

Jednocześnie kafelki w zakładce **Dziś** pokazywały 0 wpisów dla leadów, wydarzeń i zadań, a szkice działały poprawnie.

To potwierdziło, że problem nie siedzi w API, tokenie, workspace ani Supabase, tylko w warstwie składania sekcji Today.

## Zmiana

Warstwa harmonogramu dostała tryb operatorski dla dzisiejszego zakresu:

- niezrobione zadania z datą przed aktualnym momentem nadal trafiają do listy Today,
- aktywne leady bez zaplanowanego następnego kroku trafiają do Today jako elementy wymagające ruchu,
- leady z zaległym nextActionAt również trafiają do Today,
- szkice AI pozostają bez zmian.

## Czego nie zmieniono

- Nie zmieniono API.
- Nie zmieniono Supabase.
- Nie zmieniono auth/workspace.
- Nie zmieniono UI layoutu.

## Weryfikacja

- npm.cmd run check:p0-today-operator-sections
- npm.cmd run check:p0-today-loader-supabase-api
- npm.cmd run check:polish-mojibake
- npm.cmd run test:critical
