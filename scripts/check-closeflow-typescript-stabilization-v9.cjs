const fs = require('fs');
function fail(message){ console.error('CLOSEFLOW_TYPESCRIPT_STABILIZATION_V9_FAIL: ' + message); process.exit(1); }
function read(file){ return fs.readFileSync(file, 'utf8'); }
const entity = read('src/components/entity-actions.tsx');
if (!entity.includes("export type EntityActionButtonProps = Omit<ButtonProps, 'tone'> & {")) fail('EntityActionButtonProps must omit ButtonProps tone');
if (!entity.includes('tone?: EntityActionTone;')) fail('EntityActionButtonProps must expose typed tone');
if (!entity.includes('actionButtonClass(tone as EntityActionTone)')) fail('EntityActionButton call site must narrow tone for TypeScript');
if (entity.includes('export type EntityActionButtonProps = ButtonProps & {')) fail('EntityActionButtonProps still inherits raw ButtonProps tone');
console.log('CLOSEFLOW_TYPESCRIPT_STABILIZATION_V9_CHECK_OK');
