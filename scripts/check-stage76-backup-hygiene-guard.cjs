const { fail, read, has, pkg } = require('./_stage-check-helpers.cjs');
const label = 'STAGE76_BACKUP_HYGIENE_GUARD';
const gitignore = read(label, '.gitignore');
['.stage70-backup-*','.stage*-backup-*','.stage70-82-backup-*'].forEach(m => has(label, gitignore, m, '.gitignore'));
const today = read(label, 'src/pages/TodayStable.tsx');
const count = (today.match(/data-stage70-today-decision-engine-starter="true"/g) || []).length;
if (count !== 1) fail(label, 'Stage70 data marker count should be 1, got ' + count);
if (!pkg(label).scripts['check:stage76-backup-hygiene-guard']) fail(label, 'package script missing');
console.log('PASS ' + label);
