# CLOSEFLOW Metric Tile Visual Source Truth — VS-5U

Marker: CLOSEFLOW_METRIC_TILE_VISUAL_SOURCE_TRUTH_VS5U

## Teza

Audyt VS-5T pokazał, że pixel parity kafelków nie może być zamknięte samymi checkami VS-5/VS-5R/VS-5S. Ekran Dziś jest wizualnym wzorcem, ale nadal nie używa tego samego renderera co Tasks i Notifications.

## Decyzja

Ten etap nie udaje pełnej migracji TodayStable. Zamiast kolejnej ryzykownej chirurgii w dużym pliku, dodaje jeden finalny visual token layer dla kafelków, ładowany po starych page adapterach.

## Źródło prawdy od tego etapu

- visual geometry / typografia / spacing: src/styles/closeflow-metric-tile-visual-source-truth.css
- shared renderer dla nowych i naprawionych ekranów: MetricGrid -> StatShortcutCard -> MetricTile
- Today renderer migration: nadal jawnie pending, do osobnego etapu VS-5V

## Czego to ma pilnować

- Tasks nie może mieć cięższego tekstu niż Today.
- Notifications nie może wrócić do lokalnych stat-cardów.
- Stare selektory z eliteflow/visual-stage nie mogą wygrywać nad finalną warstwą kafelków.

## Czego nie robi

- Nie zmienia danych.
- Nie zmienia routingu.
- Nie migruje TodayStable przez regex.
- Nie dotyka VS-7 SurfaceCard.

## Następny etap

VS-5V — TodayStable renderer migration, tylko po ręcznym potwierdzeniu, że VS-5U poprawił pixel parity kafelków Tasks/Notifications względem Today.
