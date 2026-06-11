# RUN - STAGE231D0C_R9_CLIENT_DETAIL_LEFT_RAIL_VISUAL_ALIGN

Data: 2026-06-11 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: LOCAL_APPLIED / NEED_PUSH

## Scan / powód
Manualny screenshot po cb65a3c4 pokazał, że lewy rail nadal startuje za wysoko. R7 zastosował CSS, ale wartość offsetu była za mała względem realnej kompozycji strony z Vercel.

## Zakres plików
- src/styles/visual-stage12-client-detail-vnext.css
- scripts/check-stage231d0c-r9-client-detail-left-rail-visual-align.cjs
- tests/stage231d0c-r9-client-detail-left-rail-visual-align.test.cjs
- _project/* central docs
- _project/obsidian_updates/*
- _project/runs/*

## Done condition
- guardy PASS,
- build PASS,
- diff check PASS,
- selective commit/push,
- manual screenshot po deployu.
