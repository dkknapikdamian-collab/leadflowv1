# CloseFlow Stage14G Repair9 — ASCII launcher + compact meta P3 guard

Cel: domknąć Stage14G po błędzie parsera PowerShell w Repair8.

Zakres:
- nie zmienia UI,
- nie zmienia logiki aplikacji,
- nadpisuje tylko P3 guard,
- dodaje/utrwala skrypt package.json,
- czyści stare częściowe dokumenty Stage14G,
- uruchamia P3 guard i build jako bramki,
- commit/push dopiero po zielonych wynikach.

Naprawa:
- launcher PowerShell jest ASCII-only i nie używa problematycznego składania escaped quote w pętli P1/P2,
- P1/P2 nie są twardą bramką dla tego etapu, bo wcześniejszy P2 jest niespójny z obecnym UI,
- Leads guard sprawdza return array funkcji buildLeadCompactMeta, a nie samo istnienie parametru _leadValueLabel.
