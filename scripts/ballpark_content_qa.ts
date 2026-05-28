import { writeFileSync } from "node:fs";
import {
  classifyBallparkContentForRemediation,
  classifyBallparkReserveContentForRemediation,
  getBallparkEditorialRiskReport,
  getBallparkReservePool,
  getBallparkReviewPacket,
  getBallparkRemediationBatch,
  runBallpark400PackAudit,
  runBallparkProductionReadinessAudit,
} from "../src/ballpark/daybreak-v1-data.mjs";

type CliOptions = {
  json: boolean;
  failOnBlockers: boolean;
  month?: string;
  category?: string;
  dates?: string[];
  reserveIds?: string[];
  from?: string;
  days?: number;
  limit: number;
  out?: string;
  launchWindow: boolean;
  reviewPacket: boolean;
  reservePool: boolean;
  reserveBank: boolean;
  combined: boolean;
  editorialRisk: boolean;
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    json: false,
    failOnBlockers: false,
    launchWindow: false,
    limit: 20,
    reviewPacket: false,
    reservePool: false,
    reserveBank: false,
    combined: false,
    editorialRisk: false,
  };

  argv.forEach((arg) => {
    if (arg === "--json") options.json = true;
    if (arg === "--fail-on-blockers") options.failOnBlockers = true;
    if (arg === "--launch-window") options.launchWindow = true;
    if (arg === "--review-packet") options.reviewPacket = true;
    if (arg === "--reserve-pool") options.reservePool = true;
    if (arg === "--reserve-bank") options.reserveBank = true;
    if (arg === "--combined") options.combined = true;
    if (arg === "--editorial-risk") options.editorialRisk = true;
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
    if (arg.startsWith("--reserve-ids=")) {
      options.reserveIds = arg
        .slice("--reserve-ids=".length)
        .split(",")
        .map((reserveId) => reserveId.trim())
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

function printReserveBankSummary(payload: ReturnType<typeof classifyBallparkReserveContentForRemediation>, limit: number) {
  console.log(`Ballpark reserve bank: ${payload.passed ? "PASS" : "BLOCKED"}`);
  console.log(`Reserve packs: ${payload.launchReadyPacks}/${payload.packsChecked}`);
  console.log(`Questions checked: ${payload.questionsChecked}`);
  console.log(`Blockers: ${payload.blockerCount}`);
  console.log(`Warnings: ${payload.warningCount}`);
  console.log("");
  console.log("Categories:");
  Object.entries(payload.categoryCounts)
    .filter(([, count]) => count > 0)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
  console.log("");
  console.log(`Top ${limit} reserve packs by blocker count:`);
  payload.packs
    .filter((pack) => pack.blockerCount > 0)
    .sort((first, second) => second.blockerCount - first.blockerCount)
    .slice(0, limit)
    .forEach((pack) => {
      const categories = Object.entries(pack.blockerCategories)
        .filter(([, count]) => count > 0)
        .map(([category, count]) => `${category}:${count}`)
        .join(", ");
      console.log(`  ${pack.reserveId} ${pack.theme} [${pack.action}] ${pack.blockerCount} blockers (${categories})`);
    });
}

function printCombinedSummary(payload: ReturnType<typeof runBallpark400PackAudit>, limit: number) {
  console.log(`Ballpark 400-pack readiness: ${payload.passed ? "PASS" : "BLOCKED"}`);
  console.log(`Dated packs: ${payload.datedReady}/${payload.datedTotal}`);
  console.log(`Reserve packs: ${payload.reserveReady}/${payload.reserveTotal}`);
  console.log(`Total packs: ${payload.totalReady}/${payload.totalTarget}`);
  console.log(`Questions checked: ${payload.questionsChecked}`);
  console.log(`Blockers: ${payload.blockerCount}`);
  console.log(`Warnings: ${payload.warningCount}`);
  if (payload.qualityMetrics) {
    console.log(`Answer confidence: ${Object.entries(payload.qualityMetrics.answerConfidenceCounts).map(([key, count]) => `${key}:${count}`).join(", ")}`);
    console.log(`Soft-estimate packs: ${payload.qualityMetrics.softEstimatePackCount}`);
    console.log(`Likely first-guess spread: normal:${payload.qualityMetrics.likelyFirstGuessSpread.normal}, wide_bonus:${payload.qualityMetrics.likelyFirstGuessSpread.wideSpreadBonus}`);
    if (payload.qualityMetrics.visitorMacroMetrics) {
      const visitorMetrics = payload.qualityMetrics.visitorMacroMetrics;
      console.log(
        `Visitor-ish prompts: total:${visitorMetrics.totalVisitorish}/${visitorMetrics.limits.totalVisitorish}, ` +
          `Q3:${visitorMetrics.q3Visitorish}/${visitorMetrics.limits.q3Visitorish}, ` +
          `generic:${visitorMetrics.genericVisitorish}/${visitorMetrics.limits.genericVisitorish}`
      );
      console.log(
        `Repeated visitor anchors: ${Object.entries(visitorMetrics.repeatedAnchorCounts)
          .map(([key, count]) => `${key}:${count}`)
          .join(", ")}`
      );
    }
  }
  console.log("");
  console.log("Categories:");
  Object.entries(payload.categoryCounts)
    .filter(([, count]) => count > 0)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
  console.log("");
  console.log(`Top ${limit} combined blockers:`);
  payload.blockers.slice(0, limit).forEach((blocker) => {
    const suggestion = blocker.suggestedRewriteType ? ` -> ${blocker.suggestedRewriteType}` : "";
    console.log(`  ${blocker.packId ?? blocker.packs?.join(",") ?? "combined"} ${blocker.category}: ${blocker.message}${suggestion}`);
  });
}

function printEditorialRiskSummary(payload: ReturnType<typeof getBallparkEditorialRiskReport>, limit: number) {
  console.log("Ballpark editorial risk report");
  console.log(`Packs ranked: ${payload.totalPacks}`);
  console.log(`Bottom pack count: ${payload.bottomCount}/${payload.totalPacks}`);
  console.log(`Threshold score: ${payload.thresholdScore}`);
  console.log("");
  console.log("Categories in displayed bottom set:");
  Object.entries(payload.categoryCounts)
    .filter(([, count]) => count > 0)
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count}`);
    });
  console.log("");
  console.log(`Top ${Math.min(limit, payload.packs.length)} editorial-risk packs:`);
  payload.packs.slice(0, limit).forEach((pack) => {
    const reasons = pack.reasons
      .slice(0, 3)
      .map((reason) => `${reason.category}:${reason.points}`)
      .join(", ");
    console.log(`  ${pack.packId} ${pack.theme} score:${pack.riskScore} [${pack.suggestedRepairType}] ${reasons}`);
  });
}

const options = parseArgs(process.argv.slice(2));
const payload = options.reviewPacket
  ? getBallparkReviewPacket({
      month: options.month,
      dates: options.dates,
      reserveIds: options.reserveIds,
      includeReserveBank: options.reserveBank,
    })
  : options.editorialRisk
  ? getBallparkEditorialRiskReport({ limit: options.limit })
  : options.combined
  ? runBallpark400PackAudit()
  : options.reserveBank
  ? classifyBallparkReserveContentForRemediation()
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
} else if (options.reserveBank) {
  printReserveBankSummary(payload as ReturnType<typeof classifyBallparkReserveContentForRemediation>, options.limit);
} else if (options.combined) {
  printCombinedSummary(payload as ReturnType<typeof runBallpark400PackAudit>, options.limit);
} else if (options.editorialRisk) {
  printEditorialRiskSummary(payload as ReturnType<typeof getBallparkEditorialRiskReport>, options.limit);
} else if (options.month) {
  printMonthSummary(payload as ReturnType<typeof getBallparkRemediationBatch>, options.limit);
} else {
  printSummary(payload as ReturnType<typeof classifyBallparkContentForRemediation>, options.limit);
}

const blockerCount = "blockerCount" in payload ? payload.blockerCount : 0;
const warningCount = "warningCount" in payload ? payload.warningCount : 0;
const productionReady = "productionReady" in payload ? payload.productionReady : blockerCount === 0;
if (options.failOnBlockers && (!productionReady || blockerCount > 0 || warningCount > 0)) {
  process.exitCode = 1;
}
