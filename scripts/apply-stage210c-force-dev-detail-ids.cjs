const fs = require("fs");
const path = require("path");

const root = process.cwd();
const file = path.join(root, "src", "lib", "supabase-fallback.ts");
const archiveDir = path.join(root, "_project", "archive", "STAGE210C_FORCE_DEV_DETAIL_IDS");

fs.mkdirSync(archiveDir, { recursive: true });

if (!fs.existsSync(file)) {
  throw new Error("Missing src/lib/supabase-fallback.ts");
}

let src = fs.readFileSync(file, "utf8");
fs.writeFileSync(path.join(archiveDir, "supabase-fallback.ts.stage210c.before"), src, "utf8");

function findFunctionEnd(source, openBraceIndex) {
  let depth = 0;
  let mode = null;
  let escape = false;

  for (let i = openBraceIndex; i < source.length; i++) {
    const c = source[i];
    const n = source[i + 1];

    if (mode === "line") {
      if (c === "\n") mode = null;
      continue;
    }

    if (mode === "block") {
      if (c === "*" && n === "/") {
        i++;
        mode = null;
      }
      continue;
    }

    if (mode === "single" || mode === "double" || mode === "template") {
      if (escape) {
        escape = false;
        continue;
      }
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (mode === "single" && c === "'") {
        mode = null;
        continue;
      }
      if (mode === "double" && c === '"') {
        mode = null;
        continue;
      }
      if (mode === "template" && c === "`") {
        mode = null;
        continue;
      }
      continue;
    }

    if (c === "/" && n === "/") {
      i++;
      mode = "line";
      continue;
    }

    if (c === "/" && n === "*") {
      i++;
      mode = "block";
      continue;
    }

    if (c === "'") {
      mode = "single";
      continue;
    }

    if (c === '"') {
      mode = "double";
      continue;
    }

    if (c === "`") {
      mode = "template";
      continue;
    }

    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) return i + 1;
    }
  }

  throw new Error("Cannot find function end.");
}

function replaceFunctionByMarker(source, marker, replacement) {
  const start = source.indexOf(marker);
  if (start < 0) {
    throw new Error(`Cannot find marker: ${marker}`);
  }

  const openBrace = source.indexOf("{", start);
  if (openBrace < 0) {
    throw new Error(`Cannot find function body for marker: ${marker}`);
  }

  const end = findFunctionEnd(source, openBrace);
  return source.slice(0, start) + replacement.trimEnd() + source.slice(end);
}

function ensureHelper(source) {
  const helper = `
function isDevPreviewDetailId(id: string) {
  return import.meta.env.DEV && /^dev-(client|lead|case)-/.test(String(id || ''));
}

function getDevPreviewRowById(entity: 'clients' | 'leads' | 'cases', id: string) {
  const forceDevPreviewDetail = isDevPreviewDetailId(id);
  if (!forceDevPreviewDetail && !isDevPreviewDataEnabled()) return null;

  const data = getDevPreviewData() as Record<string, Record<string, unknown>[]>;
  const rows = Array.isArray(data[entity]) ? data[entity] : [];
  return rows.find((row) => String((row as any)?.id || '') === String(id)) ?? null;
}

`;

  if (source.includes("function getDevPreviewRowById")) {
    source = replaceFunctionByMarker(source, "function getDevPreviewRowById(", `
function getDevPreviewRowById(entity: 'clients' | 'leads' | 'cases', id: string) {
  const forceDevPreviewDetail = isDevPreviewDetailId(id);
  if (!forceDevPreviewDetail && !isDevPreviewDataEnabled()) return null;

  const data = getDevPreviewData() as Record<string, Record<string, unknown>[]>;
  const rows = Array.isArray(data[entity]) ? data[entity] : [];
  return rows.find((row) => String((row as any)?.id || '') === String(id)) ?? null;
}
`);
    if (!source.includes("function isDevPreviewDetailId")) {
      source = source.replace("function getDevPreviewRowById", `function isDevPreviewDetailId(id: string) {
  return import.meta.env.DEV && /^dev-(client|lead|case)-/.test(String(id || ''));
}

function getDevPreviewRowById`);
    }
    return source;
  }

  const anchor = "export type CloseflowDataMutationDetail = {";
  if (!source.includes(anchor)) {
    throw new Error("Cannot insert dev preview helpers, anchor not found.");
  }

  return source.replace(anchor, helper + anchor);
}

src = ensureHelper(src);

src = replaceFunctionByMarker(src, "export async function fetchClientByIdFromSupabase(", `
export async function fetchClientByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('clients', id);
  if (devRow) return normalizeClientContract(devRow);
  if (isDevPreviewDetailId(id)) throw new Error(\`DEV_PREVIEW_CLIENT_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/clients?id=\${encodeURIComponent(id)}\`).then((row) => normalizeClientContract(row));
}
`);

src = replaceFunctionByMarker(src, "export async function fetchLeadByIdFromSupabase(", `
export async function fetchLeadByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('leads', id);
  if (devRow) return normalizeLeadContract(devRow);
  if (isDevPreviewDetailId(id)) throw new Error(\`DEV_PREVIEW_LEAD_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/leads?id=\${encodeURIComponent(id)}\`).then((row) => normalizeLeadContract(row));
}
`);

src = replaceFunctionByMarker(src, "export async function fetchCaseByIdFromSupabase(", `
export async function fetchCaseByIdFromSupabase(id: string) {
  const devRow = getDevPreviewRowById('cases', id);
  if (devRow) return normalizeCaseContract(devRow);
  if (isDevPreviewDetailId(id)) throw new Error(\`DEV_PREVIEW_CASE_NOT_FOUND:\${id}\`);
  return callApi<Record<string, unknown>>(\`/api/cases?id=\${encodeURIComponent(id)}\`).then((row) => normalizeCaseContract(row));
}
`);

const checks = [
  "function isDevPreviewDetailId",
  "function getDevPreviewRowById",
  "forceDevPreviewDetail",
  "getDevPreviewRowById('clients', id)",
  "getDevPreviewRowById('leads', id)",
  "getDevPreviewRowById('cases', id)",
  "DEV_PREVIEW_CLIENT_NOT_FOUND",
  "DEV_PREVIEW_LEAD_NOT_FOUND",
  "DEV_PREVIEW_CASE_NOT_FOUND"
];

for (const needle of checks) {
  if (!src.includes(needle)) {
    throw new Error(`Missing Stage210C contract: ${needle}`);
  }
}

fs.writeFileSync(file, src, "utf8");

console.log(JSON.stringify({
  ok: true,
  patched: [
    "isDevPreviewDetailId",
    "getDevPreviewRowById",
    "fetchClientByIdFromSupabase",
    "fetchLeadByIdFromSupabase",
    "fetchCaseByIdFromSupabase"
  ],
  behavior: "dev-* detail ids use local fixtures in DEV even when Supabase env exists",
  mode: "local-only, no git add, no commit, no push"
}, null, 2));
