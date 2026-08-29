const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));
const has = (text, snippet, label) => {
  assert.ok(text.includes(snippet), `${label || 'source'} must include: ${snippet}`);
};

const referencePath = 'docs/ui/reference/forteca-calm-light/026_client_detail.webp';
const stylesPath = 'src/styles/forteca-client-detail.css';
const contract = read('_project/contracts/forteca-clean/FRT-026_CLIENT_DETAIL.md');
const layout = read('src/components/Layout.tsx');
const detail = read('src/pages/ClientDetail.tsx');
const financeSource = read('src/lib/finance/case-finance-source.ts');

test('FRT-026 activates the dedicated Forteca shell only for the client-detail route', () => {
  has(layout, "const isClientDetailRoute = /^\\/clients\\/[^/]+$/.test(location.pathname);", 'client-detail route guard');
  has(layout, 'const isFortecaShellRoute = isLeadDetailRoute || isFortecaClientsRoute || isClientDetailRoute;', 'Forteca shell route guard');
  has(layout, 'if (isFortecaClientsRoute || isClientDetailRoute) {', 'Forteca client navigation routing');
  has(layout, "return [{ caption: '', items: navGroups.flatMap((group) => group.items) }];", 'Forteca client navigation routing');
  has(layout, '}, [isClientDetailRoute, isFortecaClientsRoute, isLeadDetailRoute, navGroups]);', 'Forteca navigation dependencies');
  has(layout, "${isFortecaClientsRoute || isClientDetailRoute ? 'cf-route-clients' : ''}", 'Forteca client shell marker');
  has(layout, "${isClientDetailRoute ? 'cf-route-client-detail' : ''}", 'dedicated client-detail shell marker');
  has(layout, "${isClientDetailRoute ? 'main-client-detail' : ''}", 'client-detail main marker');
  has(layout, "data-visual-stage-client-detail={isClientDetailRoute ? '06-client-detail' : undefined}", 'client-detail visual state marker');
});

test('FRT-026 binds the real ClientDetail owner to the locked route and state contract', () => {
  assert.match(contract, /^CONTRACT_STATUS: LOCKED$/m);
  assert.match(contract, /^STAGE_ID: FRT-026$/m);
  assert.match(contract, /^TARGET_ROUTE: \/clients\/:clientId$/m);
  assert.match(contract, /^TARGET_STATE: Client Detail$/m);
  assert.match(contract, /^REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/026_client_detail\.webp$/m);
  assert.ok(exists(referencePath), `FRT-026 reference is missing: ${referencePath}`);
  assert.match(contract, /^CURRENT_RUNTIME_OWNERS: src\/pages\/ClientDetail\.tsx; client single-record source; EntityContactCard; finance summary; case\/task\/activity owners\.$/m);
  assert.match(contract, /^BEHAVIOR_TO_PRESERVE: Client data, case relation, finance calculations\/labels, workspace scope and current actions\.$/m);

  has(detail, 'function ClientDetail()', 'ClientDetail source');
  has(detail, 'export { ClientDetail };', 'ClientDetail source');
  has(detail, 'export default ClientDetail;', 'ClientDetail source');
  has(detail, 'const { clientId } = useParams();', 'route source');
  has(detail, 'const id = clientId;', 'route source');
  has(detail, 'className="client-detail-vnext-page', 'detail route markup');
  has(detail, 'main-client-detail-html', 'detail route markup');
  has(detail, 'data-client-detail-simplified-card-view="true"', 'detail state marker');
  has(detail, 'data-stage231b0-r15-r2-client-detail-shared-canvas="true"', 'detail state marker');
  has(detail, 'className="client-detail-shell"', 'detail hierarchy');
  has(detail, 'aria-label="Zakładki klienta"', 'detail state markup');
  has(detail, "setActiveTab(tab.key as ClientTab)", 'detail state wiring');
  has(detail, "data-client-tab-summary': 'true'", 'summary state marker');
  has(detail, "data-client-tab-cases': 'true'", 'cases state marker');
  has(detail, "data-client-tab-history': 'true'", 'history state marker');
  for (const marker of [
    'forteca-frt-026-page',
    'data-forteca-frt-026-root="true"',
    'data-forteca-frt-026-runtime="true"',
    'data-forteca-frt-026-hero="true"',
    'data-forteca-frt-026-case-summary="true"',
    'data-forteca-frt-026-tabs="true"',
    'data-forteca-frt-026-lower-grid="true"',
    'data-forteca-frt-026-active-cases="true"',
    'data-forteca-frt-026-notes="true"',
    'data-forteca-frt-026-contact-history="true"',
  ]) {
    has(detail, marker, 'FRT-026 route/state marker');
  }
});

test('FRT-026 keeps client detail data owned by real client-scoped sources', () => {
  for (const symbol of [
    'fetchClientByIdFromSupabase',
    'fetchLeadsFromSupabase',
    'fetchCasesFromSupabase',
    'fetchPaymentsFromSupabase',
    'fetchTasksFromSupabase',
    'fetchEventsFromSupabase',
    'fetchActivitiesFromSupabase',
  ]) {
    has(detail, symbol, 'ClientDetail data source');
  }

  has(detail, 'const reload = useCallback(async () => {', 'ClientDetail reload owner');
  has(detail, 'if (!workspace?.id || !clientId)', 'workspace and route guard');
  has(detail, 'const [clientRow, leadRows, caseRows, paymentRows, taskRows, eventRows, activityRows] = await Promise.all([', 'client detail load');
  has(detail, 'fetchClientByIdFromSupabase(clientId)', 'client detail load');
  has(detail, 'fetchLeadsFromSupabase({ clientId })', 'client detail load');
  has(detail, 'fetchCasesFromSupabase({ clientId })', 'client detail load');
  has(detail, 'fetchPaymentsFromSupabase({ clientId })', 'client detail load');
  has(detail, 'fetchActivitiesFromSupabase({ clientId: String(id || \'\'), limit: 120 })', 'client activity load');
  has(detail, 'setClient(clientRow);', 'client detail state');
  has(detail, 'setCases(Array.isArray(caseRows) ? caseRows : []);', 'client detail state');
  has(detail, 'setPayments(Array.isArray(paymentRows) ? paymentRows : []);', 'client detail state');
  has(detail, 'setActivities(normalizeClientActivitiesForA1(Array.isArray(activityRows) ? activityRows : []));', 'client activity state');
  has(detail, 'useWorkspace()', 'workspace-scoped source');
  has(detail, 'const forteca026ClientName = getClientName(client);', 'real client identity source');
  has(detail, 'const forteca026ClientInitials = getInitials(client);', 'real client identity source');
  has(detail, 'const forteca026RelationshipLabel = activeCases.length > 0', 'real client relationship source');
  has(detail, 'const forteca026ClientTypeLabel = client.company', 'real client identity source');
  has(detail, 'const forteca026CreatedLabel = formatDate(client.createdAt)', 'real client identity source');
  has(detail, 'const forteca026SourceLabel = firstSourceLead?.source || client.source', 'real client source label');
  has(detail, 'const forteca026LatestNote = clientVisibleNotesForRenderStage216L[0]?.content', 'real client activity source');
  has(detail, '{forteca026ClientName}', 'real client render binding');
  has(detail, '{forteca026LatestNote}', 'real activity render binding');
});

test('FRT-026 keeps the new visual surface attached to the existing client-scoped data and actions', () => {
  has(detail, 'data-forteca-frt-026-case-summary="true"', 'FRT-026 case summary binding');
  has(detail, 'mainCase ? getCaseTitle(mainCase)', 'FRT-026 case summary data binding');
  has(detail, 'formatMoneyWithCurrency(clientFinanceSummary.caseValueTotal, clientFinance.currency)', 'FRT-026 case finance binding');
  has(detail, 'activeClientCases.map((caseRecord: any) => renderClientCaseSmartCardStage231B0R8(caseRecord, { closed: false }))', 'FRT-026 active case binding');
  has(detail, 'clientVisibleNotesForRenderStage216L.slice(0, 3).map((note)', 'FRT-026 notes binding');
  has(detail, 'clientActivities.slice(0, 5).map((activity: any, index: number)', 'FRT-026 history binding');
  has(detail, 'className="forteca-frt-026-edit-button"', 'FRT-026 edit control');
  has(detail, 'forteca-frt-026-new-case-button', 'FRT-026 create-case control');
  has(detail, 'onClick={handleClientPanelEditToggle}', 'FRT-026 edit handler');
  has(detail, 'onClick={openNewCase}', 'FRT-026 create-case handler');
  has(detail, 'onClick={openClientNoteModalStage216M_R16_R3}', 'FRT-026 note handler');
  has(detail, 'onClick={() => setActiveTab(\'cases\')}', 'FRT-026 existing cases handler');
});

test('FRT-026 wires client-wide finance truth into detail cards and relation summary', () => {
  has(detail, "import { getClientCasesFinanceSummary, getCaseFinanceSummary } from '../lib/finance/case-finance-source';", 'finance owner import');
  has(detail, "const clientFinanceSummary = useMemo(() => {", 'client finance derivation');
  has(detail, "getClientCasesFinanceSummary({ client, cases: cases ?? [], payments: payments ?? [], mode: 'all_cases' })", 'client finance derivation');
  for (const field of [
    'contractValueTotal: financeSummary.totalValue',
    'commissionDueTotal: financeSummary.commissionAmount',
    'commissionPaidTotal: financeSummary.commissionPaidAmount',
    'remainingCommissionTotal: financeSummary.commissionRemainingAmount',
    'settlementsCount: financeSummary.settlementsCount',
    'source: financeSummary.source',
  ]) {
    has(detail, field, 'client finance projection');
  }
  has(detail, 'data-stage220a13-client-finance-scope-card="true"', 'client finance card');
  has(detail, 'aria-label="Finanse klienta"', 'client finance card');
  for (const tone of ['transaction', 'commission', 'paid', 'remaining']) {
    has(detail, `data-cf-finance-tone="${tone}"`, 'client finance semantic tone');
  }
  has(detail, '<ClientTopTiles', 'detail finance/relation summary');
  has(detail, 'financeSummary={clientFinanceSummary}', 'detail finance/relation summary');
  has(detail, 'tasks={clientTasks}', 'detail relation summary');
  has(detail, 'events={clientEvents}', 'detail relation summary');
  has(detail, 'data-stage216m-r13-client-finance-inline-card="true"', 'right-rail finance card');
  has(detail, 'Finanse w sprawach', 'finance navigation action');

  has(financeSource, 'export function getClientCasesFinanceSummary(input: ClientCasesFinanceInput)', 'canonical finance source');
  has(financeSource, "if (mode === 'all_cases') return { cases: allCases, source: 'all_cases' };", 'canonical finance scope');
  has(financeSource, 'commissionPaidAmount', 'canonical commission source');
  has(financeSource, 'commissionRemainingAmount', 'canonical commission source');
});

test('FRT-026 keeps the right rail and contextual actions connected to real handlers', () => {
  has(detail, 'const clientRightRailActionsStage216M4 = dedupeClientRightRailActionsStage231H_R1D2_R12G([', 'right-rail action source');
  has(detail, '...clientTasks.map((task: any) => {', 'right-rail task source');
  has(detail, '...clientEvents.map((event: any) => {', 'right-rail event source');
  has(detail, '.filter((entry) => !isDoneStatus(entry.status))', 'right-rail active-state guard');
  has(detail, '.sort((left, right) => left.dateTime - right.dateTime)', 'right-rail ordering');
  has(detail, '.slice(0, 5);', 'right-rail bounded list');
  has(detail, 'className="client-detail-right-rail"', 'right-rail markup');
  has(detail, 'data-stage216m-r4-client-right-rail="true"', 'right-rail marker');
  has(detail, 'data-stage216m-r4-client-upcoming-actions-card="true"', 'upcoming-actions marker');
  has(detail, 'data-stage216m-r4-client-main-case-card="true"', 'main-case marker');
  has(detail, 'data-stage216m-r4-client-upcoming-action-row="true"', 'upcoming-action row marker');

  has(detail, 'const openClientContextAction = (kind: ContextActionKind) => {', 'context action handler');
  has(detail, "recordType: 'client'", 'context action scope');
  has(detail, 'recordId: clientId', 'context action record binding');
  has(detail, 'clientId,', 'context action client binding');
  has(detail, 'openContextQuickAction({', 'context action dispatch');
  has(detail, '<ContextActionButton', 'context action controls');
  has(detail, 'kind="task"', 'task action control');
  has(detail, 'kind="event"', 'event action control');
  has(detail, 'Dodaj zadanie', 'task action label');
  has(detail, 'Dodaj wydarzenie', 'event action label');
  has(detail, 'openNewCase', 'case action handler');
  has(detail, "if (!clientId) return navigate('/cases');", 'case route fallback');
  has(detail, 'setClientCaseCreateOpen(true);', 'case create action');
  has(detail, 'data-client-detail-visible-edit-action="true"', 'edit action marker');
  has(detail, 'onClick={handleClientPanelEditToggle}', 'edit action handler');
  has(detail, 'await updateClientInSupabase({', 'client save handler');
  has(detail, 'openClientNoteModalStage216M_R16_R3', 'note action handler');
  has(detail, 'insertActivityToSupabase({', 'activity write owner');
  has(detail, 'insertTaskToSupabase({', 'task write owner');
});

test('FRT-026 keeps the dedicated client-detail layout on semantic tokens', () => {
  has(detail, "import '../styles/forteca-client-detail.css';", 'FRT-026 stylesheet binding');
  assert.ok(exists(stylesPath), `FRT-026 styles are missing: ${stylesPath}`);
  const styles = read(stylesPath);

  assert.match(styles, /\.forteca-frt-026-[a-z0-9_-]+/i, 'FRT-026 stylesheet must own FRT-026 selectors');
  assert.match(styles, /data-forteca-frt-026-/i, 'FRT-026 stylesheet must style FRT-026 markers');
  for (const token of [
    '--cf-vst-color-primary',
    '--cf-vst-color-primary-soft',
    '--cf-vst-color-task',
    '--cf-vst-color-event',
    '--cf-vst-color-delete',
    '--cf-vst-surface-card-solid',
    '--cf-vst-surface-border',
    '--cf-vst-text-muted',
  ]) {
    has(styles, token, 'semantic visual token');
  }
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i, 'FRT-026 CSS must not introduce raw hex colors');
  assert.doesNotMatch(styles, /rgba?\(/i, 'FRT-026 CSS must not introduce raw rgb colors');
});

test('FRT-026 does not embed screenshot fixture data in the client detail source', () => {
  for (const fixturePattern of [
    /data:image\//i,
    /base64,/i,
    /026_client_detail\.(?:webp|png|jpe?g)/i,
    /\b(?:screenshot|fixture)[_-]?(?:data|client|payload)\b/i,
  ]) {
    assert.doesNotMatch(detail, fixturePattern, `ClientDetail must not embed screenshot fixture data (${fixturePattern})`);
  }
});
