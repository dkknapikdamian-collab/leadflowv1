# Obsidian payload - STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN

Data: 2026-06-14 12:45 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
Status: DO_WKLEJENIA_DO_OBSIDIANA / STAGE_QUEUE_DECISION

## 02_AKTUALNY_STAN

2026-06-14 12:45 Europe/Warsaw - Do kolejki rozwoju CloseFlow dopisano lancuch produkcyjnych etapow mailowych: domena, realny email, maile systemowe, digesty i zakladka Pomoc/Support. Etap nie jest runtime wdrozeniem. To zapis decyzji i kolejki.

## 04_KIERUNEK_DO_WDROZENIA

Nowy lancuch etapow:

1. `STAGE231K1_DOMAIN_AND_EMAIL_FOUNDATION`
   - wybranie/konfiguracja domeny produkcyjnej,
   - DNS,
   - realny sender/mail provider,
   - SPF/DKIM/DMARC/MX,
   - env i diagnostyka mail setup.

2. `STAGE231K2_TRANSACTIONAL_EMAIL_TEMPLATES_AND_AUTH_NOTIFICATIONS`
   - reset hasla,
   - potwierdzenie zmiany maila,
   - potwierdzenie rejestracji,
   - potwierdzenie platnosci,
   - blad/status platnosci,
   - podstawowe powiadomienia systemowe.

3. `STAGE231K3_OWNER_DIGEST_EMAILS_DAILY_AND_WEEKLY`
   - poranny digest,
   - tygodniowe podsumowanie,
   - lista decyzji i ryzyk, nie newsletter.

4. `STAGE231K4_SUPPORT_HELP_PRODUCTION_TAB_AND_EMAIL_ROUTING`
   - produkcyjna zakladka Pomoc/Support,
   - formularz zgloszenia,
   - routing na realny support email/outbox,
   - potwierdzenie przyjecia zgloszenia.

## 08_HISTORIA_ZMIAN

2026-06-14 12:45 Europe/Warsaw - Dodano decyzje etapow produkcyjnego maila. Ustalono, ze digest i support tab nie powinny byc wdrazane przed realnym mailem/domena, zeby nie tworzyc martwych funkcji.

## 09_TESTY_DO_WYKONANIA_I_WYNIKI

Planowane testy dla STAGE231K1:
- sprawdzic DNS/MX/SPF/DKIM/DMARC,
- sprawdzic wysylke testowa z verified sender,
- sprawdzic fail-safe, gdy env mail nie istnieje.

Planowane testy dla STAGE231K2:
- render kazdego template,
- test linkow reset/confirm,
- outbox/log w dev,
- brak realnej wysylki do klientow w trybie testowym.

Planowane testy dla STAGE231K3:
- daily digest nie duplikuje maili,
- weekly digest zawiera akcje i ryzyka,
- brak danych nie daje pustego newslettera.

Planowane testy dla STAGE231K4:
- support ticket nie ginie przy braku mail env,
- user widzi jasny status,
- support email/outbox nie jest hardcodowany w wielu miejscach.

## 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

- Realny mail bez dobrej domeny i SPF/DKIM/DMARC moze wpasc do spamu.
- Maile resetu hasla, zmiany maila i platnosci sa wysokiego ryzyka: nie moga milczaco failowac.
- Digest bez stabilnych danych owner-control bedzie ozdobny i malo przydatny.
- Support tab bez outboxa/inboxa bedzie martwa funkcja.
- Jesli potrzebna bedzie tabela outbox/support tickets, SQL musi byc osobnym etapem i wpisem w SQL ledger.

## 15_SQL_LEDGER_AND_TESTED_SQL

Status: SQL NIE RUSZANY.

Mozliwy przyszly SQL: outbox email, support tickets, email events/logs. Nie przygotowywac ani nie wdrazac bez osobnej decyzji i guardu.

## Do dopisania w centralnym pliku etapow

Dopisac do `_project/04_ETAPY_ROZWOJU_APLIKACJI.md` blok z run reportu:
`_project/runs/STAGE231K_EMAIL_DOMAIN_AND_PRODUCTION_MAIL_CHAIN.md`.

Nie zostawiac tego jako osobnej luznej notatki po wdrozeniu STAGE231K.
