#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "test-results", "stage16l-failed-details");
const REPORT_MD = path.join(ROOT, "docs", "release", "FINAL_QA_FAILED_DETAILS_2026-05-06.md");
const REPORT_JSON = path.join(ROOT, "docs", "release", "FINAL_QA_FAILED_DETAILS_2026-05-06.json");
const npmBin = process.platform === "win32" ? "npm.cmd" : "npm";

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REPORT_MD), { recursive: true });

function stripBom(value) {
  const text = String(value || "");
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

function safeName(value) {
  return String(value || "x")
    .replace(/^[a-z]+ --test /, "")
    .replace(/^npm run /, "npm-run-")
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .slice(0, 160);
}

function quoteWindowsArg(value) {
  const raw = String(value == null ? "" : value);
  if (/^[A-Za-z0-9_:@%+=,.\/\\-]+$/.test(raw)) return raw;
  return `"${raw.replace(/"/g, '\\"')}"`;
}

function buildSpawn(command, args) {
  const list = Array.isArray(args) ? args : [];
  if (process.platform === "win32" && /\.(cmd|bat)$/i.test(command)) {
    const commandLine = [command].concat(list).map(quoteWindowsArg).join(" ");
    return { command: "cmd.exe", args: ["/d", "/s", "/c", commandLine], display: commandLine };
  }
  return { command, args: list, display: [command].concat(list).join(" ") };
}

function run(command, args, label, timeoutMs = 20 * 60 * 1000) {
  const target = buildSpawn(command, args);
  const startedAt = Date.now();
  const result = spawnSync(target.command, target.args, {
    cwd: ROOT,
    encoding: "utf8",
    shell: false,
    timeout: timeoutMs,
    windowsHide: true,
    env: process.env,
  });
  const status = typeof result.status === "number" ? result.status : (result.error && result.error.code === "ETIMEDOUT" ? 124 : 1);
  const stdout = stripBom(result.stdout || "");
  const stderr = stripBom(result.stderr || (result.error ? String(result.error.message || result.error) : ""));
  const durationMs = Date.now() - startedAt;
  const outFile = path.join(OUT_DIR, `${safeName(label)}.log`);
  fs.writeFileSync(outFile, [
    `COMMAND: ${target.display}`,
    `EXIT: ${status}`,
    `DURATION_MS: ${durationMs}`,
    "",
    "===== STDOUT =====",
    stdout,
    "",
    "===== STDERR =====",
    stderr,
    "",
  ].join("\n"), "utf8");
  return { label, command: target.display, ok: status === 0, code: status, durationMs, stdout, stderr, outFile: path.relative(ROOT, outFile).replace(/\\/g, "/") };
}

function readJsonIfExists(file) {
  try {
    if (!fs.existsSync(file)) return null;
    return JSON.parse(stripBom(fs.readFileSync(file, "utf8")));
  } catch {
    return null;
  }
}

function collectFailedFromStage16K() {
  const jsonPath = path.join(ROOT, "docs", "release", "FINAL_QA_RED_GATES_2026-05-06.json");
  const data = readJsonIfExists(jsonPath);
  const failed = [];

  function addTestFile(file) {
    if (file && fs.existsSync(path.join(ROOT, file))) {
      failed.push({ label: `node --test ${file}`, command: "node", args: ["--test", file] });
    }
  }

  if (Array.isArray(data?.results)) {
    for (const item of data.results) {
      const label = String(item.label || item.script || item.command || "");
      const file = String(item.file || "");
      const ok = item.ok === true || item.status === "PASS" || item.exitCode === 0 || item.code === 0;
      if (ok) continue;
      if (file.endsWith(".test.cjs")) addTestFile(file);
      else if (label.includes("verify:closeflow:quiet")) failed.push({ label: "npm run verify:closeflow:quiet", command: npmBin, args: ["run", "verify:closeflow:quiet"] });
      else if (label.includes("test:critical")) failed.push({ label: "npm run test:critical", command: npmBin, args: ["run", "test:critical"] });
    }
  }

  const fallbackTests = [
    "tests/ai-assistant-admin-and-app-scope.test.cjs",
    "tests/ai-assistant-autospeech-and-clear-input.test.cjs",
    "tests/ai-assistant-capture-handoff.test.cjs",
    "tests/ai-assistant-command-center.test.cjs",
    "tests/ai-assistant-global-app-search.test.cjs",
    "tests/ai-assistant-save-vs-search-rule.test.cjs",
    "tests/ai-assistant-scope-budget-guard.test.cjs",
    "tests/ai-direct-write-respects-mode-stage28.test.cjs",
    "tests/ai-draft-inbox-command-center.test.cjs",
    "tests/ai-draft-inbox-flow.test.cjs",
    "tests/ai-safety-gates-direct-write.test.cjs",
    "tests/ai-usage-limit-guard.test.cjs",
    "tests/billing-ui-polish-and-diagnostics.test.cjs",
    "tests/case-detail-write-access-gate-stage02b.test.cjs",
    "tests/faza2-etap21-workspace-isolation.test.cjs",
    "tests/faza3-etap32d-plan-based-ui-visibility.test.cjs",
    "tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs",
    "tests/faza5-etap51-ai-read-vs-draft-intent.test.cjs",
    "tests/request-identity-vercel-api-signature.test.cjs",
    "tests/stage35-ai-assistant-compact-ui.test.cjs",
    "tests/stage35c-ai-autospeech-compact-contract-fix.test.cjs",
    "tests/stage94-ai-layer-separation-copy.test.cjs",
    "tests/ui-completed-label-consistency.test.cjs",
    "tests/ui-copy-and-billing-cleanup.test.cjs",
  ];

  const existingLabels = new Set(failed.map((x) => x.label));
  if (!existingLabels.has("npm run verify:closeflow:quiet")) failed.unshift({ label: "npm run verify:closeflow:quiet", command: npmBin, args: ["run", "verify:closeflow:quiet"] });
  if (!existingLabels.has("npm run test:critical")) failed.splice(1, 0, { label: "npm run test:critical", command: npmBin, args: ["run", "test:critical"] });

  for (const file of fallbackTests) {
    const label = `node --test ${file}`;
    if (!failed.some((x) => x.label === label) && fs.existsSync(path.join(ROOT, file))) {
      failed.push({ label, command: "node", args: ["--test", file] });
    }
  }

  const seen = new Set();
  return failed.filter((x) => {
    if (seen.has(x.label)) return false;
    seen.add(x.label);
    return true;
  });
}

function extractUsefulFailure(result) {
  const combined = `${result.stdout}\n${result.stderr}`.replace(/\r\n/g, "\n");
  const lines = combined.split("\n");
  const useful = [];

  const patterns = [
    /FAILED:/,
    /failing tests:/,
    /^\u2716 /,
    /AssertionError/,
    /Expected values/,
    /expected:/,
    /actual:/,
    /operator:/,
    /missing /i,
    /forbidden /i,
    /does not match/i,
    /not match/i,
    /must /i,
    /should /i,
    /exit code/i,
  ];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (patterns.some((p) => p.test(line))) {
      const start = Math.max(0, i - 2);
      const end = Math.min(lines.length, i + 9);
      for (let j = start; j < end; j += 1) useful.push(lines[j]);
      useful.push("---");
    }
  }

  const deduped = [];
  const seen = new Set();
  for (const line of useful) {
    const key = line.slice(0, 300);
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(line);
  }

  const text = deduped.join("\n").trim();
  if (text) return text.slice(0, 12000);

  return combined.split("\n").slice(-80).join("\n").slice(0, 12000);
}

function codeBlock(text) {
  const value = String(text || "").replace(/```/g, "'''");
  return "```text\n" + value.trim() + "\n```";
}

const targets = collectFailedFromStage16K();

console.log("== Stage16L failed detail collector ==");
console.log("Targets: " + targets.length);
console.log("Output dir: " + path.relative(ROOT, OUT_DIR));

const results = [];
for (const target of targets) {
  console.log(`== RUN ${target.label} ==`);
  const result = run(target.command, target.args, target.label);
  console.log(`${result.ok ? "PASS" : "FAIL"} ${target.label} exit=${result.code} duration=${(result.durationMs / 1000).toFixed(1)}s`);
  results.push({ ...result, usefulFailure: extractUsefulFailure(result) });
}

const failed = results.filter((x) => !x.ok);
const passed = results.filter((x) => x.ok);

const md = [
  "# FINAL QA FAILED DETAILS \u2014 2026-05-06",
  "",
  "Cel: zebra\u0107 dok\u0142adne assertiony dla wszystkich czerwonych gate\u00F3w bez zatrzymywania si\u0119 na pierwszym b\u0142\u0119dzie.",
  "",
  `- Passed: ${passed.length}`,
  `- Failed: ${failed.length}`,
  `- Logi: \`test-results/stage16l-failed-details/\``,
  "",
  "## Failed summary",
  "",
  failed.length
    ? failed.map((x, i) => `${i + 1}. \`${x.label}\` exit=${x.code} log=\`${x.outFile}\``).join("\n")
    : "- brak",
  "",
  "## Failure details",
  "",
  ...failed.map((x, i) => [
    `### ${i + 1}. ${x.label}`,
    "",
    `- Command: \`${x.command}\``,
    `- Exit: \`${x.code}\``,
    `- Duration: \`${(x.durationMs / 1000).toFixed(1)}s\``,
    `- Full log: \`${x.outFile}\``,
    "",
    codeBlock(x.usefulFailure),
    "",
  ].join("\n")),
  "",
  "## Passed during detail run",
  "",
  passed.length ? passed.map((x) => `- \`${x.label}\``).join("\n") : "- brak",
  "",
].join("\n");

fs.writeFileSync(REPORT_MD, md, "utf8");
fs.writeFileSync(REPORT_JSON, JSON.stringify({
  generatedAt: new Date().toISOString(),
  passed: passed.length,
  failed: failed.length,
  results: results.map((x) => ({
    label: x.label,
    command: x.command,
    ok: x.ok,
    code: x.code,
    durationMs: x.durationMs,
    outFile: x.outFile,
    usefulFailure: x.usefulFailure,
  })),
}, null, 2), "utf8");

console.log("");
console.log("== Stage16L summary ==");
console.log("PASSED=" + passed.length);
console.log("FAILED=" + failed.length);
console.log("REPORT_MD=docs/release/FINAL_QA_FAILED_DETAILS_2026-05-06.md");
console.log("REPORT_JSON=docs/release/FINAL_QA_FAILED_DETAILS_2026-05-06.json");
if (failed.length) {
  console.log("");
  console.log("Top failed details:");
  failed.slice(0, 20).forEach((x, i) => {
    const firstLine = x.usefulFailure.split("\n").find((line) => /AssertionError|missing|forbidden|Expected|FAILED|\u2716/.test(line)) || "";
    console.log(`${i + 1}. ${x.label} :: ${firstLine.slice(0, 180)}`);
  });
}
process.exit(0);
