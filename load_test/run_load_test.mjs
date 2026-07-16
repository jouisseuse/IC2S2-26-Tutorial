#!/usr/bin/env node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { chromium } from "playwright";

const DEFAULT_SELECTORS = {
  // Adaptation point: for another Empirica game, update these selectors and
  // the action flow in playParticipant() so the test clicks the real consent,
  // start, decision, submit, and continue controls for that game.
  consent: [
    "text=/I consent/i",
    "button:has-text('I consent')",
  ],
  begin: [
    "text=/Begin the Hiring Challenge/i",
    "button:has-text('Begin')",
  ],
  continue: [
    "text=/Continue to the Next Round/i",
    "button:has-text('Continue')",
    "text=/Continue/i",
  ],
  candidate: [
    "button:has(svg)",
  ],
  allocationInput: [
    "input[type='number']",
  ],
  allocationSubmit: [
    "button:has-text('Submit Allocation')",
  ],
};

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.BASE_URL || "http://localhost:3000",
    users: 2,
    rounds: 1,
    ramp: null,
    headless: process.env.HEADLESS !== "false",
    timeoutMs: Number(process.env.LOAD_TEST_TIMEOUT_MS || 180000),
    actionDelayMs: Number(process.env.ACTION_DELAY_MS || 100),
    launchStepMs: Number(process.env.LAUNCH_STEP_MS || 50),
    resultsDir: process.env.RESULTS_DIR || "results",
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === "--base-url") {
      args.baseUrl = next;
      i += 1;
    } else if (token === "--users") {
      args.users = Number(next);
      i += 1;
    } else if (token === "--rounds") {
      args.rounds = Number(next);
      i += 1;
    } else if (token === "--ramp") {
      args.ramp = next.split(",").map((value) => Number(value.trim())).filter(Boolean);
      i += 1;
    } else if (token === "--headless") {
      args.headless = next !== "false";
      i += 1;
    } else if (token === "--timeout-ms") {
      args.timeoutMs = Number(next);
      i += 1;
    } else if (token === "--launch-step-ms") {
      args.launchStepMs = Number(next);
      i += 1;
    } else if (token === "--results-dir") {
      args.resultsDir = next;
      i += 1;
    } else if (token === "--help" || token === "-h") {
      printHelp();
      process.exit(0);
    }
  }

  if (!Number.isFinite(args.users) || args.users < 1) {
    throw new Error("--users must be a positive number");
  }
  if (!Number.isFinite(args.rounds) || args.rounds < 1) {
    throw new Error("--rounds must be a positive number");
  }

  return args;
}

function printHelp() {
  console.log(`TogetherHire browser load test\n\nUsage:\n  BASE_URL=http://localhost:3000 node run_load_test.mjs --users 50 --rounds 3\n  BASE_URL=http://localhost:3000 node run_load_test.mjs --ramp 25,50,100,200 --rounds 3\n\nOptions:\n  --base-url URL       Player URL. Defaults to BASE_URL or http://localhost:3000\n  --users N            Number of simulated participants for one run\n  --ramp LIST          Comma-separated user counts for progressive runs\n  --rounds N           Number of choice rounds each participant tries to complete\n  --headless true|false\n  --timeout-ms N\n  --launch-step-ms N   Delay between participant launches\n  --results-dir DIR\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function clickFirstVisible(page, selectors, options = {}) {
  const timeout = options.timeout ?? 1500;
  for (const selector of selectors) {
    const locator = page.locator(selector).first();
    try {
      await locator.waitFor({ state: "visible", timeout });
      await locator.click({ timeout });
      return { clicked: true, selector };
    } catch {
      // Try the next selector.
    }
  }
  return { clicked: false, selector: null };
}

async function maybeClick(page, selectors, timeout = 750) {
  return clickFirstVisible(page, selectors, { timeout });
}

async function fillAllocationIfPresent(page) {
  const inputs = page.locator("input[type='number']");
  const count = await inputs.count();
  if (count === 0) return false;

  const base = Math.floor(100 / count);
  let remainder = 100 - base * count;
  for (let i = 0; i < count; i += 1) {
    const value = base + (remainder > 0 ? 1 : 0);
    remainder -= remainder > 0 ? 1 : 0;
    await inputs.nth(i).fill(String(value));
  }

  await maybeClick(page, DEFAULT_SELECTORS.allocationSubmit, 2000);
  return true;
}

async function playParticipant({ browser, baseUrl, userIndex, rounds, timeoutMs, actionDelayMs }) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  const events = [];
  const startedAt = performance.now();

  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type())) {
      events.push({ type: `console:${msg.type()}`, text: msg.text() });
    }
  });
  page.on("pageerror", (error) => {
    events.push({ type: "pageerror", text: error.message });
  });
  page.on("requestfailed", (request) => {
    events.push({ type: "requestfailed", text: `${request.method()} ${request.url()} ${request.failure()?.errorText || ""}` });
  });

  try {
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: timeoutMs });
    await maybeClick(page, DEFAULT_SELECTORS.consent, 5000);
    await maybeClick(page, DEFAULT_SELECTORS.begin, 5000);

    let completedChoices = 0;
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline && completedChoices < rounds) {
      await fillAllocationIfPresent(page);
      await maybeClick(page, DEFAULT_SELECTORS.continue, 500);

      const candidateButtons = page.locator("button:has(svg)");
      const count = await candidateButtons.count().catch(() => 0);
      if (count > 0) {
        const candidateIndex = completedChoices === 0 ? 0 : (userIndex + completedChoices) % count;
        try {
          await candidateButtons.nth(candidateIndex).click({ timeout: 1500 });
          completedChoices += 1;
          await sleep(actionDelayMs);
          continue;
        } catch (error) {
          events.push({ type: "click-error", text: error.message });
        }
      }

      await sleep(500);
    }

    const elapsedMs = Math.round(performance.now() - startedAt);
    const success = completedChoices >= rounds;
    return {
      userIndex,
      success,
      completedChoices,
      elapsedMs,
      events,
      finalUrl: page.url(),
    };
  } catch (error) {
    return {
      userIndex,
      success: false,
      completedChoices: 0,
      elapsedMs: Math.round(performance.now() - startedAt),
      error: error.message,
      events,
      finalUrl: page.url(),
    };
  } finally {
    await context.close().catch(() => {});
  }
}

async function runOneLevel(args, users) {
  const browser = await chromium.launch({ headless: args.headless });
  const startedAt = performance.now();
  const tasks = [];

  try {
    for (let userIndex = 0; userIndex < users; userIndex += 1) {
      tasks.push(playParticipant({
        browser,
        baseUrl: args.baseUrl,
        userIndex,
        rounds: args.rounds,
        timeoutMs: args.timeoutMs,
        actionDelayMs: args.actionDelayMs,
      }));
      await sleep(args.launchStepMs);
    }

    const participants = await Promise.all(tasks);
    const elapsedMs = Math.round(performance.now() - startedAt);
    const completed = participants.filter((p) => p.success).length;
    const failed = users - completed;
    const allEvents = participants.flatMap((p) => p.events || []);

    return {
      users,
      rounds: args.rounds,
      completed,
      failed,
      elapsedMs,
      avgUserElapsedMs: Math.round(
        participants.reduce((sum, p) => sum + p.elapsedMs, 0) / Math.max(participants.length, 1)
      ),
      eventCount: allEvents.length,
      participants,
      system: {
        platform: os.platform(),
        arch: os.arch(),
        cpus: os.cpus().length,
        totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
      },
    };
  } finally {
    await browser.close().catch(() => {});
  }
}

async function saveResult(args, result) {
  const resultsDir = path.resolve(args.resultsDir);
  await fs.mkdir(resultsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = path.join(resultsDir, `load-test-${result.users}users-${stamp}.json`);
  await fs.writeFile(filename, JSON.stringify({ baseUrl: args.baseUrl, ...result }, null, 2));
  return filename;
}

async function main() {
  const args = parseArgs(process.argv);
  const levels = args.ramp?.length ? args.ramp : [args.users];
  const summaries = [];

  console.log(`TogetherHire load test`);
  console.log(`Base URL: ${args.baseUrl}`);
  console.log(`Levels: ${levels.join(", ")}`);
  console.log(`Rounds per user: ${args.rounds}`);

  for (const users of levels) {
    console.log(`\n==> Running ${users} simulated participants`);
    const result = await runOneLevel(args, users);
    const filename = await saveResult(args, result);
    summaries.push({
      users: result.users,
      completed: result.completed,
      failed: result.failed,
      elapsedMs: result.elapsedMs,
      avgUserElapsedMs: result.avgUserElapsedMs,
      eventCount: result.eventCount,
      resultFile: filename,
    });
    console.log(`Completed: ${result.completed}/${result.users}`);
    console.log(`Failed: ${result.failed}`);
    console.log(`Elapsed: ${result.elapsedMs} ms`);
    console.log(`Events: ${result.eventCount}`);
    console.log(`Result: ${filename}`);

    if (result.failed > 0) {
      console.log("Stopping ramp because this level had failures.");
      break;
    }
  }

  console.log("\nSummary");
  console.table(summaries);

  const last = summaries[summaries.length - 1];
  if (last?.failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
