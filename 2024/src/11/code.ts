import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

function stoneTick(num: number): number[] {
  if (num === 0) {
    return [1];
  }
  const numStr = num.toString();
  if (numStr.length % 2 === 0) {
    const firstHalf = parseInt(numStr.slice(0, numStr.length / 2));
    const secondHalf = parseInt(numStr.slice(numStr.length / 2));
    return [firstHalf, secondHalf];
  }
  return [num * 2024];
}

const initialArrangement = input.split(" ").map((num) => parseInt(num));

function getNumberOfStonesAfterBlinks(input: number[], blinks: number): number {
  let currentArrangement = input;
  for (let i = 0; i < blinks; i++) {
    const newArrangement = [];
    for (const num of currentArrangement) {
      newArrangement.push(...stoneTick(num));
    }
    currentArrangement = newArrangement;
  }
  return currentArrangement.length;
}

const numberOfStones = getNumberOfStonesAfterBlinks(initialArrangement, 25);
console.log(`Number of stones after 25 blinks: ${numberOfStones}`);
