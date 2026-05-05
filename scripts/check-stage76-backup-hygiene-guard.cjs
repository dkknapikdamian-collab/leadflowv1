const { requireIncludes, requireScript } = require('./_stage-check-helpers.cjs');
requireIncludes("STAGE76_BACKUP_HYGIENE_GUARD", ".gitignore", [".stage70-backup-*", ".stage70-82-backup-*", ".stage*-backup-*"]);
requireScript("STAGE76_BACKUP_HYGIENE_GUARD", "check:stage76-backup-hygiene-guard", "node scripts/check-stage76-backup-hygiene-guard.cjs");
console.log('PASS STAGE76_BACKUP_HYGIENE_GUARD');
