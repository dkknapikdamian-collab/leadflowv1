# STAGE161 cf-modal-surface Center Fix — raport

Runtime audit found event modal `.cf-modal-surface[role="dialog"]` with `left: -104`, `width: 780`, `centerX: 286`, `viewportCenterX: 684`, `z-index: 50`. Stage161 targets this concrete class instead of generic dialog guessing. Tests: `node scripts/check-stage161-cf-modal-surface-center-fix.cjs`, `npm.cmd run build`.
