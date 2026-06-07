# STAGE227G2 — Today Movement Helper + Leads Copy + History Tile Cleanup

Data: 2026-06-07 18:35 Europe/Warsaw

## Cel

- Ujednolicić wizualnie wiersz ruchu/helpera w kartach Today z kartami w tej samej sekcji.
- Usunąć z zakładki Leady runtime copy: "Bez przesady, tylko najpotrzebniejsze." oraz "5 leadów z największą wartością."
- Wyciszyć legacy kafelek Historia w top-stripie leada, bez usuwania właściwej historii aktywności.

## Zakres

- CSS `src/styles/work-item-card.css`
- Cleanup copy w `src/pages/Leads.tsx`
- CSS suppress legacy history top-card selector w `src/styles/visual-stage14-lead-detail-vnext.css`

## Poza zakresem

- SQL / RLS / Supabase schema
- Google Calendar
- Runtime przesuwania terminów z G1/G1R1
- Braki C3

## Testy

- `npm run check:stage227g2-today-movement-leads-copy-history-cleanup`
- `npm run test:stage227g2-today-movement-leads-copy-history-cleanup`
- G1R1/G1/F6/C3B regression
- `npm run build`
- `git diff --check`
