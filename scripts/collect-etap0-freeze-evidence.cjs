const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = process.cwd();
const now = new Date();
const iso = now.toISOString();
const stamp = iso.replace(/[:]/g, "-").replace(/\.\d{3}Z$/, "Z");
const day = iso.slice(0, 10);

const docsDir = path.join(root, "docs", "release");
const evidenceDir = path.join(docsDir, "evidence", `etap0-${stamp}`);
const outArg = process.argv.find((arg) => arg.startsWith("--out="));
const outFile = outArg
  ? path.resolve(root, outArg.slice("--out=".length))
  : path.join(docsDir, `ETAP0_ZAMROZENIE_STANU_EVIDENCE_${day}.md`);

fs.mkdirSync(evidenceDir, { recursive: true });
fs.mkdirSync(path.dirname(outFile), { recursive: true });

function run(command) {
  const result = spawnSync(command, {
    cwd: root,
    encoding: "utf8",
    shell: true,
  });

  const stdout = result.stdout || "";
  const stderr = result.stderr || "";
  const errorText = result.error ? `\n[spawn-error] ${String(result.error.message || result.error)}` : "";
  return {
    command,
    ok: result.status === 0,
    status: result.status,
    output: `${stdout}${stderr}${errorText}`.trimEnd(),
  };
}

function writeLog(name, payload) {
  const full = path.join(evidenceDir, name);
  fs.writeFileSync(full, payload.endsWith("\n") ? payload : `${payload}\n`, "utf8");
  return full;
}

const gitBranch = run("git rev-parse --abbrev-ref HEAD");
const gitCommit = run("git rev-parse HEAD");
const gitCommitShort = run("git rev-parse --short HEAD");
const gitStatus = run("git status --short --branch");
const gitRemote = run("git remote -v");
const build = run("npm.cmd run build");
const critical = run("npm.cmd run test:critical");

const statusLog = writeLog("git-status.txt", gitStatus.output || "(no output)");
const buildLog = writeLog("build.log", build.output || "(no output)");
const criticalLog = writeLog("critical-tests.log", critical.output || "(no output)");

const lines = [
  "# Etap 0: zamrozenie stanu i dowody",
  "",
  `Data UTC: ${iso}`,
  `Repo: ${root}`,
  `Branch: ${gitBranch.output || "(unknown)"}`,
  `Commit: ${gitCommit.output || "(unknown)"}`,
  `Commit short: ${gitCommitShort.output || "(unknown)"}`,
  "",
  "## Stan working tree",
  "```txt",
  gitStatus.output || "(no output)",
  "```",
  "",
  "## Remote",
  "```txt",
  gitRemote.output || "(no output)",
  "```",
  "",
  "## Build",
  `Komenda: \`${build.command}\``,
  `Status: ${build.ok ? "OK" : "FAIL"} (exit ${String(build.status)})`,
  `Log: ${path.relative(root, buildLog)}`,
  "",
  "## Critical tests",
  `Komenda: \`${critical.command}\``,
  `Status: ${critical.ok ? "OK" : "FAIL"} (exit ${String(critical.status)})`,
  `Log: ${path.relative(root, criticalLog)}`,
  "",
  "## Artefakty",
  `- ${path.relative(root, statusLog)}`,
  `- ${path.relative(root, buildLog)}`,
  `- ${path.relative(root, criticalLog)}`,
  "",
  "## Wniosek",
  build.ok && critical.ok
    ? "Punkt startowy zamrozony: build i critical tests przeszly."
    : "Punkt startowy zapisany, ale przynajmniej jeden gate nie przeszedl. Sprawdz logi.",
  "",
];

fs.writeFileSync(outFile, lines.join("\n"), "utf8");

const summary = [
  `Evidence written: ${path.relative(root, outFile)}`,
  `Build: ${build.ok ? "OK" : "FAIL"}`,
  `Critical tests: ${critical.ok ? "OK" : "FAIL"}`,
].join("\n");

console.log(summary);

if (!build.ok || !critical.ok) {
  process.exitCode = 1;
}
