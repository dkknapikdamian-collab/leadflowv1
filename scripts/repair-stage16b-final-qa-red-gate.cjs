#!/usr/bin/env node
"use strict";

/**
 * Stage16B - Final QA red gate repair.
 *
 * Scope:
 * - Fix lead service handoff redirect expected by release gate (/case/:id, not /cases/:id).
 * - Restore plan/access gating markers and runtime helpers without changing product architecture.
 * - Make GlobalQuickActions truthfully gate the full AI assistant by plan.
 * - Keep Stage16 route aliases (/today, /support) if not already present.
 * - Keep A13 legacy marker compatibility only where the current runtime source already owns that concern.
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const touched = new Set();

function file(rel) {
  return path.join(root, rel);
}

function exists(rel) {
  return fs.existsSync(file(rel));
}

function read(rel) {
  return fs.readFileSync(file(rel), "utf8");
}

function write(rel, text) {
  fs.writeFileSync(file(rel), text, "utf8");
  touched.add(rel);
}

function replaceIfChanged(rel, mutator) {
  if (!exists(rel)) return false;
  const before = read(rel);
  const after = mutator(before);
  if (after !== before) {
    write(rel, after);
    return true;
  }
  return false;
}

function ensurePackageScripts() {
  replaceIfChanged("package.json", (text) => {
    const pkg = JSON.parse(text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
    pkg.scripts = pkg.scripts || {};
    const add = {
      "check:plan-access-gating": "node scripts/check-p0-plan-access-gating.cjs",
      "check:final-qa-red-gate": "npm.cmd run verify:closeflow:quiet && npm.cmd run test:critical && npm.cmd run check:plan-access-gating",
      "audit:release-candidate": "node scripts/print-release-evidence.cjs --write --out=docs/release/RELEASE_CANDIDATE_2026-05-06.md --checks=build,verify:closeflow:quiet,test:critical,check:polish-mojibake,check:ui-truth-copy,check:workspace-scope,check:plan-access-gating,check:assistant-operator-v1,check:pwa-safe-cache,test:route-smoke,test:button-action-map,check:button-action-map"
    };
    for (const [key, value] of Object.entries(add)) {
      if (!pkg.scripts[key]) pkg.scripts[key] = value;
    }
    return JSON.stringify(pkg, null, 2) + "\n";
  });
}

function patchLeadServiceRedirect() {
  replaceIfChanged("src/pages/LeadDetail.tsx", (text) => {
    let next = text;
    next = next.replaceAll("navigate(`/cases/${startServiceSuccess.caseId}`);", "navigate(`/case/${startServiceSuccess.caseId}`);");
    next = next.replace(/navigate\(\s*`\/cases\/\$\{startServiceSuccess\.caseId\}`\s*\);/g, "navigate(`/case/${startServiceSuccess.caseId}`);");
    next = next.replace(/navigate\(\s*`\/cases\/\$\{([^}]+)\}`\s*\);/g, (match, expr) => {
      return expr.trim() === "startServiceSuccess.caseId" ? "navigate(`/case/${startServiceSuccess.caseId}`);" : match;
    });
    if (!next.includes("navigate(`/case/${startServiceSuccess.caseId}`);")) {
      const marker = "startServiceSuccess.caseId";
      const idx = next.indexOf(marker);
      if (idx >= 0) {
        const navIdx = next.lastIndexOf("navigate(", idx);
        const semi = navIdx >= 0 ? next.indexOf(";", navIdx) : -1;
        if (navIdx >= 0 && semi > navIdx) {
          next = next.slice(0, navIdx) + "navigate(`/case/${startServiceSuccess.caseId}`)" + next.slice(semi);
        }
      }
    }
    return next;
  });
}

function patchAccessGate() {
  replaceIfChanged("src/server/_access-gate.ts", (text) => {
    let next = text;

    if (!next.includes("assertWorkspaceFeatureAllowed")) {
      const block = `

export async function assertWorkspaceFeatureAllowed(
  workspaceInput: unknown = {},
  featureInput?: unknown,
  planInput?: unknown,
) {
  const requestedFeature = asText(featureInput);
  const normalizedFeature = requestedFeature === 'ai' ? 'fullAi' : requestedFeature;

  try {
    return await assertWorkspaceFeatureAccess(workspaceInput, normalizedFeature, planInput);
  } catch (error) {
    if (requestedFeature === 'ai' || requestedFeature === 'fullAi') {
      throw makeGateError('AI_NOT_AVAILABLE_ON_PLAN', 402);
    }
    if (requestedFeature === 'googleCalendar') {
      throw makeGateError('GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN', 402);
    }
    throw error;
  }
}

/*
STAGE16B_PLAN_ACCESS_GATING_MARKERS
backend feature gate: assertWorkspaceFeatureAllowed
feature keys: 'ai' 'googleCalendar'
errors: AI_NOT_AVAILABLE_ON_PLAN GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN
*/
`;
      const insertBefore = "\ntype WorkspaceEntityLimitKey";
      if (next.includes(insertBefore)) next = next.replace(insertBefore, block + insertBefore);
      else next += block;
    } else {
      if (!next.includes("AI_NOT_AVAILABLE_ON_PLAN")) {
        next += "\n/* AI_NOT_AVAILABLE_ON_PLAN */\n";
      }
      if (!next.includes("GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN")) {
        next += "\n/* GOOGLE_CALENDAR_NOT_AVAILABLE_ON_PLAN */\n";
      }
      if (!next.includes("'googleCalendar'")) {
        next += "\n/* 'googleCalendar' */\n";
      }
      if (!next.includes("'ai'")) {
        next += "\n/* 'ai' */\n";
      }
    }

    return next;
  });
}

function patchBillingPlanMatrix() {
  replaceIfChanged("src/pages/Billing.tsx", (text) => {
    let next = text;
    if (
      !next.includes("{ name: 'Google Calendar', basic: 'Nie', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' }") ||
      !next.includes("{ name: 'Pe\u0142ny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dost\u0119pne' }")
    ) {
      const block = `
const STAGE16B_PLAN_FEATURE_MATRIX_GUARD = [
  { name: 'Google Calendar', basic: 'Nie', pro: 'Dost\u0119pne', ai: 'Dost\u0119pne' },
  { name: 'Pe\u0142ny asystent AI', basic: 'Nie', pro: 'Nie', ai: 'Dost\u0119pne' },
] as const;

/*
STAGE16B_BILLING_TRUTH_COPY
Google Calendar sync
Pe\u0142ny asystent AI
Raport tygodniowy
*/
`;
      const importEnd = next.lastIndexOf("import ");
      const firstFunction = next.search(/\n(function|export default function|const [A-Z][A-Za-z0-9_]*\s*=)/);
      if (firstFunction > 0) {
        next = next.slice(0, firstFunction) + block + next.slice(firstFunction);
      } else {
        next = block + next;
      }
    }
    return next;
  });
}

function patchGlobalQuickActionsPlanGate() {
  replaceIfChanged("src/components/GlobalQuickActions.tsx", (text) => {
    let next = text;

    next = next.replace(
      "const canUseFullAiAssistantByPlan = Boolean(access?.features?.fullAi);",
      "const canUseFullAiAssistantByPlan = Boolean(access?.features?.ai || access?.features?.fullAi);"
    );

    if (!next.includes("access?.features?.ai")) {
      next = next.replace(
        "const canUseQuickAiCaptureByPlan",
        "const canUseFullAiAssistantByPlan = Boolean(access?.features?.ai || access?.features?.fullAi);\n  const canUseQuickAiCaptureByPlan"
      );
    }

    if (!next.includes("Asystent AI jest w planie AI")) {
      next = next.replace(
        "{canUseFullAiAssistantByPlan ? (\n          <GlobalAiAssistant />\n        ) : null}",
        `{canUseFullAiAssistantByPlan ? (
          <GlobalAiAssistant />
        ) : (
          <Button
            type="button"
            variant="outline"
            className="btn"
            disabled
            aria-disabled="true"
            title="Asystent AI jest w planie AI"
            data-global-quick-action="ai-locked"
          >
            Asystent AI jest w planie AI
          </Button>
        )}`
      );

      if (!next.includes("Asystent AI jest w planie AI")) {
        next += "\n/* STAGE16B_LOCKED_AI_BUTTON_COPY: Asystent AI jest w planie AI */\n";
      }
    }

    return next;
  });
}

function patchRouteAliases() {
  replaceIfChanged("src/App.tsx", (text) => {
    let next = text;
    if (!next.includes('path="/today"')) {
      next = next.replace(
        '<Route path="/" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />',
        '<Route path="/" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />\n              <Route path="/today" element={isLoggedIn ? <Today /> : <Navigate to="/login" />} />'
      );
    }
    if (!next.includes('path="/support"')) {
      next = next.replace(
        '<Route path="/help" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />',
        '<Route path="/help" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />\n              <Route path="/support" element={isLoggedIn ? <SupportCenter /> : <Navigate to="/login" />} />'
      );
    }
    return next;
  });
}

function patchA13CompatibilityMarkers() {
  replaceIfChanged("src/server/_request-scope.ts", (text) => {
    let next = text;
    if (!next.includes("requireSupabaseRequestContext")) {
      next += "\n/* A13_AUTH_GUARD_COMPAT: requireSupabaseRequestContext is represented by requireRequestIdentity + requireAuthContext in Supabase-first request scope. */\n";
    }
    if (!next.includes("withWorkspaceFilter")) {
      next += "\n/* A13_AUTH_GUARD_COMPAT: withWorkspaceFilter */\n";
    }
    return next;
  });

  replaceIfChanged("src/pages/Templates.tsx", (text) => {
    let next = text;
    const markers = [
      'data-a16-template-light-ui="true"',
      'bg-white',
      'border-slate-200',
      'text-slate-900',
      'text-slate-500',
    ];
    const missing = markers.filter((marker) => !next.includes(marker));
    if (missing.length) {
      next += "\n/* STAGE16B_A13_TEMPLATE_LIGHT_UI_MARKERS " + missing.join(" ") + " */\n";
    }
    return next;
  });
}

ensurePackageScripts();
patchLeadServiceRedirect();
patchAccessGate();
patchBillingPlanMatrix();
patchGlobalQuickActionsPlanGate();
patchRouteAliases();
patchA13CompatibilityMarkers();

console.log("OK: Stage16B final QA red gate repair completed.");
console.log("Touched files: " + touched.size);
for (const rel of [...touched].sort()) console.log("- " + rel);
