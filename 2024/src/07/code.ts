import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

type Equation = {
  equationAnswer: number;
  inputs: number[];
}

function parseInput(input: string): Equation[] {
  return input.split("\n").map((line) => {
    const lineSplit = line.split(":");
    const equationAnswer = parseInt(lineSplit[0].trim());
    const inputs = lineSplit[1].trim().split(" ").map((input) => parseInt(input));
    return { equationAnswer, inputs };
  });
}

type Operator = "+" | "*" | "||";
const ALL_OPERATORS: Operator[] = ["+", "*", "||"];

function tryOperators(equation: Equation, operators: Operator[]): boolean {
  if (operators.length !== equation.inputs.length - 1) {
    throw new Error("Invalid number of operators");
  }
  let total = equation.inputs[0];
  for (let i = 1; i < equation.inputs.length; i++) {
    if (total > equation.equationAnswer) {
      return false;
    }
    const operator = operators[i - 1];
    const input = equation.inputs[i];
    if (operator === "+") {
      total += input;
    } else if (operator === "*") {
      total *= input;
    } else if (operator === "||") {
      total = parseInt(`${total}${input}`);
    } else {
      throw new Error("Invalid operator");
    }
  }
  return total === equation.equationAnswer;
}

function getAllOperatorPermutations(operationCount: number): Operator[][] {
  if (operationCount === 1) {
    return ALL_OPERATORS.map((operator) => [operator]);
  }
  const permutations = [];
  const subPermutations = getAllOperatorPermutations(operationCount - 1);
  for (const operator of ALL_OPERATORS) {
    for (const subPermutation of subPermutations) {
      permutations.push([operator, ...subPermutation]);
    }
  }
  return permutations;
}

function getTotalNumberOfOperatorPermutationsThatSolveEquation(equation: Equation) {
  let total = 0;
  const operatorPermutations = getAllOperatorPermutations(equation.inputs.length - 1);
  for (const operatorPermutation of operatorPermutations) {
    if (tryOperators(equation, operatorPermutation)) {
      total++;
    }
  }
  return total;
}

function getAnswer1(input: string): number {
  const equations = parseInput(input);
  const equationsThatHaveAnswer = equations.filter((equation) => getTotalNumberOfOperatorPermutationsThatSolveEquation(equation) > 0);
  const sumOfAnswers = equationsThatHaveAnswer.reduce((sum, equation) => sum + equation.equationAnswer, 0);
  return sumOfAnswers;
}

console.log(`Answer 1: ${getAnswer1(input)}`);