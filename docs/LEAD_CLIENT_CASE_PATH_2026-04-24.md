# CloseFlow — ścieżka Lead → Klient → Sprawa

**Data:** 2026-04-24  
**Status:** obowiązujący kierunek po przejściu na Supabase.

## Decyzja produktowa

Ścieżka nie może być ciężkim CRM-em.

Model roboczy zostaje prosty:

```text
Lead = temat do pozyskania
Klient = osoba/firma w tle
Sprawa = temat prowadzony operacyjnie po rozpoczęciu obsługi
```

## Jak ma działać tworzenie leada

Przy utworzeniu leada API musi:

1. rozpoznać istniejącego klienta po `client_id`, `email`, `phone` albo nazwie,
2. jeżeli klient nie istnieje, utworzyć klienta,
3. zapisać `leads.client_id`,
4. zostawić lead jako aktywny temat do pozyskania,
5. nie wymuszać ręcznego pola „następny krok”.

Pole `next_action_title` może istnieć technicznie w bazie, ale nie jest już głównym polem UX. Realna najbliższa akcja ma pochodzić z zadań i wydarzeń.

## Jak ma działać ekran klienta

Klient nie jest głównym ekranem codziennej pracy.

Ekran klienta ma pokazywać:

- dane osoby/firmy,
- powiązane leady,
- powiązane sprawy,
- powiązane rozliczenia,
- szybkie przejścia do leada albo sprawy.

Nie powinien pobierać wszystkich leadów i spraw workspace tylko po to, żeby filtrować je w przeglądarce.

Od tej paczki API wspiera filtrowanie:

```text
/api/leads?clientId=<uuid>
/api/cases?clientId=<uuid>
/api/cases?leadId=<uuid>
```

## Jak ma działać rozpoczęcie obsługi

Gdy użytkownik klika `Rozpocznij obsługę`:

1. system tworzy lub wykorzystuje klienta,
2. tworzy sprawę,
3. podpina sprawę do klienta,
4. podpina sprawę do leada,
5. oznacza lead jako temat już w obsłudze,
6. dalsza praca idzie na sprawie.

## Kryterium domknięcia tej ścieżki

Ścieżka Lead → Klient → Sprawa jest domknięta dla V1, gdy:

- nowy lead zapisuje się bez błędu SQL,
- nowy lead ma `client_id`,
- klient pokazuje powiązanego leada,
- po rozpoczęciu obsługi powstaje sprawa z tym samym `client_id`,
- klient pokazuje powiązaną sprawę,
- lead po rozpoczęciu obsługi wskazuje sprawę,
- ekran klienta używa API filtrowanego po `clientId`.

## Czego nie robić w kolejnych etapach

Nie robić z klienta głównego ekranu operacyjnego.

Klient ma być rekordem wspólnym w tle. Praca odbywa się na aktywnym leadzie albo na sprawie.
