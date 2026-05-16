const fs = require('node:fs');
const path = require('node:path');

const { mojibakeWords } = require('../scripts/mojibake-markers.cjs');

const root = process.cwd();

const files = {
  page: path.join(root, 'src', 'pages', 'AiDrafts.tsx'),
  drafts: path.join(root, 'src', 'lib', 'ai-drafts.ts'),
  helper: path.join(root, 'src', 'lib', 'ai-draft-confirm-records.ts'),
  fallback: path.join(root, 'src', 'lib', 'supabase-fallback.ts'),
};

function fail(message) {
  console.error('FAIL ai drafts confirm records:', message);
  process.exit(1);
}

for (const [name, filePath] of Object.entries(files)) {
  if (!fs.existsSync(filePath)) fail(`missing file: ${name}`);
}

const page = fs.readFileSync(files.page, 'utf8');
const drafts = fs.readFileSync(files.drafts, 'utf8');
const helper = fs.readFileSync(files.helper, 'utf8');
const fallback = fs.readFileSync(files.fallback, 'utf8');
const combined = `${page}\n${drafts}\n${helper}\n${fallback}`;

const requiredPage = [
  'AI_DRAFT_CONFIRM_RECORDS_STAGE25_PAGE',
  'createLeadFromAiDraftApprovalInSupabase',
  'insertTaskToSupabase',
  'insertEventToSupabase',
  'insertActivityToSupabase',
  'buildAiDraftConfirmedParsedDraft',
  'getAiDraftCreatedRecordId',
  'linkedRecordId',
  'linkedRecordType',
  "rawText: ''",
  'Follow-up: ',
  'Wybierz powi\u0105zanie dla notatki.',
  'Otw\u00F3rz rekord',
];

for (const needle of requiredPage) {
  if (!page.includes(needle)) fail(`missing AiDrafts content: ${needle}`);
}

const requiredDraftLib = [
  'AI_DRAFT_CONFIRM_RECORDS_STAGE25_LIB',
  'linkedRecordId?: string | null',
  'linkedRecordType?:',
  'confirmedAt: patch.confirmedAt',
  'cancelledAt: patch.cancelledAt',
  "rawText: ''",
];

for (const needle of requiredDraftLib) {
  if (!drafts.includes(needle)) fail(`missing ai-drafts lib content: ${needle}`);
}

const requiredHelper = [
  'AI_DRAFT_CONFIRM_RECORDS_STAGE25',
  'getAiDraftCreatedRecordId',
  'buildAiDraftConfirmedParsedDraft',
  'rawTextRemoved: true',
];

for (const needle of requiredHelper) {
  if (!helper.includes(needle)) fail(`missing helper content: ${needle}`);
}

const requiredFallback = [
  'AI_DRAFT_CONFIRM_RECORDS_STAGE25_SUPABASE',
  'linkedRecordId?: string | null',
  'linkedRecordType?: string | null',
  'confirmedAt?: string | null',
];

for (const needle of requiredFallback) {
  if (!fallback.includes(needle)) fail(`missing supabase fallback content: ${needle}`);
}

if (!/recordType === 'note'[\s\S]{0,260}!form\.leadId[\s\S]{0,80}!form\.caseId[\s\S]{0,80}!form\.clientId/.test(page)) {
  fail('note confirmation does not validate relation before writing activity');
}

if (/handleArchive[\s\S]{0,900}createLeadFromAiDraftApprovalInSupabase/.test(page)) {
  fail('cancelled draft appears to create a lead');
}

if (/handleArchive[\s\S]{0,900}insertTaskToSupabase/.test(page)) {
  fail('cancelled draft appears to create a task');
}

if (/handleArchive[\s\S]{0,900}insertEventToSupabase/.test(page)) {
  fail('cancelled draft appears to create an event');
}

for (const mojibake of Object.values(mojibakeWords)) {
  if (combined.includes(mojibake)) fail(`mojibake found: ${mojibake}`);
}

console.log('PASS ai drafts confirm records');
