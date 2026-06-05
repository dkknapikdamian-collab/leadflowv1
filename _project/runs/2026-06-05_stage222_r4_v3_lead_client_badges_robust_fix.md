# STAGE222 R4 V3 - lead/client operational badges robust fix

V3 naprawia częściowy stan po R4 V1/V2. Docelowy wzór: [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji]. Nie rusza Today i nie dodaje CSS.

Testy: node scripts/check-stage222-r4-lead-client-operational-badges.cjs; node --test tests/stage222-r4-lead-client-operational-badges.test.cjs; npm run build; git diff --check.
