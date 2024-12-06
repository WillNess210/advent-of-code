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

function areUpdatesValidForRule(updates: number[], rule: Rule): boolean {
  const printBeforeIndex = updates.indexOf(rule.printBefore);
  const printAfterIndex = updates.indexOf(rule.printAfter);
  return printBeforeIndex <= printAfterIndex;
}

function areUpdatesValid(updates: number[], rules: Rule[]): boolean {
  const updatesSet = new Set(updates);
  const rulesThatApply = rules.filter(
    ({ printBefore, printAfter }) => updatesSet.has(printBefore) && updatesSet.has(printAfter));
  for (const rule of rulesThatApply) {
    if (!areUpdatesValidForRule(updates, rule)) {
      return false;
    }
  }
  return true;
}

function fixInvalidUpdates(updates: number[], rules: Rule[]): number[] {
  const updatesSet = new Set(updates);
  const rulesThatApply = rules.filter(
    ({ printBefore, printAfter }) => updatesSet.has(printBefore) && updatesSet.has(printAfter));
  const updatesCopy = updates.slice();
  while (!areUpdatesValid(updatesCopy, rules)) {
    const invalidRule = rulesThatApply.find((rule) => !areUpdatesValidForRule(updatesCopy, rule));
    if (!invalidRule) {
      throw new Error("No invalid rule found");
    }
    const printBeforeIndex = updatesCopy.indexOf(invalidRule.printBefore);
    const printAfterIndex = updatesCopy.indexOf(invalidRule.printAfter);
    const temp = updatesCopy[printBeforeIndex];
    updatesCopy[printBeforeIndex] = updatesCopy[printAfterIndex];
    updatesCopy[printAfterIndex] = temp;
  }
  return updatesCopy;
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

function getSumOfMiddleNumbersOfFixedInvalidUpdates(updatesList: number[][], rules: Rule[]): number {
  let sum = 0;
  for (const updates of updatesList) {
    if (!areUpdatesValid(updates, rules)) {
      const fixedUpdates = fixInvalidUpdates(updates, rules);
      sum += getMiddleNumberOfUpdates(fixedUpdates);
    }
  }
  return sum;
}

const result = getSumOfMiddleNumberOfValidUpdates(updatesList, rules);
console.log(`Result: ${result}`);
const result2 = getSumOfMiddleNumbersOfFixedInvalidUpdates(updatesList, rules);
console.log(`Result 2: ${result2}`);