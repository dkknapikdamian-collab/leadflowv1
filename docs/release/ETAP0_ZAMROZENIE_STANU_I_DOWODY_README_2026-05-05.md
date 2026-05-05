# ETAP 0 - zamrozenie stanu i dowody

Cel: przed zmianami kodu zlapac punkt startowy releasu.

Zakres dowodow:
- branch i commit startowy
- status working tree
- wynik build (`npm run build`)
- wynik krytycznych testow (`npm run test:critical`)

Komenda:

```bash
npm run audit:etap0-freeze-evidence
```

Artefakty:
- raport markdown: `docs/release/ETAP0_ZAMROZENIE_STANU_EVIDENCE_YYYY-MM-DD.md`
- logi runu: `docs/release/evidence/etap0-<timestamp>/`

Kryterium zaliczenia etapu 0:
- znamy dokladnie commit startowy,
- mamy zapisany status drzewa,
- mamy zapisany wynik build i critical tests.
