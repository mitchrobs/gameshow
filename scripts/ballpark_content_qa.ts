import { writeFileSync } from "node:fs";
import {
  classifyBallparkContentForRemediation,
  getBallparkReservePool,
  getBallparkReviewPacket,
  getBallparkRemediationBatch,
  runBallparkProductionReadinessAudit,
} from "../src/ballpark/daybreak-v1-data.mjs";

type CliOptions = {
  json: boolean;
  failOnBlockers: boolean;
  month?: string;
  category?: string;
  dates?: string[];
  from?: string;
  days?: number;
  limit: number;
  out?: string;
  launchWindow: boolean;
  reviewPacket: boolean;
  reservePool: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    json: false,
    failOnBlockers: false,
    launchWindow: false,
    limit: 20,
    reviewPacket: false,
    reservePool: false,
  };

  argv.forEach((arg) => {
    if (arg === "--json") options.json = true;
    if (arg === "--fail-on-blockers") options.failOnBlockers = true;
    if (arg === "--launch-window") options.launchWindow = true;
    if (arg === "--review-packet") options.reviewPacket = true;
    if (arg === "--reserve-pool") options.reservePool = true;
    if (arg.startsWith("--month=")) options.month = arg.slice("--month=".length);
    if (arg.startsWith("--from=")) options.from = arg.slice("--from=".length);
    if (arg.startsWith("--category=")) options.category = arg.slice("--category=".length);
    if (arg.startsWith("--dates=")) {
      options.dates = arg
        .slice("--dates=".length)
        .split(",")
        .map((dateKey) => dateKey.trim())
        .filter(Boolean);
    }
    if (arg.startsWith("--limit=")) {
      const limit = Number(arg.slice("--limit=".length));
      if (Number.isFinite(limit) && limit > 0) options.limit = Math.floor(limit);
    }
    if (arg.startsWith("--days=")) {
      const days = Number(arg.slice("--days=".length));
      if (Number.isFinite(days) && days > 0) options.days = Math.floor(days);
    }
    if (arg.startsWith("--out=")) options.out = arg.slice("--out=".length);
  });

  return options;
}

function filterCategory(payload: ReturnType<typeof classifyBallparkContentForRemediation>, category?: string) {
  if (!category) return payload;
  return {
    ...payload,
    days: payload.days
      .map((day) => ({
        ...day,
        blockers: day.blockers.filter((blocker) => blocker.category === category),
      }))
      .filter((day) => day.blockers.length > 0),
  };
}

function printSummary(payload: ReturnType<typeof classifyBallparkContentForRemediation>, limit: number) {
  console.log(`Ballpark launch-readiness: ${payload.passed ? "PASS" : "BLOCKED"}`);
  console.log(`Days checked: ${payload.daysChecked}`);
  console.log(`Questions checked: ${payload.questionsChecked}`);
  console.log(`Launch-ready days: ${payload.launchReadyDays}/${payload.daysChecked}`);
  console.log(`Automated-clear days: ${payload.automatedClearDays}/${payload.daysChecked}`);
  console.log(`Blockers: ${payload.blockerCount}`);
  console.log(`Warnings: ${payload.warningCount ?? 0}`);
  console.log("");
  console.log("Actions:");
  console.log(`  keep: ${payload.actionCounts.keep}`);
  console.log(`  revise: ${payload.actionCounts.revise}`);
  console.log(`  replace: ${payload.actionCounts.replace}`);
  console.log("");
  console.log("Categories:");
  Object.entries(payload.categoryCounts)
    .filter(([, count]) => count > 0)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
  console.log("");
  if (payload.warningCategoryCounts) {
    console.log("Warning categories:");
    Object.entries(payload.warningCategoryCounts)
      .filter(([, count]) => count > 0)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });
    console.log("");
  }
  console.log(`Top ${limit} days by blocker count:`);
  payload.days
    .filter((day) => day.blockerCount > 0)
    .sort((first, second) => second.blockerCount - first.blockerCount)
    .slice(0, limit)
    .forEach((day) => {
      const categories = Object.entries(day.blockerCategories)
        .filter(([, count]) => count > 0)
        .map(([category, count]) => `${category}:${count}`)
        .join(", ");
      console.log(`  ${day.date} ${day.theme} [${day.action}] ${day.blockerCount} blockers (${categories})`);
    });
}

function printMonthSummary(payload: ReturnType<typeof getBallparkRemediationBatch>, limit: number) {
  console.log(`Ballpark remediation batch: ${payload.month}`);
  console.log(`Days: ${payload.days.length}`);
  console.log(`Launch-ready days: ${payload.launchReadyDays}/${payload.days.length}`);
  console.log(`Automated-clear days: ${payload.automatedClearDays}/${payload.days.length}`);
  console.log(`Blockers: ${payload.blockerCount}`);
  console.log(`Warnings: ${payload.warningCount ?? 0}`);
  console.log(`Actions: keep ${payload.actionCounts.keep}, revise ${payload.actionCounts.revise}, replace ${payload.actionCounts.replace}`);
  console.log("");
  payload.days.slice(0, limit).forEach((day) => {
    const categories = Object.entries(day.blockerCategories)
      .filter(([, count]) => count > 0)
      .map(([category, count]) => `${category}:${count}`)
      .join(", ");
    console.log(`  ${day.date} ${day.theme} [${day.action}] ${day.blockerCount} blockers (${categories || "none"})`);
  });
}

function printLaunchWindowSummary(payload: ReturnType<typeof runBallparkProductionReadinessAudit>, limit: number) {
  console.log(`Ballpark production readiness: ${payload.productionReady ? "PASS" : "BLOCKED"}`);
  console.log(`Window: ${payload.launchWindowStart} to ${payload.launchWindowEnd}`);
  console.log(`Days checked: ${payload.daysChecked}/${payload.requestedWindowDays}`);
  console.log(`Launch-ready days: ${payload.launchReadyDays}/${payload.daysChecked}`);
  console.log(`Blockers: ${payload.blockerCount}`);
  console.log(`Warnings: ${payload.warningCount ?? 0}`);
  console.log(`Friday Extra Innings ready: ${payload.fridayExtraInningsLaunchReady}/${payload.fridayExtraInningsChecked}`);
  console.log(`Full-year ready: ${payload.fullYearReady ? "yes" : "no"} (${payload.fullYear.launchReadyDays}/${payload.fullYear.daysChecked}, ${payload.fullYear.blockerCount} blockers)`);
  console.log("");
  console.log("Categories:");
  Object.entries(payload.categoryCounts)
    .filter(([, count]) => count > 0)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
  console.log("");
  if (payload.warningCategoryCounts) {
    console.log("Warning categories:");
    Object.entries(payload.warningCategoryCounts)
      .filter(([, count]) => count > 0)
      .forEach(([category, count]) => {
        console.log(`  ${category}: ${count}`);
      });
    console.log("");
  }
  console.log(`Top ${limit} launch-window days by blocker count:`);
  payload.days
    .filter((day) => day.blockerCount > 0)
    .sort((first, second) => second.blockerCount - first.blockerCount)
    .slice(0, limit)
    .forEach((day) => {
      const categories = Object.entries(day.blockerCategories)
        .filter(([, count]) => count > 0)
        .map(([category, count]) => `${category}:${count}`)
        .join(", ");
      console.log(`  ${day.date} ${day.theme} [${day.action}] ${day.blockerCount} blockers (${categories})`);
    });
}

function printReservePoolSummary(payload: ReturnType<typeof getBallparkReservePool>, limit: number) {
  console.log(`Ballpark reserve pool: ${payload.count} ${payload.status.replace("_", "-")} candidates`);
  console.log(
    `Excluded launch window: ${payload.excludedLaunchWindow.start} to ${payload.excludedLaunchWindow.end}`
  );
  console.log("");
  console.log("Month counts:");
  Object.entries(payload.monthCounts).forEach(([month, count]) => {
    console.log(`  ${month}: ${count}`);
  });
  console.log("");
  console.log(`Top ${limit} reserve candidates:`);
  payload.candidates.slice(0, limit).forEach((day) => {
    console.log(
      `  ${day.date} ${day.theme} [${day.editorialStatus}] warnings:${day.warningCount}`
    );
  });
}

const options = parseArgs(process.argv.slice(2));
const payload = options.reviewPacket
  ? getBallparkReviewPacket({ month: options.month, dates: options.dates })
  : options.reservePool
  ? getBallparkReservePool({ fromDateKey: options.from, windowDays: options.days })
  : options.launchWindow
  ? runBallparkProductionReadinessAudit(options.from, options.days)
  : options.month
  ? getBallparkRemediationBatch(options.month)
  : filterCategory(classifyBallparkContentForRemediation(), options.category);

if (options.out) {
  writeFileSync(options.out, `${JSON.stringify(payload, null, 2)}\n`);
}

if (options.json || options.reviewPacket) {
  console.log(JSON.stringify(payload, null, 2));
} else if (options.launchWindow) {
  printLaunchWindowSummary(payload as ReturnType<typeof runBallparkProductionReadinessAudit>, options.limit);
} else if (options.reservePool) {
  printReservePoolSummary(payload as ReturnType<typeof getBallparkReservePool>, options.limit);
} else if (options.month) {
  printMonthSummary(payload as ReturnType<typeof getBallparkRemediationBatch>, options.limit);
} else {
  printSummary(payload as ReturnType<typeof classifyBallparkContentForRemediation>, options.limit);
}

const blockerCount = "blockerCount" in payload ? payload.blockerCount : 0;
const productionReady = "productionReady" in payload ? payload.productionReady : blockerCount === 0;
if (options.failOnBlockers && (!productionReady || blockerCount > 0)) {
  process.exitCode = 1;
}
