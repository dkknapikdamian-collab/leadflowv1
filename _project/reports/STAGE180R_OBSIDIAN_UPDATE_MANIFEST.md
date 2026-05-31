# OBSIDIAN UPDATE MANIFEST - Stage180R

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- report_id: STAGE180R_NOTIFICATIONS_REMOVE_CHANNELS_CARD_ANCHORLESS_2026-05-30
- typ wpisu: lokalny ZIP, UI cleanup powiadomień
- pliki projektu:
  - src/pages/NotificationsCenter.tsx
  - scripts/check-stage180r-notifications-remove-channels-card-anchorless.cjs
  - _project/reports/STAGE180R_NOTIFICATIONS_REMOVE_CHANNELS_CARD_ANCHORLESS_2026-05-30.md
- testy:
  - node scripts/check-stage180r-notifications-remove-channels-card-anchorless.cjs
  - npm run build
- czego nie ruszano: Supabase, RLS, routing, deployment, push
- następny krok: restart dev servera, Ctrl+F5 na /notifications, kontrola wizualna
