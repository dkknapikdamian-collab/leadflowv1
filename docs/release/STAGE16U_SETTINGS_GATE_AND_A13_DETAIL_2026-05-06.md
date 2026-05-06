# STAGE16U - Settings gate uniqueness + final A13 detail

Cel:
- naprawić ostatni znany konflikt w `tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs`, gdzie `Settings.tsx` musi mieć dokładnie jedną deklarację każdego plan gate consta,
- utrzymać `DAILY_DIGEST_EMAIL_UI_VISIBLE = false`,
- po naprawie odpalić build, verify, test:critical oraz szczegółowy A13/faza3 collector.

Bez commita. Bez pusha.
