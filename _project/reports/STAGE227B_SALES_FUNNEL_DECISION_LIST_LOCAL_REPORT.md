# STAGE227B — Sales Funnel Decision List UX Rewrite — local report

Data i godzina: 2026-06-06 15:45 Europe/Warsaw

## Cel

Naprawić ręczny UX FAIL po Stage227A. Obecny kanban `/funnel` był technicznie poprawny, ale nieczytelny: za dużo kolumn, za ciasne karty, brak jednej decyzji dla właściciela.

## Zmiana

`/funnel` zostaje osobną zakładką, ale jako panel decyzyjny:

1. Kafle decyzji właściciela.
2. Pasek etapów jako filtr.
3. Jedna szeroka lista rekordów.
4. Panel „Priorytet teraz”.

## Nie ruszano

- Supabase schema.
- RLS.
- API mutations.
- AI drafts.
- Google Calendar.
- Billing.
- Drag/drop.

## Manual test

1. Uruchomić `npm run dev`.
2. Otworzyć `http://localhost:3000/funnel`.
3. Sprawdzić: Lejek jest czytelny, bez wielu ściśniętych kolumn.
4. Kliknąć filtry: Do ruchu teraz, Bez kroku, Cisza 7+, Wysokie ryzyko, Pieniądze.
5. Kliknąć etapy w pasku filtrów.
6. Otworzyć lead/sprawę z listy.

## Ryzyka

- Widok nie ma drag/drop. To celowe.
- Detail views nie mają jeszcze mini-modułów lejka. To osobny etap.
- Wartość/prowizja zależy od helpera Stage227A i obecnego kontraktu finance.
