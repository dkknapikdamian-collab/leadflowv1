import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 8787;
const TEST_VALUE = "local_poc_test_value_123456789";
const runtimeDir = path.join(__dirname, "runtime");

process.env.PORT = String(PORT);
process.env.KABELKI_BRIDGE_KEY = TEST_VALUE;

function call(method, route, body = null, headerName = "X-KABELKI-BRIDGE-KEY") {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : "";
    const req = http.request({
      hostname: "127.0.0.1",
      port: PORT,
      path: route,
      method,
      headers: {
        "content-type": "application/json",
        "content-length": Buffer.byteLength(payload),
        [headerName]: TEST_VALUE
      }
    }, res => {
      let raw = "";
      res.on("data", chunk => { raw += chunk; });
      res.on("end", () => {
        let json = null;
        try { json = raw ? JSON.parse(raw) : null; } catch {}
        resolve({ status: res.statusCode, json, raw });
      });
    });
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function waitForServer() {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    try {
      const res = await call("GET", "/health");
      if (res.status === 200) return true;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  return false;
}

function ok(name, condition) {
  if (!condition) throw new Error(name);
  console.log(`  PASS  ${name}`);
}

const child = spawn(process.execPath, ["server.js"], {
  cwd: __dirname,
  env: { ...process.env },
  stdio: "ignore"
});

try {
  const ready = await waitForServer();
  ok("server ready", ready);
  ok("health", (await call("GET", "/health")).status === 200);
  const next = await call("GET", "/chatgpt/jobs/next");
  ok("next job", next.status === 200 && next.json?.job?.job_id === "poc_job_001");
  const ctx = await call("GET", "/chatgpt/jobs/poc_job_001/context");
  ok("context", ctx.status === 200 && Boolean(ctx.json?.context));
  const result = {
    schema_version: "simple_analysis_result_v1",
    job_id: "poc_job_001",
    tile_id: "chatgpt_analyzer_tile_poc",
    status: "needs_owner_review",
    summary: "POC result.",
    risks: ["risk one"],
    next_steps: ["step one"],
    missing_data: [],
    forbidden_actions_requested: [],
    requires_owner_review: true
  };
  ok("submit", (await call("POST", "/chatgpt/jobs/result", result, "ngrok-skip-browser-warning")).status === 200);
  ok("result log", fs.readFileSync(path.join(runtimeDir, "results.jsonl"), "utf8").includes("poc_job_001"));
  ok("secret not logged", !fs.readFileSync(path.join(runtimeDir, "request-log.jsonl"), "utf8").includes(TEST_VALUE));
  console.log("\nSMOKE: passed");
} finally {
  child.kill();
}
