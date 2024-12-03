import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");
const lines = input.split("\n");

const isNumeric = (char: string): boolean => /^[0-9]$/.test(char);

const LINE_START = "mul(";
const processLine = (line: string): number => {
  let sum = 0;
  let current = "";
  let num1 = 0;
  let num2 = 0;
  let stage: "start" | "num1" | "num2" = "start";
  // iterate over the line
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
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

const total = lines.reduce((acc, line) => acc + processLine(line), 0);
console.log(total);
