#!/usr/bin/env node
import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import http from "node:http";
import https from "node:https";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const DEFAULT_LEVELS = [25, 50, 100, 200];

function parseArgs(argv) {
  const args = {
    baseUrl: process.env.BASE_URL || "",
    experimentDir: process.env.EXPERIMENT_DIR || "../my-experiment",
    startServer: process.env.START_SERVER !== "0",
    maxUsers: Number(process.env.MAX_USERS || 200),
    levels: null,
    rounds: Number(process.env.ROUNDS || 1),
    headless: process.env.HEADLESS !== "false",
    timeoutMs: Number(process.env.LOAD_TEST_TIMEOUT_MS || 180000),
    launchStepMs: Number(process.env.LAUNCH_STEP_MS || 50),
    resultsDir: process.env.RESULTS_DIR || "results",
    serverReadyTimeoutMs: Number(process.env.SERVER_READY_TIMEOUT_MS || 120000),
  };

  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    const next = argv[i + 1];
    if (token === "--base-url") {
      args.baseUrl = next;
      i += 1;
    } else if (token === "--experiment-dir") {
      args.experimentDir = next;
      i += 1;
    } else if (token === "--start-server") {
      args.startServer = next !== "false";
      i += 1;
    } else if (token === "--max-users") {
      args.maxUsers = Number(next);
      i += 1;
    } else if (token === "--levels") {
      args.levels = next.split(",").map((value) => Number(value.trim())).filter(Boolean);
      i += 1;
    } else if (token === "--rounds") {
      args.rounds = Number(next);
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

  if (!Number.isFinite(args.maxUsers) || args.maxUsers < 1) {
    throw new Error("--max-users must be a positive number");
  }
  if (!Number.isFinite(args.rounds) || args.rounds < 1) {
    throw new Error("--rounds must be a positive number");
  }

  return args;
}

function printHelp() {
  console.log(`TogetherHire capacity estimator\n\nDefault behavior:\n  - starts Empirica from ../my-experiment\n  - tests levels up to 200 users: 25,50,100,200\n  - stops at the first failing level\n  - prints estimatedCap and writes a JSON report\n\nUsage:\n  npm run capacity\n  npm run capacity -- --max-users 100 --rounds 3\n  BASE_URL=http://localhost:3000 npm run capacity -- --start-server false --levels 10,25,50\n\nOptions:\n  --base-url URL\n  --experiment-dir DIR\n  --start-server true|false\n  --max-users N          Default: 200\n  --levels LIST          Example: 25,50,100,200\n  --rounds N             Choices each participant tries to complete per level\n  --headless true|false\n  --timeout-ms N\n  --launch-step-ms N\n  --results-dir DIR\n`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeLevels(args) {
  if (args.levels?.length) {
    return [...new Set(args.levels)].filter((n) => n <= args.maxUsers).sort((a, b) => a - b);
  }
  const levels = DEFAULT_LEVELS.filter((n) => n <= args.maxUsers);
  if (!levels.includes(args.maxUsers)) levels.push(args.maxUsers);
  return [...new Set(levels)].sort((a, b) => a - b);
}

function requestUrl(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith("https:") ? https : http;
    const req = lib.get(url, (res) => {
      res.resume();
      resolve(res.statusCode && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(3000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

function parsePlayerUrl(text) {
  const urls = text.match(/https?:\/\/[^\s)]+/g) || [];
  const cleaned = urls.map((url) => url.replace(/[.,;]+$/, ""));
  return (
    cleaned.find((url) => /player|participant/i.test(url)) ||
    cleaned.find((url) => /localhost|127\.0\.0\.1/.test(url)) ||
    cleaned[0] ||
    ""
  );
}

async function pathExists(candidate) {
  try {
    await fs.access(candidate);
    return true;
  } catch {
    return false;
  }
}

async function resolveExperimentDir(experimentDirArg) {
  if (path.isAbsolute(experimentDirArg)) {
    if (await pathExists(experimentDirArg)) return experimentDirArg;
    throw new Error(`Experiment directory does not exist: ${experimentDirArg}`);
  }

  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const repoRoot = path.resolve(scriptDir, "..");
  const candidates = [
    path.resolve(process.cwd(), experimentDirArg),
    path.resolve(repoRoot, experimentDirArg),
  ];

  for (const candidate of candidates) {
    if (await pathExists(candidate)) return candidate;
  }

  throw new Error(`Experiment directory does not exist. Tried: ${candidates.join(", ")}`);
}

async function startEmpirica(args) {
  const experimentDir = await resolveExperimentDir(args.experimentDir);

  const serverLog = path.resolve(args.resultsDir, `empirica-capacity-${new Date().toISOString().replace(/[:.]/g, "-")}.log`);
  await fs.mkdir(path.dirname(serverLog), { recursive: true });
  const logHandle = await fs.open(serverLog, "w");

  console.log(`Starting Empirica in ${experimentDir}`);
  console.log(`Server log: ${serverLog}`);

  const child = spawn("empirica", [], {
    cwd: experimentDir,
    env: process.env,
    detached: process.platform !== "win32",
    stdio: ["ignore", "pipe", "pipe"],
  });

  let detectedUrl = args.baseUrl || "";
  const onData = async (data) => {
    const text = data.toString();
    await logHandle.appendFile(text);
    if (!detectedUrl) {
      const parsed = parsePlayerUrl(text);
      if (parsed) detectedUrl = parsed;
    }
  };
  child.stdout.on("data", onData);
  child.stderr.on("data", onData);

  const fallbackUrl = args.baseUrl || "http://localhost:3000";
  const deadline = Date.now() + args.serverReadyTimeoutMs;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      await logHandle.close();
      throw new Error(`Empirica exited early with code ${child.exitCode}. See ${serverLog}`);
    }

    const candidateUrl = detectedUrl || fallbackUrl;
    if (await requestUrl(candidateUrl)) {
      console.log(`Empirica ready: ${candidateUrl}`);
      return {
        baseUrl: candidateUrl,
        serverLog,
        child,
        closeLog: () => logHandle.close().catch(() => {}),
      };
    }
    await sleep(1000);
  }

  await stopProcess(child);
  await logHandle.close();
  throw new Error(`Timed out waiting for Empirica. See ${serverLog}`);
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null) return;
  if (process.platform !== "win32") {
    try {
      process.kill(-child.pid, "SIGTERM");
    } catch {
      child.kill("SIGTERM");
    }
  } else {
    child.kill("SIGTERM");
  }
  await sleep(2000);
  if (child.exitCode === null) {
    if (process.platform !== "win32") {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {
        child.kill("SIGKILL");
      }
    } else {
      child.kill("SIGKILL");
    }
  }
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve) => {
    const child = spawn(command, args, {
      ...options,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (data) => {
      const text = data.toString();
      stdout += text;
      process.stdout.write(text);
    });
    child.stderr.on("data", (data) => {
      const text = data.toString();
      stderr += text;
      process.stderr.write(text);
    });
    child.on("close", (code) => resolve({ code, stdout, stderr }));
  });
}

async function readNewestResult(resultsDir, users) {
  const entries = await fs.readdir(resultsDir).catch(() => []);
  const matches = entries
    .filter((name) => name.startsWith(`load-test-${users}users-`) && name.endsWith(".json"))
    .sort();
  if (!matches.length) return null;
  const filename = path.join(resultsDir, matches[matches.length - 1]);
  return JSON.parse(await fs.readFile(filename, "utf8"));
}

async function runLevel(args, baseUrl, users) {
  const levelArgs = [
    "run_load_test.mjs",
    "--base-url", baseUrl,
    "--users", String(users),
    "--rounds", String(args.rounds),
    "--headless", String(args.headless),
    "--timeout-ms", String(args.timeoutMs),
    "--launch-step-ms", String(args.launchStepMs),
    "--results-dir", args.resultsDir,
  ];

  const result = await runCommand("node", levelArgs, {
    cwd: path.dirname(new URL(import.meta.url).pathname),
    env: { ...process.env, BASE_URL: baseUrl },
  });
  const json = await readNewestResult(path.resolve(path.dirname(new URL(import.meta.url).pathname), args.resultsDir), users);
  if (json) {
    return { exitCode: result.code, json };
  }

  return {
    exitCode: result.code || 1,
    json: {
      users,
      rounds: args.rounds,
      completed: 0,
      failed: users,
      elapsedMs: 0,
      avgUserElapsedMs: 0,
      eventCount: 1,
      participants: [],
      setupError: "The load-test runner exited before writing a result JSON.",
      stderr: result.stderr.slice(-4000),
    },
  };
}

async function saveCapacityReport(args, report) {
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  const resultsDir = path.resolve(scriptDir, args.resultsDir);
  await fs.mkdir(resultsDir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filename = path.join(resultsDir, `capacity-report-${stamp}.json`);
  await fs.writeFile(filename, JSON.stringify(report, null, 2));
  return filename;
}

async function main() {
  const args = parseArgs(process.argv);
  const levels = makeLevels(args);
  let server = null;
  let baseUrl = args.baseUrl;

  if (args.startServer) {
    server = await startEmpirica(args);
    baseUrl = server.baseUrl;
  } else if (!baseUrl) {
    baseUrl = "http://localhost:3000";
  }

  const report = {
    baseUrl,
    maxUsers: args.maxUsers,
    levels,
    rounds: args.rounds,
    startedAt: new Date().toISOString(),
    estimatedCap: 0,
    capMeaning: "0 means the first tested level failed. If cappedAtMax is true, capacity is at least maxUsers under this scenario.",
    cappedAtMax: false,
    results: [],
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
    },
  };

  try {
    console.log("TogetherHire capacity estimator");
    console.log(`Base URL: ${baseUrl}`);
    console.log(`Levels: ${levels.join(", ")}`);
    console.log(`Default max users: ${args.maxUsers}`);

    for (const users of levels) {
      console.log(`\n==> Capacity level: ${users} users`);
      const level = await runLevel(args, baseUrl, users);
      const passed = level.json.failed === 0 && level.exitCode === 0;
      report.results.push({
        users,
        passed,
        completed: level.json.completed,
        failed: level.json.failed,
        elapsedMs: level.json.elapsedMs,
        avgUserElapsedMs: level.json.avgUserElapsedMs,
        eventCount: level.json.eventCount,
      });

      if (passed) {
        report.estimatedCap = users;
      } else {
        console.log(`Level ${users} failed; stopping capacity search.`);
        break;
      }
    }

    report.finishedAt = new Date().toISOString();
    report.cappedAtMax = report.estimatedCap >= args.maxUsers;
    const reportFile = await saveCapacityReport(args, report);

    console.log("\nCapacity estimate");
    if (report.cappedAtMax) {
      console.log(`estimatedCap: at least ${report.estimatedCap} concurrent participants under this scenario`);
    } else {
      console.log(`estimatedCap: ${report.estimatedCap} concurrent participants under this scenario`);
    }
    console.log(`report: ${reportFile}`);

    if (report.estimatedCap === 0 || report.results.at(-1)?.passed === false) {
      process.exitCode = 1;
    }
  } finally {
    if (server) {
      await stopProcess(server.child);
      await server.closeLog();
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
