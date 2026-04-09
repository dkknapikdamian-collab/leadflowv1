# ETAP 2 — sprzedaż / domykanie

## Cel

Twardo zapisać i zamrozić etap sprzedażowy jako osobną warstwę domenową jednego systemu.

To nie jest osobny produkt.
To jest etap w lifecycle klienta przed przejściem do `case`.

## Zakres pracy operatora na tym etapie

Na etapie sprzedaży / domykania operator wykonuje:
- pierwszy kontakt
- follow-up
- ofertę
- spotkanie
- czekanie na odpowiedź
- negocjację
- zamknięcie

## Właściciel etapu

Właścicielem etapu jest:
- `Lead`

Powiązane byty operacyjne:
- `WorkItem`
- taski
- wydarzenia

## Ekrany właścicielskie

Za prowadzenie etapu odpowiadają powierzchnie:
- `Today`
- `Leads`
- `Lead Detail`
- `Tasks`
- `Calendar`

## Twarda zasada procesu

Aktywny lead musi mieć:
- następny krok

albo

- świadomy alarm typu `bez next stepu`

Lead nie może zniknąć w próżni pomiędzy akcjami.

## Co system ma pilnować sam

System ma automatycznie wykrywać i eskalować:
- brak next stepu
- overdue
- waiting too long
- brak follow-up po ofercie
- brak follow-up po spotkaniu
- wysoka wartość bez ruchu
- za dużo otwartych działań
- brak aktywności od X dni

## Powiązanie z obecną domeną kodu

Aktualny model sprzedażowy opiera się o:
- `Lead`
- `WorkItem`
- `lib/domain/lead-state.ts`
- `lib/today.ts`

Na poziomie implementacji obecne alarmy są mapowane jako:
- `missing_next_step`
- `next_step_overdue`
- `waiting_too_long`
- `no_followup_after_proposal`
- `no_followup_after_meeting`
- `high_value_stale`
- `too_many_open_actions`
- `inactive_too_long`

## Granica etapu

Ten etap kończy się na warstwie sprzedażowej.

Dopiero po:
- `won`
- albo `ready_to_start`

lead może przejść do etapu operacyjnego i utworzenia `case`.
