# Obsidian payload - STAGE231F_R3_OWNER_CONTROL_BASELINE

- Projekt: CloseFlow / LeadFlow (`project_id: closeflow_lead_app`).
- Status: wdrozone lokalnie, dedykowane guardy/testy i browser QA PASS.
- Efekt: `/today` pokazuje pelna, priorytetyzowana kolejke; `/settings` pozwala ustawic 7/14/5000 lub inne poprawne progi.
- Trwalosc: zapis 3/10 przetrwal twardy refresh w local fallback.
- Supabase: migracja `20260613065348_stage231f_r3_owner_control_workspace_settings.sql`.
- Backup: `_local_backups/STAGE231F_R3_OWNER_CONTROL_BASELINE_20260613_085014/`.
- Ryzyka: produkcyjna migracja do zastosowania; globalny quiet gate blokowany przez stary mojibake/BOM.
- Manual QA Damiana: ustawienia 3/10, `/today`, 3 leady bez next step, ustawienie next step i twardy refresh.
- App feature commit/push: `3139ee04` -> `dev-rollout-freeze`.
- Obsidian commit/push: `7f01d16` -> `main`.
