# LeadFlow / CloseFlow — kierunek rozwoju produktu

Status: AKTYWNE
Data aktualizacji: 2026-06-07 23:35 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Docelowa ścieżka w Obsidianie: `10_PROJEKTY/LeadFlow/00_START_TUTAJ/LEADFLOW_KIERUNEK_ROZWOJU.md`

## Najważniejsze

LeadFlow ma zostać prostą aplikacją dla każdego, kto ma leady. Nie robić ciężkiego CRM-a.

Kierunek:

> Lead Inbox + follow-up + alerty + notatki/zadania/wydarzenia + pakiet 2 konta + później AI drafty i product analytics.

## Decyzje właściciela

- Kanały docelowo mają wpadać do LeadFlow i zapisywać się jako lead/aktywność, ale nie podpinać wszystkiego od razu.
- Statusy już istnieją — nie budować ich od nowa, tylko uporządkować znaczenie i dodać alerty.
- Notatki do spraw, leadów i klientów już istnieją — rozwinąć je, nie dublować.
- Widoki już częściowo są — największy brak to alerty i pilnowanie zaległości.
- Pakiet dla firmy/2 osób jest kierunkiem rozwoju, ale bez ciężkich ról i organizacji na start.
- Każdy ma swoje leady domyślnie.
- Opcjonalnie można udostępnić konkretnego leada albo przypisać komuś zadanie/notatkę/wydarzenie.
- Dzielenie leadów jako wspólny pool nie jest obecnie głównym kierunkiem.
- PostHog/product analytics jest przydatne i można podpiąć później 1:1.
- AI ma dawać drafty, podsumowania i alerty, ale nie wysyłać automatycznie bez akceptacji.

## Najbliższe logiczne etapy produktu

1. Skan kodu: sprawdzić istniejące statusy, notatki, zadania, wydarzenia i widoki, żeby nie dublować funkcji.
2. Alerty: lead bez reakcji, follow-up po terminie, zadanie po terminie, gorący lead bez następnego kroku.
3. Pakiet 2 konta: prosta współpraca bez ciężkiego CRM-a.
4. Przypisanie zadania/notatki/wydarzenia drugiej osobie.
5. Opcjonalne udostępnienie konkretnego leada.
6. Kanały: najpierw formularz/webhook/e-mail, potem dopiero WhatsApp/Facebook/SMS.
7. PostHog po stabilizacji core UX.
8. AI draft/podsumowanie/next action po stabilizacji lead flow.

## Inspiracje

- Chatwoot — Lead Inbox, strumień rozmów, źródła, statusy, przypisanie, alerty.
- FreeScout — prostota shared mailbox, notatki wewnętrzne, odpowiedzialność, brak chaosu zespołowego.
- PostHog — product analytics, session replay, feature flags, error tracking, później AI observability.

## Ostrzeżenia

- Nie robić pełnego CRM-a.
- Nie zaczynać od dużej organizacji i ról.
- Nie robić domyślnego wspólnego worka leadów.
- Nie integrować 10 kanałów przed alertami i core UX.
- Nie dawać AI automatycznej wysyłki bez owner approve.
