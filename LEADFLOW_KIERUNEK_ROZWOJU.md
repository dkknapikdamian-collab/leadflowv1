# LeadFlow / CloseFlow — kierunek rozwoju produktu

Status: AKTYWNE
Data: 2026-06-07 23:35 Europe/Warsaw

## Teza
LeadFlow ma być prostą aplikacją do pilnowania leadów, follow-upów, zadań, notatek, wydarzeń i alertów właściciela. Nie ciężki CRM.

## Inspiracje
- Chatwoot: lead inbox, źródła kontaktu, przypisanie, notatki, alerty.
- FreeScout: prostota, shared mailbox logic, odpowiedzialność.
- PostHog: analytics, session replay, feature flags — później.

## Decyzje produktu
- Najpierw ręczny lead / formularz / e-mail intake, dopiero później kanały typu Gmail, WhatsApp, Facebook, SMS.
- Statusy już istnieją; porządkujemy ich znaczenie zamiast mnożyć nowe.
- Notatki rozwinąć, nie dublować.
- Największa wartość następna: alerty follow-up / lead risk / zadania po terminie.
- Zespół 2-osobowy jako prosty wariant, bez domyślnego wspólnego poola leadów.
- AI tylko jako draft + owner approve.

## Kolejka etapów rozwoju
### Teraz
1. Stage227C — Brak jako szybka akcja.
2. Stage227D — mobile / dialog contrast audit.
3. Stage227E — LeadDetail simplification / decision view cleanup.
4. Stage227E3 — shared quick actions source of truth.

### Następnie
5. Documents V1 — dokumenty do leadów, klientów i spraw.
6. Costs V1 — koszty / marża / wydatki.
7. Decision view upgrade — potencjał + koszt + marża + dokumenty + blokery.

## Czego nie robić teraz
- Nie budować ciężkiego CRM-a.
- Nie robić pełnego DMS.
- Nie mieszać dokumentów z notatkami.
- Nie robić kosztów bez jasnego modelu.
- Nie dodawać integracji kanałów przed core.
