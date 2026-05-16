#!/usr/bin/env node
"use strict";

/**
 * CloseFlow release candidate evidence gate.
 *
 * Purpose:
 * - print and optionally write a release evidence document,
 * - collect branch, commit, preview URL, package scripts, test/build results,
 * - show an env matrix without leaking secret values.
 *
 * This version is intentionally defensive on Windows:
 * - strips UTF-8 BOM before JSON.parse,
 * - resolves the git repo root before reading package.json,
 * - detects npm version from npm_config_user_agent when npm.cmd cannot be spawned,
 * - runs npm.cmd through cmd.exe on Windows to avoid spawnSync EINVAL.
 *
 * Usage:
 *   node scripts/print-release-evidence.cjs --write --preview-url=https://...
 *   node scripts/print-release-evidence.cjs --write --skip-checks
 *   node scripts/print-release-evidence.cjs --write --checks=check:polish-mojibake,verify:closeflow:quiet,test:critical,build
 */

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const CWD = process.cwd();
const args = process.argv.slice(2);
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";

function stripBom(text) {
  const value = String(text || "");
  return value.charCodeAt(0) === 0xfeff ? value.slice(1) : value;
}

function hasFlag(flag) {
  return args.includes(flag);
}

function getArg(name) {
  const eqPrefix = `--${name}=`;
  const eq = args.find((arg) => arg.startsWith(eqPrefix));
  if (eq) return eq.slice(eqPrefix.length);
  const idx = args.indexOf(`--${name}`);
  if (idx >= 0 && args[idx + 1] && !args[idx + 1].startsWith("--")) {
    return args[idx + 1];
  }
  return "";
}

function getRepeatedArg(name) {
  const out = [];
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const eqPrefix = `--${name}=`;
    if (arg.startsWith(eqPrefix)) out.push(arg.slice(eqPrefix.length));
    if (arg === `--${name}` && args[i + 1] && !args[i + 1].startsWith("--")) {
      out.push(args[i + 1]);
      i += 1;
    }
  }
  return out;
}

function quoteWindowsArg(value) {
  const raw = String(value == null ? "" : value);
  if (/^[A-Za-z0-9_:@%+=,.\/\\-]+$/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '\"')}"`;
}

function buildSpawn(command, commandArgs) {
  const argsList = Array.isArray(commandArgs) ? commandArgs : [];
  const display = [command].concat(argsList).join(" ");

  // Windows PowerShell + Node can reject direct spawnSync('npm.cmd', ...) with EINVAL.
  // Run npm/cmd tools through cmd.exe explicitly, the same way a user runs them in terminal.
  if (process.platform === "win32" && /\.(cmd|bat)$/i.test(command)) {
    const commandLine = [command].concat(argsList).map(quoteWindowsArg).join(" ");
    return {
      command: "cmd.exe",
      args: ["/d", "/s", "/c", commandLine],
      display: commandLine,
    };
  }

  return { command, args: argsList, display };
}

function runAt(cwd, command, commandArgs, opts = {}) {
  const startedAt = Date.now();
  const spawnTarget = buildSpawn(command, commandArgs);
  let result;

  try {
    result = spawnSync(spawnTarget.command, spawnTarget.args, {
      cwd,
      encoding: "utf8",
      shell: false,
      timeout: opts.timeoutMs || 20 * 60 * 1000,
      env: process.env,
      windowsHide: true,
    });
  } catch (err) {
    result = {
      status: 1,
      stdout: "",
      stderr: "",
      error: err,
    };
  }

  const timedOut = Boolean(result.error && result.error.code === "ETIMEDOUT");
  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  const status = typeof result.status === "number" ? result.status : timedOut ? 124 : 1;
  return {
    command: spawnTarget.display,
    ok: status === 0,
    code: status,
    timedOut,
    durationMs: Date.now() - startedAt,
    stdout,
    stderr,
    error: result.error ? String(result.error.message || result.error) : "",
  };
}

function tryRunAt(cwd, command, commandArgs) {
  const result = runAt(cwd, command, commandArgs, { timeoutMs: 60 * 1000 });
  return result.ok ? stripBom(result.stdout).trim() : "";
}

function detectRepoRoot() {
  const root = tryRunAt(CWD, "git", ["rev-parse", "--show-toplevel"]);
  return root || CWD;
}

const ROOT = detectRepoRoot();
const SHOULD_WRITE = hasFlag("--write");
const SKIP_CHECKS = hasFlag("--skip-checks") || hasFlag("--no-checks");
const OUTPUT_PATH = getArg("out") || path.join("docs", "release", "RELEASE_CANDIDATE_2026-05-06.md");
const PREVIEW_URL_ARG = getArg("preview-url") || getArg("preview") || process.env.RELEASE_PREVIEW_URL || "";
const CHECKS_ARG = getArg("checks");
const EXTRA_LIMITATIONS = getRepeatedArg("known-limitation");

function nowIso() {
  return new Date().toISOString();
}

function normalizeUrl(raw) {
  if (!raw) return "";
  const trimmed = String(raw).trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function run(command, commandArgs, opts = {}) {
  return runAt(opts.cwd || ROOT, command, commandArgs, opts);
}

function tryRun(command, commandArgs) {
  return tryRunAt(ROOT, command, commandArgs);
}

function readJson(filePath) {
  try {
    return JSON.parse(stripBom(fs.readFileSync(filePath, "utf8")));
  } catch (err) {
    return null;
  }
}

function tailText(value, maxLines = 120, maxChars = 18000) {
  const text = stripBom(value).replace(/\r\n/g, "\n");
  const lines = text.split("\n");
  const tailed = lines.slice(Math.max(0, lines.length - maxLines)).join("\n");
  if (tailed.length <= maxChars) return tailed;
  return tailed.slice(tailed.length - maxChars);
}

function escapeMd(value) {
  return String(value == null ? "" : value).replace(/\|/g, "\\|").replace(/\n/g, "<br>");
}

function codeBlock(value, lang = "") {
  const text = String(value || "").trimEnd();
  if (!text) return "_brak outputu_";
  return `\`\`\`${lang}\n${text}\n\`\`\``;
}

const pkgPath = path.join(ROOT, "package.json");
const pkg = readJson(pkgPath);
const scripts = pkg && pkg.scripts && typeof pkg.scripts === "object" ? pkg.scripts : {};
const scriptNames = Object.keys(scripts).sort();

function detectNpmVersion() {
  const ua = process.env.npm_config_user_agent || "";
  const uaMatch = ua.match(/npm\/(\S+)/);
  if (uaMatch) return uaMatch[1];
  return tryRun(npmBin, ["--version"]);
}

function detectPreviewUrl() {
  const candidates = [
    PREVIEW_URL_ARG,
    process.env.APP_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.VITE_APP_URL,
    process.env.VITE_PUBLIC_APP_URL,
    process.env.DEPLOYMENT_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL,
    process.env.VERCEL_BRANCH_URL,
    process.env.VERCEL_URL,
  ].filter(Boolean);

  return normalizeUrl(candidates[0] || "");
}

const git = {
  repoRoot: ROOT,
  branch: tryRun("git", ["branch", "--show-current"]),
  commit: tryRun("git", ["rev-parse", "HEAD"]),
  shortCommit: tryRun("git", ["rev-parse", "--short", "HEAD"]),
  commitDate: tryRun("git", ["log", "-1", "--format=%cI"]),
  commitSubject: tryRun("git", ["log", "-1", "--format=%s"]),
  remote: tryRun("git", ["remote", "get-url", "origin"]),
  statusShort: tryRun("git", ["status", "--short"]),
};

const detectedScripts = scriptNames.filter((name) => /(test|verify|check|lint|type|build|audit)/i.test(name));

function normalizeCheckList() {
  if (CHECKS_ARG) {
    return CHECKS_ARG.split(",").map((x) => x.trim()).filter(Boolean);
  }
  return [
    "check:polish-mojibake",
    "verify:closeflow:quiet",
    "test:critical",
    "build",
  ];
}

const requestedChecks = normalizeCheckList();
const availableChecks = requestedChecks.filter((name) => Boolean(scripts[name]) && name !== "audit:release-evidence");
const missingChecks = requestedChecks.filter((name) => !scripts[name]);

const checkResults = [];
if (!SKIP_CHECKS && pkg) {
  for (const script of availableChecks) {
    const result = run(npmBin, ["run", script], { timeoutMs: 25 * 60 * 1000 });
    checkResults.push({
      script,
      ok: result.ok,
      code: result.code,
      durationMs: result.durationMs,
      stdoutTail: tailText(result.stdout, 120, 18000),
      stderrTail: tailText(result.stderr || result.error, 80, 12000),
      command: result.command,
    });
  }
}

function parseEnvFile(fileName) {
  const fullPath = path.join(ROOT, fileName);
  if (!fs.existsSync(fullPath)) return [];
  const text = stripBom(fs.readFileSync(fullPath, "utf8"));
  const keys = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!match) continue;
    const key = match[1];
    const rawValue = match[2] || "";
    const value = rawValue.trim();
    const hasValue = value !== "" && !/^<.*>$/.test(value) && !/^your_/i.test(value);
    keys.push({ key, fileName, hasValue });
  }
  return keys;
}

const envFiles = [
  ".env.local",
  ".env.production.local",
  ".env.production",
  ".env",
  ".env.example",
  ".env.template",
];

const envFileMap = new Map();
for (const file of envFiles) {
  for (const entry of parseEnvFile(file)) {
    if (!envFileMap.has(entry.key)) envFileMap.set(entry.key, []);
    envFileMap.get(entry.key).push(entry);
  }
}

const expectedEnv = [
  { key: "APP_URL", area: "release/app", note: "Publiczny URL aplikacji, u\u017Cywany w linkach i callbackach." },
  { key: "RELEASE_PREVIEW_URL", area: "release/app", note: "Opcjonalny jawny URL preview do raportu release." },
  { key: "VERCEL_URL", area: "release/app", note: "URL deploymentu Vercel, zwykle ustawiany automatycznie." },
  { key: "VITE_SUPABASE_URL", area: "data/auth", note: "Frontend Supabase URL." },
  { key: "VITE_SUPABASE_ANON_KEY", area: "data/auth", note: "Frontend Supabase anon key." },
  { key: "SUPABASE_URL", area: "data/auth", note: "Backend Supabase URL." },
  { key: "SUPABASE_ANON_KEY", area: "data/auth", note: "Backend Supabase anon key, je\u015Bli u\u017Cywany." },
  { key: "SUPABASE_SERVICE_ROLE_KEY", area: "data/auth", note: "Backend service role key, tylko server-side." },
  { key: "VITE_FIREBASE_API_KEY", area: "auth", note: "Firebase auth frontend, je\u015Bli u\u017Cywany." },
  { key: "VITE_FIREBASE_AUTH_DOMAIN", area: "auth", note: "Firebase auth domain, je\u015Bli u\u017Cywany." },
  { key: "VITE_FIREBASE_PROJECT_ID", area: "auth", note: "Firebase project id, je\u015Bli u\u017Cywany." },
  { key: "STRIPE_SECRET_KEY", area: "billing", note: "Stripe server key do checkoutu." },
  { key: "STRIPE_WEBHOOK_SECRET", area: "billing", note: "Stripe webhook signing secret." },
  { key: "VITE_STRIPE_PUBLISHABLE_KEY", area: "billing", note: "Stripe publishable key dla frontu, je\u015Bli u\u017Cywany." },
  { key: "STRIPE_PRICE_ID_BASIC", area: "billing", note: "Price ID planu Basic, je\u015Bli u\u017Cywany." },
  { key: "STRIPE_PRICE_ID_PRO", area: "billing", note: "Price ID planu Pro, je\u015Bli u\u017Cywany." },
  { key: "STRIPE_PRICE_ID_AI", area: "billing", note: "Price ID planu AI, je\u015Bli u\u017Cywany." },
  { key: "RESEND_API_KEY", area: "mail/digest", note: "Mail provider. Bez tego digest mo\u017Ce przej\u015B\u0107 logik\u0119, ale nie wy\u015Ble maila." },
  { key: "DIGEST_FROM_EMAIL", area: "mail/digest", note: "Adres nadawcy digestu." },
  { key: "CRON_SECRET", area: "mail/digest", note: "Sekret chroni\u0105cy endpointy cron." },
  { key: "DIGEST_ENFORCE_WORKSPACE_HOUR", area: "mail/digest", note: "Wymuszanie godziny workspace dla digestu." },
  { key: "AI_ENABLED", area: "ai", note: "W\u0142\u0105czenie/wy\u0142\u0105czenie AI." },
  { key: "AI_PRIMARY_PROVIDER", area: "ai", note: "Primary provider AI, np. gemini." },
  { key: "GEMINI_API_KEY", area: "ai", note: "Gemini key, je\u015Bli AI u\u017Cywa Gemini." },
  { key: "GEMINI_MODEL", area: "ai", note: "Model Gemini." },
  { key: "AI_FALLBACK_PROVIDER", area: "ai", note: "Fallback provider AI." },
  { key: "CLOUDFLARE_ACCOUNT_ID", area: "ai", note: "Cloudflare Workers AI account." },
  { key: "CLOUDFLARE_API_TOKEN", area: "ai", note: "Cloudflare Workers AI token." },
  { key: "CLOUDFLARE_AI_MODEL", area: "ai", note: "Cloudflare Workers AI model." },
  { key: "GOOGLE_CLIENT_ID", area: "google-calendar", note: "OAuth Google Calendar, je\u015Bli sync jest aktywny." },
  { key: "GOOGLE_CLIENT_SECRET", area: "google-calendar", note: "OAuth Google Calendar secret." },
  { key: "GOOGLE_REDIRECT_URI", area: "google-calendar", note: "OAuth Google Calendar callback." },
];

const expectedByKey = new Map(expectedEnv.map((item) => [item.key, item]));
const allEnvKeys = Array.from(new Set(expectedEnv.map((x) => x.key).concat(Array.from(envFileMap.keys())))).sort((a, b) => {
  const ai = expectedEnv.findIndex((x) => x.key === a);
  const bi = expectedEnv.findIndex((x) => x.key === b);
  if (ai >= 0 && bi >= 0) return ai - bi;
  if (ai >= 0) return -1;
  if (bi >= 0) return 1;
  return a.localeCompare(b);
});

function envStatus(key) {
  if (process.env[key] && String(process.env[key]).trim()) return "SET_IN_PROCESS";
  const entries = envFileMap.get(key) || [];
  const realFile = entries.find((entry) => entry.fileName !== ".env.example" && entry.fileName !== ".env.template" && entry.hasValue);
  if (realFile) return "PRESENT_IN_ENV_FILE";
  const example = entries.find((entry) => entry.fileName === ".env.example" || entry.fileName === ".env.template");
  if (example) return "EXAMPLE_ONLY";
  return "MISSING";
}

const envRows = allEnvKeys.map((key) => {
  const meta = expectedByKey.get(key) || { area: "extra", note: "Znalezione w plikach env repo." };
  const entries = envFileMap.get(key) || [];
  return {
    key,
    area: meta.area,
    status: envStatus(key),
    sources: entries.map((entry) => entry.fileName).filter((v, i, a) => a.indexOf(v) === i).join(", ") || "-",
    note: meta.note,
  };
});

const previewUrl = detectPreviewUrl();
const packageManager = {
  node: process.version,
  npm: detectNpmVersion(),
  packageName: pkg ? pkg.name || "" : "",
  packageVersion: pkg ? pkg.version || "" : "",
};

function checkStatusText(result) {
  if (!result) return "NOT_RUN";
  return result.ok ? "PASS" : "FAIL";
}

const buildResult = checkResults.find((result) => result.script === "build");
const failedChecks = checkResults.filter((result) => !result.ok);

const limitations = [...EXTRA_LIMITATIONS];

if (!previewUrl) {
  limitations.push("Preview URL nie zosta\u0142 wykryty automatycznie. Podaj go przez --preview-url albo RELEASE_PREVIEW_URL.");
}
if (!pkg) {
  limitations.push("Brak mo\u017Cliwego do odczytu package.json w katalogu repo. Skrypt nie mo\u017Ce zebra\u0107 listy skrypt\u00F3w ani uruchomi\u0107 build/test\u00F3w.");
}
if (missingChecks.length) {
  limitations.push(`Nie wykryto wymaganych check\u00F3w w package.json: ${missingChecks.join(", ")}.`);
}
if (!scriptNames.includes("test:critical") && !scriptNames.includes("e2e") && !scriptNames.some((name) => /playwright|cypress|smoke/i.test(name))) {
  limitations.push("Nie wykryto jawnego skryptu E2E/smoke. Manualny smoke test release\u2019u pozostaje obowi\u0105zkowy.");
}
if (envStatus("RESEND_API_KEY") === "MISSING" || envStatus("DIGEST_FROM_EMAIL") === "MISSING" || envStatus("CRON_SECRET") === "MISSING") {
  limitations.push("Je\u015Bli digest/cron mailowy jest cz\u0119\u015Bci\u0105 testu release, brak RESEND_API_KEY/DIGEST_FROM_EMAIL/CRON_SECRET oznacza brak fizycznej wysy\u0142ki maila lub brak pe\u0142nego zabezpieczenia cron.");
}
if (envStatus("GOOGLE_CLIENT_ID") === "MISSING" || envStatus("GOOGLE_CLIENT_SECRET") === "MISSING") {
  limitations.push("Je\u015Bli Google Calendar sync jest w zakresie release, brak GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET oznacza brak pe\u0142nego testu OAuth/sync.");
}
limitations.push("Warto\u015Bci sekret\u00F3w nie s\u0105 drukowane. Raport pokazuje tylko status obecno\u015Bci kluczy i nazwy \u017Ar\u00F3de\u0142.");
limitations.push("Commit hash w pliku markdown jest snapshotem z chwili uruchomienia. Naj\u015Bwie\u017Cszy dow\u00F3d dla audytora daje ponowne uruchomienie `npm run audit:release-evidence` na sprawdzanym branche.");

let overall = "PASS";
if (!pkg || failedChecks.length > 0) {
  overall = "FAIL";
} else if (missingChecks.length > 0 || !previewUrl || git.statusShort) {
  overall = "WARN";
}

const statusEmoji = overall === "PASS" ? "\u2705" : overall === "WARN" ? "\u26A0\uFE0F" : "\u274C";

const detectedScriptsTable = detectedScripts.length
  ? detectedScripts.map((name) => `| \`${escapeMd(name)}\` | \`${escapeMd(scripts[name])}\` |`).join("\n")
  : "| _brak_ | _brak_ |";

const checkResultsTable = SKIP_CHECKS
  ? "| SKIPPED | - | - | - |\n"
  : (checkResults.length
    ? checkResults.map((r) => `| \`${escapeMd(r.script)}\` | ${r.ok ? "PASS" : "FAIL"} | ${r.code} | ${(r.durationMs / 1000).toFixed(1)}s |`).join("\n")
    : "| _brak uruchomionych check\u00F3w_ | - | - | - |");

const missingChecksTable = missingChecks.length
  ? missingChecks.map((name) => `- \`${name}\``).join("\n")
  : "- brak";

const envTable = envRows.map((row) => {
  return `| \`${escapeMd(row.key)}\` | ${escapeMd(row.area)} | ${escapeMd(row.status)} | ${escapeMd(row.sources)} | ${escapeMd(row.note)} |`;
}).join("\n");

const checkOutputSections = SKIP_CHECKS
  ? "Checki zosta\u0142y pomini\u0119te flag\u0105 `--skip-checks`.\n"
  : checkResults.map((r) => {
    const combined = [
      r.stdoutTail ? `STDOUT:\n${r.stdoutTail}` : "",
      r.stderrTail ? `STDERR:\n${r.stderrTail}` : "",
    ].filter(Boolean).join("\n\n");
    return `### ${r.ok ? "PASS" : "FAIL"}: \`${r.script}\`\n\n- Command: \`${escapeMd(r.command)}\`\n- Exit code: \`${r.code}\`\n- Duration: \`${(r.durationMs / 1000).toFixed(1)}s\`\n\n${codeBlock(combined || "brak outputu", "text")}`;
  }).join("\n\n");

const manualSmokeChecklist = [
  "Zaloguj si\u0119 zwyk\u0142ym userem.",
  "Utw\u00F3rz leada, zadanie i wydarzenie.",
  "Przekszta\u0142\u0107 leada w spraw\u0119 / rozpocznij obs\u0142ug\u0119.",
  "Wygeneruj szkic AI i zatwierd\u017A go dopiero r\u0119cznie.",
  "Od\u015Bwie\u017C Today, Leads, Tasks, Calendar, Lead Detail, Case Detail.",
  "Sprawd\u017A, czy dane wracaj\u0105 po reloadzie.",
  "Wyloguj si\u0119 i zaloguj drugim userem z innego workspace.",
  "Potwierd\u017A brak przecieku danych i brak widoczno\u015Bci admin-only dla zwyk\u0142ego usera.",
];

const markdown = `# Release Candidate Evidence \u2014 CloseFlow / LeadFlow

**Data wygenerowania:** ${nowIso()}
**Status evidence gate:** ${statusEmoji} **${overall}**
**Zakres:** ETAP 0.1 \u2014 Release Candidate Evidence Gate
**Uwaga:** ten dokument nie zmienia dzia\u0142ania aplikacji. To dow\u00F3d release\u2019u dla audytu.

---

## 1. \u0179r\u00F3d\u0142o prawdy release candidate

| Pole | Warto\u015B\u0107 |
|---|---|
| Repo root | \`${escapeMd(git.repoRoot || "UNKNOWN")}\` |
| Repo remote | \`${escapeMd(git.remote || "UNKNOWN")}\` |
| Branch | \`${escapeMd(git.branch || "UNKNOWN")}\` |
| Commit | \`${escapeMd(git.commit || "UNKNOWN")}\` |
| Short commit | \`${escapeMd(git.shortCommit || "UNKNOWN")}\` |
| Commit date | \`${escapeMd(git.commitDate || "UNKNOWN")}\` |
| Commit subject | ${escapeMd(git.commitSubject || "UNKNOWN")} |
| Preview URL | ${previewUrl ? `[${escapeMd(previewUrl)}](${previewUrl})` : "**NOT_PROVIDED**"} |
| Working tree | ${git.statusShort ? "DIRTY" : "CLEAN"} |
| Node | \`${escapeMd(packageManager.node)}\` |
| npm | \`${escapeMd(packageManager.npm || "UNKNOWN")}\` |
| package | \`${escapeMd(packageManager.packageName || "UNKNOWN")}\` |
| package version | \`${escapeMd(packageManager.packageVersion || "UNKNOWN")}\` |

### Git working tree

${codeBlock(git.statusShort || "clean", "text")}

---

## 2. Lista skrypt\u00F3w testowych / release guard\u00F3w wykrytych w package.json

| Script | Command |
|---|---|
${detectedScriptsTable}

### Checki wymagane przez gate, ale niewykryte w package.json

${missingChecksTable}

---

## 3. Wyniki uruchomionych check\u00F3w

| Script | Status | Exit code | Czas |
|---|---:|---:|---:|
${checkResultsTable}

### Wynik builda

| Pole | Warto\u015B\u0107 |
|---|---|
| Build script present | ${scripts.build ? "tak" : "nie"} |
| Build result | ${buildResult ? checkStatusText(buildResult) : (SKIP_CHECKS ? "SKIPPED" : "NOT_RUN")} |

---

## 4. Env matrix bez sekret\u00F3w

Statusy:
- \`SET_IN_PROCESS\` \u2014 zmienna ustawiona w procesie uruchomienia,
- \`PRESENT_IN_ENV_FILE\` \u2014 zmienna istnieje z warto\u015Bci\u0105 w pliku env repo,
- \`EXAMPLE_ONLY\` \u2014 zmienna jest tylko w przyk\u0142adzie/template,
- \`MISSING\` \u2014 brak wykrycia.

| Env key | Obszar | Status | \u0179r\u00F3d\u0142a | Notatka |
|---|---|---|---|---|
${envTable}

---

## 5. Znane ograniczenia release candidate

${limitations.map((item) => `- ${item}`).join("\n")}

---

## 6. Minimalny smoke test manualny do podpisu audytora

${manualSmokeChecklist.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}

---

## 7. Szczeg\u00F3\u0142owy output check\u00F3w

${checkOutputSections}

---

## 8. Decyzja gate

${overall === "PASS" ? "\u2705 Gate techniczny przeszed\u0142. Nadal wymagany jest manualny smoke test krytycznych \u015Bcie\u017Cek." : ""}
${overall === "WARN" ? "\u26A0\uFE0F Gate ma ostrze\u017Cenia. Nie podpisywa\u0107 release\u2019u bez wyja\u015Bnienia preview URL / dirty tree / brak\u00F3w E2E." : ""}
${overall === "FAIL" ? "\u274C Gate nie przeszed\u0142. Nie przekazywa\u0107 aplikacji u\u017Cytkownikowi, dop\u00F3ki czerwone checki lub brak package.json / brak builda nie zostan\u0105 naprawione." : ""}
`;

if (SHOULD_WRITE) {
  const outFull = path.join(ROOT, OUTPUT_PATH);
  fs.mkdirSync(path.dirname(outFull), { recursive: true });
  fs.writeFileSync(outFull, markdown, "utf8");
  console.log(`Release evidence written: ${OUTPUT_PATH}`);
}

console.log(markdown);

process.exit(overall === "FAIL" ? 1 : 0);

/* STAGE16_FINAL_QA_RELEASE_CANDIDATE_2026_05_06: supports route smoke, button action map, env matrix and RC evidence output. */
