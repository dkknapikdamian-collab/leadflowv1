# CLOSEFLOW_STAGE13_SETTINGS_ROLLBACK_2026-05-11

Purpose: rollback the broken Stage 13 Settings tabbed layout and restore the Settings page from before the Stage 13 experiment.

Scope:
- restore `src/pages/Settings.tsx` from the parent of the commit that added `src/pages/SettingsLegacy.tsx`, or from `SettingsLegacy.tsx` as fallback,
- restore/clean `src/styles/Settings.css`,
- remove Stage 13 Settings helper files and scripts,
- keep a small rollback guard,
- run build.

Do not change billing, help, client, lead or case modules in this rollback.
