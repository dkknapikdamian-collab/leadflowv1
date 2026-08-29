const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const exists = (file) => fs.existsSync(path.join(root, file));

const contractPath = '_project/contracts/forteca-clean/FRT-025_CLIENTS_ARCHIVED.md';
const referencePath = 'docs/ui/reference/forteca-calm-light/025_clients_archived.webp';
const clientsPath = 'src/pages/Clients.tsx';
const stylesPath = 'src/styles/forteca-clients-archived.css';

function section(source, startMarker, endMarker) {
  const start = source.indexOf(startMarker);
  assert.ok(start >= 0, `missing source section: ${startMarker}`);
  const end = source.indexOf(endMarker, start + startMarker.length);
  assert.ok(end > start, `missing source section end: ${endMarker}`);
  return source.slice(start, end);
}

function archivedRenderer(source) {
  return section(source, 'const renderArchivedStage025 = () => (', '\n  const renderActiveCommissionStage024');
}

test('FRT-025 pins the archived contract and reference without embedding fixture data', () => {
  const contract = read(contractPath);

  assert.match(contract, /CONTRACT_STATUS: LOCKED/);
  assert.match(contract, /STAGE_ID: FRT-025/);
  assert.match(contract, /TARGET_ROUTE: \/clients/);
  assert.match(contract, /TARGET_STATE: Clients — archived/);
  assert.match(contract, /REFERENCE_FILE: docs\/ui\/reference\/forteca-calm-light\/025_clients_archived\.webp/);
  assert.ok(exists(referencePath), `FRT-025 reference is missing: ${referencePath}`);
});

test('FRT-025 exposes an archived query, state marker, and dedicated render branch', () => {
  const source = read(clientsPath);

  for (const marker of [
    "query.get('frt025') === 'archived'",
    "const isArchivedStage025 = new URLSearchParams(location.search).get('frt025') === 'archived';",
    "data-forteca-frt-025-runtime={isArchivedStage025 ? 'true' : undefined}",
    "data-forteca-frt-025-root={isArchivedStage025 ? 'true' : undefined}",
  ]) {
    assert.ok(source.includes(marker), `missing FRT-025 runtime marker: ${marker}`);
  }

  assert.match(source, /type ClientRelationFilterStage232C[\s\S]{0,350}\| 'archived';/);
  assert.match(source, /query\.get\('frt025'\) === 'archived'[\s\S]{0,450}setClientRelationFilterStage232C\('archived'\)/);
  assert.match(source, /isArchivedStage025\s*\?\s*renderArchivedStage025\(\)/);
});

test('FRT-025 keeps the three client tabs and derives KPI values from archive state', () => {
  const source = read(clientsPath);
  const surface = archivedRenderer(source);
  const tabValues = Array.from(surface.matchAll(/data-forteca-frt-025-tab=["']([^"']+)["']/g), (match) => match[1]);

  assert.deepEqual([...new Set(tabValues)].sort(), ['active', 'all', 'archived']);
  for (const copy of [/\bAktywni\b/i, /\bArchiwalne\b/i, /\bWszyscy\b/i]) {
    assert.match(surface, copy, `missing archived-view tab copy matching ${copy}`);
  }
  const archivedTab = surface.match(/<button[^>]*data-forteca-frt-025-tab=["']archived["'][^>]*>/);
  assert.ok(archivedTab, 'missing the active archived tab element');
  assert.match(archivedTab[0], /(?:\bis-active\b|aria-current=["']page["'])/);
  assert.match(surface, /setClientRelationFilterStage232C\('all'\)/);
  assert.match(surface, /setStatusFilterStage021\('active'\)/);
  assert.match(surface, /setStatusFilterStage021\('all'\)/);

  for (const marker of [
    'data-forteca-frt-025-tabs="true"',
    'data-forteca-frt-025-kpis="true"',
  ]) {
    assert.ok(surface.includes(marker), `missing FRT-025 surface marker: ${marker}`);
  }
  for (const value of [
    'archivedRowsStage025.length',
    'stage025ArchivedThisMonth',
    'stage025ArchiveDeltaLabel',
    'stage025RestorableCount',
    'stage025InactiveOver90Count',
  ]) {
    assert.ok(surface.includes(`{${value}}`) || surface.includes(`{${value} `), `missing derived FRT-025 KPI value: ${value}`);
  }
  assert.ok((surface.match(/className="forteca-frt-025-kpi"/g) || []).length >= 3, 'FRT-025 should expose multiple KPI cards');
  for (const tone of ['primary', 'warning', 'success', 'danger']) {
    assert.match(surface, new RegExp(`data-forteca-frt-025-tone=["']${tone}`));
  }
});

test('FRT-025 wires search and archive filters to stateful toolbar controls', () => {
  const source = read(clientsPath);
  const surface = archivedRenderer(source);

  for (const marker of [
    'data-forteca-frt-025-toolbar="true"',
    'data-forteca-frt-025-filters="true"',
    'data-forteca-frt-025-clear="true"',
    'data-forteca-frt-025-customize-panel="true"',
  ]) {
    assert.ok(surface.includes(marker), `missing FRT-025 toolbar marker: ${marker}`);
  }
  assert.match(surface, /value=\{search\}[\s\S]*?setSearch\(event\.target\.value\)/);

  for (const filter of [
    'stage025ArchiveReasonFilter',
    'stage025ArchiveDateFilter',
    'stage025OwnerFilter',
  ]) {
    assert.match(surface, new RegExp(`value=\\{${filter}\\}`));
    assert.match(surface, new RegExp(`set${filter.charAt(0).toUpperCase()}${filter.slice(1)}\\(`));
  }
  for (const option of ['last_30', 'last_90', 'older']) {
    assert.ok(surface.includes(`value="${option}"`), `missing archive date filter option: ${option}`);
  }
  assert.match(surface, /stage025ArchiveReasonOptions\.map\(/);
  assert.match(surface, /stage025OwnerOptions\.map\(/);
  assert.match(surface, /onClick=\{resetArchivedFiltersStage025\}/);

  const resetter = section(source, 'const resetArchivedFiltersStage025 = () => {', '\n  const exportActiveCommissionStage024');
  for (const reset of [
    "setSearch('')",
    "setStage025ArchiveReasonFilter('all')",
    "setStage025ArchiveDateFilter('all')",
    "setStage025OwnerFilter('all')",
    'setStage025Page(1)',
  ]) {
    assert.ok(resetter.includes(reset), `archive filter reset is missing: ${reset}`);
  }
});

test('FRT-025 renders real archived clients and rejects screenshot or fake-row sources', () => {
  const source = read(clientsPath);
  const surface = archivedRenderer(source);
  const archiveRows = section(source, 'const archivedRowsStage025', '\n  const stage025ArchiveReasonOptions');

  assert.match(archiveRows, /useMemo<Stage025ArchivedRow\[\]>/);
  assert.match(archiveRows, /return clients\s*\.map\(/);
  assert.match(archiveRows, /getStage025ArchivedAt\(client\)/);
  assert.match(source, /const visibleArchivedRowsStage025 = filteredArchivedRowsStage025\.slice\(/);
  assert.match(surface, /visibleArchivedRowsStage025\.map\(/);
  assert.match(surface, /data-forteca-frt-025-row="true"[\s\S]*?data-client-id=\{client\.id\}/);
  assert.match(surface, /<Link\s+to=\{['"]\/clients\/['"]\s*\+\s*client\.id\}/);
  assert.doesNotMatch(source, /(?:const|let)\s+(?:archivedRowsStage025|visibleArchivedRowsStage025)\s*=\s*\[/);
  assert.doesNotMatch(surface, /\b(?:leads|leadRows|mock|fixture)\b/i);
  assert.doesNotMatch(source, /(?:025_clients_archived\.webp|archiwalni_klienci_w_panelu_forteca\.png|data:image\/|base64,)/i);
});

test('FRT-025 routes restore through the existing ConfirmDialog and preserves archive safety', () => {
  const source = read(clientsPath);
  const surface = archivedRenderer(source);

  assert.ok(source.includes("import { ConfirmDialog } from '../components/confirm-dialog';"));
  assert.match(source, /const handleRestoreClient = async/);
  assert.match(source, /setClientArchiveConfirm\(\{\s*mode: 'restore'/);
  assert.match(surface, /handleRestoreClient\(/);
  assert.match(surface, /onClick=\{\(event\) => handleRestoreClient\(event, client\)\}/);
  assert.match(source, /<ConfirmDialog[\s\S]*?onConfirm=\{confirmClientArchiveAction\}/);
  assert.match(source, /onOpenChange=\{\(open\) => \{[\s\S]*?if \(!open && !archivePendingId\) setClientArchiveConfirm\(null\)/);
  assert.match(source, /pending=\{Boolean\(archivePendingId\)\}/);
  assert.match(source, /confirmTone=\{clientArchiveConfirm\?\.mode === 'restore' \? 'default' : 'destructive'\}/);
  assert.match(source, /if \(mode === 'archive'\)[\s\S]*?else \{[\s\S]*?updateClientInSupabase\(\{[\s\S]*?id: targetClient\.id,[\s\S]*?archivedAt: null/);
  assert.match(source, /archivedAt: null[\s\S]*?await reload\(\)/);
  assert.doesNotMatch(surface, /\bupdateClientInSupabase\b/);
  assert.doesNotMatch(source, /\bwindow\.confirm\s*\(/);
});

test('FRT-025 keeps archived surfaces on semantic classes and shared visual tokens', () => {
  const source = read(clientsPath);

  assert.ok(source.includes("import '../styles/forteca-clients-archived.css';"));
  assert.ok(exists(stylesPath), `FRT-025 styles are missing: ${stylesPath}`);
  const styles = read(stylesPath);

  assert.match(source, /forteca-frt-025-page/);
  assert.match(styles, /\.forteca-frt-025-[a-z0-9_-]+/i);
  assert.match(styles, /data-forteca-frt-025-tone/);
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
    assert.ok(styles.includes(token), `FRT-025 is missing shared visual token: ${token}`);
  }
  assert.doesNotMatch(styles, /#[0-9a-f]{3,8}\b/i);
  assert.doesNotMatch(styles, /rgba?\(/i);
});
