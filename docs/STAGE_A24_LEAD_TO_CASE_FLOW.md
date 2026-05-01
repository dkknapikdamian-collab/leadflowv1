# A24 - Lead -> klient -> sprawa

## Decyzja produktowa

Po pozyskaniu tematu użytkownik nie pracuje dalej na leadzie.

Docelowy flow:

1. Lead jest źródłem i etapem pozyskania.
2. Klient jest rekordem kontaktowym w tle.
3. Sprawa jest głównym miejscem pracy operacyjnej.

## Akcja w UI

Akcja ma nazywać się:

```text
Rozpocznij obsługę
```

Po wykonaniu akcji lead ma pokazywać stan:

```text
Ten temat jest już w obsłudze
Otwórz sprawę
```

## Backend

Backend obsługuje `POST /api/leads` z:

```json
{
  "action": "start_service",
  "id": "lead-id"
}
```

Etap A24 wzmacnia flow przez Supabase RPC:

```sql
public.closeflow_start_lead_service(...)
```

RPC wykonuje w jednej operacji bazowej:

1. tworzy albo podpina klienta,
2. tworzy sprawę,
3. podpina lead do sprawy,
4. ustawia lead jako przeniesiony do obsługi,
5. zapisuje activity,
6. zwraca `caseId`.

API ma fallback do dotychczasowego kodu, gdy migracja RPC nie została jeszcze uruchomiona w Supabase.

## Lead po przeniesieniu

Lead dostaje:

- `status = moved_to_service`,
- `lead_visibility = archived`,
- `sales_outcome = moved_to_service`,
- `linked_case_id`,
- `client_id`,
- `moved_to_service_at`,
- `case_started_at`,
- `closed_at`,
- wyczyszczony następny krok sprzedażowy.

## Aktywne leady

Domyślna lista leadów nie powinna pokazywać leadów przeniesionych do obsługi jako aktywnych.

Lead nie jest kasowany. Zostaje jako historia źródłowa i linkuje do sprawy.

## Poprawka wizualna A24

Panel `Najcenniejsze relacje` w widoku `Dziś` dostaje osobny lock CSS, żeby etykieta `Lead` była wyrównana pod nazwą i nie nachodziła na kwoty ani nazwisko.

## Nie zmieniono

- Nie przeniesiono pracy operacyjnej do klienta.
- Nie skasowano historii leadów.
- Nie zmieniono układu Lead / Sprawa / Klient, bo obecny układ jest czytelny.
- Nie ruszano notatek głosowych.

## Check

```powershell
npm.cmd run check:a24-lead-to-case-flow
```
