import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RUNTIME_DIR = path.join(__dirname, "runtime");
const JOBS_PATH = path.join(RUNTIME_DIR, "jobs.json");
const RESULTS_PATH = path.join(RUNTIME_DIR, "results.jsonl");
const REQUEST_LOG_PATH = path.join(RUNTIME_DIR, "request-log.jsonl");
const ENV_PATH = path.join(__dirname, ".env");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value;
  }
}

loadEnvFile(ENV_PATH);

const PORT = Number(process.env.PORT || 8787);
const BRIDGE_KEY = process.env.KABELKI_BRIDGE_KEY || "";

fs.mkdirSync(RUNTIME_DIR, { recursive: true });
for (const filePath of [RESULTS_PATH, REQUEST_LOG_PATH]) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "", "utf8");
}

function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, "utf8").trim();
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeJsonFile(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function appendJsonl(filePath, value) {
  fs.appendFileSync(filePath, `${JSON.stringify(value)}\n`, "utf8");
}

function sendJson(res, statusCode, body) {
  if (res.headersSent) return;
  const payload = JSON.stringify(body, null, 2);
  res.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store"
  });
  res.end(payload);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 2_000_000) {
        reject(new Error("request_body_too_large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(raw));
    req.on("error", reject);
  });
}

function getHeaderValue(req, name) {
  const value = req.headers[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function getProvidedKey(req) {
  return (
    getHeaderValue(req, "x-kabelki-bridge-key") ||
    getHeaderValue(req, "ngrok-skip-browser-warning") ||
    ""
  );
}

function isAuthorized(req) {
  const provided = String(getProvidedKey(req) || "");
  return Boolean(BRIDGE_KEY && provided === BRIDGE_KEY);
}

function safeJobPublic(job) {
  return {
    schema_version: job.schema_version,
    job_id: job.job_id,
    tile_id: job.tile_id,
    skill_id: job.skill_id,
    project_id: job.project_id,
    environment: job.environment,
    prompt_contract_id: job.prompt_contract_id,
    prompt_version: job.prompt_version,
    input_schema: job.input_schema,
    output_schema: job.output_schema,
    status: job.status,
    context: job.context,
    safety_contract: job.safety_contract
  };
}

function loadJobs() {
  const jobs = readJsonFile(JOBS_PATH, []);
  return Array.isArray(jobs) ? jobs : [];
}

function saveJobs(jobs) {
  writeJsonFile(JOBS_PATH, jobs);
}

function findNextJob(jobs) {
  return jobs.find(job => ["queued", "waiting_for_chatgpt"].includes(job.status));
}

function forbiddenResultAction(action) {
  const blocked = new Set([
    "code",
    "run_command",
    "publish",
    "send_email",
    "push",
    "deploy",
    "spend_money",
    "approve_own_result"
  ]);
  return blocked.has(String(action || "").trim());
}

function validateResult(jobIdFromPathOrBody, body) {
  const allowedStatuses = new Set([
    "completed",
    "needs_owner_review",
    "needs_more_data",
    "failed"
  ]);
  const blockedStatuses = new Set([
    "approved",
    "final",
    "sent",
    "published"
  ]);

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return ["invalid_json_object", "Result body must be a JSON object."];
  }

  if (!body.job_id || typeof body.job_id !== "string") {
    return ["job_id_required", "Result job_id is required."];
  }

  if (body.job_id !== jobIdFromPathOrBody) {
    return ["job_id_mismatch", "Result job_id must match path/body job_id."];
  }

  if (!body.schema_version || typeof body.schema_version !== "string") {
    return ["schema_version_required", "schema_version is required."];
  }

  if (!body.tile_id || typeof body.tile_id !== "string") {
    return ["tile_id_required", "tile_id is required."];
  }

  if (!body.status || typeof body.status !== "string") {
    return ["status_required", "status is required."];
  }

  if (blockedStatuses.has(body.status) || !allowedStatuses.has(body.status)) {
    return ["status_not_allowed", "status must be completed, needs_owner_review, needs_more_data, or failed."];
  }

  if (body.requires_owner_review !== true) {
    return ["owner_review_required", "requires_owner_review must be true."];
  }

  if (!Array.isArray(body.forbidden_actions_requested)) {
    return ["forbidden_actions_requested_required", "forbidden_actions_requested must be an array."];
  }

  const forbidden = body.forbidden_actions_requested.find(forbiddenResultAction);
  if (forbidden) {
    return ["forbidden_action_requested", `Forbidden action requested: ${forbidden}`];
  }

  return null;
}

function logRequest(req, statusCode, jobId = null, authOk = false) {
  appendJsonl(REQUEST_LOG_PATH, {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: new URL(req.url, `http://${req.headers.host || "localhost"}`).pathname,
    status_code: statusCode,
    job_id: jobId,
    auth_ok: authOk
  });
}

async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = url.pathname;
  let statusCode = 500;
  let jobIdForLog = null;
  const authOk = isAuthorized(req);

  try {
    if (req.method === "OPTIONS") {
      statusCode = 204;
      res.writeHead(204, {
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET,POST,OPTIONS",
        "access-control-allow-headers": "content-type,x-kabelki-bridge-key,ngrok-skip-browser-warning"
      });
      res.end();
      return;
    }

    if (!authOk) {
      statusCode = 401;
      sendJson(res, statusCode, {
        error: "unauthorized",
        detail: "Missing or invalid X-KABELKI-BRIDGE-KEY or ngrok-skip-browser-warning header."
      });
      return;
    }

    if (req.method === "GET" && pathname === "/health") {
      statusCode = 200;
      sendJson(res, statusCode, {
        status: "ok",
        service: "kabelki-chatgpt-bridge-poc",
        time: new Date().toISOString()
      });
      return;
    }

    if (req.method === "GET" && pathname === "/chatgpt/jobs/next") {
      const jobs = loadJobs();
      const job = findNextJob(jobs);
      if (!job) {
        statusCode = 200;
        sendJson(res, statusCode, {
          job: null,
          status: "empty"
        });
        return;
      }

      if (job.status === "queued") {
        job.status = "waiting_for_chatgpt";
        job.updated_at = new Date().toISOString();
        saveJobs(jobs);
      }

      jobIdForLog = job.job_id || null;
      statusCode = 200;
      sendJson(res, statusCode, {
        job: safeJobPublic(job)
      });
      return;
    }

    const contextMatch = pathname.match(/^\/chatgpt\/jobs\/([^/]+)\/context$/);
    if (req.method === "GET" && contextMatch) {
      const jobId = decodeURIComponent(contextMatch[1]);
      jobIdForLog = jobId;
      const jobs = loadJobs();
      const job = jobs.find(item => item.job_id === jobId);
      if (!job) {
        statusCode = 404;
        sendJson(res, statusCode, {
          error: "job_not_found",
          job_id: jobId
        });
        return;
      }

      statusCode = 200;
      sendJson(res, statusCode, {
        job: safeJobPublic(job),
        job_id: job.job_id,
        tile_id: job.tile_id,
        skill_id: job.skill_id,
        context: job.context || {},
        safety_contract: job.safety_contract || {},
        output_schema: job.output_schema
      });
      return;
    }

    const resultMatch = pathname.match(/^\/chatgpt\/jobs(?:\/([^/]+))?\/result$/);
    if (req.method === "POST" && resultMatch) {
      const pathJobId = resultMatch[1] ? decodeURIComponent(resultMatch[1]) : null;

      let body;
      try {
        const raw = await readBody(req);
        body = raw ? JSON.parse(raw) : {};
      } catch (error) {
        statusCode = 400;
        sendJson(res, statusCode, {
          accepted: false,
          error: "invalid_json",
          detail: String(error.message || error)
        });
        return;
      }

      const effectiveJobId = pathJobId || body.job_id;
      jobIdForLog = effectiveJobId || null;

      if (!effectiveJobId) {
        statusCode = 400;
        sendJson(res, statusCode, {
          accepted: false,
          error: "job_id_required",
          detail: "job_id is required in path or body."
        });
        return;
      }

      const validationError = validateResult(effectiveJobId, body);
      if (validationError) {
        const [error, detail] = validationError;
        statusCode = 400;
        sendJson(res, statusCode, {
          accepted: false,
          error,
          detail
        });
        return;
      }

      const jobs = loadJobs();
      const job = jobs.find(item => item.job_id === effectiveJobId);
      if (job) {
        job.status = body.status === "failed" ? "failed" : "waiting_owner_review";
        job.result_submitted_at = new Date().toISOString();
        saveJobs(jobs);
      }

      appendJsonl(RESULTS_PATH, {
        timestamp: new Date().toISOString(),
        job_id: effectiveJobId,
        result: body
      });

      statusCode = 200;
      sendJson(res, statusCode, {
        accepted: true,
        job_id: effectiveJobId,
        status: "result_submitted"
      });
      return;
    }

    statusCode = 404;
    sendJson(res, statusCode, {
      error: "not_found",
      path: pathname
    });
  } finally {
    logRequest(req, statusCode, jobIdForLog, authOk);
  }
}

const server = http.createServer((req, res) => {
  handle(req, res).catch(error => {
    if (!res.headersSent) {
      sendJson(res, 500, {
        error: "internal_error",
        detail: String(error.message || error)
      });
    }
  });
});

server.listen(PORT, () => {
  const weakKeyWarning = !BRIDGE_KEY || BRIDGE_KEY === "replace_me";
  console.log(`Kabelki ChatGPT Bridge POC listening on http://localhost:${PORT}`);
  if (weakKeyWarning) {
    console.warn("WARNING: KABELKI_BRIDGE_KEY is missing or still set to replace_me.");
  }
});
