import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");
const lines = input.split("\n");

type Rule = {
  printBefore: number;
  printAfter: number;
}
const rules: Rule[] = [];
const updatesList: number[][] = [];
let i = 0;
while (true) {
  const line = lines[i++];
  if (line === "") {
    break;
  }
  const [printBefore, printAfter] = line.split("|").map(Number);
  const rule: Rule = { printBefore, printAfter };
  rules.push(rule);
}
while (i < lines.length) {
  updatesList.push(lines[i++].split(",").map(Number));
}

function areUpdatesValid(updates: number[], rules: Rule[]): boolean {
  const updatesSet = new Set(updates);
  const rulesThatApply = rules.filter(
    ({ printBefore, printAfter }) => updatesSet.has(printBefore) && updatesSet.has(printAfter));
  for (const rule of rulesThatApply) {
    const printBeforeIndex = updates.indexOf(rule.printBefore);
    const printAfterIndex = updates.indexOf(rule.printAfter);
    if (printBeforeIndex > printAfterIndex) {
      return false;
    }
  }
  return true;
}

function getMiddleNumberOfUpdates(updates: number[]): number {
  const middleIndex = Math.floor(updates.length / 2);
  return updates[middleIndex];
}

function getSumOfMiddleNumberOfValidUpdates(updatesList: number[][], rules: Rule[]): number {
  let sum = 0;
  for (const updates of updatesList) {
    if (areUpdatesValid(updates, rules)) {
      sum += getMiddleNumberOfUpdates(updates);
    }
  }
  return sum;
}

const result = getSumOfMiddleNumberOfValidUpdates(updatesList, rules);
console.log(`Result: ${result}`);