# STAGE231D0B - Client List Card Visual Freeze - Obsidian update

Data i godzina: 2026-06-12 11:15 Europe/Warsaw
Nazwa / alias wejĹ›ciowy: aktualizacja STAGE231D0B - Client List Card Visual Freeze
Entity ID: DO_POTWIERDZENIA
Workspace ID: DO_POTWIERDZENIA
Project ID: CloseFlow / LeadFlow / DO_POTWIERDZENIA wedĹ‚ug Atlasu
Idea ID: nie dotyczy
Report ID: nie dotyczy
Canonical name: CloseFlow / LeadFlow
Folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Decyzja

Z kafelka klienta usuwamy:
- Leady:
- Aktywna sprawa

Uzasadnienie:
- Klient jest juĹĽ pozyskanym leadem.
- Klient moĹĽe mieÄ‡ wiele spraw, wiÄ™c binarny badge Aktywna sprawa jest mylÄ…cy.

## Nowy model kafelka

Wiersz 1:
- nazwa
- telefon
- e-mail
- Aktywna prowizja
- akcje

Wiersz 2:
- firma
- Sprawy
- Zarobione Ĺ‚Ä…cznie
- NajbliĹĽsza akcja
- ryzyka/statusy pomocnicze

## ĹąrĂłdĹ‚a finansowe

- Aktywna prowizja = suma prowizji z aktywnych spraw klienta.
- Zarobione Ĺ‚Ä…cznie = suma wpĹ‚aconej prowizji ze wszystkich spraw klienta.

## Guardy/testy

- 
pm run check:stage231d0b-client-list-card-freeze
- 
pm run build
- git diff --check

## Audyt ryzyk po etapie

- Ryzyko danych: jeĹ›li sprawa nie ma ustawionej prowizji, aktywna prowizja pokaĹĽe 0 PLN.
- Ryzyko pĹ‚atnoĹ›ci: jeĹ›li typ/status pĹ‚atnoĹ›ci prowizyjnej nie jest rozpoznany, Zarobione Ĺ‚Ä…cznie wymaga osobnego etapu normalizacji danych.
- Zakres: etap nie usuwa leadsCount z caĹ‚ej aplikacji; blokuje tylko widoczny kafelek klienta.
- Zakres: ClientDetail i modele finansowe nie sÄ… przebudowywane.

## Czego nie ruszano

- Supabase schema
- SQL/RLS
- ClientDetail layout
- LeadDetail
- CaseDetail
- globalny model pĹ‚atnoĹ›ci

## NastÄ™pny krok

WykonaÄ‡ test rÄ™czny /clients na desktop/mobile. Po PASS wykonaÄ‡ selektywny commit/push repo.