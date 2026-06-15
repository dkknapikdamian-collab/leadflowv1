# Obsidian payload - STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH

Data: 2026-06-15 Europe/Warsaw
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Folder Obsidian: 10_PROJEKTY/CloseFlow_Lead_App

## Decyzja do zapisania

Zakładka `Kalendarz` ma być źródłem prawdy czasu operatora.

## Problem

Audyt wykazał:

- fundament jest rozbudowany, ale obciążony wieloma historycznymi warstwami CSS/DOM normalizacji,
- month preview i selected-day full list mają sens, ale wymagają guardów liczników,
- week view może nie przewijać realnego tygodnia, bo zakres bazuje na `new Date()`,
- `Zrobione` może pokazać sukces dla lead bez realnej zmiany,
- `Usuń` ma dobry unsupported-kind gate i trzeba go utrzymać,
- relacje client-only mogą ginąć przy create/edit,
- DEV seed musi zostać tylko w DEV,
- kolorystyka jest generalnie spójna, ale nie należy dodawać nowych lokalnych tone map.

## Etap

Dopisać do centralnej kolejki:

`STAGE232G_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH`

## Następny krok

Po decyzji Damiana przekazać stage deweloperowi z guardem i testem ręcznym.
