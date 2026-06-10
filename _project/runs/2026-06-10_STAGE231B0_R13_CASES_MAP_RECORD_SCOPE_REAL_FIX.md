# STAGE231B0-R13-R6 — Owner risk minimal safe call

Status: LOCAL_ONLY_PREPARED

## Problem
R13-R4 build failed because ownerRiskBadges was opened before metaParts and not closed. R13-R5 failed before changing file due bad HEAD-block assumption.

## Fix
Replace damaged ownerRiskBadges-to-metaParts span with a complete closed safe call.
