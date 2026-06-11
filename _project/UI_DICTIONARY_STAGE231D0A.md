# UI Dictionary — STAGE231D0A / STAGE231D0B

Status: ACTIVE
Last updated: 2026-06-10 Europe/Warsaw

## ClientListCard

Nazwa ludzka:
Kafelek klienta na liście klientów

Nazwa systemowa:
ClientListCard

Wariant:
client-relationship-row-2line

Rola:
Szybka ocena relacji z klientem.

Wiersz 1:
- nazwa
- telefon
- e-mail
- aktywna prowizja
- akcje

Wiersz 2:
- firma
- sprawy count
- zarobione łącznie
- najbliższa akcja
- ryzyka/statusy pomocnicze

Zakaz:
Nie używać badge „Aktywna sprawa”, bo klient może mieć wiele spraw.
Nie pokazywać „Leady”, bo klient jest już pozyskanym leadem.

Źródła finansowe:
- Aktywna prowizja = suma prowizji z aktywnych spraw.
- Zarobione łącznie = suma wpłaconej prowizji ze wszystkich spraw klienta.


## LeadListCard

Nazwa ludzka:
Kafelek leada na liście leadów

Nazwa systemowa:
LeadListCard

Wariant:
lead-opportunity-row

Rola:
Szybka ocena szansy sprzedażowej.

Pokazuje:
- nazwa / temat
- telefon albo e-mail
- źródło
- status
- potencjał
- najbliższa akcja
- ryzyka
- akcje

Nie pokazuje:
- spraw klienta
- kosztów sprawy
- zarobione łącznie
- wpłaconej prowizji

Źródło wizualne:
Ten sam record-list source truth co ClientListCard, ale inny payload biznesowy.

Status:
MAPPING_ONLY_STAGE231D0B_R9 — runtime leadów nie jest przebudowywany w tym etapie.
