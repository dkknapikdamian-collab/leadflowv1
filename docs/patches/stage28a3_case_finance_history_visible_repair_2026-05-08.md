# Stage28A3 — Case finance history visible repair

## Cel

Naprawić stan po nieudanym Stage28A2.

## Problem

Stage28A2 szukał konkretnych klas w panelu finansów. Lokalny plik po Stage28A miał inny układ, więc repair nie znalazł miejsca na nagłówek.

## Zmiana

- jeśli panel finansów Stage28A istnieje, dodaje osobną widoczną sekcję `Historia wpłat` przed zakładkami,
- sekcja używa `visibleCasePayments`,
- nie resetuje repo,
- odpala ponownie guard Stage28A,
- odpala guard Stage28A3,
- odpala build,
- commit/push w jednym poleceniu.
