# CloseFlow v100 - Quick AI Capture single-source contract

## Cel

Po ujednoliceniu globalnego paska akcji Quick AI Capture ma być dostępny z jednego miejsca: `GlobalQuickActions`.
Widoki takie jak `Today` i `Leads` nie powinny renderować drugiego, lokalnego widgetu `QuickAiCapture`.

## Zasada

- Globalny pasek u góry aplikacji jest miejscem dla: Asystent AI, Szybki szkic, Szkice AI, Lead, Zadanie i Wydarzenie.
- Lokalne ekrany mogą zachować własną logikę dodawania rekordów, ale nie kopiują globalnych widgetów.
- Quick Capture nadal zapisuje szkic i wymaga świadomego zatwierdzenia jako lead.