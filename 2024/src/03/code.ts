import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

const isNumeric = (char: string): boolean => /^[0-9]$/.test(char);

const LINE_START = "mul(";
const ENABLE_STRING = "do()";
const DISABLE_STRING = "don't()";
const MOST_RECENT_CHARS_HISTORY = Math.max(
  ENABLE_STRING.length,
  DISABLE_STRING.length
);
const processInput = (input: string): number => {
  let enabled = true;
  let sum = 0;
  let current = "";
  let num1 = 0;
  let num2 = 0;
  let stage: "start" | "num1" | "num2" = "start";
  let mostRecentChars = "";
  // iterate over the line
  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (mostRecentChars.length === MOST_RECENT_CHARS_HISTORY) {
      mostRecentChars = mostRecentChars.slice(1);
    }
    mostRecentChars += char;
    if (mostRecentChars.slice(-ENABLE_STRING.length) === ENABLE_STRING) {
      enabled = true;
    } else if (
      mostRecentChars.slice(-DISABLE_STRING.length) === DISABLE_STRING
    ) {
      enabled = false;
    }

    if (!enabled) {
      continue;
    }

    if (stage === "start") {
      if (char === LINE_START[current.length]) {
        current += char;
        if (current === LINE_START) {
          stage = "num1";
          current = "";
        }
      } else {
        current = "";
      }
    } else if (stage === "num1") {
      if (current.length > 0 && char === ",") {
        num1 = parseInt(current);
        stage = "num2";
        current = "";
      } else if (isNumeric(char)) {
        current += char;
      } else {
        current = "";
        stage = "start";
      }
    } else if (stage === "num2") {
      if (current.length > 0 && char === ")") {
        num2 = parseInt(current);
        sum += num1 * num2;
        current = "";
        stage = "start";
      } else if (isNumeric(char)) {
        current += char;
      } else {
        current = "";
        stage = "start";
      }
    }
  }
  return sum;
};

const total = processInput(input);
console.log(total);
