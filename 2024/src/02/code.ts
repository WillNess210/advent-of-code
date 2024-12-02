import * as fs from "fs";

// code.ts src/01/example.txt
// get filename to read from command line arguments
const args = process.argv.slice(2);
const filename = args[0];

console.log(filename);
const input = fs.readFileSync(filename, "utf-8");

const parseInput = (input: string): number[][] => {
  return input.split("\n").map((line) => line.split(" ").map(Number));
};

const MAX_CHANGE = 3;
const isReportSafe = (report: number[]): boolean => {
  const direction = report[0] - report[1] > 0 ? -1 : 1;
  for (let i = 1; i < report.length; i++) {
    const difference = report[i] - report[i - 1];
    if (Math.sign(difference) !== direction) {
      return false;
    } else if (Math.abs(difference) > MAX_CHANGE) {
      return false;
    }
  }
  return true;
};

const calculateSafeReports = (reports: number[][]): number => {
  return reports.filter(isReportSafe).length;
};

const reports = parseInput(input);
const safeReports = calculateSafeReports(reports);
console.log(`Safe reports: ${safeReports}`);
