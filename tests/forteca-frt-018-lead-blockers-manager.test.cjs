const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const paths = Object.freeze({
  contract: '_project/contracts/forteca-clean/FRT-018_LEAD_BLOCKERS_MANAGER.md',
  reference: 'docs/ui/reference/forteca-calm-light/018_lead_missing_blockers_list.webp',
  leadDetail: 'src/pages/LeadDetail.tsx',
  panel: 'src/components/detail/LeadBlockersManagerPanel.tsx',
  rowsCss: 'src/styles/owners/closeflow-records-and-rails.css',
  actionsCss: 'src/styles/owners/closeflow-actions.css',
  surfacesCss: 'src/styles/owners/closeflow-surfaces-and-cards.css',
});

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const sha256 = (file) => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, file))).digest('hex').toUpperCase();

function sourceSlice(source, startAnchor, endAnchor) {
  const start = source.indexOf(startAnchor);
  assert.ok(start >= 0, `missing source anchor: ${startAnchor}`);
  const end = source.indexOf(endAnchor, start + startAnchor.length);
  assert.ok(end > start, `missing source boundary: ${endAnchor}`);
  return source.slice(start, end);
}

function stageCssBlock(source) {
  const start = source.indexOf('/* FRT-018:');
  assert.ok(start >= 0, 'FRT-018 CSS owner block is missing');
  return source.slice(start);
}

test('FRT-018 pins the active contract and immutable reference', () => {
  const contract = read(paths.contract);
  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-018/);
  assert.match(contract, /TARGET_ROUTE: \/leads\/:leadId/);
  assert.match(contract, /TARGET_STATE: Lead Detail — missing items\/blockers manager/);
  assert.match(contract, /no dead control, placeholder, parallel owner, or page-local plaster/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/018_lead_missing_blockers_list\.webp/);
  assert.equal(
    sha256(paths.reference),
    '94A2EB80866E940D31D0B70603EF68992C4E449011F8C85C18254D8ACF71C0BD',
    'FRT-018 reference changed without an explicit source-of-truth update',
  );
});

test('FRT-018 renders a real Lead Detail tab from the active missing-item source', () => {
  const leadDetail = read(paths.leadDetail);
  const panel = read(paths.panel);

  assert.match(leadDetail, /activeLeadDetailTab.*'blockers'/);
  assert.match(leadDetail, /id: 'blockers'.*Braki i blokady/);
  assert.match(leadDetail, /activeLeadDetailTab === 'blockers'/);
  assert.match(leadDetail, /forteca-lead-detail-content-grid--blockers/);
  assert.match(leadDetail, /className=\{`forteca-lead-detail-content-grid \$\{activeLeadDetailTab === 'blockers'/);
  assert.match(leadDetail, /<LeadBlockersManagerPanel/);
  assert.match(leadDetail, /items={leadMissingManagerItemsStage232I4R14}/);
  assert.match(panel, /data-forteca-frt-018-manager="true"/);
  assert.match(panel, /data-forteca-frt-018-source="lead-missing-items"/);
  assert.match(panel, /resolvedCount\?: number/);
  assert.match(panel, /import \{ Button \} from '\.\.\/ui\/button'/);
  assert.match(panel, /SemanticIcon/);
  assert.doesNotMatch(panel, /<button\b/);
  assert.doesNotMatch(panel, /from ['"]lucide-react['"]/);
  assert.match(panel, /Braki i blokady/);
  assert.match(panel, /Brak danych/);
  assert.match(panel, /Źródło: aktywne zadania leada/);
  assert.doesNotMatch(panel, /case_items|insertCaseItemToSupabase/);
});

test('FRT-018 exposes only supported actions and keeps every action scoped', () => {
  const leadDetail = read(paths.leadDetail);
  const panel = read(paths.panel);

  for (const callback of [
    'onAdd={openLeadMissingManagerStage232I4R18}',
    'onEdit={handleEditLeadMissingItemStage232I4R18}',
    'onToggleBlocker={handleToggleLeadMissingBlockerStage232I4R14}',
    'onResolve={handleResolveLeadMissingItemStage228R13}',
    'onResolveAll={handleResolveAllLeadMissingStage232I4R18}',
    'onDelete={handleDeleteLeadMissingItemStage228R15}',
  ]) {
    assert.match(leadDetail, new RegExp(callback.replace(/[{}]/g, '\\$&')));
  }
  assert.match(panel, /anchor\.download = 'closeflow-braki-i-blokady\.csv'/);
  assert.match(panel, /Wyślij przypomnienie do wszystkich/);
  assert.match(panel, /disabled title="Obecny runtime nie ma bezpiecznej zbiorczej wysyłki przypomnień\./);
  assert.match(panel, /onClick=\{\(\) => void onShowHistory\(\)\}/);
  assert.match(leadDetail, /openLinkedTaskEditor\(task\)/);
  assert.match(leadDetail, /countResolvedLeadMissingItemsStage232I4R18/);
  assert.match(leadDetail, /isLeadMissingItemInCurrentScopeStage232I4R18/);
  assert.match(leadDetail, /Brak nie należy do bieżącego leada/);
  assert.match(leadDetail, /priority: nextPriorityStage232I4R16ZR8/);
});

test('FRT-018 restores the scoped Lead Detail list after a failed delete', () => {
  const leadDetail = read(paths.leadDetail);
  const deleteHandler = sourceSlice(leadDetail, 'const handleDeleteLeadMissingItemStage228R15', 'const openLeadMissingManagerStage232I4R18');
  assert.match(deleteHandler, /let optimisticSnapshot: any\[\] \| null = null/);
  assert.match(deleteHandler, /optimisticSnapshot = \[\.\.\.linkedTasks\]/);
  assert.match(deleteHandler, /setLinkedTasks\(\(previous\) => previous\.filter/);
  assert.match(deleteHandler, /let deletionCommitted = false/);
  assert.match(deleteHandler, /deletionCommitted = true/);
  assert.match(deleteHandler, /if \(!deletionCommitted && optimisticSnapshot\) setLinkedTasks\(optimisticSnapshot\)/);
  assert.match(deleteHandler, /hardDeleteTaskFromSupabase\(taskId\)/);
  assert.match(deleteHandler, /loadLead\(\{ silent: true \}\)/);
  assert.match(deleteHandler, /missing-item delete committed but activity history write failed/);
});

test('FRT-018 routes destructive icons and visual colors through the shared SOT', () => {
  const panel = read(paths.panel);
  assert.match(panel, /DeleteActionIcon/);
  assert.doesNotMatch(panel, /Trash2/);
  assert.doesNotMatch(panel, /RestoreActionIcon/);
  assert.match(panel, /role="task_status"/);
  assert.match(panel, /forteca-frt-018-icon-action-delete/);

  for (const file of [paths.rowsCss, paths.actionsCss, paths.surfacesCss]) {
    const block = stageCssBlock(read(file));
    assert.doesNotMatch(block, /#[0-9a-f]{3,8}\b/i, `${file} adds raw hex to the FRT-018 block`);
    assert.doesNotMatch(block, /rgba?\([^)]*\)/i, `${file} adds raw rgb/rgba to the FRT-018 block`);
  }
  const actionBlock = stageCssBlock(read(paths.actionsCss));
  assert.match(actionBlock, /--cf-vst-color-delete/);
  assert.match(actionBlock, /--cf-vst-color-delete-soft/);
  assert.match(actionBlock, /--cf-vst-color-delete-border/);
  assert.match(actionBlock, /data-forteca-frt-018-manager/);

  const layoutCss = read('src/styles/owners/closeflow-rails-and-detail.css');
  assert.match(layoutCss, /forteca-lead-detail-content-grid\.forteca-lead-detail-content-grid--blockers/);
  assert.match(layoutCss, /\.forteca-lead-detail-right-rail \{\s*display: none;/);
});
