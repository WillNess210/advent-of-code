import * as fs from "fs";

const args = process.argv.slice(2);
const filename = args[0];

const input = fs.readFileSync(filename, "utf-8");

function stoneTick(stoneValue: number): number[] {
  if (stoneValue === 0) {
    return [1];
  }
  const numStr = stoneValue.toString();
  if (numStr.length % 2 === 0) {
    const firstHalf = parseInt(numStr.slice(0, numStr.length / 2));
    const secondHalf = parseInt(numStr.slice(numStr.length / 2));
    return [firstHalf, secondHalf];
  }
  return [stoneValue * 2024];
}

const initialArrangement = input.split(" ").map((num) => parseInt(num));

const memoization: Record<string, number> = {};

function stoneCountAfterTicks(stoneValue: number, ticksLeft: number): number {
  if (ticksLeft === 0) {
    return 1;
  }
  const newStoneValues = stoneTick(stoneValue);
  let total = 0;
  for (const stoneValue of newStoneValues) {
    const memoizationString = `${stoneValue}-${ticksLeft - 1}`;
    if (memoization[memoizationString]) {
      total += memoization[memoizationString];
      continue;
    }
    const stoneValueCount = stoneCountAfterTicks(stoneValue, ticksLeft - 1);
    memoization[memoizationString] = stoneValueCount;
    total += stoneValueCount;
  }
  return total;
}

function stoneCountAfterTicksForArrangement(
  arrangement: number[],
  ticksLeft: number
): number {
  return arrangement.reduce(
    (acc, val) => acc + stoneCountAfterTicks(val, ticksLeft),
    0
  );
}

const result25 = stoneCountAfterTicksForArrangement(initialArrangement, 25);
console.log(result25);
const result75 = stoneCountAfterTicksForArrangement(initialArrangement, 75);
console.log(result75);
