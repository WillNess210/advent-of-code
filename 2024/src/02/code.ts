import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

const parseInput = (input: string): number[][] => {
  return input.split("\n").map((line) => line.split(" ").map(Number));
};

const MAX_CHANGE = 3;
// returns the index of the first element that is not safe, or "safe" if all elements are safe
const isReportSafe = (report: number[]): number | "safe" => {
  const direction = report[0] - report[1] > 0 ? -1 : 1;
  for (let i = 1; i < report.length; i++) {
    const difference = report[i] - report[i - 1];
    if (Math.sign(difference) !== direction) {
      return i;
    } else if (Math.abs(difference) > MAX_CHANGE) {
      return i;
    }
  }
  return "safe";
};

const calculateSafeReports = (reports: number[][]): number => {
  return reports.filter((report) => isReportSafe(report) === "safe").length;
};

const removeIndexAndCheckSafety = (
  report: number[],
  indexToRemove: number
): boolean => {
  const reportWithoutIndex = report.slice();
  reportWithoutIndex.splice(indexToRemove, 1);
  return isReportSafe(reportWithoutIndex) === "safe";
};

const isReportSafeWithDampeners = (report: number[]): boolean => {
  const reportSafeResult = isReportSafe(report);
  if (reportSafeResult === "safe") {
    return true;
  }
  if (removeIndexAndCheckSafety(report, 0)) {
    return true;
  }
  for (let i = 0; i < 2; i++) {
    if (removeIndexAndCheckSafety(report, reportSafeResult - i)) {
      return true;
    }
  }
  return false;
};
const calculateSafeReportsWithDampeners = (reports: number[][]): number => {
  return reports.filter(isReportSafeWithDampeners).length;
};

const reports = parseInput(input);
const safeReports = calculateSafeReports(reports);
console.log(`Safe reports: ${safeReports}`);
const safeReportsWithDampeners = calculateSafeReportsWithDampeners(reports);
console.log(`Safe reports with dampeners: ${safeReportsWithDampeners}`);
